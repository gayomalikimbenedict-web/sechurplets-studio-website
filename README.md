# Sechurplets Studio website

Static site (HTML/CSS/JS) plus a small Python checkout backend that runs as Vercel serverless functions.
Products are digital Google Sheets templates: customers pay with PayPal and the receipt page shows each template's **Make a copy** link.

## How checkout works
`checkout.html` -> `POST /api/checkout` (server validates, prices the cart, records a PENDING order, creates the PayPal order) -> PayPal -> back to `receipt.html` -> `POST /api/capture` (server captures, checks amount/currency/order, marks PAID in one transaction) -> `GET /api/receipt` (links shown only when PAID).

- `server/` business logic, database layer (SQLite locally, Postgres in production), PayPal client
- `api/` one thin Vercel function per endpoint
- `tests/` `python tests/test_checkout.py`
- Money is stored as integer cents. Prices are set in `server/catalog.py`, never in the browser.

## Try it locally (no PayPal account needed)
```
python -m server.dev_server
```
Open http://localhost:3000. It uses a fake PayPal and a local `store.db`. Never deploy with `PAYPAL_MOCK`.

## Go live
1. Create a Postgres database (Vercel -> Storage -> Neon) and copy its connection string.
2. Create a PayPal app at developer.paypal.com (start in sandbox).
3. In Vercel -> Project -> Settings -> Environment Variables add everything in `.env.example`
   (Make a copy links, PayPal keys, `DATABASE_URL`). Tables are created automatically on first request.
4. Redeploy, do a sandbox purchase, then switch `PAYPAL_ENV=live` with your live keys.
