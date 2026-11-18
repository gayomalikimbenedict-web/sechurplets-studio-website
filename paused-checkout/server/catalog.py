"""Product catalog. Prices live ONLY here and in the database; the browser never sets a price.

Money is stored as integer cents (not floats) so totals are exact.
"""

CURRENCY = 'USD'

# slug, display name, price in cents
PRODUCTS = [
    ('order-cleaner', 'Fulfillment-Ready Order Cleaner', 4900),
    ('shopify-reconciler', 'Shopify Payout & Refund Reconciler', 7900),
    ('merge-dedupe', 'One Master List: Merge & Dedupe Any Sheets', 9900),
    ('auto-report-builder', 'Auto Report Builder: Weekly Ops & Sales Report', 14900),
    ('support-scorecards', 'Support Team Scorecards', 12900),
    ('ops-toolkit', 'E-commerce Ops Toolkit: Clean, Reconcile, Report', 29900),
    ('time-zone-sync', 'Global Time Zone Sync Engine', 2400),
]

# The Toolkit delivers these five templates.
BUNDLES = {
    'ops-toolkit': ['order-cleaner', 'shopify-reconciler', 'merge-dedupe',
                    'auto-report-builder', 'support-scorecards'],
}

# Delivery links are NOT stored in the repo or database (the repo is public).
# Each is read from an environment variable, e.g. DELIVERY_ORDER_CLEANER.
def delivery_env_name(slug):
    return 'DELIVERY_' + slug.upper().replace('-', '_')
