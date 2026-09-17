/* Page « Les parfums » */
(function () {
  const { qs } = window.MRApp;
  const C = window.MRC;
  C.renderScents(qs('[data-scent-grid]'));
  C.renderLayers(qs('[data-layer-grid]'));
  C.renderMoods(qs('[data-mood-grid]'));
  window.MRApp.reveals();
})();
