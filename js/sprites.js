/* ============================================================
   hey EU – Pixel-Sprites (Charaktere im Retro-RPG-Stil)
   Zeichnet 12x13-Pixel-Figuren mit anpassbaren Farben.
   ============================================================ */

/* Zeichencodes: . leer | H Haare | S Haut | E Auge | T Shirt
   P Hose | O Schuhe | A Arm (Haut) */

const HEADS = {
  kurz: {
    down: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HSSSSSSH..',
      '..SSESSESS..',
      '..SSSSSSSS..',
      '...SSSSSS...'
    ],
    up: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..SHHHHHHS..',
      '...SSSSSS...'
    ],
    side: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHSSSSSS..',
      '..HHSSSESS..',
      '..HHSSSSSS..',
      '...SSSSSS...'
    ]
  },
  lang: {
    down: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHSSSSHH..',
      '..HSESSESH..',
      '..HSSSSSSH..',
      '..HHSSSSHH..'
    ],
    up: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHSSSSHH..'
    ],
    side: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHHSSSSS..',
      '..HHHSSESS..',
      '..HHHSSSSS..',
      '..HHSSSSS...'
    ]
  },
  wuschel: {
    down: [
      '..H.HHHH.H..',
      '..HHHHHHHH..',
      '.HHHHHHHHHH.',
      '..HSSSSSSH..',
      '..SSESSESS..',
      '..SSSSSSSS..',
      '...SSSSSS...'
    ],
    up: [
      '..H.HHHH.H..',
      '..HHHHHHHH..',
      '.HHHHHHHHHH.',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..SHHHHHHS..',
      '...SSSSSS...'
    ],
    side: [
      '..H.HHHH.H..',
      '..HHHHHHHH..',
      '.HHHHHHHHHH.',
      '..HHSSSSSS..',
      '..HHSSSESS..',
      '..HHSSSSSS..',
      '...SSSSSS...'
    ]
  },
  pony: {
    down: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HSESSESH..',
      '..SSSSSSSS..',
      '...SSSSSS...'
    ],
    up: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..SHHHHHHS..',
      '...SSSSSS...'
    ],
    side: [
      '...HHHHHH...',
      '..HHHHHHHH..',
      '..HHHHHHHH..',
      '..HHHHHHSS..',
      '..HHSSSESS..',
      '..HHSSSSSS..',
      '...SSSSSS...'
    ]
  }
};

const BODIES = {
  down: [
    [ // Frame 0 – stehen
      '..TTTTTTTT..',
      '.ATTTTTTTTA.',
      '.ATTTTTTTTA.',
      '..PPPPPPPP..',
      '..PPP..PPP..',
      '..OOO..OOO..'
    ],
    [ // Frame 1 – Schritt links
      '..TTTTTTTT..',
      '.ATTTTTTTTA.',
      '.ATTTTTTTTA.',
      '..PPPPPPPP..',
      '..PPP..PP...',
      '..OOO...OO..'
    ],
    [ // Frame 2 – Schritt rechts
      '..TTTTTTTT..',
      '.ATTTTTTTTA.',
      '.ATTTTTTTTA.',
      '..PPPPPPPP..',
      '...PP..PPP..',
      '..OO...OOO..'
    ]
  ],
  side: [
    [
      '...TTTTTT...',
      '...TTTTTTA..',
      '...TTTTTT...',
      '....PPPP....',
      '....PP.PP...',
      '....OO.OO...'
    ],
    [
      '...TTTTTT...',
      '...TTTTTTA..',
      '...TTTTTT...',
      '....PPPP....',
      '...PP..PP...',
      '...OO...OO..'
    ],
    [
      '...TTTTTT...',
      '...TTTTTTA..',
      '...TTTTTT...',
      '....PPPP....',
      '....PPPP....',
      '....OOOO....'
    ]
  ]
};
BODIES.up = BODIES.down;

const PANTS_COLOR = '#35507a';
const SHOE_COLOR = '#6b4a2b';
const EYE_COLOR = '#26221f';

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) * f));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) * f));
  const b = Math.max(0, Math.min(255, (n & 255) * f));
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

/* Zeichnet ein Zeilen-Template in einen Kontext */
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

/* Erstellt alle Frames einer Figur.
   cfg = { skin, hair, hairStyle, shirt }
   Ergebnis: { 'down0': canvas, 'down1', ..., 'left0', ... } (12x13) */
