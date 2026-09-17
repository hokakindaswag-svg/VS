/* Génère les visuels SVG (mockups produits, moods, UGC, éditorial).
   Usage : node scripts/generate-images.mjs
   Ces fichiers sont des placeholders : remplace-les par de vraies photos
   en renseignant `image` dans assets/js/data.js. */
import { writeFileSync, mkdirSync } from 'node:fs';

const SCENTS = [
  { slug:'bare-vanilla',   name:'BARE VANILLA',   notes:'VANILLE · CRÈME · MUSC',       bg:'#F6EADF', deep:'#C29466', ink:'#6B4A2E', liquid:'#F0DCC4' },
  { slug:'pure-seduction', name:'PURE SEDUCTION', notes:'FRUITÉ · SUCRÉ · SENSUEL',     bg:'#F9D3DF', deep:'#B22C57', ink:'#6E1730', liquid:'#F2AEC4' },
  { slug:'love-spell',     name:'LOVE SPELL',     notes:'PÊCHE · CERISE · FLORAL',      bg:'#FBD5CB', deep:'#D4425A', ink:'#7B2233', liquid:'#F7B8AA' },
  { slug:'velvet-petals',  name:'VELVET PETALS',  notes:'AMANDE · FLORAL · CRÉMEUX',    bg:'#EFDCEC', deep:'#A2678F', ink:'#5E3552', liquid:'#E3C6DE' },
  { slug:'coconut-passion',name:'COCONUT PASSION',notes:'COCO · VANILLE · CHALEUR',     bg:'#F7EBD8', deep:'#C08A50', ink:'#6D4A24', liquid:'#F3E1C4' },
  { slug:'amber-romance',  name:'AMBER ROMANCE',  notes:'AMBRE · VANILLE · MUSC',       bg:'#F2DCC5', deep:'#9A5B2E', ink:'#5A3117', liquid:'#E5BE92' },
  { slug:'aqua-kiss',      name:'AQUA KISS',      notes:'FRAIS · AQUATIQUE · FLORAL',   bg:'#DEEAEF', deep:'#5589A0', ink:'#2F5566', liquid:'#C9E0EA' },
  { slug:'midnight-bloom', name:'MIDNIGHT BLOOM', notes:'FLORAL SOMBRE · MUSC',         bg:'#E0D3E4', deep:'#5A3B6B', ink:'#301C3D', liquid:'#C6AFD0' },
];

const defs = (s, id) => `
  <linearGradient id="bgg${id}" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0%" stop-color="#FFFDFB"/><stop offset="55%" stop-color="${s.bg}"/><stop offset="100%" stop-color="${s.deep}22"/>
  </linearGradient>
  <radialGradient id="flash${id}" cx="50%" cy="28%" r="62%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity=".85"/><stop offset="60%" stop-color="#ffffff" stop-opacity=".12"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="glass${id}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#ffffff" stop-opacity=".95"/><stop offset="18%" stop-color="${s.liquid}"/><stop offset="52%" stop-color="${s.deep}"/><stop offset="78%" stop-color="${s.liquid}"/><stop offset="100%" stop-color="#ffffff" stop-opacity=".8"/>
  </linearGradient>
  <!-- Finition tube métallique dégradée, façon vernis satiné -->
  <linearGradient id="metal${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".9"/>
    <stop offset="16%" stop-color="${s.liquid}"/>
    <stop offset="48%" stop-color="${s.deep}"/>
    <stop offset="78%" stop-color="${s.ink}"/>
    <stop offset="100%" stop-color="${s.deep}"/>
  </linearGradient>
  <linearGradient id="cap${id}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#F7F2EE"/><stop offset="35%" stop-color="#D9B27C"/><stop offset="70%" stop-color="#B4884A"/><stop offset="100%" stop-color="#F1DDBB"/>
  </linearGradient>
  <linearGradient id="capv${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#F1DDBB"/><stop offset="45%" stop-color="#D9B27C"/><stop offset="100%" stop-color="#A87A3E"/>
  </linearGradient>
  <!-- Reflet diagonal façon studio, commun aux deux formats -->
  <linearGradient id="sheen${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="38%" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="47%" stop-color="#ffffff" stop-opacity=".55"/>
    <stop offset="56%" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
  <filter id="grain${id}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.13"/></feComponentTransfer></filter>
  <filter id="soft${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="26"/></filter>`;

