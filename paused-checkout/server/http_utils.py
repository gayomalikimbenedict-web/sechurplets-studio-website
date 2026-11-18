"""Tiny JSON wrapper around BaseHTTPRequestHandler (the format Vercel's Python runtime expects)."""
import json
import os
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

from .checkout_service import CheckoutError
from .database import ConfigError, Database
from .payment_service import PaymentError, get_gateway

_db = None


def get_db():
    global _db
    if _db is None:
        _db = Database()
        _db.init_schema()
    return _db


def site_url(headers):
    configured = os.environ.get('SITE_URL')
    if configured:
        return configured
    host = headers.get('x-forwarded-host') or headers.get('host') or 'localhost:3000'
    proto = headers.get('x-forwarded-proto') or ('http' if host.startswith('localhost') else 'https')
    return '%s://%s' % (proto, host)


def make_handler(get=None, post=None):
    """get(db, query_dict) / post(db, json_body, site_url) -> (dict, status)."""

    class handler(BaseHTTPRequestHandler):
        def _send(self, status, payload):
            body = json.dumps(payload).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(body)

        def _run(self, fn):
            try:
                payload, status = fn()
                self._send(status, payload)
            except CheckoutError as e:
                self._send(e.status, {'error': str(e)})
            except PaymentError as e:
                self._send(e.status, {'error': str(e)})
            except ConfigError:
                self._send(503, {'error': 'The store is not configured yet. Please email us to order.'})
            except Exception:
                if os.environ.get('API_DEBUG'):
                    import traceback; traceback.print_exc()
                self._send(500, {'error': 'Something went wrong. Please try again.'})

        def do_GET(self):
            if not get:
                return self._send(405, {'error': 'Method not allowed.'})
            q = {k: v[0] for k, v in parse_qs(urlparse(self.path).query).items()}
            self._run(lambda: (get(get_db(), q), 200))

        def do_POST(self):
            if not post:
                return self._send(405, {'error': 'Method not allowed.'})
            try:
                n = int(self.headers.get('Content-Length') or 0)
                if n > 10_000:
                    return self._send(413, {'error': 'Request too large.'})
                body = json.loads(self.rfile.read(n) or b'{}')
            except (ValueError, TypeError):
                return self._send(400, {'error': 'Invalid request.'})
            self._run(lambda: (post(get_db(), body, site_url(self.headers)), 200))

        def log_message(self, *a):
            pass

    return handler
