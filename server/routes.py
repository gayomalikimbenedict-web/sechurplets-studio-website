"""The four API operations, shared by the Vercel functions (api/*.py) and the local dev server."""
from . import checkout_service as svc
from .payment_service import get_gateway


def products_get(db, q):
    return svc.list_products(db)


def checkout_post(db, body, site):
    return svc.create_checkout(db, get_gateway(), body, site)


def capture_post(db, body, site):
    return svc.capture(db, get_gateway(), _int(body.get('order')), body.get('key'), body.get('token'))


def receipt_get(db, q):
    return svc.receipt(db, _int(q.get('o')), q.get('k'))


def _int(v):
    try:
        return int(v)
    except (TypeError, ValueError):
        raise svc.CheckoutError('Order not found.', 404)