function makeCharacterSprites(cfg) {
  const colors = {
    H: cfg.hair, S: cfg.skin, A: cfg.skin, E: EYE_COLOR,
    T: cfg.shirt, P: PANTS_COLOR, O: SHOE_COLOR
  };
  const head = HEADS[cfg.hairStyle] || HEADS.kurz;
  const frames = {};

  for (const dir of ['down', 'up', 'side']) {
    for (let f = 0; f < 3; f++) {
      const cv = document.createElement('canvas');
      cv.width = 12; cv.height = 13;
      const ctx = cv.getContext('2d');
      paintTemplate(ctx, head[dir], colors, 0, 0);
      paintTemplate(ctx, BODIES[dir][f], colors, 0, 7);
      frames[(dir === 'side' ? 'right' : dir) + f] = cv;
    }
  }
  // Links = rechts gespiegelt
  for (let f = 0; f < 3; f++) {
    const src = frames['right' + f];
    const cv = document.createElement('canvas');
    cv.width = 12; cv.height = 13;
    const ctx = cv.getContext('2d');
    ctx.translate(12, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(src, 0, 0);
    frames['left' + f] = cv;
  }
  return frames;
}

/* Zufalls-Charakter für NPCs */
function randomCharConfig(rng) {
  const pick = a => a[Math.floor(rng() * a.length)];
  return {
    skin: pick(SKIN_TONES),
    hair: pick(HAIR_COLORS),
    hairStyle: pick(HAIR_STYLES).id,
    shirt: pick(SHIRT_COLORS)
  };
}

/* ---------- Kachel-Grafiken (auf die Weltkarte gemalt) ---------- */

function drawSeaTile(ctx, px, py, tx, ty, phase) {
  ctx.fillStyle = '#4aa3e8';
  ctx.fillRect(px, py, TILE, TILE);
  // sanfte Wellen, pseudo-zufällig verteilt, zwei Phasen für Animation
  const h = (tx * 73 + ty * 149 + 37) % 97;
  if (h % 7 === phase * 3) {
    ctx.fillStyle = '#7ec3f2';
    const wy = py + 4 + (h % 8);
    ctx.fillRect(px + 2 + (h % 5), wy, 6, 1);
    ctx.fillRect(px + 4 + (h % 5), wy + 1, 3, 1);
  }
  if (h % 11 === phase * 5) {
    ctx.fillStyle = '#aedcf7';
    ctx.fillRect(px + 9 - (h % 4), py + 11 - (h % 6), 4, 1);
  }
}

function drawGrassTile(ctx, px, py, tx, ty, color, edges) {
  ctx.fillStyle = color;
  ctx.fillRect(px, py, TILE, TILE);
  // leichte Struktur
  const h = (tx * 31 + ty * 57) % 13;
  ctx.fillStyle = shade(color, 1.08);
  ctx.fillRect(px + (h % 6) + 2, py + ((h * 3) % 6) + 2, 2, 1);
  ctx.fillRect(px + ((h * 5) % 9) + 3, py + ((h * 7) % 9) + 4, 1, 2);
  // Sandkanten zum Meer
  ctx.fillStyle = '#f0d78c';
  const s = 3;
  if (edges.n) ctx.fillRect(px, py, TILE, s);
  if (edges.s) ctx.fillRect(px, py + TILE - s, TILE, s);
  if (edges.w) ctx.fillRect(px, py, s, TILE);
  if (edges.e) ctx.fillRect(px + TILE - s, py, s, TILE);
}

function drawBridgeTile(ctx, px, py, tx, ty, phase) {
  drawSeaTile(ctx, px, py, tx, ty, phase);
  // Holzsteg
  ctx.fillStyle = '#d9a95f';
  ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
  ctx.fillStyle = '#c08e46';
  for (let i = 3; i < TILE - 1; i += 4) ctx.fillRect(px + 1, py + i, TILE - 2, 1);
  ctx.fillStyle = '#a2743a';
  ctx.fillRect(px + 1, py + 1, 1, TILE - 2);
  ctx.fillRect(px + TILE - 2, py + 1, 1, TILE - 2);
}

function drawTree(ctx, px, py) {
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(px + 7, py + 10, 3, 5);
  ctx.fillStyle = '#3e9645';
  ctx.beginPath();
  ctx.arc(px + 8, py + 7, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#55b25c';
  ctx.beginPath();
  ctx.arc(px + 6.5, py + 5.5, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawMountain(ctx, px, py) {
  ctx.fillStyle = '#8d8d99';
  ctx.beginPath();
  ctx.moveTo(px + 8, py + 1);
  ctx.lineTo(px + 15, py + 14);
  ctx.lineTo(px + 1, py + 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(px + 8, py + 1);
  ctx.lineTo(px + 11, py + 7);
  ctx.lineTo(px + 5, py + 7);
  ctx.closePath();
  ctx.fill();
}

function drawFlowers(ctx, px, py, tx, ty) {
  const h = tx * 17 + ty * 29;
  const cols = ['#ff8fb2', '#ffd447', '#ff7043', '#c58fff'];
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = cols[(h + i) % cols.length];
    ctx.fillRect(px + 3 + ((h + i * 5) % 10), py + 3 + ((h * (i + 2)) % 10), 2, 2);
  }
}

function drawLandmarkBase(ctx, px, py) {
  ctx.fillStyle = '#e8e2d0';
  ctx.fillRect(px + 1, py + 6, TILE - 2, TILE - 7);
  ctx.fillStyle = '#cfc6ac';
  ctx.fillRect(px + 1, py + TILE - 3, TILE - 2, 2);
}
