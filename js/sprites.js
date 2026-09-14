/* ============================================================
   hey EU – Figuren
   Die Figuren werden gezeichnet (nicht aus Pixelrastern gebaut),
   damit sie zum Stil der Wahrzeichen passen und in jeder Größe
   sauber aussehen.
   Zeichenraum: x von -11 bis 11, Füße bei y = 0, Kopf bei y = -30.
   ============================================================ */

const CHAR_UW = 22, CHAR_UH = 32;     // Zeichenraum in Einheiten
const CHAR_PX = 3;                    // Pixel je Einheit beim Vorzeichnen
const SPRITE_W = CHAR_UW * CHAR_PX;
const SPRITE_H = CHAR_UH * CHAR_PX;

const OUTLINE = '#3a2f28';
const PANTS = '#3f5d92', PANTS_D = '#32496f';
const SHOES = '#5a4030', SHOES_D = '#452f22';

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) * f));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) * f));
  const b = Math.max(0, Math.min(255, (n & 255) * f));
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

/* abgerundetes Rechteck */
function _rr(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

function _blob(ctx, pts, fill, stroke) {
  ctx.beginPath();
  pts.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](p[0], p[1]));
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

/* ---------- Frisuren ----------
   Jede Frisur zeichnet die Haare um einen Kopf mit Mittelpunkt (0, cy)
   und Radius r. dir: 'down' | 'up' | 'side' */
