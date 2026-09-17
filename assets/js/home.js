/* Page d’accueil — montage des sections dynamiques */
(function () {
  const { SCENTS, PRODUCTS } = window.MR;
  const { qs, param, reveals } = window.MRApp;
  const C = window.MRC;

  const el = (s) => qs(s);

  C.renderScents(el('[data-scent-grid]'));
  C.renderMoods(el('[data-mood-grid]'));
  C.renderLayers(el('[data-layer-grid]'));
  C.renderUgc(el('[data-ugc]'));
  C.renderGifts(el('[data-gift-list]'));

  /* Bestsellers : brumes des parfums marqués bestseller + un lait signature */
  const best = SCENTS.filter((s) => s.bestseller).map((s) => window.MR.getProduct(`${s.slug}-mist`));
  const lotions = SCENTS.filter((s) => s.bestseller).slice(0, 2).map((s) => window.MR.getProduct(`${s.slug}-lotion`));
  C.renderProducts(el('[data-bestsellers]'), [...best, ...lotions].slice(0, 8));

  C.mountDuoBuilder(el('[data-duo-builder]'), { p1: param('p1'), p2: param('p2') });

  reveals();
})();
