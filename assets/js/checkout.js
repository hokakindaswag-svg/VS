/* Commande — récapitulatif + formulaire (démo) */
(function () {
  const { PRICES, getProduct } = window.MR;
  const { money, esc, qs, Cart, pricing, toast } = window.MRApp;

  const field = (id, label, type = 'text', extra = '') => `
    <label class="tiny" for="${id}" style="display:block;margin:12px 0 5px">${label}</label>
    <input id="${id}" name="${id}" type="${type}" ${extra}
      style="width:100%;height:50px;border:1px solid var(--line);border-radius:12px;padding:0 16px;background:#fff">`;

  qs('[data-checkout-fields]').innerHTML = `
    <h3 style="font-size:22px;margin-bottom:4px">Livraison</h3>
    ${field('email', 'E-mail', 'email', 'required autocomplete="email"')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div>${field('prenom', 'Prénom', 'text', 'required autocomplete="given-name"')}</div>
      <div>${field('nom', 'Nom', 'text', 'required autocomplete="family-name"')}</div>
    </div>
    ${field('adresse', 'Adresse', 'text', 'required autocomplete="street-address"')}
    <div style="display:grid;grid-template-columns:1fr 2fr;gap:12px">
      <div>${field('cp', 'Code postal', 'text', 'required inputmode="numeric" autocomplete="postal-code"')}</div>
      <div>${field('ville', 'Ville', 'text', 'required autocomplete="address-level2"')}</div>
    </div>
    <h3 style="font-size:22px;margin:26px 0 4px">Paiement</h3>
    ${field('carte', 'Numéro de carte', 'text', 'inputmode="numeric" placeholder="4242 4242 4242 4242"')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div>${field('exp', 'Expiration', 'text', 'placeholder="MM/AA"')}</div>
      <div>${field('cvc', 'CVC', 'text', 'inputmode="numeric" placeholder="123"')}</div>
    </div>
    <button class="btn btn-cherry btn-block" type="submit" style="margin-top:22px">Payer ma commande</button>
    <p class="tiny" style="text-align:center;margin-top:12px">Démo — aucun paiement n’est réellement traité.</p>`;

  function summary() {
    const items = Cart.items();
    const p = pricing(items);
    const shipping = p.total >= 25 || !items.length ? 0 : 3.95;
    qs('[data-checkout-summary]').innerHTML = `
      <p class="eyebrow">Ta commande</p>
      ${items.length ? items.map((l) => {
        const pr = getProduct(l.id);
        return `<div class="row"><span>${esc(pr.name)} — ${esc(pr.typeShort)} ×${l.qty}</span><span>${money(pr.price * l.qty)}</span></div>`;
      }).join('') : '<p class="lede">Ton panier est vide.</p>'}
      ${p.savings > 0 ? `<div class="row save"><span>Offre 2 pour ${money(PRICES.duo)}</span><span>− ${money(p.savings)}</span></div>` : ''}
      <div class="row"><span>Livraison</span><span>${shipping === 0 ? 'Offerte' : money(shipping)}</span></div>
      <div class="row total"><span>Total</span><span>${money(p.total + shipping)}</span></div>
      ${p.single ? `<a class="btn btn-ghost btn-block btn-sm" href="duo.html" style="margin-top:14px">Ajouter un 2ᵉ produit — ${money(PRICES.duo)} les 2</a>` : ''}`;
  }

  qs('[data-checkout-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!Cart.items().length) { toast('Ton panier est vide'); return; }
    Cart.clear();
    document.querySelector('main').innerHTML = `
      <div class="wrap" style="text-align:center;padding:70px 20px 100px;max-width:560px">
        <p class="eyebrow">Merci ♡</p>
        <h1 class="h-section">Commande <span class="italic">confirmée</span>.</h1>
        <p class="lede" style="margin:14px auto 26px">Un e-mail de confirmation arrive. Expédition sous 24 h ouvrées.</p>
        <a class="btn btn-cherry" href="index.html">Retour à la boutique</a>
      </div>`;
  });

  document.addEventListener('cart:change', summary);
  summary();
})();
