(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var money = function (c) { return '$' + (c / 100).toFixed(2); };
  var slugs = (new URLSearchParams(location.search).get('p') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  var form = $('checkout-form'), err = $('checkout-error'), list = $('order-lines'), btn = $('pay-btn');
  var chosen = [];

  function showError(msg) { err.textContent = msg; err.hidden = !msg; }

  fetch('/api/products', { headers: { Accept: 'application/json' } })
    .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Could not load the product details.'); return j; }); })
    .then(function (data) {
      var bySlug = {};
      data.products.forEach(function (p) { bySlug[p.slug] = p; });
      chosen = slugs.map(function (s) { return bySlug[s]; }).filter(Boolean);
      list.textContent = '';
      if (!chosen.length) {
        $('summary-empty').hidden = false; form.hidden = true; return;
      }
      var total = 0, blocked = [];
      chosen.forEach(function (p) {
        total += p.price_cents;
        if (!p.available) blocked.push(p.name);
        var li = document.createElement('li');
        var n = document.createElement('span'); n.textContent = p.name;
        var pr = document.createElement('b'); pr.textContent = money(p.price_cents);
        li.appendChild(n); li.appendChild(pr); list.appendChild(li);
      });
      $('order-total').textContent = money(total);
      $('summary').hidden = false;
      if (blocked.length) {
        showError('Not available for online purchase yet: ' + blocked.join(', ') + '. Please email us to order.');
        btn.disabled = true;
      }
      if (new URLSearchParams(location.search).get('cancelled')) {
        showError('Payment was cancelled. You have not been charged.');
      }
    })
    .catch(function (e) { showError((e && e.message && e.message !== 'Failed to fetch' && !/JSON|Unexpected/.test(e.message)) ? e.message : 'Could not load the product details. Please refresh and try again, or email us to order.'); btn.disabled = true; });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    showError('');
    btn.disabled = true; btn.textContent = 'Taking you to PayPal...';
    fetch('/api/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: $('email').value.trim(), items: chosen.map(function (p) { return p.slug; }) })
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.j.error || 'Something went wrong.');
        window.location.href = res.j.approve_url;
      })
      .catch(function (e) {
        showError(e.message); btn.disabled = false; btn.textContent = 'Pay with PayPal';
      });
  });
})();
