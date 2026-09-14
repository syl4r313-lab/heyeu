/* ============================================================
   hey EU – Gelände
   Gras, Küste, Bäume, Berge, Wege, Häuser und Pinnwände werden
   gezeichnet (keine Pixelraster). Alle Funktionen bekommen die
   linke obere Ecke der Kachel und die Kachelgröße s in Pixeln.
   ============================================================ */

function hash2(x, y) { return ((x * 73856093) ^ (y * 19349663) ^ 0x9e3779b9) >>> 0; }
function rnd01(h, i) { return (((h >> (i * 3)) & 1023) / 1023); }

function tShade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) * f));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) * f));
  const b = Math.max(0, Math.min(255, (n & 255) * f));
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

/* weicher Schlagschatten unter Objekten */
function tShadow(ctx, cx, cy, rx, ry) {
  ctx.fillStyle = 'rgba(40,60,30,0.2)';
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

/* ---------- Gras ---------- */
function drawGrass(ctx, x, y, s, tx, ty, color) {
  const h = hash2(tx, ty);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, s, s);

  // große, weiche Farbflecken für Tiefe
  const light = tShade(color, 1.07), dark = tShade(color, 0.93);
  ctx.fillStyle = (h & 1) ? light : dark;
  ctx.beginPath();
  ctx.ellipse(x + rnd01(h, 0) * s, y + rnd01(h, 1) * s, s * 0.42, s * 0.3,
    rnd01(h, 2) * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = (h & 2) ? dark : light;
  ctx.beginPath();
  ctx.ellipse(x + rnd01(h, 3) * s, y + rnd01(h, 4) * s, s * 0.3, s * 0.22,
    rnd01(h, 5) * 3, 0, Math.PI * 2);
  ctx.fill();

  // Grasbüschel als kleine Bögen – sparsam, sonst wirkt die Wiese unruhig
  const tufts = (h % 5 === 0) ? 2 : (h % 2);
  ctx.strokeStyle = tShade(color, 0.8);
  ctx.lineWidth = Math.max(0.7, s * 0.03);
  ctx.lineCap = 'round';
  for (let i = 0; i < tufts; i++) {
    const gx = x + rnd01(h, i + 6) * s * 0.88 + s * 0.06;
    const gy = y + rnd01(h, i + 9) * s * 0.88 + s * 0.06;
    const gh = s * (0.1 + rnd01(h, i + 12) * 0.07);
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.quadraticCurveTo(gx - gh * 0.45, gy - gh * 0.7, gx - gh * 0.2, gy - gh);
    ctx.moveTo(gx, gy);
    ctx.quadraticCurveTo(gx + gh * 0.45, gy - gh * 0.7, gx + gh * 0.25, gy - gh);
    ctx.stroke();
  }
}

/* Küstenkante: Sandstreifen und Brandungssaum nach außen */
function drawCoast(ctx, x, y, s, edges) {
  const sand = '#f0dea8', sandD = '#dcc283';
  const band = s * 0.2;
  ctx.save();
  if (edges.n) {
    ctx.fillStyle = sand; ctx.fillRect(x, y, s, band);
    ctx.fillStyle = sandD; ctx.fillRect(x, y, s, band * 0.35);
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillRect(x, y - s * 0.09, s, s * 0.09);
  }
  if (edges.s) {
    ctx.fillStyle = sand; ctx.fillRect(x, y + s - band, s, band);
    ctx.fillStyle = sandD; ctx.fillRect(x, y + s - band * 0.35, s, band * 0.35);
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillRect(x, y + s, s, s * 0.09);
  }
  if (edges.w) {
    ctx.fillStyle = sand; ctx.fillRect(x, y, band, s);
    ctx.fillStyle = sandD; ctx.fillRect(x, y, band * 0.35, s);
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillRect(x - s * 0.09, y, s * 0.09, s);
  }
  if (edges.e) {
    ctx.fillStyle = sand; ctx.fillRect(x + s - band, y, band, s);
    ctx.fillStyle = sandD; ctx.fillRect(x + s - band * 0.35, y, band * 0.35, s);
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillRect(x + s, y, s * 0.09, s);
  }
  ctx.restore();
}

/* ---------- Brücke / Steg ---------- */
function drawBridge(ctx, x, y, s, tx, ty, horizontal) {
  const h = hash2(tx, ty);
  // Pfosten im Wasser
  ctx.fillStyle = 'rgba(30,60,90,0.25)';
  ctx.fillRect(x + s * 0.1, y + s * 0.82, s * 0.8, s * 0.16);
  const plank = '#d8a862', plankD = '#b9853f', edge = '#8f6330';
  ctx.fillStyle = plank;
  ctx.fillRect(x, y + s * 0.06, s, s * 0.88);
  // Planken quer zur Laufrichtung
  ctx.fillStyle = plankD;
  const n = 4;
  for (let i = 0; i < n; i++) {
    if (horizontal) ctx.fillRect(x + i * s / n, y + s * 0.06, s * 0.055, s * 0.88);
    else ctx.fillRect(x, y + s * 0.06 + i * s * 0.88 / n, s, s * 0.05);
  }
  // Randbalken
  ctx.fillStyle = edge;
  ctx.fillRect(x, y + s * 0.06, s, s * 0.07);
  ctx.fillRect(x, y + s * 0.87, s, s * 0.07);
  // Maserung
  ctx.fillStyle = 'rgba(120,80,40,0.35)';
  ctx.fillRect(x + rnd01(h, 0) * s * 0.7, y + s * 0.3, s * 0.18, s * 0.04);
  ctx.fillRect(x + rnd01(h, 2) * s * 0.7, y + s * 0.62, s * 0.14, s * 0.04);
}

/* ---------- Bäume ---------- */
function drawTree(ctx, x, y, s, tx, ty, kind) {
  const h = hash2(tx, ty);
  const cx = x + s * 0.5, base = y + s * 0.92;
  tShadow(ctx, cx + s * 0.06, base, s * 0.3, s * 0.11);
  // Stamm
  ctx.strokeStyle = '#7a5433';
  ctx.lineWidth = s * 0.1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, base);
  ctx.quadraticCurveTo(cx - s * 0.03, base - s * 0.22, cx, base - s * 0.38);
  ctx.stroke();

  if (kind === 'nadel') {
    const tones = ['#2c6140', '#35734a', '#3f8355'];
    for (let i = 0; i < 3; i++) {
      const w = s * (0.42 - i * 0.09), ty2 = base - s * (0.3 + i * 0.22);
      ctx.fillStyle = tones[i];
      ctx.beginPath();
      ctx.moveTo(cx - w, ty2);
      ctx.lineTo(cx + w, ty2);
      ctx.lineTo(cx, ty2 - s * 0.36);
      ctx.closePath(); ctx.fill();
    }
    return;
  }
  // Laubkrone aus mehreren Ballen
  const g1 = (h & 1) ? '#2f7a3e' : '#38753a';
  const g2 = (h & 1) ? '#44a04d' : '#4c9a47';
  const g3 = (h & 1) ? '#63bd68' : '#6cb85e';
  const cy = base - s * 0.56;
  ctx.fillStyle = g1;
  ctx.beginPath(); ctx.arc(cx, cy, s * 0.36, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx - s * 0.22, cy + s * 0.1, s * 0.24, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + s * 0.23, cy + s * 0.08, s * 0.23, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = g2;
  ctx.beginPath(); ctx.arc(cx - s * 0.06, cy - s * 0.04, s * 0.28, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + s * 0.18, cy + s * 0.02, s * 0.18, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = g3;
  ctx.beginPath(); ctx.arc(cx - s * 0.14, cy - s * 0.13, s * 0.15, 0, Math.PI * 2); ctx.fill();
  // Früchte
  if (h % 4 === 0) {
    ctx.fillStyle = (h % 8) ? '#e4574f' : '#f2cf46';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(cx + (rnd01(h, i) - 0.5) * s * 0.5, cy + (rnd01(h, i + 4) - 0.4) * s * 0.45,
        s * 0.045, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ---------- Busch ---------- */
function drawBush(ctx, x, y, s, tx, ty) {
  const h = hash2(tx, ty);
  const cx = x + s * 0.5, base = y + s * 0.82;
  tShadow(ctx, cx + s * 0.04, base + s * 0.04, s * 0.26, s * 0.08);
  const c1 = '#3c7f42', c2 = '#4f9c4f', c3 = '#6bb865';
  ctx.fillStyle = c1;
  ctx.beginPath(); ctx.arc(cx - s * 0.16, base - s * 0.12, s * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + s * 0.16, base - s * 0.1, s * 0.18, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = c2;
  ctx.beginPath(); ctx.arc(cx, base - s * 0.22, s * 0.22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = c3;
  ctx.beginPath(); ctx.arc(cx - s * 0.08, base - s * 0.3, s * 0.1, 0, Math.PI * 2); ctx.fill();
  if (h % 3 === 0) {
    ctx.fillStyle = '#d95f8a';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(cx + (rnd01(h, i) - 0.5) * s * 0.4, base - s * 0.15 - rnd01(h, i + 3) * s * 0.2,
        s * 0.04, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ---------- Blumen ---------- */
function drawFlowers(ctx, x, y, s, tx, ty) {
  const h = hash2(tx, ty);
  const cols = ['#ff8fb2', '#ffd447', '#ff8a52', '#c58fff', '#ffffff', '#7ec8ff'];
  const n = 3 + (h % 3);
  for (let i = 0; i < n; i++) {
    const fx = x + s * 0.14 + rnd01(h, i) * s * 0.72;
    const fy = y + s * 0.2 + rnd01(h, i + 5) * s * 0.66;
    const r = s * 0.055;
    ctx.strokeStyle = '#4a8a3c';
    ctx.lineWidth = s * 0.022;
    ctx.beginPath();
    ctx.moveTo(fx, fy + r * 2.6); ctx.lineTo(fx, fy + r * 0.6);
    ctx.stroke();
    const col = cols[(h + i) % cols.length];
    ctx.fillStyle = col;
    for (let k = 0; k < 5; k++) {
      const a = k * Math.PI * 2 / 5 - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(fx + Math.cos(a) * r, fy + Math.sin(a) * r, r * 0.82, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffe88a';
    ctx.beginPath(); ctx.arc(fx, fy, r * 0.6, 0, Math.PI * 2); ctx.fill();
  }
}

/* ---------- Felsen ---------- */
function drawRock(ctx, x, y, s, tx, ty) {
  const h = hash2(tx, ty);
  const cx = x + s * 0.5, base = y + s * 0.82;
  tShadow(ctx, cx + s * 0.05, base + s * 0.03, s * 0.28, s * 0.09);
  const pts = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = Math.PI + i * Math.PI / (n - 1);
    const r = s * (0.28 + rnd01(h, i) * 0.1);
    pts.push([cx + Math.cos(a) * r, base + Math.sin(a) * r * 0.95]);
  }
  ctx.fillStyle = '#8b8a90';
  ctx.beginPath();
  pts.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](p[0], p[1]));
  ctx.lineTo(pts[pts.length - 1][0], base);
  ctx.lineTo(pts[0][0], base);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#a5a4ab';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], base);
  for (let i = 0; i < Math.ceil(n / 2); i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.lineTo(cx, base);
  ctx.closePath(); ctx.fill();
}

/* ---------- Berg ---------- */
function drawMountain(ctx, x, y, s, tx, ty) {
  const h = hash2(tx, ty);
  const cx = x + s * 0.5, base = y + s * 0.95;
  const peak = base - s * 1.05, halfW = s * 0.52;
  tShadow(ctx, cx + s * 0.1, base, s * 0.5, s * 0.12);
  ctx.fillStyle = '#7f838f';
  ctx.beginPath();
  ctx.moveTo(cx - halfW, base);
  ctx.lineTo(cx - s * 0.06, peak);
  ctx.lineTo(cx + halfW, base);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#676b78';
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.06, peak);
  ctx.lineTo(cx + halfW, base);
  ctx.lineTo(cx + s * 0.08, base);
  ctx.closePath(); ctx.fill();
  // Schneekappe
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.06, peak);
  ctx.lineTo(cx + s * 0.2, peak + s * 0.34);
  ctx.lineTo(cx + s * 0.08, peak + s * 0.3);
  ctx.lineTo(cx - s * 0.02, peak + s * 0.4);
  ctx.lineTo(cx - s * 0.13, peak + s * 0.28);
  ctx.lineTo(cx - s * 0.26, peak + s * 0.36);
  ctx.closePath(); ctx.fill();
  if (h % 3 === 0) {
    ctx.strokeStyle = 'rgba(70,74,86,0.7)';
    ctx.lineWidth = s * 0.02;
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.2, base - s * 0.2);
    ctx.lineTo(cx - s * 0.1, base - s * 0.5);
    ctx.stroke();
  }
}

/* ---------- Weg ---------- */
function drawPath(ctx, x, y, s, tx, ty) {
  const h = hash2(tx, ty);
  ctx.fillStyle = '#d8c49a';
  ctx.fillRect(x, y, s, s);
  ctx.fillStyle = '#c9b184';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(x + rnd01(h, i) * s, y + rnd01(h, i + 5) * s,
      s * 0.12, s * 0.08, rnd01(h, i + 9) * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.fillRect(x, y, s, s * 0.06);
}

/* ---------- Haus ---------- */
function drawHouse(ctx, x, y, s, tx, ty, roofCol) {
  const h = hash2(tx, ty);
  const cx = x + s * 0.5, base = y + s * 0.95;
  tShadow(ctx, cx + s * 0.08, base, s * 0.4, s * 0.1);
  const wallTones = ['#f4e8d0', '#efe0c4', '#e8dcc8', '#f2ead8'];
  const wall = wallTones[h % wallTones.length];
  const w = s * 0.74, hh = s * 0.56;
  ctx.fillStyle = wall;
  ctx.fillRect(cx - w / 2, base - hh, w, hh);
  ctx.fillStyle = tShade(wall, 0.88);
  ctx.fillRect(cx + w * 0.18, base - hh, w * 0.32, hh);
  // Dach
  const roof = roofCol || ((h & 1) ? '#c1452f' : '#a8553c');
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.62, base - hh);
  ctx.lineTo(cx + w * 0.62, base - hh);
  ctx.lineTo(cx + w * 0.3, base - hh - s * 0.34);
  ctx.lineTo(cx - w * 0.3, base - hh - s * 0.34);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = tShade(roof, 1.18);
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.62, base - hh);
  ctx.lineTo(cx - w * 0.02, base - hh);
  ctx.lineTo(cx - w * 0.02, base - hh - s * 0.34);
  ctx.lineTo(cx - w * 0.3, base - hh - s * 0.34);
  ctx.closePath(); ctx.fill();
  // Tür und Fenster
  ctx.fillStyle = '#8a5f34';
  ctx.fillRect(cx - w * 0.12, base - hh * 0.62, w * 0.24, hh * 0.62);
  ctx.fillStyle = '#ffe9a8';
  ctx.fillRect(cx - w * 0.42, base - hh * 0.82, w * 0.2, hh * 0.3);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(cx - w * 0.33, base - hh * 0.82, w * 0.02, hh * 0.3);
}

/* ---------- Pinnwand ---------- */
function drawPinboard(ctx, x, y, s) {
  const cx = x + s * 0.5, base = y + s * 0.95;
  tShadow(ctx, cx + s * 0.06, base, s * 0.34, s * 0.09);
  // Pfosten
  ctx.fillStyle = '#7a5433';
  ctx.fillRect(cx - s * 0.32, base - s * 0.5, s * 0.1, s * 0.5);
  ctx.fillRect(cx + s * 0.22, base - s * 0.5, s * 0.1, s * 0.5);
  // Tafel
  const top = base - s * 1.18;
  ctx.fillStyle = '#8a6230';
  ctx.fillRect(cx - s * 0.5, top, s, s * 0.74);
  ctx.fillStyle = '#c8964e';
  ctx.fillRect(cx - s * 0.44, top + s * 0.06, s * 0.88, s * 0.62);
  // Dach
  ctx.fillStyle = '#a9442e';
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.58, top);
  ctx.lineTo(cx + s * 0.58, top);
  ctx.lineTo(cx + s * 0.44, top - s * 0.16);
  ctx.lineTo(cx - s * 0.44, top - s * 0.16);
  ctx.closePath(); ctx.fill();
  // Zettel
  const papers = [
    { x: -0.36, y: 0.12, w: 0.26, h: 0.34, c: '#fffdf5', p: '#e63946' },
    { x: -0.02, y: 0.1, w: 0.3, h: 0.26, c: '#d9f0ff', p: '#2d6fc2' },
    { x: 0.06, y: 0.42, w: 0.24, h: 0.2, c: '#fff3b0', p: '#35a251' }
  ];
  for (const pp of papers) {
    ctx.fillStyle = pp.c;
    ctx.fillRect(cx + pp.x * s, top + pp.y * s, pp.w * s, pp.h * s);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    for (let ly = 0.06; ly < pp.h - 0.05; ly += 0.09) {
      ctx.fillRect(cx + (pp.x + 0.04) * s, top + (pp.y + ly) * s, (pp.w - 0.08) * s, s * 0.022);
    }
    ctx.fillStyle = pp.p;
    ctx.beginPath();
    ctx.arc(cx + (pp.x + pp.w / 2) * s, top + (pp.y + 0.02) * s, s * 0.032, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ---------- Platz unter einem Wahrzeichen ---------- */
function drawPlaza(ctx, x, y, s) {
  ctx.fillStyle = '#e6dfcd';
  ctx.fillRect(x, y, s, s);
  ctx.strokeStyle = '#d0c6ae';
  ctx.lineWidth = Math.max(0.6, s * 0.03);
  for (let i = 1; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(x, y + i * s / 3); ctx.lineTo(x + s, y + i * s / 3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + i * s / 3, y); ctx.lineTo(x + i * s / 3, y + s); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillRect(x, y, s, s * 0.05);
}

/* ---------- Animiertes Meer ----------
   Wird jedes Bild neu gezeichnet, damit sich die Wellen bewegen.
   wx/wy sind Weltkoordinaten in Kacheln. */
function drawSeaRegion(ctx, screenW, screenH, camTileX, camTileY, tilePx, time) {
  const top = '#54ace9', mid = '#4398e0', deep = '#3585c9';
  const g = ctx.createLinearGradient(0, 0, 0, screenH);
  g.addColorStop(0, top);
  g.addColorStop(0.55, mid);
  g.addColorStop(1, deep);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, screenW, screenH);

  // zwei versetzte Wellenlagen
  ctx.save();
  ctx.lineCap = 'round';
  for (let layer = 0; layer < 2; layer++) {
    const speed = layer ? 0.00022 : 0.00034;
    const amp = tilePx * (layer ? 0.1 : 0.07);
    const step = tilePx * (layer ? 2.1 : 1.6);
    ctx.strokeStyle = layer ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.24)';
    ctx.lineWidth = Math.max(1, tilePx * 0.05);
    const phase = time * speed;
    for (let sy = -step; sy < screenH + step; sy += step) {
      const wy = sy + ((camTileY * tilePx * 0.15) % step);
      ctx.beginPath();
      for (let sx = -tilePx; sx < screenW + tilePx; sx += tilePx * 0.5) {
        const wobble = Math.sin((sx + camTileX * tilePx) * 0.035 / (layer + 1) + phase + sy * 0.02) * amp;
        if (sx <= -tilePx) ctx.moveTo(sx, wy + wobble);
        else ctx.lineTo(sx, wy + wobble);
      }
      ctx.stroke();
    }
  }
  ctx.restore();

  // funkelnde Lichtpunkte
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  const sparkStep = tilePx * 3.4;
  for (let sy = 0; sy < screenH; sy += sparkStep) {
    for (let sx = 0; sx < screenW; sx += sparkStep) {
      const t = Math.sin(time * 0.002 + (sx + sy) * 0.01);
      if (t > 0.86) {
        ctx.beginPath();
        ctx.arc(sx + (sy % 2) * sparkStep * 0.5, sy, tilePx * 0.06 * t, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
