# Paused: PayPal checkout

Built and unit-tested (`python tests/test_checkout.py`, 15 tests) but NOT deployed. Not yet verified: the live PayPal sandbox calls, the production Postgres path, and a real Vercel Python deployment (the first attempt returned 404 for /api/*, cause not yet diagnosed).

Try locally with a fake PayPal: from this folder run `python -m server.dev_server`, open http://localhost:3000 (the dev server serves this folder's pages; copy `assets/checkout.js` and `assets/receipt.js` as needed).

To turn it on later: move `api/`, `server/`, `requirements.txt`, `checkout.html`, `receipt.html` and the two JS files back to the site root, set the variables in `.env.example` in Vercel, point the Buy buttons to `checkout?p=<slug>`, and update the Privacy/Terms/Refunds pages to describe PayPal and stored order data.
