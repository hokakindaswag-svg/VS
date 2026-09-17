/* Page « 2 au choix pour 19,99 € » */
(function () {
  const { PRODUCTS } = window.MR;
  const { qs, param } = window.MRApp;
  const C = window.MRC;
  C.mountDuoBuilder(qs('[data-duo-builder]'), { p1: param('p1'), p2: param('p2') });
  C.renderLayers(qs('[data-layer-grid]'));
  C.renderProducts(qs('[data-duo-grid]'), PRODUCTS);
  window.MRApp.reveals();
})();