const HAIR = {
  kurz(ctx, cy, r, dir, col, colL) {
    if (dir === 'up') {
      // Von hinten sieht man nur den Hinterkopf – eine runde Haarkappe
      ctx.beginPath();
      ctx.ellipse(0, cy, r + 0.4, r * 1.06, 0, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill();
      ctx.strokeStyle = OUTLINE; ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(-r * 0.32, cy - r * 0.42, r * 0.3, r * 0.42, -0.35, 0, Math.PI * 2);
      ctx.fillStyle = colL; ctx.fill();
      return;
    }
    // Von vorn und von der Seite: Haaransatz über der Stirn
    ctx.beginPath();
    ctx.arc(0, cy, r + 0.4, Math.PI * 0.94, Math.PI * 2.06);
    ctx.quadraticCurveTo(r * 0.75, cy + r * 0.34, r * 0.2, cy - r * 0.12);
    ctx.quadraticCurveTo(-r * 0.4, cy + r * 0.22, -r * 0.78, cy - r * 0.3);
    ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUTLINE; ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-r * 0.35, cy - r * 0.55, r * 0.32, r * 0.19, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = colL; ctx.fill();
  },
  lang(ctx, cy, r, dir, col, colL) {
    // weiche Strähnen, die das Gesicht rahmen und bis auf die Schultern fallen
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sx * r * 0.55, cy - r * 0.5);
      ctx.quadraticCurveTo(sx * (r + 0.8), cy + r * 0.25, sx * (r + 0.55), cy + r * 1.35);
      ctx.quadraticCurveTo(sx * (r + 0.02), cy + r * 1.58, sx * r * 0.44, cy + r * 1.18);
      ctx.quadraticCurveTo(sx * r * 0.62, cy + r * 0.35, sx * r * 0.42, cy - r * 0.45);
      ctx.closePath();
      ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUTLINE; ctx.stroke();
    }
    HAIR.kurz(ctx, cy, r, dir, col, colL);
  },
  wuschel(ctx, cy, r, dir, col, colL) {
    for (const [dx, dy, rr] of [[-r * 0.8, -r * 0.55, r * 0.55], [-r * 0.25, -r * 0.85, r * 0.6],
                                [r * 0.35, -r * 0.8, r * 0.58], [r * 0.85, -r * 0.45, r * 0.5]]) {
      ctx.beginPath(); ctx.arc(dx, cy + dy, rr, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUTLINE; ctx.stroke();
    }
    HAIR.kurz(ctx, cy, r, dir, col, colL);
    for (const [dx, dy, rr] of [[-r * 0.8, -r * 0.55, r * 0.5], [-r * 0.25, -r * 0.85, r * 0.55],
                                [r * 0.35, -r * 0.8, r * 0.53], [r * 0.85, -r * 0.45, r * 0.45]]) {
      ctx.beginPath(); ctx.arc(dx, cy + dy, rr, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(-r * 0.4, cy - r * 0.75, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = colL; ctx.fill();
  },
  pony(ctx, cy, r, dir, col, colL) {
    HAIR.kurz(ctx, cy, r, dir, col, colL);
    if (dir === 'up') return;
    // Pony in weichen Spitzen – endet oberhalb der Augen
    ctx.beginPath();
    ctx.moveTo(-r * 0.99, cy - r * 0.55);
    ctx.lineTo(r * 0.99, cy - r * 0.55);
    ctx.quadraticCurveTo(r * 0.82, cy - r * 0.02, r * 0.42, cy - r * 0.2);
    ctx.quadraticCurveTo(r * 0.12, cy + r * 0.08, -r * 0.18, cy - r * 0.18);
    ctx.quadraticCurveTo(-r * 0.55, cy + r * 0.02, -r * 0.99, cy - r * 0.55);
    ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUTLINE; ctx.stroke();
  },
  zopf(ctx, cy, r, dir, col, colL) {
    // zwei Zöpfe, die seitlich nach unten hängen
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sx * r * 0.62, cy - r * 0.3);
      ctx.quadraticCurveTo(sx * (r + 1.25), cy + r * 0.35, sx * (r + 0.95), cy + r * 1.25);
      ctx.quadraticCurveTo(sx * (r + 0.35), cy + r * 1.45, sx * r * 0.62, cy + r * 1.05);
      ctx.quadraticCurveTo(sx * r * 0.62, cy + r * 0.35, sx * r * 0.45, cy - r * 0.25);
      ctx.closePath();
      ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUTLINE; ctx.stroke();
      // Haargummi am Zopfende
      ctx.beginPath();
      ctx.ellipse(sx * (r + 0.78), cy + r * 1.12, r * 0.2, r * 0.14, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#e8577e'; ctx.fill();
      ctx.strokeStyle = OUTLINE; ctx.stroke();
    }
    HAIR.kurz(ctx, cy, r, dir, col, colL);
  },
  locken(ctx, cy, r, dir, col, colL) {
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * 0.98 + i * (Math.PI * 1.04) / 8;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r * 0.95, cy + Math.sin(a) * r * 0.95, r * 0.36, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUTLINE; ctx.stroke();
    }
    HAIR.kurz(ctx, cy, r, dir, col, colL);
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * 0.98 + i * (Math.PI * 1.04) / 8;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r * 0.95, cy + Math.sin(a) * r * 0.95, r * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 ? col : colL; ctx.fill();
    }
  }
};

/* ---------- Figur zeichnen ----------
   dir: 'down' | 'up' | 'side' (Blick nach rechts)
   pose: 0 = stehen, 1/2 = Schritt, 3 = Sprung, 4 = winken */
