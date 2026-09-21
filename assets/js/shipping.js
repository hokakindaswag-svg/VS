/* Page shipping — pré-remplit l'offre via les sub id avant paiement */
(function () {
  const { getProduct } = window.MR;
  const { money, esc, qs, Cart, pricing, toast, PAYMENT_LINKS } = window.MRApp;

  function renderSummary() {
    const items = Cart.items();
    const linesEl = qs('[data-ship-lines]');
    const sumEl = qs('[data-ship-summary]');

    if (!items.length) {
      window.location.href = 'panier.html';
      return null;
    }

    linesEl.innerHTML = items.map((l) => {
      const pr = getProduct(l.id);
      return `<div class="cart-line">
        <img src="${pr.image}" alt="${esc(pr.name)} ${esc(pr.typeShort)}" loading="lazy">
        <div class="cl-body">
          <strong>${esc(pr.name)}</strong>
          <span class="cl-meta">${esc(pr.typeLabel)} · ${pr.size}</span>
          <div class="cl-foot">
            <span>Qté ${l.qty}</span>
            <span>${money(pr.price * l.qty)}</span>
          </div>
        </div>
      </div>`;
    }).join('');

    const p = pricing(items);
    sumEl.innerHTML = `
      <p class="eyebrow">Récapitulatif</p>
      <div class="row"><span>Sous-total (${p.count} produit${p.count > 1 ? 's' : ''})</span><span>${money(p.subtotal)}</span></div>
      ${p.savings > 0 ? `<div class="row save"><span>Offre appliquée</span><span>− ${money(p.savings)}</span></div>` : ''}
      <div class="row"><span>Livraison</span><span>Offerte</span></div>
      <div class="row total"><span>Total</span><span>${money(p.total)}</span></div>`;

    return p;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const items = Cart.items();
    if (!items.length) { window.location.href = 'panier.html'; return; }

    const form = e.target;
    if (!form.reportValidity()) return;

    const f = new FormData(form);
    const p = pricing(items);
    const base = p.single ? PAYMENT_LINKS.single : PAYMENT_LINKS.duo;

    const sub = new URLSearchParams({
      sub9: f.get('first').trim(),
      sub10: f.get('last').trim(),
      sub11: f.get('email').trim(),
      sub12: f.get('phone').trim(),
      sub13: f.get('address').trim(),
      sub14: f.get('zip').trim(),
      sub15: f.get('city').trim(),
      sub16: f.get('country').trim(),
    });

    window.location.href = `${base}&${sub.toString()}`;
  }

  function mount() {
    if (!renderSummary()) return;
    const form = qs('[data-ship-form]');
    form.addEventListener('submit', handleSubmit);
  }

  document.addEventListener('cart:change', renderSummary);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
