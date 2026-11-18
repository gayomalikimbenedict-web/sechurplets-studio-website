# Sechurplets Studio website

Static site (HTML/CSS/JS, no build step). Deploy the folder on Vercel with Framework "Other" and empty build settings.

- `index.html`, `store.html`, `demo.html`, `privacy.html`, `terms.html`, `refunds.html`, `404.html`
- `products/` one page per template
- `assets/` CSS, JS, logo and icons
- `vercel.json` clean URLs and security headers; `sitemap.xml`, `robots.txt`

## Ordering (current)
Online checkout is **paused**. Every "Order by email" button opens a prefilled email to sechurplets.studio@outlook.com, and product pages also offer WhatsApp. Prices and product facts come from "Sechurplets Studio: Product Listing Copy".

## Paused PayPal checkout
`paused-checkout/` holds the finished backend (Python API, database layer, PayPal client, tests, checkout and receipt pages). It is excluded from deployment by `.vercelignore` and is not linked from the site. See `paused-checkout/README.md` before turning it on.
