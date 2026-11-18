"""PayPal Orders v2 (redirect flow) using only the standard library.

Environment:
  PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET
  PAYPAL_ENV = sandbox (default) | live
  PAYPAL_MOCK = 1  -> local fake gateway for development ONLY (ignored on Vercel)
"""
import base64
import json
import os
import time
import urllib.error
import urllib.request


class PaymentError(Exception):
    def __init__(self, message, status=502):
        super().__init__(message)
        self.status = status


def money(cents):
    return '%d.%02d' % (cents // 100, cents % 100)


def to_cents(value):
    whole, _, frac = str(value).partition('.')
    return int(whole) * 100 + int((frac + '00')[:2])


class PayPalClient:
    def __init__(self, client_id=None, client_secret=None, env=None):
        self.client_id = client_id or os.environ.get('PAYPAL_CLIENT_ID')
        self.client_secret = client_secret or os.environ.get('PAYPAL_CLIENT_SECRET')
        env = (env or os.environ.get('PAYPAL_ENV') or 'sandbox').lower()
        self.base = 'https://api-m.paypal.com' if env == 'live' else 'https://api-m.sandbox.paypal.com'
        if not self.client_id or not self.client_secret:
            raise PaymentError('Payments are not configured yet.', 503)
        self._token, self._expires = None, 0

    def _request(self, method, path, body=None, headers=None, auth='bearer'):
        data = None
        h = {'Accept': 'application/json'}
        if auth == 'basic':
            raw = ('%s:%s' % (self.client_id, self.client_secret)).encode()
            h['Authorization'] = 'Basic ' + base64.b64encode(raw).decode()
            h['Content-Type'] = 'application/x-www-form-urlencoded'
            data = body
        else:
            h['Authorization'] = 'Bearer ' + self._access_token()
            if body is not None:
                h['Content-Type'] = 'application/json'
                data = json.dumps(body).encode()
        h.update(headers or {})
        req = urllib.request.Request(self.base + path, data=data, method=method, headers=h)
        try:
            with urllib.request.urlopen(req, timeout=15) as r:
                return r.status, json.loads(r.read() or b'{}')
        except urllib.error.HTTPError as e:
            try:
                return e.code, json.loads(e.read() or b'{}')
            except ValueError:
                return e.code, {}
        except (urllib.error.URLError, TimeoutError, OSError):
            raise PaymentError('Could not reach PayPal. Please try again.')

    def _access_token(self):
        if self._token and time.time() < self._expires - 30:
            return self._token
        status, data = self._request('POST', '/v1/oauth2/token', b'grant_type=client_credentials', auth='basic')
        if status != 200 or 'access_token' not in data:
            raise PaymentError('PayPal sign-in failed. Check the API credentials.', 503)
        self._token, self._expires = data['access_token'], time.time() + int(data.get('expires_in', 300))
        return self._token

    def create_order(self, order_id, total_cents, currency, return_url, cancel_url, description):
        status, data = self._request('POST', '/v2/checkout/orders', {
            'intent': 'CAPTURE',
            'purchase_units': [{
                'custom_id': str(order_id),
                'description': description[:120],
                'amount': {'currency_code': currency, 'value': money(total_cents)},
            }],
            'payment_source': {'paypal': {'experience_context': {
                'return_url': return_url, 'cancel_url': cancel_url,
                'user_action': 'PAY_NOW', 'shipping_preference': 'NO_SHIPPING',
                'brand_name': 'Sechurplets Studio'}}},
        }, headers={'PayPal-Request-Id': 'sechurplets-order-%s' % order_id})
        if status not in (200, 201):
            raise PaymentError('PayPal could not start the payment.')
        approve = next((l['href'] for l in data.get('links', []) if l.get('rel') in ('payer-action', 'approve')), None)
        if not data.get('id') or not approve:
            raise PaymentError('PayPal returned an unexpected response.')
        return data['id'], approve

    @staticmethod
    def _normalize(data):
        unit = (data.get('purchase_units') or [{}])[0]
        cap = ((unit.get('payments') or {}).get('captures') or [{}])[0]
        amount = cap.get('amount') or {}
        return {
            'status': cap.get('status') or data.get('status'),
            'order_status': data.get('status'),
            'capture_id': cap.get('id'),
            'amount_cents': to_cents(amount['value']) if amount.get('value') else None,
            'currency': amount.get('currency_code'),
            'custom_id': unit.get('custom_id'),
        }

    def get_order(self, paypal_order_id):
        status, data = self._request('GET', '/v2/checkout/orders/' + paypal_order_id)
        if status != 200:
            raise PaymentError('PayPal could not find that payment.')
        return self._normalize(data)

    def capture_order(self, paypal_order_id):
        status, data = self._request('POST', '/v2/checkout/orders/%s/capture' % paypal_order_id, {},
                                     headers={'PayPal-Request-Id': 'sechurplets-capture-' + paypal_order_id})
        if status in (200, 201):
            return self._normalize(data)
        issues = [d.get('issue') for d in data.get('details', [])]
        if 'ORDER_ALREADY_CAPTURED' in issues:
            return self.get_order(paypal_order_id)
        if 'INSTRUMENT_DECLINED' in issues or 'PAYER_ACTION_REQUIRED' in issues:
            raise PaymentError('Payment Declined. Please try another PayPal funding source.', 402)
        raise PaymentError('PayPal could not complete the payment.')


class MockPayPal:
    """Local fake gateway so the whole flow can be clicked through without credentials."""

    def __init__(self):
        self.orders = {}

    def create_order(self, order_id, total_cents, currency, return_url, cancel_url, description):
        pid = 'MOCK-%s' % order_id
        self.orders[pid] = {'order_id': order_id, 'cents': total_cents, 'currency': currency}
        sep = '&' if '?' in return_url else '?'
        return pid, '%s%stoken=%s' % (return_url, sep, pid)

    def get_order(self, pid):
        return self.capture_order(pid)

    def capture_order(self, pid):
        o = self.orders.get(pid)
        if not o:
            raise PaymentError('Unknown mock payment.')
        return {'status': 'COMPLETED', 'order_status': 'COMPLETED', 'capture_id': 'CAP-' + pid,
                'amount_cents': o['cents'], 'currency': o['currency'], 'custom_id': str(o['order_id'])}


_mock = MockPayPal()


def get_gateway():
    if os.environ.get('PAYPAL_MOCK') == '1' and not os.environ.get('VERCEL'):
        return _mock
    return PayPalClient()