function drawCharacter(ctx, cfg, dir, pose) {
  const skin = cfg.skin, skinD = shade(cfg.skin, 0.86);
  const hairC = cfg.hair, hairL = shade(cfg.hair, 1.42);
  const shirt = cfg.shirt, shirtD = shade(cfg.shirt, 0.8), shirtL = shade(cfg.shirt, 1.12);
  const hairFn = HAIR[cfg.hairStyle] || HAIR.kurz;

  ctx.lineWidth = 1.05;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = OUTLINE;

  const jumping = pose === 3;
  const bob = pose === 1 || pose === 2 ? 0.5 : 0;   // leichtes Wippen beim Gehen
  const yOff = -bob;

  ctx.save();
  ctx.translate(0, yOff);

  /* --- Beine --- */
  const legY = -11.5, legH = 11.5;
  let lx1 = -3.4, lx2 = 1.0, lh1 = legH, lh2 = legH;
  if (pose === 1) { lx1 = -5.2; lx2 = 1.9; lh1 = legH - 1.2; lh2 = legH - 1.2; }
  else if (pose === 2) { lx1 = -2.0; lx2 = 2.9; lh1 = legH - 1.2; lh2 = legH - 1.2; }
  else if (jumping) { lx1 = -4.2; lx2 = 1.2; lh1 = legH - 3.6; lh2 = legH - 4.6; }

  const drawLeg = (x, h, pantCol, shoeCol) => {
    _rr(ctx, x, legY, 2.6, h - 1.6, 1.1, pantCol, OUTLINE);
    _rr(ctx, x - 0.5, legY + h - 2.6, 3.6, 2.6, 1.1, shoeCol, OUTLINE);
  };
  if (dir === 'side') {
    drawLeg(lx1 + 1.6, lh1, PANTS_D, SHOES_D);
    drawLeg(lx2 - 1.0, lh2, PANTS, SHOES);
  } else {
    drawLeg(lx1, lh1, PANTS, SHOES);
    drawLeg(lx2, lh2, PANTS_D, SHOES_D);
  }

  /* --- Körper --- */
  const bodyTop = -20.5, bodyH = 9.6;
  _rr(ctx, -5.2, bodyTop, 10.4, bodyH, 3.2, shirt, OUTLINE);
  // Schattenseite und Lichtkante
  ctx.save();
  _rr(ctx, -5.2, bodyTop, 10.4, bodyH, 3.2, null, null);
  ctx.clip();
  ctx.fillStyle = shirtD;
  ctx.fillRect(dir === 'side' ? -5.2 : 2.0, bodyTop, 3.2, bodyH);
  ctx.fillStyle = shirtL;
  ctx.fillRect(-5.2, bodyTop, 2.2, bodyH * 0.55);
  ctx.restore();

  /* --- Arme --- */
  const armY = bodyTop + 1.4;
  const drawArm = (x, swing, col) => {
    ctx.save();
    ctx.translate(x, armY);
    ctx.rotate(swing);
    _rr(ctx, -1.35, 0, 2.7, 7.4, 1.3, col, OUTLINE);
    ctx.beginPath();
    ctx.arc(0, 7.4, 1.55, 0, Math.PI * 2);
    ctx.fillStyle = skin; ctx.fill(); ctx.strokeStyle = OUTLINE; ctx.stroke();
    ctx.restore();
  };
  let swingA = 0, swingB = 0;
  if (pose === 1) { swingA = 0.5; swingB = -0.5; }
  else if (pose === 2) { swingA = -0.5; swingB = 0.5; }
  else if (jumping) { swingA = 2.5; swingB = -2.5; }
  else if (pose === 4) { swingA = 0.25; swingB = -2.75; }

  if (dir === 'side') {
    drawArm(2.4, swingB * 0.8, shirt);
  } else {
    drawArm(-5.4, swingA, shirtL === shirt ? shirt : shirt);
    drawArm(5.4, swingB, shirtD);
  }

  /* --- Kopf --- */
  const headR = 7.2, headY = -27.4;
  // Hals
  _rr(ctx, -1.7, headY + headR - 1.4, 3.4, 3.2, 1.2, skinD, OUTLINE);
  // Gesichtsfläche
  ctx.beginPath();
  ctx.ellipse(0, headY, headR, headR * 1.04, 0, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.strokeStyle = OUTLINE; ctx.stroke();
  // Schattenseite im Gesicht
  ctx.save();
  ctx.beginPath(); ctx.ellipse(0, headY, headR, headR * 1.04, 0, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = skinD;
  ctx.fillRect(dir === 'side' ? -headR : headR * 0.42, headY - headR, headR * 0.6, headR * 2.2);
  ctx.restore();

  // Ohren
  if (dir !== 'up') {
    const ears = dir === 'side' ? [-headR * 0.25] : [-headR, headR];
    for (const ex of ears) {
      ctx.beginPath();
      ctx.arc(ex, headY + 0.6, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = skin; ctx.fill(); ctx.strokeStyle = OUTLINE; ctx.stroke();
    }
  }

  // Haare
  hairFn(ctx, headY, headR, dir, hairC, hairL);

  // Gesicht
  if (dir === 'down') {
    const eye = (x) => {
      ctx.beginPath(); ctx.ellipse(x, headY + 1.1, 1.05, 1.35, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#2b2320'; ctx.fill();
      ctx.beginPath(); ctx.arc(x - 0.35, headY + 0.6, 0.42, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff'; ctx.fill();
    };
    eye(-2.5); eye(2.5);
    // Wangen
    ctx.fillStyle = 'rgba(232,110,110,0.32)';
    ctx.beginPath(); ctx.ellipse(-4.3, headY + 3.1, 1.5, 0.95, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4.3, headY + 3.1, 1.5, 0.95, 0, 0, Math.PI * 2); ctx.fill();
    // Mund
    ctx.strokeStyle = '#8a4a3c'; ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.arc(0, headY + 2.4, 1.75, jumping ? 0.15 : 0.35, Math.PI - (jumping ? 0.15 : 0.35));
    ctx.stroke();
    ctx.lineWidth = 1.05;
  } else if (dir === 'side') {
    ctx.beginPath(); ctx.ellipse(3.1, headY + 1.1, 1, 1.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#2b2320'; ctx.fill();
    ctx.beginPath(); ctx.arc(2.8, headY + 0.6, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff'; ctx.fill();
    ctx.fillStyle = 'rgba(232,110,110,0.3)';
    ctx.beginPath(); ctx.ellipse(5, headY + 3, 1.3, 0.85, 0, 0, Math.PI * 2); ctx.fill();
    // Nase und Mund im Profil
    ctx.strokeStyle = '#8a4a3c'; ctx.lineWidth = 0.75;
    ctx.beginPath(); ctx.arc(4.6, headY + 2.6, 1.2, -0.3, 1.1); ctx.stroke();
    ctx.lineWidth = 1.05;
  }

  ctx.restore();
}

/* ---------- Vorgezeichnete Einzelbilder ---------- */

const CHAR_POSES = { stand: 0, walk1: 1, walk2: 2, jump: 3, wave: 4 };

function renderCharFrame(cfg, dir, pose, flip) {
  const cv = document.createElement('canvas');
  cv.width = SPRITE_W; cv.height = SPRITE_H;
  const ctx = cv.getContext('2d');
  ctx.save();
  ctx.translate(SPRITE_W / 2, SPRITE_H - CHAR_PX);
  ctx.scale(CHAR_PX, CHAR_PX);
  if (flip) ctx.scale(-1, 1);
  drawCharacter(ctx, cfg, dir, pose);
  ctx.restore();
  return cv;
}

const CHAR_DIRS = { down: ['down', false], up: ['up', false], right: ['side', false], left: ['side', true] };

/* Bildersatz einer Figur.
   Wichtig: Die Einzelbilder entstehen erst, wenn sie zum ersten Mal
   gebraucht werden. Alle 20 Bilder für alle 99 Figuren im Voraus zu
   zeichnen wären rund 48 MB Grafikspeicher – daran scheitern Handys.
   Figuren mit gleichem Aussehen teilen sich denselben Satz. */
const _spriteSets = new Map();

function charKey(cfg) {
  return [cfg.skin, cfg.hair, cfg.hairStyle, cfg.shirt].join('|');
}

function makeCharacterSprites(cfg) {
  const key = charKey(cfg);
  let satz = _spriteSets.get(key);
  if (satz) return satz;

  const cache = {};
  satz = {
    get(dirKey, poseName) {
      const k = dirKey + '_' + poseName;
      let bild = cache[k];
      if (!bild) {
        const dir = CHAR_DIRS[dirKey] || CHAR_DIRS.down;
        bild = renderCharFrame(cfg, dir[0], (CHAR_POSES[poseName] || 0), dir[1]);
        cache[k] = bild;
      }
      return bild;
    }
  };
  _spriteSets.set(key, satz);
  // Bei sehr vielen verschiedenen Figuren den ältesten Satz verwerfen
  if (_spriteSets.size > 120) {
    _spriteSets.delete(_spriteSets.keys().next().value);
  }
  return satz;
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
