/* Page infos : à propos, FAQ, livraison, retours, légal */
(function () {
  const { INFO, FAQ, BRAND } = window.MR;
  const { esc, qs, qsa } = window.MRApp;

  const sections = [
    { id: 'a-propos', t: 'À propos', b: `${BRAND.name} est née d’une idée simple : un parfum qui sent cher ne devrait pas coûter cher. Des brumes et des laits parfumés formulés en France, vegan, non testés sur les animaux, à 9,99 € — et 2 au choix pour 19,99 €. Huit signatures pensées pour être portées seules, ou superposées.` },
    { id: 'livraison', t: 'Livraison', b: INFO.shipping },
    { id: 'retours', t: 'Retours', b: INFO.returns },
    { id: 'contact', t: 'Contact', b: `Une question ? Écris-nous à ${BRAND.email}, on répond sous 24 h du lundi au vendredi. On est aussi en DM sur Instagram et TikTok.` },
    { id: 'confidentialite', t: 'Confidentialité', b: "Tes données servent uniquement à traiter ta commande et, si tu l’as accepté, à t’envoyer nos e-mails. Elles ne sont jamais revendues. Tu peux demander leur suppression à tout moment par e-mail." },
    { id: 'cgv', t: 'Conditions générales de vente', b: "Les prix sont indiqués en euros TTC. L’offre « 2 produits au choix pour 19,99 € » s’applique automatiquement à chaque paire de produits éligibles du panier et n’est pas cumulable avec d’autres remises. Les commandes sont expédiées sous 24 h ouvrées." },
    { id: 'cookies', t: 'Cookies', b: "Nous utilisons des cookies nécessaires au fonctionnement du site (panier) et des cookies de mesure d’audience anonymisés. Tu peux les refuser depuis ton navigateur." },
    { id: 'mentions', t: 'Mentions légales', b: `${BRAND.name} SAS — 12 rue des Lilas, 75011 Paris. SIREN 000 000 000. Directeur de la publication : la direction. Hébergement : à compléter.` },
  ];

  qs('[data-infos]').innerHTML = `
    <div style="margin-bottom:34px">
      <p class="eyebrow">FAQ</p>
      <h2 class="h-section" style="font-size:30px;margin-bottom:14px">Les questions <span class="italic">qu’on nous pose</span>.</h2>
      ${FAQ.map((f) => `
        <div class="acc">
          <button class="acc-head">${esc(f.q)}<i>+</i></button>
          <div class="acc-body"><p>${esc(f.a)}</p></div>
        </div>`).join('')}
    </div>
    ${sections.map((s) => `
      <section id="${s.id}" style="padding:26px 0;border-top:1px solid var(--line)">
        <h2 class="h-section" style="font-size:26px;margin-bottom:10px">${esc(s.t)}</h2>
        <p class="lede">${esc(s.b)}</p>
      </section>`).join('')}`;

  qsa('.acc-head').forEach((h) => h.addEventListener('click', () => {
    const acc = h.parentElement, body = acc.querySelector('.acc-body');
    const open = acc.classList.toggle('open');
    body.style.maxHeight = open ? body.scrollHeight + 'px' : 0;
  }));

  if (location.hash) {
    const el = document.querySelector(location.hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }
})();
