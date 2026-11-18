"""Local test server: serves the static site and /api/* with a fake PayPal.

    python -m server.dev_server          (then open http://localhost:3000)

Uses store.db (SQLite) and fake delivery links, so no credentials are needed.
"""
import json
import mimetypes
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse

os.environ.setdefault('PAYPAL_MOCK', '1')
os.environ.pop('VERCEL', None)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from server.catalog import BUNDLES, PRODUCTS, delivery_env_name  # noqa: E402
from server.http_utils import make_handler  # noqa: E402
from server.routes import capture_post, checkout_post, products_get, receipt_get  # noqa: E402

for slug, _, _ in PRODUCTS:  # fake sheet links so every product is buyable locally
    os.environ.setdefault(delivery_env_name(slug), 'https://docs.google.com/spreadsheets/d/FAKE-%s/copy' % slug)

API = {
    '/api/products': make_handler(get=products_get),
    '/api/checkout': make_handler(post=checkout_post),
    '/api/capture': make_handler(post=capture_post),
    '/api/receipt': make_handler(get=receipt_get),
}


class Dev(BaseHTTPRequestHandler):
    def _api(self):
        cls = API.get(urlparse(self.path).path)
        if not cls:
            return False
        # Re-dispatch to the same handler class the Vercel functions use.
        h = cls.__new__(cls)
        h.__dict__.update(self.__dict__)
        getattr(h, 'do_' + self.command)()
        return True

    def _static(self):
        p = unquote(urlparse(self.path).path)
        p = 'index.html' if p == '/' else p.lstrip('/')
        f = os.path.normpath(os.path.join(ROOT, p))
        if not f.startswith(ROOT) or any(part in ('server', 'api', 'tests', '.git') for part in os.path.relpath(f, ROOT).split(os.sep)[:1]):
            f = None
        for cand in (f, f and f + '.html'):
            if cand and os.path.isfile(cand):
                data = open(cand, 'rb').read()
                self.send_response(200)
                self.send_header('Content-Type', mimetypes.guess_type(cand)[0] or 'application/octet-stream')
                self.send_header('Content-Length', str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return
        body = open(os.path.join(ROOT, '404.html'), 'rb').read()
        self.send_response(404); self.send_header('Content-Type', 'text/html'); self.end_headers(); self.wfile.write(body)

    def do_GET(self):
        self._api() or self._static()

    def do_POST(self):
        self._api() or (self.send_response(404), self.end_headers())

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    print('Dev server with FAKE PayPal on http://localhost:%d  (Ctrl+C to stop)' % port)
    ThreadingHTTPServer(('127.0.0.1', port), Dev).serve_forever()
