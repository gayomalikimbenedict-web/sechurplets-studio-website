import os
import sys
import tempfile
import threading
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.pop('VERCEL', None)
os.environ.pop('DATABASE_URL', None)

from server import checkout_service as svc  # noqa: E402
from server.catalog import PRODUCTS, delivery_env_name  # noqa: E402
from server.database import Database  # noqa: E402
from server.payment_service import MockPayPal, PaymentError  # noqa: E402

SITE = 'https://example.test'


class Gateway(MockPayPal):
    """Mock that can misbehave."""
    def __init__(self):
        super().__init__()
        self.capture_override = None
        self.capture_calls = 0

    def capture_order(self, pid):
        self.capture_calls += 1
        r = super().capture_order(pid)
        if self.capture_override:
            r.update(self.capture_override)
        return r


class T(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.db = Database(sqlite_path=os.path.join(self.dir.name, 't.db'))
        self.db.init_schema()
        self.gw = Gateway()
        for slug, _, _ in PRODUCTS:
            os.environ[delivery_env_name(slug)] = 'https://docs.google.com/spreadsheets/d/X-%s/copy' % slug
        os.environ.pop(delivery_env_name('time-zone-sync'))

    def tearDown(self):
        self.dir.cleanup()

    def start(self, items, email='buyer@example.com'):
        r = svc.create_checkout(self.db, self.gw, {'email': email, 'items': items}, SITE)
        q = dict(p.split('=') for p in r['approve_url'].split('?')[1].split('&'))
        return r['order_id'], q['k'], q['token']

    def order(self, oid):
        with self.db.transaction() as tx:
            return tx.one('SELECT * FROM orders WHERE order_id = ?', (oid,))

    def test_total_computed_on_server_ignoring_client_prices(self):
        r = svc.create_checkout(self.db, self.gw, {'email': 'a@b.co', 'items': ['order-cleaner', 'merge-dedupe'],
                                                   'price': 1, 'total': 1}, SITE)
        self.assertEqual(self.order(r['order_id'])['total_cents'], 4900 + 9900)

    def test_happy_path_delivers_links(self):
        oid, key, tok = self.start(['order-cleaner'])
        self.assertEqual(svc.receipt(self.db, oid, key)['status'], 'PENDING')
        self.assertNotIn('downloads', svc.receipt(self.db, oid, key))   # no links before payment
        self.assertEqual(svc.capture(self.db, self.gw, oid, key, tok)['status'], 'PAID')
        rc = svc.receipt(self.db, oid, key)
        self.assertEqual(rc['downloads'][0]['url'], 'https://docs.google.com/spreadsheets/d/X-order-cleaner/copy')

    def test_bundle_delivers_five(self):
        oid, key, tok = self.start(['ops-toolkit'])
        svc.capture(self.db, self.gw, oid, key, tok)
        self.assertEqual(len(svc.receipt(self.db, oid, key)['downloads']), 5)

    def test_bundle_plus_component_rejected(self):
        with self.assertRaises(svc.CheckoutError):
            svc.create_checkout(self.db, self.gw, {'email': 'a@b.co', 'items': ['ops-toolkit', 'order-cleaner']}, SITE)

    def test_wrong_key_and_unknown_order_look_identical(self):
        oid, key, tok = self.start(['order-cleaner'])
        for bad in ((oid, 'wrong'), (9999, key)):
            with self.assertRaises(svc.CheckoutError) as c:
                svc.receipt(self.db, *bad)
            self.assertEqual(c.exception.status, 404)

    def test_capture_requires_matching_paypal_token(self):
        oid, key, tok = self.start(['order-cleaner'])
        with self.assertRaises(svc.CheckoutError):
            svc.capture(self.db, self.gw, oid, key, 'MOCK-other')
        self.assertEqual(self.order(oid)['status'], 'PENDING')

    def test_amount_mismatch_is_flagged_not_delivered(self):
        oid, key, tok = self.start(['ops-toolkit'])
        self.gw.capture_override = {'amount_cents': 100}
        self.assertEqual(svc.capture(self.db, self.gw, oid, key, tok)['status'], 'REVIEW')
        self.assertNotIn('downloads', svc.receipt(self.db, oid, key))

    def test_double_capture_is_idempotent(self):
        oid, key, tok = self.start(['order-cleaner'])
        svc.capture(self.db, self.gw, oid, key, tok)
        calls = self.gw.capture_calls
        self.assertEqual(svc.capture(self.db, self.gw, oid, key, tok)['status'], 'PAID')
        self.assertEqual(self.gw.capture_calls, calls)   # no second charge attempt

    def test_concurrent_captures_end_paid_once(self):
        oid, key, tok = self.start(['order-cleaner'])
        res = []
        ts = [threading.Thread(target=lambda: res.append(svc.capture(self.db, self.gw, oid, key, tok))) for _ in range(6)]
        [t.start() for t in ts]; [t.join() for t in ts]
        self.assertTrue(all(r['status'] == 'PAID' for r in res))
        self.assertEqual(self.order(oid)['status'], 'PAID')

    def test_unavailable_product_not_sold(self):
        with self.assertRaises(svc.CheckoutError) as c:
            svc.create_checkout(self.db, self.gw, {'email': 'a@b.co', 'items': ['time-zone-sync']}, SITE)
        self.assertEqual(c.exception.status, 409)

    def test_delivery_url_must_be_google_docs(self):
        os.environ[delivery_env_name('order-cleaner')] = 'https://evil.example/x'
        with self.assertRaises(svc.CheckoutError):
            svc.create_checkout(self.db, self.gw, {'email': 'a@b.co', 'items': ['order-cleaner']}, SITE)

    def test_validation(self):
        for payload in ({'email': 'nope', 'items': ['order-cleaner']}, {'email': 'a@b.co', 'items': []},
                        {'email': 'a@b.co', 'items': 'order-cleaner'}, {'email': 'a@b.co', 'items': ['../x']}, None):
            with self.assertRaises(svc.CheckoutError):
                svc.create_checkout(self.db, self.gw, payload, SITE)

    def test_gateway_failure_marks_order_failed_and_rolls_nothing_half(self):
        class Down(MockPayPal):
            def create_order(self, *a, **k):
                raise PaymentError('down')
        with self.assertRaises(PaymentError):
            svc.create_checkout(self.db, Down(), {'email': 'a@b.co', 'items': ['order-cleaner']}, SITE)
        with self.db.transaction() as tx:
            self.assertEqual(tx.one('SELECT status FROM orders')['status'], 'FAILED')

    def test_rollback_on_error_inside_transaction(self):
        with self.assertRaises(RuntimeError):
            with self.db.transaction() as tx:
                tx.execute("INSERT INTO orders (customer_email,total_cents,currency,status,receipt_key) VALUES ('x@y.co',100,'USD','PENDING','k')")
                raise RuntimeError('boom')
        with self.db.transaction() as tx:
            self.assertEqual(tx.one('SELECT COUNT(*) AS n FROM orders')['n'], 0)

    def test_price_snapshot_survives_price_change(self):
        oid, key, tok = self.start(['order-cleaner'])
        with self.db.transaction() as tx:
            tx.execute("UPDATE products SET price_cents = 9999 WHERE slug = 'order-cleaner'")
        self.assertEqual(svc.receipt(self.db, oid, key)['items'][0]['price_cents'], 4900)


if __name__ == '__main__':
    unittest.main(verbosity=2)
