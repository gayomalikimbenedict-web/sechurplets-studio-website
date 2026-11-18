"""Checkout business rules. Every price and total is computed here, on the server."""
import hmac
import os
import re
import secrets

from .catalog import BUNDLES, CURRENCY, delivery_env_name
from .payment_service import PaymentError

EMAIL_RE = re.compile(r'^[^@\s]{1,64}@[^@\s]{1,255}\.[^@\s]{2,}$')
MAX_ITEMS = 7


class CheckoutError(Exception):
    def __init__(self, message, status=400):
        super().__init__(message)
        self.status = status


def delivery_url(slug):
    url = (os.environ.get(delivery_env_name(slug)) or '').strip()
    return url if url.startswith('https://docs.google.com/') else None


def is_available(slug):
    parts = BUNDLES.get(slug, [slug])
    return all(delivery_url(p) for p in parts)


def list_products(db):
    with db.transaction() as tx:
        rows = tx.all('SELECT slug, name, price_cents FROM products ORDER BY product_id')
    return {'currency': CURRENCY,
            'products': [dict(r, available=is_available(r['slug'])) for r in rows]}


def create_checkout(db, gateway, payload, site_url):
    email = str((payload or {}).get('email', '')).strip()
    slugs = (payload or {}).get('items')
    if not EMAIL_RE.match(email) or len(email) > 254:
        raise CheckoutError('Please enter a valid email address.')
    if not isinstance(slugs, list) or not slugs or len(slugs) > MAX_ITEMS or not all(isinstance(s, str) for s in slugs):
        raise CheckoutError('Your cart is empty.')
    slugs = list(dict.fromkeys(slugs))  # one license per product; drop duplicates

    for bundle, parts in BUNDLES.items():
        if bundle in slugs and any(p in slugs for p in parts):
            raise CheckoutError('The Toolkit already includes those templates. Remove them or the Toolkit.')

    with db.transaction() as tx:
        products = {}
        for s in slugs:
            row = tx.one('SELECT product_id, slug, name, price_cents FROM products WHERE slug = ?', (s,))
            if not row:
                raise CheckoutError('That product does not exist.', 404)
            products[s] = row
        unavailable = [p['name'] for s, p in products.items() if not is_available(s)]
        if unavailable:
            raise CheckoutError('Not available for online purchase yet: %s. Please email us to order.' % ', '.join(unavailable), 409)

        total = sum(p['price_cents'] for p in products.values())
        key = secrets.token_urlsafe(24)
        order_id = tx.insert(
            'INSERT INTO orders (customer_email, total_cents, currency, status, receipt_key) VALUES (?, ?, ?, ?, ?)',
            (email, total, CURRENCY, 'PENDING', key), 'order_id')
        for p in products.values():
            tx.execute('INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) VALUES (?, ?, 1, ?)',
                       (order_id, p['product_id'], p['price_cents']))

    base = site_url.rstrip('/')
    cart = ','.join(slugs)
    try:
        pid, approve = gateway.create_order(
            order_id, total, CURRENCY,
            return_url='%s/receipt?o=%d&k=%s' % (base, order_id, key),
            cancel_url='%s/checkout?p=%s&cancelled=1' % (base, cart),
            description='Sechurplets Studio order %d' % order_id)
        with db.transaction() as tx:
            tx.execute('UPDATE orders SET paypal_order_id = ? WHERE order_id = ?', (pid, order_id))
    except PaymentError:
        with db.transaction() as tx:
            tx.execute("UPDATE orders SET status = 'FAILED' WHERE order_id = ? AND status = 'PENDING'", (order_id,))
        raise
    return {'order_id': order_id, 'approve_url': approve}


def _load_order(tx, order_id, key):
    order = tx.one('SELECT * FROM orders WHERE order_id = ?', (order_id,))
    # Same error for "no such order" and "wrong key" so ids cannot be probed.
    if not order or not hmac.compare_digest(order['receipt_key'], str(key or '')):
        raise CheckoutError('Order not found.', 404)
    return order


def capture(db, gateway, order_id, key, paypal_token):
    with db.transaction() as tx:
        order = _load_order(tx, order_id, key)
    if order['status'] == 'PAID':
        return {'status': 'PAID'}
    if order['status'] in ('FAILED', 'REVIEW'):
        return {'status': order['status']}
    if not paypal_token or paypal_token != order['paypal_order_id']:
        raise CheckoutError('This payment does not match the order.', 400)

    result = gateway.capture_order(paypal_token)
    ok = (result['status'] == 'COMPLETED'
          and result['amount_cents'] == order['total_cents']
          and result['currency'] == order['currency']
          and result['custom_id'] == str(order['order_id']))
    with db.transaction() as tx:
        if ok:
            # BEGIN -> UPDATE (only if still PENDING) -> COMMIT. Two racing requests: only one wins.
            tx.execute("UPDATE orders SET status = 'PAID', paypal_capture_id = ?, paid_at = CURRENT_TIMESTAMP "
                       "WHERE order_id = ? AND status = 'PENDING'", (result['capture_id'], order_id))
            return {'status': 'PAID'}
        if result['status'] == 'COMPLETED':
            # Money moved but it does not match our order: never deliver, flag for a human.
            tx.execute("UPDATE orders SET status = 'REVIEW', paypal_capture_id = ? WHERE order_id = ? AND status = 'PENDING'",
                       (result['capture_id'], order_id))
            return {'status': 'REVIEW'}
    raise CheckoutError('The payment was not completed.', 402)


def receipt(db, order_id, key):
    with db.transaction() as tx:
        order = _load_order(tx, order_id, key)
        items = tx.all('SELECT p.slug, p.name, i.unit_price_cents FROM order_items i '
                       'JOIN products p ON p.product_id = i.product_id WHERE i.order_id = ? ORDER BY i.order_item_id',
                       (order_id,))
        names = {r['slug']: r['name'] for r in tx.all('SELECT slug, name FROM products')}
    out = {
        'order_id': order['order_id'], 'status': order['status'], 'email': order['customer_email'],
        'total_cents': order['total_cents'], 'currency': order['currency'],
        'items': [{'name': i['name'], 'price_cents': i['unit_price_cents']} for i in items],
    }
    if order['status'] == 'PAID':
        downloads = []
        for i in items:
            for part in BUNDLES.get(i['slug'], [i['slug']]):
                downloads.append({'name': names.get(part, part), 'url': delivery_url(part)})
        out['downloads'] = downloads
    return out
