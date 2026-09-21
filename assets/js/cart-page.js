/* Page panier complète */
(function () {
  const { PRICES, getProduct } = window.MR;
  const { money, esc, qs, Cart, pricing, recommend } = window.MRApp;
  const C = window.MRC;

  function render() {
    const items = Cart.items();
    const p = pricing(items);
    const lines = qs('[data-cart-lines]');
    const prog = qs('[data-cart-progress]');
    const recosEl = qs('[data-cart-recos]');
    const sum = qs('[data-cart-summary]');

    if (!items.length) {
      prog.innerHTML = '';
      recosEl.innerHTML = '';
      sum.innerHTML = '';
      lines.innerHTML = `
        <div class="empty">
          <h2 class="h-section">Ton panier est <span class="italic">vide</span>.</h2>
          <p class="lede" style="margin:10px auto 22px">Deux produits au choix pour ${money(PRICES.duo)}. On commence par lequel ?</p>
          <a class="btn btn-cherry" href="boutique.html">Découvrir les parfums</a>
        </div>`;
      return;
    }

    prog.innerHTML = p.single
      ? `<div class="progress-card">
           <p class="eyebrow">L’offre du moment</p>
           <h3>Il te manque un produit ♡</h3>
           <p>Ajoute un 2<sup>e</sup> produit éligible et repars avec 2 produits pour ${money(PRICES.duo)}.</p>
           <div class="bar"><i style="width:50%"></i></div>
           <p class="tiny">1 produit sur 2</p>
         </div>`
      : `<div class="progress-card">
           <p class="eyebrow">Offre appliquée</p>
           <h3>Ton duo est prêt ♡</h3>
           <p>${p.pairs} duo${p.pairs > 1 ? 's' : ''} · ${money(PRICES.duo)} les 2 produits.${p.savings > 0 ? ` Tu économises ${money(p.savings)}.` : ''}</p>
           <div class="bar"><i style="width:100%"></i></div>
           <p class="tiny">Aucun code nécessaire</p>
         </div>`;

    lines.innerHTML = items.map((l) => {
      const pr = getProduct(l.id);
      return `<div class="cart-line">
        <img src="${pr.image}" alt="${esc(pr.name)}" loading="lazy">
        <div class="cl-body">
          <strong>${esc(pr.name)}</strong>
          <span class="cl-meta">${esc(pr.typeLabel)} · ${pr.size}</span>
          ${!p.single || l.qty > 1 ? '<span class="duo-flag">♡ Éligible duo 19,99 €</span>' : '<span class="duo-flag">♡ Éligible duo</span>'}
          <div class="cl-foot">
            <div class="qty-mini">
              <button data-qty="${pr.id}" data-delta="-1" aria-label="Diminuer">−</button>
              <span>${l.qty}</span>
              <button data-qty="${pr.id}" data-delta="1" aria-label="Augmenter">+</button>
            </div>
            <span>${money(pr.price * l.qty)}</span>
            <button class="remove" data-remove="${pr.id}">Supprimer</button>
          </div>
        </div>
      </div>`;
    }).join('');

    const recos = recommend(4);
    recosEl.innerHTML = `
      <p class="eyebrow">${p.single ? 'Complète ton duo — 19,99 € les 2' : 'Ça se superpose très bien'}</p>
      <h3 class="h-section" style="font-size:26px;margin-bottom:16px">${p.single ? 'Encore un produit ♡' : 'Encore un duo ?'}</h3>
      <div class="grid grid-2" data-reco-grid></div>`;
    C.renderProducts(qs('[data-reco-grid]'), recos);

    const shipping = 0; // livraison toujours offerte
    sum.innerHTML = `
      <p class="eyebrow">Récapitulatif</p>
      <div class="row"><span>Sous-total (${p.count} produit${p.count > 1 ? 's' : ''})</span><span>${money(p.subtotal)}</span></div>
      ${p.savings > 0 ? `<div class="row save"><span>Offre 2 pour ${money(PRICES.duo)}</span><span>− ${money(p.savings)}</span></div>` : ''}
      <div class="row"><span>Livraison</span><span>${shipping === 0 ? 'Offerte' : money(shipping)}</span></div>
      <div class="row total"><span>Total</span><span>${money(p.total + shipping)}</span></div>
      <button class="btn btn-dark btn-block" data-finalize style="margin-top:16px">Passer commande</button>
      <a class="btn btn-ghost btn-block btn-sm" href="boutique.html" style="margin-top:8px">Continuer mes achats</a>
      <p class="tiny" style="text-align:center;margin-top:14px">Paiement sécurisé · Retours gratuits 30 jours</p>`;
  }

  document.addEventListener('cart:change', render);
  render();
})();
