/* Sechurplets Studio: browser preview of the Order Cleaner workflow.
   Everything runs in your browser. Files you choose are never uploaded. */
(function () {
  'use strict';

  var SAMPLE_TSV = "Raw Order ID\tRaw Date/Time\tCustomer Full Name\tGross Amount\tShipping Address\tShipping Zip Code\tFulfillment Status\tFinancial Status\tLine Items / SKU\tTraffic Source\tSystem Notes (Leave Blank)\n#1001\t2026-09-22T08:15:30-05:00\tjohn smith\t$45.00\t123 main street boston ma\t2111\tfulfilled\tpaid\tSKU-PRO-X1\tFacebook Ads\t\n#1002\t09/21/2026 14:22\tSARAH CONNOR\tUSD 120.50\t456 ELM RD LOS ANGELES CA\t90001\tunfulfilled\tpaid\tSKU-LITE-A2\tGoogle Search\t\n#1003\t2026-09-21T18:45:12Z\tmicheal jordan\t$89.99\t23 bull street chicago il\t60601\tfulfilled\trefunded\tSKU-PRO-X1\tTikTok Shop\t\n#1004\t2026-09-22T03:10:00-04:00\tdavid beckham\t$210.00\t77 soccer lane miami fl\t33101\tcancelled\tvoided\tSKU-PREM-Z9\tInstagram Ads\t\n#1001\t2026-09-22T08:15:30-05:00\tjohn smith\t$45.00\t123 main street boston ma\t2111\tfulfilled\tpaid\tSKU-PRO-X1\tFacebook Ads\t\n#1005\t22-09-2026 09:00:15\tEMMA WATSON\t$35.25\t42 library way new york ny\t10001\tfulfilled\tpaid\tSKU-BKS-04\tDirect\t\n#1006\t2026-09-20T11:55:00Z\tbruce wayne\t$1500.00\t1007 mountain drive gotham nj\t7001\tunfulfilled\thigh_risk\tSKU-BAT-99\tUnknown\t\n#1007\t09/19/2026 16:40\tclark kent\t115\t321 daily planet rd metropolis il\t62960\tfulfilled\tpaid\tSKU-LITE-A2\tGoogle Search\t\n#1007\t09/19/2026 16:40\tclark kent\t115\t321 daily planet rd metropolis il\t62960\tfulfilled\tpaid\tSKU-LITE-A2\tGoogle Search\t\n#1008\t2026-09-22T10:12:44-05:00\ttony stark\t$500.00\t10880 malibu point malibu ca\t90265\tfulfilled\tpaid\tSKU-PREM-Z9\tEmail Newsletter\t\n#1009\t2026-09-22T11:05:00Z\tpeter parker\t$15.99\t20 Ingram St Brooklyn NY\t11211\tfulfilled\tpaid\tSKU-LITE-A2\tTikTok Shop\t\n#1010\t09/22/2026 16:30\tselena gomez\tUSD 79.00\t88 Hollywood Blvd Los Angeles CA\t90028\tunfulfilled\tpaid\tSKU-PRO-X1\tInstagram Ads\t\n#1011\t2026-09-22T12:14:18-04:00\tELON MUSK\t$888.88\t1 Rocket Road Hawthorne CA\t90250\tfulfilled\tpaid\tSKU-PREM-Z9\tTwitter/X Ref\t\n#1012\t22/09/2026 15:45\ttaylor swift\t$198.90\t13 Corn Street Nashville TN\t37201\tfulfilled\tpaid\tSKU-PRO-X1\tDirect\t\n#1013\t2026-09-21T23:59:59Z\tbilbo baggins\t$24.50\t1 Bagshot Row Hobbiton NZ\t3111\tfulfilled\tpaid\tSKU-BKS-04\tPinterest Ads\t\n#1014\t2026-09-22T01:15:00-08:00\tluke skywalker\t$350.00\t99 Desert Ridge Tatooine AZ\t85364\tcancelled\trefunded\tSKU-PREM-Z9\tGoogle Search\t\n#1015\t09/20/2026 9:12\tWANDA MAXIMOFF\t$95.00\t616 Hex Road Westview NJ\t7011\tfulfilled\tpaid\tSKU-PRO-X1\tFacebook Ads\t\n#1016\t2026-09-22T14:22:11Z\tharry potter\t$12.50\t4 Privet Drive Surrey UK\t4111\tfulfilled\tpaid\tSKU-BKS-04\tDirect\t\n#1012\t22/09/2026 15:45\ttaylor swift\t$198.90\t13 Corn Street Nashville TN\t37201\tfulfilled\tpaid\tSKU-PRO-X1\tDirect\t\n#1017\t2026-09-22T06:40:00-06:00\twalter white\t$420.00\t308 Negra Arroyo Lane Albuquerque NM\t87104\tfulfilled\tpaid\tSKU-PREM-Z9\tUnknown\t\n#1018\t21-09-2026 13:10:45\tLARA CROFT\tUSD 250.00\t15 Croft Manor Surrey UK\t3115\tunfulfilled\tpaid\tSKU-PRO-X1\tGoogle Search\t\n#1019\t2026-09-22T09:11:00Z\tbarry allen\t$65.00\t456 Central City Ave Central City MO\t64101\tfulfilled\tpaid\tSKU-LITE-A2\tFacebook Ads\t\n#1020\t09/21/2026 21:30\tbrian oconner\t$135.00\t1327 Market St San Francisco CA\t94103\tfulfilled\tpaid\tSKU-PREM-Z9\tYouTube Ads\t\n#1021\t2026-09-22T02:55:00-04:00\tDIANA PRINCE\t$180.00\t777 Gateway Blvd Washington DC\t20001\tfulfilled\tpaid\tSKU-PRO-X1\tInstagram Ads\t\n#1022\t2026-09-22T07:18:22Z\tarthur dent\t$42.42\t15 Cottington Lane London UK\t5118\tcancelled\tvoided\tSKU-BKS-04\tDirect\t\n#1023\t22/09/2026 11:22\tSTEVE ROGERS\t$50.00\t569 Brooklyn Heights Brooklyn NY\t11201\tfulfilled\tpaid\tSKU-LITE-A2\tFacebook Ads\t\n#1024\t2026-09-21T14:35:00-07:00\tbruce banner\t$299.00\t88 Gamma Lab Rd Albuquerque NM\t87102\tunfulfilled\thigh_risk\tSKU-PREM-Z9\tGoogle Search\t\n#1025\t09/22/2026 8:05\tnatasha romanoff\t$140.00\t22 Red Room Way Arlington VA\t22201\tfulfilled\tpaid\tSKU-PRO-X1\tTikTok Shop\t\n#1020\t09/21/2026 21:30\tbrian oconner\t$135.00\t1327 Market St San Francisco CA\t94103\tfulfilled\tpaid\tSKU-PREM-Z9\tYouTube Ads\t\n#1026\t2026-09-22T13:45:00Z\ttony montana\t$3000.00\t444 Ocean Drive Miami FL\t33139\tfulfilled\tpaid\tSKU-PREM-Z9\tDirect\t\n#1027\t2026-09-22T05:12:00-05:00\tjack sparrow\t$85.50\t77 Black Pearl Pier Port Royal FL\t33901\tfulfilled\trefunded\tSKU-LITE-A2\tPinterest Ads\t\n#1028\t22-09-2026 16:15:30\tKatniss Everdeen\t$45.00\t12 District Way District 12 KY\t40001\tfulfilled\tpaid\tSKU-BKS-04\tFacebook Ads\t\n#1029\t2026-09-21T20:22:00Z\tsherlock holmes\t$110.00\t221B Baker Street London UK\t6112\tfulfilled\tpaid\tSKU-PRO-X1\tGoogle Search\t\n#1030\t09/22/2026 10:45\toptimus prime\t$550.00\t1 Cybertron Highway Detroit MI\t48201\tunfulfilled\tpaid\tSKU-PREM-Z9\tYouTube Ads\t\n#1031\t2026-09-22T11:30:12-04:00\tELLEN RIPLEY\tUSD 160.00\t55 Nostromo Way Houston TX\t77001\tfulfilled\tpaid\tSKU-PRO-X1\tEmail Newsletter\t\n#1032\t21/09/2026 17:50\tmarty mcfly\t$88.00\t99 Hill Valley Plaza California CA\t90210\tfulfilled\tpaid\tSKU-LITE-A2\tDirect\t\n#1033\t2026-09-22T04:18:00Z\tindiana jones\t$175.00\t45 Archeology Rd Austin TX\t78701\tcancelled\tvoided\tSKU-BKS-04\tGoogle Search\t\n#1034\t2026-09-22T08:50:00-07:00\tjames bond\t$700.00\t007 MI6 Headquarters London UK\t1107\tfulfilled\tpaid\tSKU-PREM-Z9\tDirect\t\n#1035\t09/22/2026 12:00\tlisa simpson\t$20.00\t742 Evergreen Terrace Springfield IL\t62701\tfulfilled\tpaid\tSKU-BKS-04\tInstagram Ads\t\n#1036\t2026-09-22T15:10:00Z\thomer simpson\t$120.00\t742 Evergreen Terrace Springfield IL\t62701\tfulfilled\tpaid\tSKU-LITE-A2\tInstagram Ads\t\n#1037\t22-09-2026 14:05:44\tMARrio brothers\t$64.00\t1 Mushroom Kingdom Way Brooklyn NY\t11202\tunfulfilled\tpaid\tSKU-PRO-X1\tTikTok Shop\t\n#1038\t2026-09-21T19:11:00-05:00\tlara jean\t$38.50\t555 Cove Cove Cove VA\t22001\tfulfilled\tpaid\tSKU-BKS-04\tPinterest Ads\t\n#1039\t09/21/2026 23:40\tNEO ANDERSON\tUSD 101.00\t101 Matrix Lane Chicago IL\t60602\tfulfilled\tpaid\tSKU-PREM-Z9\tDirect\t\n#1040\t2026-09-22T02:15:00-08:00\tjohn wick\t$999.00\t22 Continental Hotel New York NY\t10005\tunfulfilled\thigh_risk\tSKU-PREM-Z9\tUnknown\t\n#1036\t2026-09-22T15:10:00Z\thomer simpson\t$120.00\t742 Evergreen Terrace Springfield IL\t62701\tfulfilled\tpaid\tSKU-LITE-A2\tInstagram Ads\t\n#1041\t2026-09-22T16:32:00Z\tdaenerys targaryen\t$300.00\t3 Dragonstone Keep Boston MA\t2115\tfulfilled\tpaid\tSKU-PREM-Z9\tFacebook Ads\t\n#1042\t22/09/2026 08:44\tjon snow\t$45.00\t1 Winterfell Wall Seattle WA\t98101\tfulfilled\tpaid\tSKU-LITE-A2\tGoogle Search\t\n#1043\t2026-09-22T07:55:00-04:00\t\"tyrion lannister\t\"\t$150.00\t55 Kings Landing Road New York NY\t10003\tfulfilled\trefunded\tSKU-PRO-X1\tEmail Newsletter\t\n#1044\t09/20/2026 14:15\tSpongeBob SquarePants\t$14.99\t124 Conch Street Bikini Bottom HI\t96801\tfulfilled\tpaid\tSKU-LITE-A2\tDirect\t\n#1045\t2026-09-22T12:00:00Z\tpatrick star\t$10.00\t120 Rock Road Bikini Bottom HI\t96801\tfulfilled\tpaid\tSKU-LITE-A2\tDirect\t\n#1046\t22-09-2026 11:11:11\tsquidward tentacles\t$55.00\t122 Conch Street Bikini Bottom HI\t96801\tcancelled\tvoided\tSKU-PRO-X1\tFacebook Ads\t\n#1047\t2026-09-22T09:05:00-05:00\ttony soprano\t$2500.00\t14 Aspen Drive North Caldwell NJ\t7006\tfulfilled\tpaid\tSKU-PREM-Z9\tUnknown\t\n#1048\t09/21/2026 8:30\twalter white jr\t$50.00\t308 Negra Arroyo Lane Albuquerque NM\t87104\tfulfilled\tpaid\tSKU-LITE-A2\tDirect\t\n#1049\t2026-09-22T13:12:00Z\tjesse pinkman\t$180.00\t9828 Maderia Drive NE Albuquerque NM\t87109\tunfulfilled\tpaid\tSKU-PRO-X1\tYouTube Ads\t\n#1050\t22/09/2026 17:22\tsaul goodman\t$800.00\t9800 Montgomery Blvd NE Albuquerque NM\t87111\tfulfilled\tpaid\tSKU-PREM-Z9\tGoogle Search\t\n#1051\t2026-09-22T01:40:00-07:00\tragnar lothbrok\t$135.00\t1 Viking Pier Kattegat MN\t55101\tfulfilled\tpaid\tSKU-PRO-X1\tTikTok Shop\t\n#1052\t09/22/2026 10:00\tharley quinn\t$99.00\t55 Arkham Asylum Rd Gotham NJ\t7002\tfulfilled\tpaid\tSKU-PRO-X1\tInstagram Ads\t\n#1053\t2026-09-22T14:45:00Z\tclark kent\t$0.00\t1 Smallville Farm Kansas KS\t66001\tfulfilled\tpaid\tSKU-LITE-A2\tGoogle Search\t\n#1054\t22-09-2026 07:30:00\tLOIS LANE\tUSD 85.00\t55 Metropolis Plaza New York NY\t10001\tfulfilled\tpaid\tSKU-PRO-X1\tFacebook Ads\t\n#1055\t2026-09-21T16:15:00-04:00\tbarry allen\t$45.00\t456 Central City Ave Central City MO\t64101\tfulfilled\tpaid\tSKU-LITE-A2\tFacebook Ads\t\n#1056\t09/22/2026 11:15\thal jordan\t$120.00\t88 Coast City Highway Los Angeles CA\t90005\tunfulfilled\tpaid\tSKU-PRO-X1\tGoogle Search\t\n#1057\t2026-09-22T15:30:22Z\tbruce wayne\t$5000.00\t1007 mountain drive gotham nj\t7001\tfulfilled\tpaid\tSKU-PREM-Z9\tDirect\t\n#1058\t22/09/2026 12:45\tarthur curry\t$65.00\t7 Atlantis Reef Way Miami FL\t33109\tfulfilled\tpaid\tSKU-LITE-A2\tPinterest Ads\t\n#1059\t2026-09-22T03:50:00-05:00\tdiana prince\t$250.00\t777 Gateway Blvd Washington DC\t20001\tfulfilled\tpaid\tSKU-PREM-Z9\tInstagram Ads\t\n#1060\t09/21/2026 19:40\tvictor stone\t$199.00\t99 Cybernetics Rd Detroit MI\t48203\tfulfilled\tpaid\tSKU-PRO-X1\tYouTube Ads\t\n#1057\t2026-09-22T15:30:22Z\tbruce wayne\t$5000.00\t1007 mountain drive gotham nj\t7001\tfulfilled\tpaid\tSKU-PREM-Z9\tDirect\t\n#1061\t2026-09-22T10:15:00Z\tWADE WILSON\t$49.99\t99 Mercenary Alley New York NY\t10011\tunfulfilled\thigh_risk\tSKU-LITE-A2\tUnknown\t\n#1062\t22-09-2026 13:22:15\tlogan howlett\t$150.00\t100 Weapon X Road Mansion NY\t10501\tfulfilled\tpaid\tSKU-PRO-X1\tGoogle Search\t\n#1063\t2026-09-21T21:45:00-04:00\tcharles xavier\t$1200.00\t140 Westchester Ave New York NY\t10580\tfulfilled\tpaid\tSKU-PREM-Z9\tDirect\t\n#1064\t09/22/2026 9:00\tscott summers\t$85.00\t140 Westchester Ave New York NY\t10580\tfulfilled\tpaid\tSKU-LITE-A2\tFacebook Ads\t\n#1065\t2026-09-22T11:12:00Z\tjean grey\t$210.00\t140 Westchester Ave New York NY\t10580\tfulfilled\tpaid\tSKU-PRO-X1\tFacebook Ads\t\n#1066\t22/09/2026 14:55\tororo munroe\t$95.00\t140 Westchester Ave New York NY\t10580\tunfulfilled\tpaid\tSKU-LITE-A2\tInstagram Ads\t\n#1067\t2026-09-22T05:40:00-07:00\tpeter parker\t$35.00\t20 Ingram St Brooklyn NY\t11211\tfulfilled\tpaid\tSKU-LITE-A2\tTikTok Shop\t\n#1068\t09/21/2026 22:15\tmiles morales\t$75.00\t44 Brooklyn St Brooklyn NY\t\"11204\t\"\tfulfilled\tpaid\tSKU-PRO-X1\tInstagram Ads\t\n#1069\t2026-09-22T12:30:00Z\tgwen stacy\t$80.00\t55 Spider Lane New York NY\t\"10014\t\"\tfulfilled\t\"paid\t\"\tSKU-PRO-X1\tTikTok Shop\t\n#1070\t22-09-2026 16:40:11\ttony stark\t$4500.00\t10880 malibu point malibu ca\t90265\tfulfilled\tpaid\tSKU-PREM-Z9\tEmail Newsletter\t\n#1071\t2026-09-22T08:12:00-05:00\tpepper potts\t$150.00\t10880 malibu point malibu ca\t90265\tfulfilled\tpaid\tSKU-PRO-X1\tDirect\t\n#1072\t09/22/2026 14:45\thappy hogan\t$60.00\t10880 malibu point malibu ca\t90265\tfulfilled\tpaid\tSKU-LITE-A2\tDirect\t\n#1073\t2026-09-22T14:18:00Z\tsteve rogers\t$45.00\t569 Brooklyn Heights Brooklyn NY\t11201\tfulfilled\tpaid\tSKU-LITE-A2\tFacebook Ads\t\n#1074\t22/09/2026 10:30\tbucky barnes\t$95.00\t12 Soldier Way Arlington VA\t22202\tcancelled\tvoided\tSKU-PRO-X1\tGoogle Search\t\n#1075\t2026-09-21T15:55:00-04:00\tsam wilson\t$110.00\t45 Falcon Rd Atlanta GA\t30301\tfulfilled\tpaid\tSKU-PRO-X1\tYouTube Ads\t\n#1076\t09/22/2026 7:15\tthor odinson\t$850.00\t1 Asgard Palace Road Boston MA\t2112\tfulfilled\tpaid\tSKU-PREM-Z9\tDirect\t\n#1077\t2026-09-22T13:00:22Z\tloki odinson\t$140.00\t2 Asgard Palace Road Boston MA\t2112\tunfulfilled\thigh_risk\tSKU-PRO-X1\tUnknown\t\n#1078\t22-09-2026 09:22:15\tbruce banner\t$55.00\t88 Gamma Lab Rd Albuquerque NM\t87102\tfulfilled\tpaid\tSKU-LITE-A2\tGoogle Search\t\n#1079\t2026-09-21T18:40:00-07:00\tnatasha romanoff\t$125.00\t22 Red Room Way Arlington VA\t22201\tfulfilled\tpaid\tSKU-PRO-X1\tTikTok Shop\t\n#1080\t09/22/2026 12:45\tclint barton\t$90.00\t44 Archer Farm Road Iowa IA\t52201\tfulfilled\tpaid\tSKU-LITE-A2\tPinterest Ads\t\n#1081\t2026-09-22T15:22:00Z\tnick fury\t$500.00\t1 SHIELD HQ Washington DC\t20005\tfulfilled\tpaid\tSKU-PREM-Z9\tDirect\t\n#1082\t22/09/2026 11:44\tmaria hill\t$115.00\t2 SHIELD HQ Washington DC\t20005\tfulfilled\tpaid\tSKU-PRO-X1\tDirect\t\n#1083\t2026-09-22T04:12:00-05:00\tphil coulson\t$45.00\t3 SHIELD HQ Washington DC\t20005\tfulfilled\tpaid\tSKU-LITE-A2\tGoogle Search\t\n#1084\t09/21/2026 20:30\tTCHALLA KING\tUSD 9999.00\t1 Wakanda Palace Ave New York NY\t10001\tfulfilled\tpaid\tSKU-PREM-Z9\tDirect\t\n#1085\t2026-09-22T06:55:00-08:00\tshuri lynn\t$350.00\t2 Wakanda Palace Ave New York NY\t10001\tfulfilled\tpaid\tSKU-PREM-Z9\tYouTube Ads\t\n#1086\t09/22/2026 10:15\tcarol danvers\t$450.00\t88 Starforce Way Los Angeles CA\t90002\tfulfilled\tpaid\tSKU-PREM-Z9\tGoogle Search\t\n#1087\t2026-09-22T14:30:22Z\twanda maximoff\t$120.00\t616 Hex Road Westview NJ\t7011\tfulfilled\tpaid\tSKU-PRO-X1\tFacebook Ads\t\n#1088\t22-09-2026 12:15:44\tvision android\t$200.00\t616 Hex Road Westview NJ\t7011\tfulfilled\tpaid\tSKU-PREM-Z9\tFacebook Ads\t\n#1089\t2026-09-21T17:11:00-04:00\tscott lang\t$35.00\t12 Pym Labs Way San Francisco CA\t94102\tfulfilled\trefunded\tSKU-LITE-A2\tInstagram Ads\t\n#1090\t09/22/2026 8:45\thope van dyne\t$160.00\t14 Pym Labs Way San Francisco CA\t94102\tfulfilled\tpaid\tSKU-PRO-X1\tInstagram Ads\t\n#1087\t2026-09-22T14:30:22Z\twanda maximoff\t$120.00\t616 Hex Road Westview NJ\t7011\tfulfilled\tpaid\tSKU-PRO-X1\tFacebook Ads\t\n#1091\t2026-09-22T11:05:00Z\tstephen strange\t$600.00\t177A Bleecker St New York NY\t10012\tfulfilled\tpaid\tSKU-PREM-Z9\tGoogle Search\t\n#1092\t22/09/2026 16:22\twong master\t$75.00\t177A Bleecker St New York NY\t10012\tunfulfilled \tpaid\tSKU-LITE-A2\tGoogle Search";

  // ---- Settings (the real template keeps these in its CONFIG tab) ----
  var CANCELLED_WORDS = ['cancelled', 'canceled'];
  var REFUND_WORDS = ['refunded', 'partially_refunded', 'partially refunded'];

  var COLS = [
    { key: 'orderId', re: /order\s*(id|#|no|number)/i, required: true },
    { key: 'date', re: /date|time/i },
    { key: 'name', re: /name/i },
    { key: 'amount', re: /amount|total|price/i },
    { key: 'address', re: /address/i },
    { key: 'zip', re: /zip|postal/i },
    { key: 'fulfillment', re: /fulfil/i },
    { key: 'financial', re: /financial|payment/i },
    { key: 'sku', re: /sku|item/i },
    { key: 'email', re: /e-?mail/i }
  ];

  var MASTER_HEADERS = ['Order ID', 'Date', 'Time', 'First Name', 'Last Name', 'Amount', 'Address', 'Zip', 'Fulfillment Status', 'SKU'];
  var ARCHIVE_HEADERS = ['Order ID', 'Customer', 'Date', 'Amount', 'Note'];
  var RISK_HEADERS = ['Order ID', 'Customer', 'Amount', 'Status', 'Reason'];

  var state = { rows: null, label: '', master: [], archive: [], risk: [], ran: false, tab: 'master', readCount: 0, removedCancelled: 0 };

  function $(id) { return document.getElementById(id); }

  // ---- Parsing ----
  function parseLine(line, delim) {
    var cells = [], cur = '', inQ = false, i, ch;
    for (i = 0; i < line.length; i++) {
      ch = line.charAt(i);
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === delim && !inQ) { cells.push(cur); cur = ''; continue; }
      cur += ch;
    }
    cells.push(cur);
    return cells.map(function (c) { return c.replace(/\s+/g, ' ').trim(); });
  }

  function parseText(text) {
    var lines = text.split('\n').map(function (l) { return l.replace(/\r$/, ''); }).filter(function (l) { return l.trim().length; });
    if (!lines.length) return [];
    var delim = lines[0].split('\t').length >= lines[0].split(',').length ? '\t' : ',';
    return lines.map(function (l) { return parseLine(l, delim); });
  }

  function properCase(str) {
    return String(str || '').toLowerCase().replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  // Date and time are shown as written in the file (no time-zone conversion).
  function parseDateTime(raw) {
    raw = (raw || '').trim();
    if (!raw) return null;
    var m = raw.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (m) return { y: +m[1], mo: +m[2], d: +m[3], h: +m[4], mi: +m[5] };
    var parts = raw.split(' ');
    var dp = parts[0], tp = parts[1] || '00:00';
    var sep = dp.indexOf('/') > -1 ? '/' : '-';
    var n = dp.split(sep).map(Number);
    if (n.length < 3 || n.some(isNaN)) return null;
    var y, mo, d;
    if (n[0] > 999) { y = n[0]; mo = n[1]; d = n[2]; }
    else {
      y = n[2];
      if (n[0] > 12) { d = n[0]; mo = n[1]; }
      else if (n[1] > 12) { mo = n[0]; d = n[1]; }
      else if (sep === '/') { mo = n[0]; d = n[1]; }
      else { d = n[0]; mo = n[1]; }
    }
    var t = tp.split(':').map(Number);
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    return { y: y, mo: mo, d: d, h: t[0] || 0, mi: t[1] || 0 };
  }

  function mapColumns(header) {
    var map = {}, used = {};
    COLS.forEach(function (c) {
      for (var i = 0; i < header.length; i++) {
        if (used[i]) continue;
        if (c.re.test(header[i])) { map[c.key] = i; used[i] = true; break; }
      }
    });
    return map;
  }

  function get(row, map, key) {
    return map[key] === undefined ? '' : (row[map[key]] || '');
  }

  function money(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fixAddress(a) {
    var s = properCase(a);
    return s.replace(/\s([A-Za-z]{2})$/, function (_, st) { return ' ' + st.toUpperCase(); });
  }

  function lc(s) { return String(s || '').toLowerCase(); }

  // ---- The clean ----
  function runClean() {
    if (!state.rows || state.rows.length < 2) { showStatus('No data loaded. Choose a file or use the sample data.', false); return; }
    var map = mapColumns(state.rows[0]);
    if (map.orderId === undefined) {
      showStatus('Could not find an Order ID column. The real template lets you match your column names once in CONFIG.', false);
      return;
    }
    var rows = state.rows.slice(1).filter(function (r) { return (r[map.orderId] || '').trim() !== ''; });
    var seen = {}, master = [], archive = [], risk = [], removedCancelled = 0;

    rows.forEach(function (r) {
      var id = r[map.orderId].trim();
      var dt = parseDateTime(get(r, map, 'date'));
      var dateStr = dt ? pad2(dt.mo) + '/' + pad2(dt.d) + '/' + dt.y : '';
      var timeStr = dt ? pad2(dt.h) + ':' + pad2(dt.mi) : '';
      var full = get(r, map, 'name').trim();
      var parts = full ? full.split(' ') : [];
      var first = parts.length ? properCase(parts[0]) : '';
      var last = parts.length > 1 ? properCase(parts.slice(1).join(' ')) : '';
      var customer = (first + ' ' + last).trim();
      var amtRaw = get(r, map, 'amount');
      var amt = parseFloat(String(amtRaw).replace(/[^0-9.\-]/g, ''));
      var hasAmt = !isNaN(amt);
      var zip = get(r, map, 'zip').trim();
      if (/^\d{4}$/.test(zip)) zip = '0' + zip;
      var address = fixAddress(get(r, map, 'address'));
      var fulf = properCase(get(r, map, 'fulfillment') || '');
      var fin = lc(get(r, map, 'financial'));
      var sku = get(r, map, 'sku').trim();
      var email = get(r, map, 'email').trim();

      // 1. Duplicate Order IDs: the first copy is kept, repeats go to the archive.
      if (seen[id]) {
        archive.push([id, customer, dateStr, hasAmt ? money(amt) : '', 'Duplicate Order ID (first copy kept)']);
        return;
      }
      seen[id] = true;

      var line = [id, dateStr, timeStr, first, last, hasAmt ? amt : '', address, zip, fulf, sku];

      // 2. Cancelled orders leave the fulfillment list and are listed for review.
      if (CANCELLED_WORDS.indexOf(lc(fulf)) > -1) {
        removedCancelled++;
        risk.push([id, customer, hasAmt ? money(amt) : '', fulf, 'Cancelled: removed from the fulfillment list']);
        return;
      }

      // 3. Everything else stays in the master list; refund-related and unusual records are flagged.
      var reasons = [];
      if (REFUND_WORDS.indexOf(fin) > -1) reasons.push('Refund-related (financial status: ' + fin + ')');
      if (!full) reasons.push('Missing customer name');
      if (!address) reasons.push('Missing address');
      if (!hasAmt || amt === 0) reasons.push('Zero or missing total');
      if (map.email !== undefined && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) reasons.push('Invalid email');
      if (reasons.length) risk.push([id, customer, hasAmt ? money(amt) : '', fulf || fin, reasons.join('; ')]);

      master.push(line);
    });

    state.master = master; state.archive = archive; state.risk = risk;
    state.ran = true; state.readCount = rows.length; state.removedCancelled = removedCancelled;
    var accounted = master.length + archive.length + removedCancelled;
    showStatus('Read ' + rows.length + ' rows. ' + master.length + ' in CLEANED_MASTER, ' + archive.length +
      ' duplicates archived, ' + removedCancelled + ' cancelled removed, ' + risk.length +
      ' listed in REFUNDS_&_RISK_LOG. Check: ' + rows.length + ' read = ' + accounted + ' accounted for. Nothing deleted.', true);
    render();
  }

  // ---- Export (fulfillment CSV) ----
  function csvCell(v) {
    var s = String(v === undefined || v === null ? '' : v);
    // Guard against spreadsheet formula injection from uploaded files.
    if (/^[=+\-@\t\r]/.test(s) && isNaN(Number(s))) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function exportCsv() {
    if (!state.ran || !state.master.length) { showStatus('Nothing to export yet. Click "Run full clean" first.', false); return; }
    var rows = [MASTER_HEADERS].concat(state.master.map(function (r) {
      return r.map(function (c, i) { return i === 5 && c !== '' ? c.toFixed(2) : c; });
    }));
    var csv = rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'fulfillment_ready_export.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showStatus('Fulfillment CSV downloaded. Upload it to your system directly; re-saving in Excel can hide leading zeros in zip codes.', true);
  }

  function clearAll() {
    state.rows = null; state.label = ''; state.master = []; state.archive = []; state.risk = []; state.ran = false;
    $('file-input').value = '';
    $('file-status').textContent = 'No file loaded yet.';
    showStatus('Cleared. Choose a file or use the sample data to start again.', true);
    render();
  }

  // ---- UI ----
  function showStatus(msg, ok) {
    var box = $('status-box');
    box.className = 'status-box ' + (ok ? 'success' : 'loading');
    box.textContent = msg;
  }

  function el(tag, text, cls) {
    var e = document.createElement(tag);
    if (text !== undefined) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  }

  function renderTable(headers, rows, fmt) {
    var scroll = $('table-scroll');
    scroll.textContent = '';
    if (!rows.length) {
      scroll.appendChild(el('p', state.ran ? 'No rows in this tab.' : 'Click "Run full clean" to fill the result tabs.', 'empty-note'));
      return;
    }
    var table = el('table', undefined, 'clean-table');
    var thead = el('thead'), trh = el('tr');
    headers.forEach(function (h) { var th = el('th', h); th.scope = 'col'; trh.appendChild(th); });
    thead.appendChild(trh); table.appendChild(thead);
    var tbody = el('tbody');
    rows.forEach(function (r) {
      var tr = el('tr');
      r.forEach(function (c, i) { tr.appendChild(el('td', fmt ? fmt(c, i) : (c === '' ? '—' : c))); });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody); scroll.appendChild(table);
  }

  function render() {
    $('count-master').textContent = state.ran ? '(' + state.master.length + ')' : '';
    $('count-archive').textContent = state.ran ? '(' + state.archive.length + ')' : '';
    $('count-risk').textContent = state.ran ? '(' + state.risk.length + ')' : '';
    var tabs = document.querySelectorAll('.data-tab');
    Array.prototype.forEach.call(tabs, function (t) {
      var on = t.getAttribute('data-tab') === state.tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    $('table-scroll').setAttribute('aria-labelledby', 'tab-' + state.tab);
    if (state.tab === 'master') renderTable(MASTER_HEADERS, state.master, function (c, i) { return i === 5 && c !== '' ? money(c) : (c === '' ? '—' : c); });
    else if (state.tab === 'archive') renderTable(ARCHIVE_HEADERS, state.archive);
    else renderTable(RISK_HEADERS, state.risk);
  }

  function setRows(rows, label) {
    state.rows = rows; state.label = label; state.ran = false;
    state.master = []; state.archive = []; state.risk = [];
    $('file-status').textContent = label + ': ' + Math.max(rows.length - 1, 0) + ' rows detected.';
    showStatus('Loaded ' + label + '. Click "Run full clean".', true);
    render();
  }

  var xlsxPromise = null;
  function loadXlsx() {
    if (window.XLSX) return Promise.resolve();
    if (xlsxPromise) return xlsxPromise;
    xlsxPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.onload = resolve;
      s.onerror = function () { xlsxPromise = null; reject(new Error('Could not load the Excel reader. Try a CSV file instead.')); };
      document.head.appendChild(s);
    });
    return xlsxPromise;
  }

  function handleFile(file) {
    var name = file.name.toLowerCase();
    $('file-status').textContent = 'Reading ' + file.name + '...';
    var reader = new FileReader();
    if (/\.xlsx?$/.test(name)) {
      reader.onload = function (e) {
        loadXlsx().then(function () {
          var wb = window.XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
          var ws = wb.Sheets[wb.SheetNames[0]];
          var rows = window.XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' })
            .map(function (r) { return r.map(function (c) { return String(c === null || c === undefined ? '' : c).trim(); }); })
            .filter(function (r) { return r.some(function (c) { return c !== ''; }); });
          setRows(rows, file.name);
        }).catch(function (err) { $('file-status').textContent = 'Could not read that file: ' + err.message; });
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = function (e) { setRows(parseText(String(e.target.result)), file.name); };
      reader.readAsText(file);
    }
  }

  function init() {
    if (!$('table-scroll')) return;
    $('btn-run').addEventListener('click', runClean);
    $('btn-export').addEventListener('click', exportCsv);
    $('btn-clear').addEventListener('click', clearAll);
    $('btn-sample').addEventListener('click', function () { setRows(parseText(SAMPLE_TSV), 'sample_orders.tsv'); });
    $('file-input').addEventListener('change', function (e) { if (e.target.files[0]) handleFile(e.target.files[0]); });

    var box = $('upload-box');
    ['dragover', 'dragenter'].forEach(function (ev) { box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.add('dragover'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.remove('dragover'); }); });
    box.addEventListener('drop', function (e) { if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });

    var tabs = Array.prototype.slice.call(document.querySelectorAll('.data-tab'));
    tabs.forEach(function (t, idx) {
      t.addEventListener('click', function () { state.tab = t.getAttribute('data-tab'); render(); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(idx + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') n = tabs[(idx + tabs.length - 1) % tabs.length];
        if (n) { e.preventDefault(); n.focus(); state.tab = n.getAttribute('data-tab'); render(); }
      });
    });

    setRows(parseText(SAMPLE_TSV), 'sample_orders.tsv (pre-loaded)');
    state.tab = 'master';
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  // Exposed for testing only.
  window.__cleaner = { parseText: parseText, state: state, runClean: runClean, setRows: setRows };
})();
