/* ============================================================
   hey EU – Pixel-Sprites (Charaktere & Kacheln)
   Figuren: 16x22 Pixel, mit Umriss, Schattierung und Glanzlicht.
   Zeichencodes: . leer | o Umriss | H Haare | h Haar-Glanz
   S Haut | s Haut-Schatten | E Auge | W Augen-Glanz
   T Shirt | t Shirt-Schatten | P Hose | O Schuhe | A Arm (Haut)
   ============================================================ */

const HEADS = {
  kurz: {
    down: [
      '.....oooooo.....',
      '....oHHHHHHo....',
      '...oHHHHHHHHo...',
      '..oHhHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '..oHSSSSSSSSHo..',
      '.oHSSSSSSSSSSHo.',
      '.oSSEWSSSSEWSSo.',
      '.oSSSSSSssSSSSo.',
      '..oSSSSSSSSSSo..',
      '..osSSSSSSSSso..',
      '....oossssoo....'
    ],
    up: [
      '.....oooooo.....',
      '....oHHHHHHo....',
      '...oHHHHHHHHo...',
      '..oHhHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '.oHHHHHHHHHHHHo.',
      '.oHHHHHHHHHHHHo.',
      '.oHHHHHHHHHHHHo.',
      '..oHHHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '....oossssoo....'
    ],
    side: [
      '.....oooooo.....',
      '....oHHHHHHo....',
      '...oHHHHHHHHo...',
      '..oHHhHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '..oHHHHSSSSSSo..',
      '.oHHHHHSSSSSSo..',
      '.oHHHHSSSEWSSo..',
      '.oHHHHSSSSSSSo..',
      '..oHHSSSSSSSo...',
      '..osHSSSSSSso...',
      '....oossssoo....'
    ]
  },
  lang: {
    down: [
      '.....oooooo.....',
      '....oHHHHHHo....',
      '...oHHHHHHHHo...',
      '..oHhHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '..oHHSSSSSSHHo..',
      '.oHHSSSSSSSSHHo.',
      '.oHSEWSSSSEWSHo.',
      '.oHSSSSSssSSSHo.',
      '.oHHSSSSSSSSHHo.',
      '.oHHsSSSSSSsHHo.',
      '..oHHossssoHHo..'
    ],
    up: [
      '.....oooooo.....',
      '....oHHHHHHo....',
      '...oHHHHHHHHo...',
      '..oHhHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '.oHHHHHHHHHHHHo.',
      '.oHHHHHHHHHHHHo.',
      '.oHHHHHHHHHHHHo.',
      '.oHHHHHHHHHHHHo.',
      '.oHhHHHHHHHHhHo.',
      '..oHHHHHHHHHHo..'
    ],
    side: [
      '.....oooooo.....',
      '....oHHHHHHo....',
      '...oHHHHHHHHo...',
      '..oHHhHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '..oHHHHSSSSSSo..',
      '.oHHHHHSSSSSSo..',
      '.oHHHHSSSEWSSo..',
      '.oHHHHSSSSSSSo..',
      '.oHHHHSSSSSSo...',
      '.oHhHHsSSSSso...',
      '..oHHHossssoo...'
    ]
  },
  wuschel: {
    down: [
      '...oo.oooo.oo...',
      '..oHHoHHHHoHHo..',
      '.oHHHHHHHHHHHHo.',
      '.oHhHHHHHHHHhHo.',
      '.oHHHHHHHHHHHHo.',
      '..oHSSSSSSSSHo..',
      '.oHSSSSSSSSSSHo.',
      '.oSSEWSSSSEWSSo.',
      '.oSSSSSSssSSSSo.',
      '..oSSSSSSSSSSo..',
      '..osSSSSSSSSso..',
      '....oossssoo....'
    ],
    up: [
      '...oo.oooo.oo...',
      '..oHHoHHHHoHHo..',
      '.oHHHHHHHHHHHHo.',
      '.oHhHHHHHHHHhHo.',
      '.oHHHHHHHHHHHHo.',
      '..oHHHHHHHHHHo..',
      '.oHHHHHHHHHHHHo.',
      '.oHHHHHHHHHHHHo.',
      '.oHHHHHHHHHHHHo.',
      '..oHHHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '....oossssoo....'
    ],
    side: [
      '...oo.oooo.oo...',
      '..oHHoHHHHoHHo..',
      '.oHHHHHHHHHHHHo.',
      '.oHHhHHHHHHHhHo.',
      '.oHHHHHHHHHHHHo.',
      '..oHHHHSSSSSSo..',
      '.oHHHHHSSSSSSo..',
      '.oHHHHSSSEWSSo..',
      '.oHHHHSSSSSSSo..',
      '..oHHHSSSSSSo...',
      '..osHSSSSSSso...',
      '....oossssoo....'
    ]
  },
  pony: {
    down: [
      '.....oooooo.....',
      '....oHHHHHHo....',
      '...oHHHHHHHHo...',
      '..oHhHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '.oHHSSSSSSSSHHo.',
      '.oHSEWSSSSEWSHo.',
      '.oHSSSSSssSSSHo.',
      '.oHHSSSSSSSSHHo.',
      '..oosSSSSSSsoo..',
      '....oossssoo....'
    ],
    up: [
      '.....oooooo.....',
      '....oHHHHHHo....',
      '...oHHHHHHHHo...',
      '..oHhHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '.oHHHHHHHHHHHHo.',
      '.oHHHHHHHHHHHHo.',
      '.oHHHHHHHHHHHHo.',
      '.oHHHHHHHHHHHHo.',
      '..oHHHHHHHHHHo..',
      '....oossssoo....'
    ],
    side: [
      '.....oooooo.....',
      '....oHHHHHHo....',
      '...oHHHHHHHHo...',
      '..oHHhHHHHHHHo..',
      '..oHHHHHHHHHHo..',
      '..oHHHHHHHSSo...',
      '.oHHHHHSSSSSSo..',
      '.oHHHHSSSEWSSo..',
      '.oHHHHSSSSSSSo..',
      '.oHHHHSSSSSSo...',
      '..oHHsSSSSSso...',
      '....oossssoo....'
    ]
  }
};