function bottle(s, type) {
  const id = s.slug.replace(/-/g, '') + type;
  const W = 900, H = 1200;
  const isMist = type === 'mist';
  const bw = isMist ? 250 : 296, bh = isMist ? 560 : 620;
  const bx = (W - bw) / 2, by = isMist ? 470 : 400;

  /* --- Brume : flacon en verre, bouchon doré arrondi, buse latérale --- */
  const mistMarkup = `
  <rect x="${bx+bw/2-34}" y="${by-150}" width="68" height="152" rx="10" fill="${s.liquid}" opacity=".5"/>
  <rect x="${bx+bw/2-50}" y="${by-198}" width="100" height="62" rx="20" fill="url(#cap${id})"/>
  <rect x="${bx+bw/2-52}" y="${by-172}" width="104" height="16" fill="${s.ink}" opacity=".92"/>
  <text x="${bx+bw/2}" y="${by-161}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="7.5" letter-spacing="2" fill="#EFCE93">MAISON ROSÉ</text>
  <rect x="${bx+bw/2+6}" y="${by-214}" width="46" height="20" rx="7" fill="${s.ink}" opacity=".85" transform="rotate(-6 ${bx+bw/2+6} ${by-214})"/>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="46" fill="url(#glass${id})"/>
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="46" fill="url(#sheen${id})"/>
  <rect x="${bx+16}" y="${by+18}" width="22" height="${bh-50}" rx="11" fill="#fff" opacity=".5"/>
  <rect x="${bx+26}" y="${by+150}" width="${bw-52}" height="250" rx="12" fill="#FFFBF7" opacity=".94"/>
  <text x="450" y="${by+188}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="9.5" letter-spacing="3" fill="${s.deep}">MAISON ROSÉ</text>
  <text x="450" y="${by+225}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" letter-spacing="1.5" fill="${s.ink}">${s.name.split(' ')[0]}</text>
  <text x="450" y="${by+263}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" letter-spacing="1.5" fill="${s.ink}">${s.name.split(' ').slice(1).join(' ')}</text>
  <line x1="${bx+70}" y1="${by+288}" x2="${bx+bw-70}" y2="${by+288}" stroke="${s.deep}" stroke-width="1.2" opacity=".6"/>
  <text x="450" y="${by+320}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="12.5" letter-spacing="3" fill="${s.deep}">BRUME PARFUMÉE</text>
  <text x="450" y="${by+350}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="10.5" letter-spacing="2.2" fill="${s.ink}" opacity=".65">${s.notes}</text>
  <text x="450" y="${by+bh-26}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="9.5" letter-spacing="1.5" fill="${s.ink}" opacity=".55">250 ML</text>`;

  /* --- Lait : tube métallique dégradé, capuchon flip-top doré ------- */
  const shoulderTop = by, capH = 66, neckW = 76;
  const tubePath = `M ${bx+10} ${shoulderTop}
           C ${bx-8} ${shoulderTop+70}, ${bx+bw/2-neckW-22} ${bh*0.62+shoulderTop}, ${bx+bw/2-neckW} ${bh+shoulderTop-capH}
           L ${bx+bw/2+neckW} ${bh+shoulderTop-capH}
           C ${bx+bw/2+neckW+22} ${bh*0.62+shoulderTop}, ${bx+bw+8} ${shoulderTop+70}, ${bx+bw-10} ${shoulderTop}
           Z`;
  const lotionMarkup = `
  <path d="${tubePath}" fill="url(#metal${id})"/>
  <path d="M ${bx+22} ${shoulderTop+2} L ${bx+bw-22} ${shoulderTop+2} L ${bx+bw-30} ${shoulderTop+22} L ${bx+30} ${shoulderTop+22} Z" fill="${s.ink}" opacity=".5"/>
  <path d="${tubePath}" fill="url(#sheen${id})"/>
  <text x="450" y="${shoulderTop+96}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="10.5" letter-spacing="3" fill="#fff" opacity=".85">MAISON ROSÉ</text>
  <text x="450" y="${shoulderTop+146}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="32" letter-spacing="0.5" fill="#fff">${s.name.split(' ')[0]}</text>
  <text x="450" y="${shoulderTop+186}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="32" letter-spacing="0.5" fill="#fff">${s.name.split(' ').slice(1).join(' ')}</text>
  <text x="450" y="${bh+shoulderTop-capH-64}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11" letter-spacing="2" fill="#fff" opacity=".8">LOTION PARFUMÉE</text>
  <text x="450" y="${bh+shoulderTop-capH-40}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="10" letter-spacing="1.5" fill="#fff" opacity=".7">236 ML</text>
  <rect x="${bx+bw/2-68}" y="${bh+shoulderTop-capH-14}" width="136" height="18" fill="${s.ink}" opacity=".9"/>
  <text x="450" y="${bh+shoulderTop-capH-1}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="7.5" letter-spacing="2" fill="#EFCE93">MAISON ROSÉ</text>
  <rect x="${bx+bw/2-70}" y="${bh+shoulderTop-capH}" width="140" height="${capH}" rx="26" fill="url(#capv${id})"/>
  <rect x="${bx+bw/2-70}" y="${bh+shoulderTop-capH}" width="140" height="${capH*0.4}" rx="18" fill="#fff" opacity=".28"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${s.name}">
<defs>${defs(s, id)}</defs>
<rect width="${W}" height="${H}" fill="url(#bgg${id})"/>
<ellipse cx="450" cy="330" rx="330" ry="330" fill="url(#flash${id})"/>
<g opacity=".28" fill="none" stroke="${s.deep}" stroke-width="1.5">
  <ellipse cx="450" cy="1090" rx="330" ry="52"/><ellipse cx="450" cy="1090" rx="250" ry="38"/>
</g>
<ellipse cx="470" cy="1100" rx="${bw*0.85}" ry="34" fill="${s.ink}" opacity=".22" filter="url(#soft${id})"/>
<g>
  ${isMist ? mistMarkup : lotionMarkup}
</g>
<rect width="${W}" height="${H}" filter="url(#grain${id})" opacity=".5" style="mix-blend-mode:multiply"/>
</svg>`;
}

