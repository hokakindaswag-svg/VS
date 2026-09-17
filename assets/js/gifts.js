/* Page Cadeaux */
(function () {
  const { SCENTS, getProduct } = window.MR;
  const { qs, param } = window.MRApp;
  const C = window.MRC;
  C.renderGifts(qs('[data-gift-list]'));
  C.mountDuoBuilder(qs('[data-duo-builder]'), { p1: param('p1'), p2: param('p2') });
  const best = SCENTS.filter((s) => s.bestseller).map((s) => getProduct(`${s.slug}-mist`));
  C.renderProducts(qs('[data-gift-best]'), best);
  window.MRApp.reveals();
})();