const BODIES = {
  down: [
    [ // stehen
      '....oTTTTTTo....',
      '..ooTTTTTTTToo..',
      '.oAoTTttttTToAo.',
      '.oAoTTTTTTTToAo.',
      '..ooTttttttToo..',
      '...oPPPppPPPo...',
      '...oPPPooPPPo...',
      '...oPPo..oPPo...',
      '...oOOo..oOOo...',
      '....ooo..ooo....'
    ],
    [ // Schritt A
      '....oTTTTTTo....',
      '..ooTTTTTTTToo..',
      '.oAoTTttttTToAo.',
      '.oAoTTTTTTTToAo.',
      '..ooTttttttToo..',
      '...oPPPppPPPo...',
      '...oPPPooPPo....',
      '...oPPo.oPPo....',
      '...oOOo.oOOo....',
      '....ooo.ooo.....'
    ],
    [ // Schritt B
      '....oTTTTTTo....',
      '..ooTTTTTTTToo..',
      '.oAoTTttttTToAo.',
      '.oAoTTTTTTTToAo.',
      '..ooTttttttToo..',
      '...oPPPppPPPo...',
      '....oPPooPPPo...',
      '....oPPo.oPPo...',
      '....oOOo.oOOo...',
      '.....ooo.ooo....'
    ]
  ],
  side: [
    [
      '.....oTTTTTo....',
      '....oTTTTTTTo...',
      '....oTtTTTTtAo..',
      '....oTTTTTTTo...',
      '.....oTttttTo...',
      '.....oPPPPPo....',
      '.....oPPoPPo....',
      '.....oPPoPPo....',
      '.....oOOoOOo....',
      '......ooooo.....'
    ],
    [
      '.....oTTTTTo....',
      '....oTTTTTTTo...',
      '....oTtTTTTtAo..',
      '....oTTTTTTTo...',
      '.....oTttttTo...',
      '.....oPPPPPo....',
      '....oPPooPPo....',
      '....oPPo.oPPo...',
      '....oOOo.oOOo...',
      '.....ooo..ooo...'
    ],
    [
      '.....oTTTTTo....',
      '....oTTTTTTTo...',
      '....oTtTTTTtAo..',
      '....oTTTTTTTo...',
      '.....oTttttTo...',
      '.....oPPPPPo....',
      '.....oPPPPo.....',
      '.....oPPPPo.....',
      '.....oOOOOo.....',
      '......oooo......'
    ]
  ]
};
BODIES.up = BODIES.down;

