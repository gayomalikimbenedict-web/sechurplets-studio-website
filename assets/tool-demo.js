/* Animated walkthroughs for the product pages.
   Illustrative: made-up sample data, simplified. Every scene runs at least 10 seconds. */
(function () {
  'use strict';

  /* ---------- scenes ---------- */
  var OC_COLS = ['Order ID', 'Customer', 'Zip', 'Total', 'Note'];
  var SCENES = {
    'order-cleaner': {
      title: 'Order Cleaner',
      tabs: ['IMPORT', 'CLEANED_MASTER', 'DUPLICATES_ARCHIVE', 'REFUNDS_&_RISK_LOG'],
      frames: [
        { ms: 2400, tab: 'IMPORT', caption: 'Paste your order export into the IMPORT tab.',
          table: { cols: OC_COLS, rows: [
            { id: 'a', cells: ['ORD-1001', 'Ana R.', '2134', '49.00', ''] },
            { id: 'b', cells: ['ORD-1002', 'Ben K.', '94107', '79.00', ''] },
            { id: 'c', cells: ['ORD-1002', 'Ben K.', '94107', '79.00', ''] },
            { id: 'd', cells: ['ORD-1003', 'Cara L.', '60601', '29.00', 'cancelled'] },
            { id: 'e', cells: ['ORD-1004', 'Dev P.', '10001', '0.00', ''] }] } },
        { ms: 1800, tab: 'IMPORT', btn: 'Run full clean', caption: 'Click Run full clean.',
          table: { cols: OC_COLS, rows: [
            { id: 'a', cells: ['ORD-1001', 'Ana R.', '2134', '49.00', ''] },
            { id: 'b', cells: ['ORD-1002', 'Ben K.', '94107', '79.00', ''] },
            { id: 'c', cells: ['ORD-1002', 'Ben K.', '94107', '79.00', ''] },
            { id: 'd', cells: ['ORD-1003', 'Cara L.', '60601', '29.00', 'cancelled'] },
            { id: 'e', cells: ['ORD-1004', 'Dev P.', '10001', '0.00', ''] }] } },
        { ms: 2800, tab: 'DUPLICATES_ARCHIVE', caption: 'Duplicate Order IDs move to DUPLICATES_ARCHIVE. The first copy is kept.',
          table: { cols: ['Order ID', 'Customer', 'Total', 'Note'], rows: [
            { id: 'c', c: 'dup', cells: ['ORD-1002', 'Ben K.', '79.00', 'Duplicate: first copy kept'] }] } },
        { ms: 3000, tab: 'REFUNDS_&_RISK_LOG', caption: 'Cancelled orders are taken out of your fulfillment list and listed for review. Unusual records are flagged too.',
          table: { cols: ['Order ID', 'Customer', 'Total', 'Reason'], rows: [
            { id: 'd', c: 'cancel', cells: ['ORD-1003', 'Cara L.', '29.00', 'Cancelled: removed from fulfillment'] },
            { id: 'e', c: 'flag', cells: ['ORD-1004', 'Dev P.', '0.00', 'Flagged: zero total'] }] } },
        { ms: 2800, tab: 'CLEANED_MASTER', caption: 'Short US zip codes get their leading zero back: 2134 becomes 02134.',
          table: { cols: ['Order ID', 'Customer', 'Zip', 'Total'], rows: [
            { id: 'a', cells: ['ORD-1001', 'Ana R.', { t: '02134', c: 'fix' }, '49.00'] },
            { id: 'b', cells: ['ORD-1002', 'Ben K.', '94107', '79.00'] }] } },
        { ms: 2600, tab: 'CLEANED_MASTER', btn: 'Export fulfillment CSV', chip: 'fulfillment.csv', caption: 'Export the fulfillment CSV, then clear the sheet for the next batch.',
          table: { cols: ['Order ID', 'Customer', 'Zip', 'Total'], rows: [
            { id: 'a', cells: ['ORD-1001', 'Ana R.', '02134', '49.00'] },
            { id: 'b', cells: ['ORD-1002', 'Ben K.', '94107', '79.00'] }] } }
      ]
    },

    'shopify-reconciler': {
      title: 'Payout & Refund Reconciler',
      tabs: ['SUMMARY', 'MATCHED', 'UNMATCHED', 'DISCREPANCIES', 'DUPLICATES'],
      frames: [
        { ms: 2600, tabs: ['Orders export', 'Refunds export', 'Payouts export'], tab: 'Orders export', caption: 'Export your orders, refunds, and payout transactions from Shopify as CSV and paste each one into the template.',
          table: { key: 'orders', cols: ['Order', 'Amount', 'Currency'], rows: [
            { id: 'o1', cells: ['ORD-2001', '49.00', 'USD'] }, { id: 'o2', cells: ['ORD-2002', '79.00', 'USD'] },
            { id: 'o3', cells: ['ORD-2003', '99.00', 'USD'] }, { id: 'o4', cells: ['ORD-2004', '149.00', 'USD'] }] } },
        { ms: 2000, tabs: ['Orders export', 'Refunds export', 'Payouts export'], tab: 'Payouts export', btn: 'Run reconciliation', caption: 'Click Run reconciliation. Tolerance for rounding differences is set in CONFIG.',
          table: { key: 'payouts', cols: ['Order', 'Amount', 'Currency'], rows: [
            { id: 'p1', cells: ['ORD-2001', '49.00', 'USD'] }, { id: 'p2', cells: ['ORD-2002', '79.00', 'USD'] },
            { id: 'p4', cells: ['ORD-2004', '129.00', 'USD'] }] } },
        { ms: 2800, tab: 'MATCHED', caption: 'Records are matched by order number, and amounts and currencies are compared.',
          table: { key: 'matched', cols: ['Order', 'Order amount', 'Payout amount', 'Result'], rows: [
            { id: 'o1', c: 'ok', cells: ['ORD-2001', '49.00 USD', '49.00 USD', 'Matched'] },
            { id: 'o2', c: 'ok', cells: ['ORD-2002', '79.00 USD', '79.00 USD', 'Matched'] }] } },
        { ms: 2800, tab: 'UNMATCHED', caption: 'Records with no partner are listed in UNMATCHED.',
          table: { key: 'unmatched', cols: ['Order', 'Amount', 'Result'], rows: [
            { id: 'o3', c: 'flag', cells: ['ORD-2003', '99.00 USD', 'No payout found'] }] } },
        { ms: 2800, tab: 'DISCREPANCIES', caption: 'Amount differences are listed in DISCREPANCIES.',
          table: { key: 'disc', cols: ['Order', 'Order amount', 'Payout amount', 'Difference'], rows: [
            { id: 'o4', c: 'cancel', cells: ['ORD-2004', '149.00 USD', '129.00 USD', '20.00 USD'] }] } },
        { ms: 3200, tab: 'SUMMARY', caption: 'SUMMARY shows the counts and a money-to-review total for each currency. Currencies are never mixed.',
          table: { key: 'sum', cols: ['Item', 'Count', 'Money to review'], rows: [
            { id: 's1', cells: ['Matched', '2', ''] }, { id: 's2', cells: ['Unmatched', '1', '99.00 USD'] },
            { id: 's3', cells: ['Discrepancies', '1', '20.00 USD'] }, { id: 's4', c: 'fix', cells: ['Total, USD', '', '119.00 USD'] }] },
          note: 'Money to review shows where to look first. It is not a loss figure.' }
      ]
    },

    'merge-dedupe': {
      title: 'Merge & Dedupe',
      tabs: ['CONFIG', 'MAPPING', 'MASTER', 'DUPLICATES_ARCHIVE', 'CONFLICTS', 'SUMMARY'],
      frames: [
        { ms: 2800, tab: 'CONFIG', caption: 'Put your data in your own tabs, each with a header row, and list the tab names in CONFIG with a priority number.',
          table: { key: 'cfg', cols: ['Source tab', 'Priority'], rows: [
            { id: 't1', cells: ['Website list', '1'] }, { id: 't2', cells: ['Event list', '2'] }, { id: 't3', cells: ['Old list', '3'] }] } },
        { ms: 2600, tab: 'MAPPING', btn: 'Build mapping', caption: 'Click Build mapping. Similar column names are matched for you, and you can correct any match.',
          table: { key: 'map', cols: ['Master column', 'Website list', 'Event list', 'Old list'], rows: [
            { id: 'm1', cells: ['Email', 'Email', 'E-mail', 'email'] }, { id: 'm2', cells: ['Name', 'Name', 'Full name', 'name'] },
            { id: 'm3', cells: ['City', 'City', 'City', 'town'] }] } },
        { ms: 2200, tab: 'MAPPING', caption: 'Choose the column that identifies the same record, for example Email.',
          table: { key: 'map', cols: ['Master column', 'Website list', 'Event list', 'Old list'], rows: [
            { id: 'm1', c: 'fix', cells: ['Email (key)', 'Email', 'E-mail', 'email'] }, { id: 'm2', cells: ['Name', 'Name', 'Full name', 'name'] },
            { id: 'm3', cells: ['City', 'City', 'City', 'town'] }] } },
        { ms: 1800, tab: 'MAPPING', btn: 'Run merge', caption: 'Click Run merge.',
          table: { key: 'map', cols: ['Master column', 'Website list', 'Event list', 'Old list'], rows: [
            { id: 'm1', cells: ['Email (key)', 'Email', 'E-mail', 'email'] }, { id: 'm2', cells: ['Name', 'Name', 'Full name', 'name'] },
            { id: 'm3', cells: ['City', 'City', 'City', 'town'] }] } },
        { ms: 3000, tab: 'MASTER', caption: 'One master list. If the winning record has a blank, the value can be filled from a lower-priority duplicate.',
          table: { key: 'master', cols: ['Email', 'Name', 'City', 'Note'], rows: [
            { id: 'r1', cells: ['ana@example.com', 'Ana R.', 'Manila', ''] },
            { id: 'r2', cells: ['ben@example.com', 'Ben K.', { t: 'Cebu', c: 'fix' }, 'City filled from a lower-priority duplicate'] },
            { id: 'r3', cells: ['cara@example.com', 'Cara L.', 'Davao', ''] }] } },
        { ms: 2600, tab: 'CONFLICTS', caption: 'Values that differ between sources are listed in CONFLICTS for you to review.',
          table: { key: 'conf', cols: ['Email', 'Column', 'Kept (priority 1)', 'Other value'], rows: [
            { id: 'k1', c: 'flag', cells: ['ana@example.com', 'City', 'Manila', 'Quezon City'] }] } },
        { ms: 3000, tab: 'SUMMARY', caption: 'SUMMARY shows nothing was lost: rows read equal rows in MASTER plus rows archived. Your original tabs are never changed.',
          table: { key: 'sum', cols: ['Item', 'Rows'], rows: [
            { id: 's1', cells: ['Rows read (all tabs)', '9'] }, { id: 's2', cells: ['In MASTER', '5'] },
            { id: 's3', cells: ['In DUPLICATES_ARCHIVE', '4'] }, { id: 's4', c: 'fix', cells: ['MASTER + archived', '9'] }] } }
      ]
    },

    'auto-report-builder': {
      title: 'Auto Report Builder',
      tabs: ['DATA', 'LAYOUT', 'REPORT'],
      frames: [
        { ms: 2600, tab: 'DATA', caption: 'Paste your orders into the DATA tab, one row per order.',
          table: { key: 'data', cols: ['Order ID', 'Order Date', 'Total', 'Status', 'Country'], rows: [
            { id: 'd1', cells: ['ORD-3001', '2026-11-09', '49.00', 'paid', 'US'] }, { id: 'd2', cells: ['ORD-3002', '2026-11-09', '129.00', 'paid', 'PH'] },
            { id: 'd3', cells: ['ORD-3003', '2026-11-10', '79.00', 'refunded', 'GB'] }, { id: 'd4', cells: ['ORD-3004', '2026-11-11', '149.00', 'paid', 'US'] },
            { id: 'd5', cells: ['ORD-3005', '2026-11-12', '99.00', 'paid', 'AU'] }] } },
        { ms: 2800, tab: 'LAYOUT', caption: 'In LAYOUT, set the title, company name, colors, logo, the period, and which sections to show.',
          table: { key: 'lay', cols: ['Setting', 'Value'], rows: [
            { id: 'l1', cells: ['Title', 'Weekly Ops & Sales Report'] }, { id: 'l2', cells: ['Company', 'Your Company'] },
            { id: 'l3', cells: ['Period', 'Previous full week'] }, { id: 'l4', cells: ['Sections', 'Each one can be switched on or off'] }] } },
        { ms: 1800, tab: 'LAYOUT', btn: 'Build report', caption: 'Click Build report.',
          table: { key: 'lay', cols: ['Setting', 'Value'], rows: [
            { id: 'l1', cells: ['Title', 'Weekly Ops & Sales Report'] }, { id: 'l2', cells: ['Company', 'Your Company'] },
            { id: 'l3', cells: ['Period', 'Previous full week'] }, { id: 'l4', cells: ['Sections', 'Each one can be switched on or off'] }] } },
        { ms: 3600, tab: 'REPORT', caption: 'Key numbers, compared with the previous period, and revenue by day.',
          board: { tiles: [['Orders', '128', 'up on previous period'], ['Revenue', '$5,240', 'up on previous period'], ['Average order', '$41', 'down on previous period']],
                   bars: { title: 'Revenue by day', labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], vals: [55, 70, 48, 82, 95, 60, 40] } } },
        { ms: 3200, tab: 'REPORT', caption: 'Top items, orders by status, and orders by country.',
          board: { lists: [
            { title: 'Top items', items: [['Order Cleaner', '34', 85], ['Reconciler', '22', 55], ['Scorecards', '15', 38]] },
            { title: 'Orders by status', items: [['Paid', '110', 86], ['Refunded', '10', 8], ['Cancelled', '8', 6]] },
            { title: 'Orders by country', items: [['US', '60', 47], ['PH', '38', 30], ['GB', '30', 23]] }] } }
      ]
    },

    'support-scorecards': {
      title: 'Support Team Scorecards',
      tabs: ['ACTIVITY', 'CONFIG', 'SCORECARDS', 'TEAM_SUMMARY'],
      frames: [
        { ms: 2600, tab: 'ACTIVITY', caption: 'Paste your call, chat, or ticket log into the ACTIVITY tab.',
          table: { key: 'act', cols: ['Agent', 'Type', 'Handle time', 'Resolved'], rows: [
            { id: 'a1', cells: ['Agent A', 'chat', '06:10', 'yes'] }, { id: 'a2', cells: ['Agent C', 'call', '11:40', 'no'] },
            { id: 'a3', cells: ['Agent B', 'chat', '07:25', 'yes'] }, { id: 'a4', cells: ['Agent C', 'call', '10:05', 'yes'] },
            { id: 'a5', cells: ['Agent A', 'chat', '05:50', 'yes'] }] } },
        { ms: 2800, tab: 'CONFIG', caption: 'Set your own thresholds, for example a maximum average handle time and a minimum resolution rate.',
          table: { key: 'cfg', cols: ['Setting', 'Value'], rows: [
            { id: 'c1', cells: ['Maximum average handle time', '08:00'] }, { id: 'c2', cells: ['Minimum resolution rate', '85%'] }] } },
        { ms: 1800, tab: 'CONFIG', btn: 'Build scorecards', caption: 'Click Build scorecards.',
          table: { key: 'cfg', cols: ['Setting', 'Value'], rows: [
            { id: 'c1', cells: ['Maximum average handle time', '08:00'] }, { id: 'c2', cells: ['Minimum resolution rate', '85%'] }] } },
        { ms: 3800, tab: 'SCORECARDS', caption: 'Each agent gets a scorecard. Cells outside your thresholds are marked, and a Flags column says why.',
          table: { key: 'sc', cols: ['Agent', 'Interactions', 'Avg handle', 'Resolution', 'Flags'], rows: [
            { id: 'g1', cells: ['Agent A', '48', '06:05', '94%', ''] },
            { id: 'g2', c: 'flag', cells: ['Agent C', '51', { t: '10:20', c: 'bad' }, { t: '78%', c: 'bad' }, 'Handle time and resolution outside thresholds'] },
            { id: 'g3', cells: ['Agent B', '44', '07:20', '90%', ''] },
            { id: 'g4', c: 'dim', cells: ['Agent E', '3', 'n/a', 'n/a', 'Too few interactions to judge'] }] } },
        { ms: 3000, tab: 'TEAM_SUMMARY', caption: 'Team summaries come from your team tags or the TEAMS tab.',
          table: { key: 'ts', cols: ['Team', 'Agents', 'Interactions', 'Avg handle', 'Resolution'], rows: [
            { id: 't1', cells: ['Team 1', '3', '143', '07:40', '87%'] }, { id: 't2', cells: ['Team 2', '3', '127', '06:55', '91%'] }] } }
      ]
    },

    'ops-toolkit': {
      title: 'E-commerce Ops Toolkit',
      tabs: [],
      frames: [
        { ms: 2400, caption: 'One purchase, five Google Sheets templates for online sellers.', tiles: { on: -1 } },
        { ms: 2000, caption: 'Clean your order exports.', tiles: { on: 0 } },
        { ms: 2000, caption: 'Reconcile payouts and refunds.', tiles: { on: 1 } },
        { ms: 2000, caption: 'Merge scattered sheets into one master list.', tiles: { on: 2 } },
        { ms: 2000, caption: 'Build reports.', tiles: { on: 3 } },
        { ms: 2000, caption: 'Score your support team.', tiles: { on: 4 } },
        { ms: 3600, caption: 'The five tools cost $505 separately. The Toolkit is $299, so you save $206 (about 41%).', tiles: { on: -1, all: true, foot: ['Separately: $505', 'Toolkit: $299', 'You save $206 (about 41%)'] },
          note: 'Not included: Global Time Zone Sync Engine, which is sold separately.' }
      ],
      toolkit: [['Order Cleaner', '$49'], ['Payout & Refund Reconciler', '$79'], ['Merge & Dedupe', '$99'], ['Auto Report Builder', '$149'], ['Support Team Scorecards', '$129']]
    },

    'time-zone-sync': {
      title: 'Time Zone Sync Engine',
      tabs: [],
      frames: [
        { ms: 2600, caption: 'Choose Genesis, then Setup Continents.', menu: { label: 'Genesis', items: ['Setup Continents', 'Run the world', 'Goodbye world'], active: 0 },
          tabsOverride: ['Sheet1'], table: { key: 'empty', cols: ['', '', ''], rows: [] } },
        { ms: 2800, caption: 'Seven continent tabs are built, with the locations listed.', tabsOverride: ['ASIA', 'AFRICA', 'ANTARCTICA', 'EUROPE', 'NORTH AMERICA', 'OCEANIA', 'SOUTH AMERICA'], tab: 'ASIA',
          table: { key: 'tz', cols: ['Country / Territory', 'Time Zone', 'Day (Today)', 'Time (HH:MM:SS)', 'Parts of the Day'], rows: [
            { id: 'z1', cells: ['PHILIPPINES', 'UTC+08:00', '', '', ''] }, { id: 'z2', cells: ['JAPAN', 'UTC+09:00', '', '', ''] },
            { id: 'z3', cells: ['INDIA', 'UTC+05:30', '', '', ''] }, { id: 'z4', cells: ['UAE', 'UTC+04:00', '', '', ''] },
            { id: 'z5', cells: ['SAUDI ARABIA', 'UTC+03:00', '', '', ''] }, { id: 'z6', cells: ['THAILAND', 'UTC+07:00', '', '', ''] }] } },
        { ms: 2200, caption: 'Choose Genesis, then Run the world.', menu: { label: 'Genesis', items: ['Setup Continents', 'Run the world', 'Goodbye world'], active: 1 },
          tabsOverride: ['ASIA', 'AFRICA', 'ANTARCTICA', 'EUROPE', 'NORTH AMERICA', 'OCEANIA', 'SOUTH AMERICA'], tab: 'ASIA',
          table: { key: 'tz', cols: ['Country / Territory', 'Time Zone', 'Day (Today)', 'Time (HH:MM:SS)', 'Parts of the Day'], rows: [
            { id: 'z1', cells: ['PHILIPPINES', 'UTC+08:00', '', '', ''] }, { id: 'z2', cells: ['JAPAN', 'UTC+09:00', '', '', ''] },
            { id: 'z3', cells: ['INDIA', 'UTC+05:30', '', '', ''] }, { id: 'z4', cells: ['UAE', 'UTC+04:00', '', '', ''] },
            { id: 'z5', cells: ['SAUDI ARABIA', 'UTC+03:00', '', '', ''] }, { id: 'z6', cells: ['THAILAND', 'UTC+07:00', '', '', ''] }] } },
        { ms: 5600, tick: true, caption: 'A sidebar opens. The clock fills in and keeps ticking while the sidebar is open.', side: { title: 'Global Seven-Continent Engine', text: 'Clock running. Close this panel to stop.' },
          tabsOverride: ['ASIA', 'AFRICA', 'ANTARCTICA', 'EUROPE', 'NORTH AMERICA', 'OCEANIA', 'SOUTH AMERICA'], tab: 'ASIA',
          table: { key: 'tz', cols: ['Country / Territory', 'Time Zone', 'Day (Today)', 'Time (HH:MM:SS)', 'Parts of the Day'], rows: [
            { id: 'z1', cells: ['PHILIPPINES', 'UTC+08:00', 'Wednesday', { t: '15:42:07', tick: true }, { t: 'Afternoon', c: 'pd-aft' }] },
            { id: 'z2', cells: ['JAPAN', 'UTC+09:00', 'Wednesday', { t: '16:42:07', tick: true }, { t: 'Afternoon', c: 'pd-aft' }] },
            { id: 'z3', cells: ['INDIA', 'UTC+05:30', 'Wednesday', { t: '13:12:07', tick: true }, { t: 'Afternoon', c: 'pd-aft' }] },
            { id: 'z4', cells: ['UAE', 'UTC+04:00', 'Wednesday', { t: '11:42:07', tick: true }, { t: 'Morning', c: 'pd-morn' }] },
            { id: 'z5', cells: ['SAUDI ARABIA', 'UTC+03:00', 'Wednesday', { t: '10:42:07', tick: true }, { t: 'Morning', c: 'pd-morn' }] },
            { id: 'z6', cells: ['THAILAND', 'UTC+07:00', 'Wednesday', { t: '14:42:07', tick: true }, { t: 'Afternoon', c: 'pd-aft' }] }] } },
        { ms: 2400, caption: 'Close the sidebar to stop the clock. Run it again any time.',
          tabsOverride: ['ASIA', 'AFRICA', 'ANTARCTICA', 'EUROPE', 'NORTH AMERICA', 'OCEANIA', 'SOUTH AMERICA'], tab: 'ASIA',
          table: { key: 'tz', cols: ['Country / Territory', 'Time Zone', 'Day (Today)', 'Time (HH:MM:SS)', 'Parts of the Day'], rows: [
            { id: 'z1', cells: ['PHILIPPINES', 'UTC+08:00', 'Wednesday', '15:42:12', { t: 'Afternoon', c: 'pd-aft' }] },
            { id: 'z2', cells: ['JAPAN', 'UTC+09:00', 'Wednesday', '16:42:12', { t: 'Afternoon', c: 'pd-aft' }] },
            { id: 'z3', cells: ['INDIA', 'UTC+05:30', 'Wednesday', '13:12:12', { t: 'Afternoon', c: 'pd-aft' }] },
            { id: 'z4', cells: ['UAE', 'UTC+04:00', 'Wednesday', '11:42:12', { t: 'Morning', c: 'pd-morn' }] },
            { id: 'z5', cells: ['SAUDI ARABIA', 'UTC+03:00', 'Wednesday', '10:42:12', { t: 'Morning', c: 'pd-morn' }] },
            { id: 'z6', cells: ['THAILAND', 'UTC+07:00', 'Wednesday', '14:42:12', { t: 'Afternoon', c: 'pd-aft' }] }] } }
      ]
    }
  };

  /* ---------- helpers ---------- */
  function h(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }
  function total(scene) { return scene.frames.reduce(function (s, f) { return s + f.ms; }, 0); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function addSec(t) {
    var p = t.split(':').map(Number), s = p[0] * 3600 + p[1] * 60 + p[2] + 1;
    s %= 86400;
    return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s % 3600 / 60)) + ':' + pad(s % 60);
  }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- player ---------- */
  function Player(root, scene) {
    var self = this;
    this.root = root; this.scene = scene; this.i = 0; this.loops = 0;
    this.playing = false; this.userPaused = false; this.visible = false;
    this.timer = null; this.tickTimer = null; this.tableKey = null; this.rows = {};

    root.textContent = '';
    root.classList.add('dp');
    var win = h('div', 'dp-window');
    var bar = h('div', 'dp-bar'); bar.setAttribute('aria-hidden', 'true');
    bar.appendChild(h('i')); bar.appendChild(h('i')); bar.appendChild(h('i'));
    this.titleEl = h('span', 'dp-title', scene.title + ' · Google Sheets');
    bar.appendChild(this.titleEl);
    this.toolbar = h('div', 'dp-toolbar');
    this.tabsEl = h('div', 'dp-tabs'); this.tabsEl.setAttribute('aria-hidden', 'true');
    this.stage = h('div', 'dp-stage');
    this.main = h('div', 'dp-main');
    this.side = h('div', 'dp-side'); this.side.hidden = true; this.side.setAttribute('aria-hidden', 'true');
    this.stage.appendChild(this.main); this.stage.appendChild(this.side);
    this.menuEl = h('div', 'dp-menu'); this.menuEl.hidden = true; this.menuEl.setAttribute('aria-hidden', 'true');
    win.appendChild(bar); win.appendChild(this.toolbar); win.appendChild(this.tabsEl); win.appendChild(this.stage); win.appendChild(this.menuEl);

    this.capWrap = h('div', 'dp-cap');
    this.stepLbl = h('span', 'dp-step');
    this.cap = h('p', 'dp-caption');
    this.capWrap.appendChild(this.stepLbl); this.capWrap.appendChild(this.cap);

    var ctl = h('div', 'dp-ctl');
    this.playBtn = h('button', 'btn btn-ghost btn-small', 'Pause demo'); this.playBtn.type = 'button';
    this.playBtn.addEventListener('click', function () { self.toggle(); });
    this.dots = h('div', 'dp-steps'); this.dotEls = [];
    scene.frames.forEach(function (f, n) {
      var d = h('button', 'dp-dot'); d.type = 'button';
      d.setAttribute('aria-label', 'Go to step ' + (n + 1) + ': ' + f.caption);
      d.appendChild(h('span'));
      d.addEventListener('click', function () { self.userPaused = true; self.pause(); self.show(n); self.syncBtn(); });
      self.dots.appendChild(d); self.dotEls.push(d);
    });
    this.meta = h('span', 'dp-meta', 'About ' + Math.round(total(scene) / 1000) + ' seconds');
    ctl.appendChild(this.playBtn); ctl.appendChild(this.dots); ctl.appendChild(this.meta);

    var det = h('details', 'dp-text');
    det.appendChild(h('summary', null, 'Text version of this demo'));
    var ol = h('ol'); scene.frames.forEach(function (f) { ol.appendChild(h('li', null, f.caption)); });
    det.appendChild(ol);

    root.appendChild(win); root.appendChild(this.capWrap); root.appendChild(ctl); root.appendChild(det);
    this.show(0);
    this.syncBtn();

    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          self.visible = e.isIntersecting && e.intersectionRatio >= 0.35;
          if (self.visible && !self.userPaused && !self.playing && self.loops < 2) self.play();
          if (!self.visible && self.playing) self.pause();
        });
      }, { threshold: [0, 0.35, 0.7] }).observe(root);
    }
  }

  Player.prototype.syncBtn = function () {
    var done = this.loops >= 2 && !this.playing;
    this.playBtn.textContent = this.playing ? 'Pause demo' : (done ? 'Replay demo' : 'Play demo');
    this.root.classList.toggle('is-paused', !this.playing);
  };
  Player.prototype.toggle = function () {
    if (this.playing) { this.userPaused = true; this.pause(); }
    else { this.userPaused = false; if (this.loops >= 2) { this.loops = 0; this.show(0); } this.play(); }
    this.syncBtn();
  };
  Player.prototype.play = function () {
    var self = this;
    if (this.playing) return;
    this.playing = true; this.syncBtn();
    this.schedule();
    clearInterval(this.tickTimer);
    this.tickTimer = setInterval(function () { self.tick(); }, 1000);
  };
  Player.prototype.pause = function () {
    this.playing = false; clearTimeout(this.timer); clearInterval(this.tickTimer); this.syncBtn();
  };
  Player.prototype.schedule = function () {
    var self = this, f = this.scene.frames[this.i];
    this.show(this.i);
    this.timer = setTimeout(function () {
      if (self.i < self.scene.frames.length - 1) { self.i++; }
      else { self.loops++; if (self.loops >= 2) { self.pause(); return; } self.i = 0; }
      self.schedule();
    }, f.ms);
  };
  Player.prototype.tick = function () {
    var f = this.scene.frames[this.i];
    if (!f.tick) return;
    var cells = this.main.querySelectorAll('td[data-tick]');
    for (var k = 0; k < cells.length; k++) cells[k].textContent = addSec(cells[k].textContent);
  };

  Player.prototype.show = function (n) {
    var f = this.scene.frames[n], self = this;
    this.i = n;
    this.stepLbl.textContent = 'Step ' + (n + 1) + ' of ' + this.scene.frames.length;
    this.cap.textContent = f.caption;
    for (var k = 0; k < this.dotEls.length; k++) {
      var d = this.dotEls[k];
      d.classList.toggle('done', k < n);
      d.classList.toggle('active', k === n);
      d.firstChild.style.animation = 'none';
      if (k === n) { void d.offsetWidth; d.firstChild.style.animation = ''; d.firstChild.style.animationDuration = f.ms + 'ms'; }
    }
    // toolbar: button chip / file chip
    this.toolbar.textContent = '';
    if (f.btn) { var b = h('span', 'dp-press', f.btn); this.toolbar.appendChild(b); }
    if (f.chip) { this.toolbar.appendChild(h('span', 'dp-file', f.chip)); }
    this.toolbar.hidden = !(f.btn || f.chip);
    // tabs
    var tabs = f.tabsOverride || f.tabs || this.scene.tabs;
    this.tabsEl.textContent = '';
    tabs.forEach(function (t) { this.tabsEl.appendChild(h('span', 'dp-tab' + (t === f.tab ? ' on' : ''), t)); }, this);
    this.tabsEl.hidden = !tabs.length;
    // menu
    if (f.menu) {
      this.menuEl.textContent = '';
      this.menuEl.appendChild(h('span', 'dp-menu-label', f.menu.label));
      var ul = h('ul');
      f.menu.items.forEach(function (it, idx) { ul.appendChild(h('li', idx === f.menu.active ? 'on' : '', it)); });
      this.menuEl.appendChild(ul); this.menuEl.hidden = false;
    } else this.menuEl.hidden = true;
    // sidebar
    if (f.side) {
      this.side.textContent = '';
      this.side.appendChild(h('b', null, f.side.title)); this.side.appendChild(h('span', null, f.side.text));
      this.side.hidden = false;
    } else this.side.hidden = true;
    // content
    if (f.table) this.renderTable(f); else this.renderOther(f);
    if (f.note) { var nt = this.main.querySelector('.dp-note') || h('p', 'dp-note'); nt.textContent = f.note; this.main.appendChild(nt); }
  };

  Player.prototype.renderTable = function (f) {
    var t = f.table, key = t.key || f.tab;
    if (this.tableKey !== key || !this.tableEl) {
      this.main.textContent = ''; this.rows = {}; this.tableKey = key;
      var wrap = h('div', 'dp-grid fadein'), tbl = h('table'), thead = h('thead'), tr = h('tr');
      t.cols.forEach(function (c) { tr.appendChild(h('th', null, c)); });
      thead.appendChild(tr); tbl.appendChild(thead); this.tbody = h('tbody'); tbl.appendChild(this.tbody);
      wrap.appendChild(tbl); this.main.appendChild(wrap); this.tableEl = tbl;
    }
    var keep = {}, tbody = this.tbody, self = this;
    t.rows.forEach(function (r, idx) {
      keep[r.id] = true;
      var tr = self.rows[r.id], fresh = false;
      if (!tr) { tr = h('tr'); self.rows[r.id] = tr; fresh = true; r.cells.forEach(function () { tr.appendChild(h('td')); }); tr.style.animationDelay = (idx * 90) + 'ms'; tr.className = 'rowin'; }
      tr.dataset.state = r.c || '';
      tr.classList.toggle('st-dup', r.c === 'dup'); tr.classList.toggle('st-cancel', r.c === 'cancel');
      tr.classList.toggle('st-flag', r.c === 'flag'); tr.classList.toggle('st-ok', r.c === 'ok');
      tr.classList.toggle('st-fix', r.c === 'fix'); tr.classList.toggle('st-dim', r.c === 'dim');
      r.cells.forEach(function (c, k) {
        var td = tr.children[k], txt = typeof c === 'string' ? c : c.t, cls = typeof c === 'string' ? '' : (c.c || '');
        if (td.textContent !== txt) { td.textContent = txt; if (!fresh && txt) { td.classList.remove('flash'); void td.offsetWidth; td.classList.add('flash'); } }
        td.className = (td.classList.contains('flash') ? 'flash ' : '') + cls;
        if (typeof c !== 'string' && c.tick) td.setAttribute('data-tick', '1'); else td.removeAttribute('data-tick');
      });
      tbody.appendChild(tr);
    });
    Object.keys(this.rows).forEach(function (id) { if (!keep[id]) { self.rows[id].remove(); delete self.rows[id]; } });
  };

  Player.prototype.renderOther = function (f) {
    this.main.textContent = ''; this.tableKey = null; this.tableEl = null; this.rows = {};
    var wrap = h('div', 'dp-board fadein');
    if (f.board) {
      var b = f.board;
      if (b.tiles) {
        var tl = h('div', 'dp-kpis');
        b.tiles.forEach(function (t) { var k = h('div', 'dp-kpi'); k.appendChild(h('span', null, t[0])); k.appendChild(h('b', null, t[1])); k.appendChild(h('em', null, t[2])); tl.appendChild(k); });
        wrap.appendChild(tl);
      }
      if (b.bars) {
        var ch = h('div', 'dp-chart'); ch.appendChild(h('span', 'dp-chart-title', b.bars.title));
        var row = h('div', 'dp-bars');
        b.bars.vals.forEach(function (v, k) {
          var col = h('div', 'dp-bar-col'), bar = h('i'); bar.style.height = '0%'; bar.style.transitionDelay = (k * 70) + 'ms';
          col.appendChild(bar); col.appendChild(h('span', null, b.bars.labels[k])); row.appendChild(col);
          setTimeout(function () { bar.style.height = v + '%'; }, 40);
        });
        ch.appendChild(row); wrap.appendChild(ch);
      }
      if (b.lists) {
        var lg = h('div', 'dp-lists');
        b.lists.forEach(function (L) {
          var box = h('div', 'dp-list'); box.appendChild(h('b', null, L.title));
          L.items.forEach(function (it) {
            var r = h('div', 'dp-li'); r.appendChild(h('span', null, it[0])); r.appendChild(h('em', null, it[1]));
            var tr = h('i'); var fill = h('u'); fill.style.width = '0%'; tr.appendChild(fill); r.appendChild(tr);
            setTimeout(function () { fill.style.width = it[2] + '%'; }, 60);
            box.appendChild(r);
          });
          lg.appendChild(box);
        });
        wrap.appendChild(lg);
      }
    }
    if (f.tiles) {
      var g = h('div', 'dp-tiles');
      this.scene.toolkit.forEach(function (t, k) {
        var el = h('div', 'dp-tile' + (f.tiles.on === k ? ' on' : '') + (f.tiles.all ? ' all' : ''));
        el.appendChild(h('b', null, t[0])); el.appendChild(h('span', null, t[1])); g.appendChild(el);
      });
      wrap.appendChild(g);
      if (f.tiles.foot) { var ft = h('ul', 'dp-foot'); f.tiles.foot.forEach(function (x) { ft.appendChild(h('li', null, x)); }); wrap.appendChild(ft); }
    }
    this.main.appendChild(wrap);
  };

  /* ---------- boot ---------- */
  window.SECH_SCENES = SCENES;
  window.SECH_DEMO_TOTALS = Object.keys(SCENES).reduce(function (o, k) { o[k] = total(SCENES[k]); return o; }, {});
  window.SECH_PLAYERS = [];
  function boot() {
    var roots = document.querySelectorAll('[data-scene]');
    for (var k = 0; k < roots.length; k++) {
      var s = SCENES[roots[k].getAttribute('data-scene')];
      if (s) window.SECH_PLAYERS.push(new Player(roots[k], s));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
