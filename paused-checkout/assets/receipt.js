(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var money = function (c) { return '$' + (c / 100).toFixed(2); };
  var q = new URLSearchParams(location.search);
  var order = q.get('o'), key = q.get('k'), token = q.get('token');
  var box = $('receipt-status');

  function say(title, text) { $('receipt-title').textContent = title; box.textContent = text || ''; }
  function api(path, opts) {
    return fetch(path, opts).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Something went wrong.'); return j; }); });
  }

  function render(r) {
    if (r.status === 'REVIEW') {
      say('We are checking your payment', 'Your payment needs a quick manual check before we can send your files. Email sechurplets.studio@outlook.com with order number ' + r.order_id + ' and we will sort it out.');
      return;
    }
    if (r.status === 'FAILED') { say('Payment not completed', 'This order was not paid. You have not been charged.'); return; }
    if (r.status !== 'PAID') { say('Payment not completed', 'We have not received a payment for this order yet.'); return; }
    say('Thank you. Your order is paid.', 'Order #' + r.order_id + ' for ' + r.email + '. Save this page: your links stay available here.');
    var ul = $('receipt-items'); ul.textContent = '';
    r.items.forEach(function (i) {
      var li = document.createElement('li');
      var n = document.createElement('span'); n.textContent = i.name;
      var p = document.createElement('b'); p.textContent = money(i.price_cents);
      li.appendChild(n); li.appendChild(p); ul.appendChild(li);
    });
    $('receipt-total').textContent = money(r.total_cents);
    var dl = $('downloads'); dl.textContent = '';
    (r.downloads || []).forEach(function (d) {
      var li = document.createElement('li');
      var name = document.createElement('span'); name.textContent = d.name;
      li.appendChild(name);
      if (d.url && d.url.indexOf('https://docs.google.com/') === 0) {
        var a = document.createElement('a');
        a.href = d.url; a.className = 'btn btn-primary btn-small'; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.textContent = 'Make your copy'; a.setAttribute('aria-label', 'Make your copy of ' + d.name + ' (opens in a new tab)');
        li.appendChild(a);
      } else {
        var m = document.createElement('em'); m.textContent = 'Link not available yet. Email us with your order number.';
        li.appendChild(m);
      }
      dl.appendChild(li);
    });
    $('receipt-body').hidden = false;
  }

  if (!order || !key) { say('Receipt not found', 'This link is incomplete. Use the link from your payment, or email us with your order number.'); return; }

  var load = function () { return api('/api/receipt?o=' + encodeURIComponent(order) + '&k=' + encodeURIComponent(key)); };
  var run = token
    ? api('/api/capture', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: order, key: key, token: token }) })
        .then(load)
    : load();
  run.then(function (r) {
    if (token && window.history && history.replaceState) { q.delete('token'); q.delete('PayerID'); history.replaceState(null, '', location.pathname + '?' + q.toString()); }
    render(r);
  }).catch(function (e) { say('We could not confirm your payment', e.message + ' If you were charged, email sechurplets.studio@outlook.com with your order number.'); });
})();