function mood(s) {
  const id = 'm' + s.slug.replace(/-/g, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
<defs>${defs(s, id)}</defs>
<rect width="800" height="1000" fill="url(#bgg${id})"/>
<ellipse cx="400" cy="300" rx="380" ry="340" fill="url(#flash${id})"/>
<g opacity=".5">
  <circle cx="230" cy="740" r="150" fill="${s.deep}" opacity=".22" filter="url(#soft${id})"/>
  <circle cx="600" cy="420" r="190" fill="${s.liquid}" opacity=".5" filter="url(#soft${id})"/>
</g>
<g transform="translate(400 520)" opacity=".9">
  ${Array.from({length:8},(_,i)=>`<ellipse cx="0" cy="-120" rx="58" ry="140" fill="${s.deep}" opacity=".18" transform="rotate(${i*45})"/>`).join('')}
  <circle r="46" fill="${s.liquid}"/><circle r="22" fill="${s.deep}" opacity=".55"/>
</g>
<rect x="60" y="60" width="680" height="880" fill="none" stroke="#FFFDFB" stroke-width="2" opacity=".7"/>
<rect width="800" height="1000" filter="url(#grain${id})" opacity=".55" style="mix-blend-mode:multiply"/>
</svg>`;
}

mkdirSync('assets/img/scents', { recursive: true });
mkdirSync('assets/img/mood', { recursive: true });
mkdirSync('assets/img/editorial', { recursive: true });

for (const s of SCENTS) {
  writeFileSync(`assets/img/scents/${s.slug}-mist.svg`, bottle(s, 'mist'));
  writeFileSync(`assets/img/scents/${s.slug}-lotion.svg`, bottle(s, 'lotion'));
  writeFileSync(`assets/img/mood/${s.slug}.svg`, mood(s));
}

/* --- HERO éditorial --------------------------------------------------- */
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" width="1600" height="1100">
<defs>
  <linearGradient id="h1" x1="0" y1="0" x2="0.6" y2="1">
    <stop offset="0%" stop-color="#FFF9F6"/><stop offset="45%" stop-color="#FADCE4"/><stop offset="100%" stop-color="#E8A9BC"/>
  </linearGradient>
  <radialGradient id="h2" cx="62%" cy="26%" r="55%">
    <stop offset="0%" stop-color="#fff" stop-opacity=".95"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/>
  </radialGradient>
  <filter id="hs" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="40"/></filter>
  <filter id="hg"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter>
  <linearGradient id="hb" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#fff" stop-opacity=".9"/><stop offset="25%" stop-color="#F6C3D3"/><stop offset="55%" stop-color="#B7365C"/><stop offset="82%" stop-color="#F2B7CB"/><stop offset="100%" stop-color="#fff" stop-opacity=".85"/>
  </linearGradient>
</defs>
<rect width="1600" height="1100" fill="url(#h1)"/>
<ellipse cx="1000" cy="300" rx="620" ry="520" fill="url(#h2)"/>
<circle cx="300" cy="820" r="230" fill="#C9315C" opacity=".14" filter="url(#hs)"/>
<circle cx="1320" cy="760" r="200" fill="#FFF3F6" opacity=".7" filter="url(#hs)"/>
<g transform="translate(0 60)">
  <ellipse cx="800" cy="1000" rx="430" ry="52" fill="#8E1F3E" opacity=".18" filter="url(#hs)"/>
  ${[{x:560,h:430,w:190},{x:790,h:530,w:210},{x:1040,h:390,w:170}].map((b,i)=>`
  <g>
    <rect x="${b.x}" y="${960-b.h}" width="${b.w}" height="${b.h}" rx="${b.w*0.2}" fill="url(#hb)" opacity=".95"/>
    <rect x="${b.x+12}" y="${960-b.h+18}" width="20" height="${b.h-50}" rx="10" fill="#fff" opacity=".55"/>
    <rect x="${b.x+b.w/2-36}" y="${960-b.h-70}" width="72" height="76" rx="12" fill="#F7E7EC" opacity=".9"/>
    <rect x="${b.x+b.w/2-48}" y="${960-b.h-108}" width="96" height="46" rx="14" fill="#7B1E3A"/>
    <rect x="${b.x+22}" y="${960-b.h*0.55}" width="${b.w-44}" height="${b.h*0.32}" rx="10" fill="#FFFCFA" opacity=".92"/>
  </g>`).join('')}
</g>
<g opacity=".8" fill="#C9315C">
  <circle cx="420" cy="960" r="26"/><circle cx="462" cy="972" r="22"/>
  <path d="M420 936 C 424 916, 448 912, 452 930" stroke="#6E8B4C" stroke-width="6" fill="none"/>
</g>
<rect width="1600" height="1100" filter="url(#hg)" opacity=".5" style="mix-blend-mode:multiply"/>
</svg>`;
writeFileSync('assets/img/editorial/hero.svg', hero);

/* --- Bannière cadeaux / gifting --------------------------------------- */
const gift = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
<defs>
  <linearGradient id="g1" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stop-color="#FFFBF8"/><stop offset="60%" stop-color="#F7DCE3"/><stop offset="100%" stop-color="#D98FA6"/></linearGradient>
  <filter id="gs" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="gg"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.12"/></feComponentTransfer></filter>
</defs>
<rect width="1200" height="900" fill="url(#g1)"/>
<circle cx="880" cy="220" r="240" fill="#fff" opacity=".55" filter="url(#gs)"/>
<g transform="translate(600 480)">
  <ellipse cx="0" cy="250" rx="330" ry="46" fill="#8E1F3E" opacity=".2" filter="url(#gs)"/>
  <rect x="-260" y="-60" width="520" height="300" rx="18" fill="#FCEFF3"/>
  <rect x="-260" y="-60" width="520" height="52" rx="18" fill="#B7365C" opacity=".9"/>
  <rect x="-40" y="-60" width="80" height="300" fill="#B7365C" opacity=".35"/>
  <path d="M0 -60 C -70 -150, -170 -90, -20 -62 C -120 -190, 20 -180, 0 -60 Z" fill="#B7365C"/>
  <path d="M0 -60 C 70 -150, 170 -90, 20 -62 C 120 -190, -20 -180, 0 -60 Z" fill="#D4506F"/>
</g>
<rect width="1200" height="900" filter="url(#gg)" opacity=".5" style="mix-blend-mode:multiply"/>
</svg>`;
writeFileSync('assets/img/editorial/gift.svg', gift);

/* --- Cartes UGC verticales -------------------------------------------- */
const ugcPalettes = [
  ['#F9D3DF','#B22C57'], ['#F6EADF','#C29466'], ['#FBD5CB','#D4425A'],
  ['#EFDCEC','#A2678F'], ['#F7EBD8','#C08A50'], ['#E0D3E4','#5A3B6B'],
];
mkdirSync('assets/img/ugc', { recursive: true });
ugcPalettes.forEach(([bg, deep], i) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 1066" width="600" height="1066">
<defs>
  <linearGradient id="u${i}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stop-color="#FFFCFA"/><stop offset="55%" stop-color="${bg}"/><stop offset="100%" stop-color="${deep}"/></linearGradient>
  <radialGradient id="uf${i}" cx="50%" cy="25%" r="60%"><stop offset="0%" stop-color="#fff" stop-opacity=".9"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <filter id="ub${i}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="28"/></filter>
  <filter id="un${i}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.14"/></feComponentTransfer></filter>
</defs>
<rect width="600" height="1066" fill="url(#u${i})"/>
<ellipse cx="300" cy="280" rx="300" ry="280" fill="url(#uf${i})"/>
<circle cx="150" cy="820" r="140" fill="${deep}" opacity=".25" filter="url(#ub${i})"/>
<g transform="translate(300 600)">
  <ellipse cx="0" cy="220" rx="150" ry="28" fill="#000" opacity=".15" filter="url(#ub${i})"/>
  <rect x="-80" y="-140" width="160" height="350" rx="34" fill="#FFF9F6" opacity=".92"/>
  <rect x="-30" y="-200" width="60" height="64" rx="10" fill="${deep}" opacity=".5"/>
  <rect x="-44" y="-238" width="88" height="44" rx="14" fill="${deep}"/>
  <rect x="-56" y="-40" width="112" height="150" rx="10" fill="${bg}"/>
</g>
<rect width="600" height="1066" filter="url(#un${i})" opacity=".5" style="mix-blend-mode:multiply"/>
</svg>`;
  writeFileSync(`assets/img/ugc/ugc-${i + 1}.svg`, svg);
});

console.log('Visuels générés.');