const SPRITE_W = 16, SPRITE_H = 22;
const OUTLINE_COLOR = '#2b2320';
const PANTS_COLOR = '#3b5a8f';
const SHOE_COLOR = '#5d4025';
const EYE_COLOR = '#241f1c';

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) * f));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) * f));
  const b = Math.max(0, Math.min(255, (n & 255) * f));
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

function paintTemplate(ctx, rows, colors, ox, oy) {
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const c = colors[row[x]];
      if (!c) continue;
      ctx.fillStyle = c;
      ctx.fillRect(ox + x, oy + y, 1, 1);
    }
  }
}

/* Alle Frames einer Figur (16x22): down/up/left/right x 0/1/2 */
function makeCharacterSprites(cfg) {
  const colors = {
    o: OUTLINE_COLOR,
    H: cfg.hair, h: shade(cfg.hair, 1.45),
    S: cfg.skin, s: shade(cfg.skin, 0.82), A: cfg.skin,
    E: EYE_COLOR, W: '#ffffff',
    T: cfg.shirt, t: shade(cfg.shirt, 0.78),
    P: PANTS_COLOR, p: shade(PANTS_COLOR, 0.78),
    O: SHOE_COLOR
  };
  const head = HEADS[cfg.hairStyle] || HEADS.kurz;
  const frames = {};

  for (const dir of ['down', 'up', 'side']) {
    for (let f = 0; f < 3; f++) {
      const cv = document.createElement('canvas');
      cv.width = SPRITE_W; cv.height = SPRITE_H;
      const ctx = cv.getContext('2d');
      paintTemplate(ctx, head[dir], colors, 0, 0);
      paintTemplate(ctx, BODIES[dir][f], colors, 0, 12);
      frames[(dir === 'side' ? 'right' : dir) + f] = cv;
    }
  }
  for (let f = 0; f < 3; f++) {
    const src = frames['right' + f];
    const cv = document.createElement('canvas');
    cv.width = SPRITE_W; cv.height = SPRITE_H;
    const ctx = cv.getContext('2d');
    ctx.translate(SPRITE_W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(src, 0, 0);
    frames['left' + f] = cv;
  }
  return frames;
}

function randomCharConfig(rng) {
  const pick = a => a[Math.floor(rng() * a.length)];
  return {
    skin: pick(SKIN_TONES),
    hair: pick(HAIR_COLORS),
    hairStyle: pick(HAIR_STYLES).id,
    shirt: pick(SHIRT_COLORS)
  };
}

/* ================= Kachel-Grafiken ================= */

function hash2(x, y) { return ((x * 73856093) ^ (y * 19349663)) >>> 0; }

/* Meer mit Tiefenstufen, Wellen und Schaum an Küsten.
   depth: 0 = flach (an Land), 1 = küstennah, 2 = tief
   foam: {n,s,w,e} – Land in dieser Richtung */
function drawSeaTile(ctx, px, py, tx, ty, phase, depth, foam) {
  const base = depth === 0 ? '#54ace9' : depth === 1 ? '#4aa3e8' : '#4198e0';
  ctx.fillStyle = base;
  ctx.fillRect(px, py, TILE, TILE);

  const h = hash2(tx, ty) % 97;
  // weiche Übergänge zwischen den Tiefen: gestreute Pixel der Nachbartiefe
  if (depth === 1) {
    ctx.fillStyle = '#54ace9';
    for (let i = 0; i < 3; i++) ctx.fillRect(px + ((h >> i) % 14), py + ((h >> (i + 3)) % 14), 2, 1);
  } else if (depth === 2) {
    ctx.fillStyle = '#3a8ed8';
    for (let i = 0; i < 3; i++) ctx.fillRect(px + ((h >> i) % 14), py + ((h >> (i + 4)) % 14), 2, 2);
  }
  // sanfte Wellenlinien in zwei Phasen
  if (h % 5 === phase * 2) {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    const wy = py + 3 + (h % 9);
    ctx.fillRect(px + (h % 6), wy, 6, 1);
    ctx.fillRect(px + (h % 6) + 2, wy + 1, 3, 1);
  }
  if (h % 9 === (phase ? 4 : 0)) {
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(px + 10 - (h % 5), py + 12 - (h % 7), 4, 1);
  }
  if (!foam) return;
  // Schaum: unregelmäßige, weiche Tupfer entlang der Küste
  const foamSide = (fx, fy, horiz, seed) => {
    for (let i = 0; i < TILE; i++) {
      const hh = hash2(tx * 16 + (horiz ? i : 0) + seed, ty * 16 + (horiz ? 0 : i) + phase * 7);
      if (hh % 5 < 2) {
        ctx.fillStyle = hh % 3 ? 'rgba(255,255,255,0.55)' : 'rgba(220,242,255,0.8)';
        ctx.fillRect(horiz ? px + i : fx, horiz ? fy : py + i, 1, 1);
        if (hh % 7 === 0) ctx.fillRect(horiz ? px + i : fx + (fx === px ? 1 : -1), horiz ? fy + (fy === py ? 1 : -1) : py + i, 1, 1);
      }
    }
  };
  if (foam.n) foamSide(px, py, true, 1);
  if (foam.s) foamSide(px, py + TILE - 1, true, 2);
  if (foam.w) foamSide(px, py, false, 3);
  if (foam.e) foamSide(px + TILE - 1, py, false, 4);
}

function drawGrassTile(ctx, px, py, tx, ty, color, edges) {
  ctx.fillStyle = color;
  ctx.fillRect(px, py, TILE, TILE);
  const h = hash2(tx, ty);
  const dark = shade(color, 0.9), light = shade(color, 1.12);

  // Struktur: kleine Grasbüschel und Farbflecken
  ctx.fillStyle = dark;
  for (let i = 0; i < 4; i++) {
    const gx = (h >> (i * 3)) % 13, gy = (h >> (i * 3 + 5)) % 13;
    ctx.fillRect(px + 1 + gx, py + 1 + gy, 2, 1);
  }
  ctx.fillStyle = light;
  for (let i = 0; i < 3; i++) {
    const gx = (h >> (i * 4 + 2)) % 12, gy = (h >> (i * 4 + 7)) % 12;
    ctx.fillRect(px + 2 + gx, py + 2 + gy, 1, 2);
  }
  if (h % 7 === 0) { // Grasbüschel-„V“
    const gx = px + 3 + (h % 9), gy = py + 4 + ((h >> 4) % 8);
    ctx.fillStyle = dark;
    ctx.fillRect(gx, gy, 1, 2);
    ctx.fillRect(gx + 2, gy, 1, 2);
    ctx.fillRect(gx + 1, gy + 1, 1, 1);
  }

  // Sandkante zur Küste: heller Sand + dunklere Abschlusslinie
  const sand = '#f2dc96', sandDark = '#d9b96a';
  const s = 2;
  if (edges.n) { ctx.fillStyle = sand; ctx.fillRect(px, py, TILE, s); ctx.fillStyle = sandDark; ctx.fillRect(px, py, TILE, 1); }
  if (edges.s) { ctx.fillStyle = sand; ctx.fillRect(px, py + TILE - s, TILE, s); ctx.fillStyle = sandDark; ctx.fillRect(px, py + TILE - 1, TILE, 1); }
  if (edges.w) { ctx.fillStyle = sand; ctx.fillRect(px, py, s, TILE); ctx.fillStyle = sandDark; ctx.fillRect(px, py, 1, TILE); }
  if (edges.e) { ctx.fillStyle = sand; ctx.fillRect(px + TILE - s, py, s, TILE); ctx.fillStyle = sandDark; ctx.fillRect(px + TILE - 1, py, 1, TILE); }
}

function drawBridgeTile(ctx, px, py, tx, ty, phase) {
  drawSeaTile(ctx, px, py, tx, ty, phase, 1, null);
  // Holzsteg mit Planken, Nägeln und Randbalken
  ctx.fillStyle = '#dcae66';
  ctx.fillRect(px, py + 1, TILE, TILE - 2);
  ctx.fillStyle = '#c8964e';
  for (let i = 4; i < TILE; i += 4) ctx.fillRect(px, py + i, TILE, 1);
  ctx.fillStyle = '#a97a3c';
  ctx.fillRect(px, py + 1, TILE, 1);
  ctx.fillRect(px, py + TILE - 2, TILE, 1);
  const h = hash2(tx, ty);
  ctx.fillStyle = '#8a6230';
  ctx.fillRect(px + 2 + (h % 4), py + 5, 1, 1);
  ctx.fillRect(px + 10 + (h % 3), py + 10, 1, 1);
}

function drawTree(ctx, px, py, tx, ty) {
  const h = hash2(tx, ty);
  const g1 = h % 2 ? '#2e7d3b' : '#357a2e';   // Schattenlaub
  const g2 = h % 2 ? '#43a047' : '#4c9a3d';   // Hauptlaub
  const g3 = h % 2 ? '#66bb6a' : '#71b85e';   // Glanzlaub
  // Stamm
  ctx.fillStyle = '#5d4025';
  ctx.fillRect(px + 7, py + 10, 3, 5);
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(px + 8, py + 10, 1, 5);
  // Laubkrone in drei Ebenen
  ctx.fillStyle = g1;
  ctx.beginPath(); ctx.arc(px + 8, py + 7, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = g2;
  ctx.beginPath(); ctx.arc(px + 7, py + 6, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + 10.5, py + 7.5, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = g3;
  ctx.beginPath(); ctx.arc(px + 6, py + 4.5, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(px + 9, py + 4, 2, 1);
  // kleine Früchte/Blüten
  if (h % 3 === 0) {
    ctx.fillStyle = h % 6 ? '#e35b5b' : '#f4e04d';
    ctx.fillRect(px + 4 + (h % 5), py + 6 + ((h >> 3) % 3), 1, 1);
    ctx.fillRect(px + 9, py + 8, 1, 1);
  }
}

function drawMountain(ctx, px, py, tx, ty) {
  const h = hash2(tx, ty);
  // Fels mit zwei Grautönen
  ctx.fillStyle = '#7c7c8a';
  ctx.beginPath();
  ctx.moveTo(px + 8, py + 1);
  ctx.lineTo(px + 15, py + 14);
  ctx.lineTo(px + 1, py + 14);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#9a9aa8';
  ctx.beginPath();
  ctx.moveTo(px + 8, py + 1);
  ctx.lineTo(px + 12, py + 14);
  ctx.lineTo(px + 8, py + 14);
  ctx.closePath(); ctx.fill();
  // Schneekappe mit Zacken
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(px + 8, py + 1);
  ctx.lineTo(px + 10.5, py + 6);
  ctx.lineTo(px + 9, py + 5);
  ctx.lineTo(px + 8, py + 7);
  ctx.lineTo(px + 7, py + 5);
  ctx.lineTo(px + 5.5, py + 6);
  ctx.closePath(); ctx.fill();
  // Felsdetails
  ctx.fillStyle = '#68687a';
  ctx.fillRect(px + 5 + (h % 3), py + 9, 2, 1);
  ctx.fillRect(px + 9, py + 11, 2, 1);
}

function drawFlowers(ctx, px, py, tx, ty) {
  const h = hash2(tx, ty);
  const cols = ['#ff8fb2', '#ffd447', '#ff7043', '#c58fff', '#ffffff'];
  for (let i = 0; i < 3; i++) {
    const fx = px + 2 + ((h >> (i * 4)) % 11);
    const fy = py + 2 + ((h >> (i * 4 + 3)) % 10);
    // Stängel
    ctx.fillStyle = '#2e7d3b';
    ctx.fillRect(fx + 1, fy + 2, 1, 2);
    // Blüte mit hellem Zentrum
    ctx.fillStyle = cols[(h + i) % cols.length];
    ctx.fillRect(fx, fy, 3, 1);
    ctx.fillRect(fx + 1, fy - 1, 1, 3);
    ctx.fillStyle = '#fff6c9';
    ctx.fillRect(fx + 1, fy, 1, 1);
  }
}

function drawLandmarkBase(ctx, px, py) {
  // Steinplatten-Plaza
  ctx.fillStyle = '#e8e2d0';
  ctx.fillRect(px, py + 4, TILE, TILE - 4);
  ctx.fillStyle = '#d5cdb4';
  ctx.fillRect(px, py + 9, TILE, 1);
  ctx.fillRect(px + 5, py + 4, 1, 5);
  ctx.fillRect(px + 10, py + 10, 1, 6);
  ctx.fillStyle = '#c2b898';
  ctx.fillRect(px, py + TILE - 2, TILE, 2);
  ctx.fillStyle = '#f5f1e4';
  ctx.fillRect(px + 1, py + 4, TILE - 2, 1);
}

/* Pinnwand: Holztafel auf zwei Pfosten mit bunten Zetteln.
   Ragt oben 6px über die Kachel hinaus. */
function drawPinboard(ctx, px, py) {
  const top = py - 6;
  // Pfosten
  ctx.fillStyle = '#5d4025';
  ctx.fillRect(px + 2, py + 6, 2, 9);
  ctx.fillRect(px + 12, py + 6, 2, 9);
  // Tafel mit Rahmen
  ctx.fillStyle = '#8a6230';
  ctx.fillRect(px, top, TILE, 12);
  ctx.fillStyle = '#c8964e';
  ctx.fillRect(px + 1, top + 1, TILE - 2, 10);
  ctx.fillStyle = '#dcae66';
  ctx.fillRect(px + 2, top + 2, TILE - 4, 8);
  // Dach
  ctx.fillStyle = '#a9442e';
  ctx.fillRect(px - 1, top - 2, TILE + 2, 2);
  ctx.fillStyle = '#c65b40';
  ctx.fillRect(px - 1, top - 2, TILE + 2, 1);
  // Zettel mit Pins
  const papers = [
    { x: 3, y: 3, w: 4, h: 5, c: '#fffdf5', p: '#e63946' },
    { x: 8, y: 2, w: 5, h: 4, c: '#d9f0ff', p: '#2d6fc2' },
    { x: 9, y: 7, w: 4, h: 3, c: '#fff3b0', p: '#35a251' }
  ];
  for (const pp of papers) {
    ctx.fillStyle = pp.c;
    ctx.fillRect(px + pp.x, top + pp.y, pp.w, pp.h);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    for (let ly = 1; ly < pp.h - 1; ly += 2) ctx.fillRect(px + pp.x + 1, top + pp.y + ly, pp.w - 2, 1);
    ctx.fillStyle = pp.p;
    ctx.fillRect(px + pp.x + (pp.w >> 1), top + pp.y - 1, 1, 1);
  }
}
