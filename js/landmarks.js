/* ============================================================
   hey EU – Wahrzeichen
   Jedes Wahrzeichen ist von Hand gezeichnet (keine Emojis).
   Gezeichnet wird in einem Koordinatensystem mit dem Ursprung
   am Boden in der Mitte: x von -10 bis 10, y von -22 bis 0.
   Licht kommt von links oben.
   ============================================================ */

const LM_ART = {};

/* ---------- kleine Zeichenhilfen ---------- */
function _r(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
function _p(ctx, pts, c) {
  ctx.fillStyle = c;
  ctx.beginPath();
  pts.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](p[0], p[1]));
  ctx.closePath(); ctx.fill();
}
function _c(ctx, x, y, r, col) {
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
function _line(ctx, x1, y1, x2, y2, c, w) {
  ctx.strokeStyle = c; ctx.lineWidth = w || 0.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
/* Fensterreihe */
function _win(ctx, x, y, n, dx, w, h, c) {
  ctx.fillStyle = c;
  for (let i = 0; i < n; i++) ctx.fillRect(x + i * dx, y, w, h);
}

/* Standardfarben */
const C = {
  stoneL: '#efe7d6', stone: '#d8ccb2', stoneD: '#b3a488', stoneX: '#8a7c63',
  roof: '#c1452f', roofD: '#98301f', roofL: '#d96a52',
  gold: '#f1c757', goldD: '#c79a30',
  wood: '#a5713d', woodD: '#7d5228',
  iron: '#8d7f74', ironD: '#6a5e55',
  grass: '#63a548', grassD: '#4a8035',
  water: '#4aa3e8', waterD: '#3585c4', foam: '#dff1ff',
  night: '#1f2b52', snow: '#ffffff', shadow: 'rgba(0,0,0,0.18)'
};

/* Sockel aus Stein, auf dem viele Wahrzeichen stehen */
function _base(ctx, w, c) {
  w = w || 9;
  _p(ctx, [[-w, 0], [w, 0], [w - 1, -1.6], [-w + 1, -1.6]], c || C.stoneD);
  _r(ctx, -w + 1, -1.9, (w - 1) * 2, 0.5, C.stoneL);
}

/* ================= Nordwesteuropa ================= */

/* Island – Geysir */
LM_ART.geysir = ctx => {
  _p(ctx, [[-9, 0], [9, 0], [7, -2.4], [-7, -2.4]], '#6e6257');
  _p(ctx, [[-7, -2.4], [7, -2.4], [5, -3.4], [-5, -3.4]], '#877a6c');
  _c(ctx, 0, -3.6, 2.6, '#2f7fa8');
  _c(ctx, 0, -3.8, 1.7, '#6cc3e0');
  // Wasserfontäne
  _p(ctx, [[-1.6, -4], [1.6, -4], [1.1, -12], [0, -17], [-1.1, -12]], '#bfe8f5');
  _p(ctx, [[-0.8, -4], [0.8, -4], [0.5, -12], [0, -15.5], [-0.5, -12]], '#ffffff');
  // Dampfwolken
  _c(ctx, -2.3, -16, 1.5, 'rgba(255,255,255,0.75)');
  _c(ctx, 1.4, -18, 1.9, 'rgba(255,255,255,0.68)');
  _c(ctx, -0.6, -19.8, 1.4, 'rgba(255,255,255,0.55)');
};

/* Irland – Cliffs of Moher */
LM_ART.cliffs = ctx => {
  // Meer bis zum Horizont
  _r(ctx, -10, -7.5, 20, 7.5, '#3f8fc4');
  _r(ctx, -10, -7.5, 20, 0.7, '#59a6d6');
  for (let i = -9; i < 10; i += 3.2) {
    _r(ctx, i, -5.4, 2.2, 0.35, 'rgba(255,255,255,0.45)');
    _r(ctx, i + 1.4, -3.2, 1.8, 0.35, 'rgba(255,255,255,0.4)');
  }
  // Steilwand: hohe Felskante, die nach rechts ins Meer abbricht
  _p(ctx, [[-10, 0], [-10, -17.4], [-3.4, -18.2], [2.2, -16], [4.6, -11.4], [5.2, -7.2], [-10, -7.2]], '#8d7657');
  // helle Sonnenseite
  _p(ctx, [[-10, -17.4], [-3.4, -18.2], [2.2, -16], [4.6, -11.4], [3.2, -11], [1.4, -15], [-3.4, -16.8], [-10, -16]], '#ab9270');
  // waagerechte Gesteinsschichten
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-10, -17.4); ctx.lineTo(-3.4, -18.2); ctx.lineTo(2.2, -16);
  ctx.lineTo(4.6, -11.4); ctx.lineTo(5.2, -7.2); ctx.lineTo(-10, -7.2);
  ctx.closePath(); ctx.clip();
  for (let i = 0; i < 7; i++) _r(ctx, -10, -16.2 + i * 1.4, 20, 0.3, '#7a6448');
  ctx.restore();
  // Grasdecke auf der Kante
  _p(ctx, [[-10, -17.4], [-3.4, -18.2], [2.2, -16], [1.8, -14.9], [-3.4, -17], [-10, -16.2]], '#5aa445');
  _p(ctx, [[-10, -17.4], [-3.4, -18.2], [-3.4, -17.6], [-10, -16.9]], '#72bd57');
  // Brandung am Fuß der Wand
  _c(ctx, 4.4, -7.4, 1.7, 'rgba(255,255,255,0.8)');
  _c(ctx, 6.2, -7, 1.2, 'rgba(255,255,255,0.6)');
  _c(ctx, 2.6, -7.3, 1.1, 'rgba(255,255,255,0.55)');
  // Möwen als V-Silhouetten
  for (const [gx, gy, gs] of [[7.2, -15, 1], [8.6, -12.8, 0.75]]) {
    _line(ctx, gx - 0.9 * gs, gy, gx, gy - 0.55 * gs, '#ffffff', 0.32);
    _line(ctx, gx, gy - 0.55 * gs, gx + 0.9 * gs, gy, '#ffffff', 0.32);
  }
};

/* Großbritannien – Big Ben */
LM_ART.bigben = ctx => {
  _base(ctx, 5, '#9a8e72');
  _r(ctx, -3, -14, 6, 12, '#cdb78d');
  _r(ctx, -3, -14, 2, 12, '#ddc9a1');
  _r(ctx, 1.4, -14, 1.6, 12, '#b9a179');
  // Fensterbänder
  for (let i = 0; i < 4; i++) _win(ctx, -2.2, -12.5 + i * 2.4, 3, 1.5, 0.7, 1.4, '#6d5f45');
  // Uhrenstube
  _r(ctx, -3.6, -17.4, 7.2, 3.6, '#e2d0a8');
  _c(ctx, 0, -15.6, 1.5, '#fdf6e3');
  _c(ctx, 0, -15.6, 1.2, '#ffffff');
  _line(ctx, 0, -15.6, 0, -16.5, '#3b3128', 0.3);
  _line(ctx, 0, -15.6, 0.7, -15.3, '#3b3128', 0.3);
  // Spitze
  _p(ctx, [[-3.6, -17.4], [3.6, -17.4], [2.4, -18.6], [-2.4, -18.6]], '#b8a075');
  _p(ctx, [[-2.4, -18.6], [2.4, -18.6], [0, -22.6]], '#4e7a4f');
  _c(ctx, 0, -23, 0.5, C.gold);
};

/* Portugal – Turm von Belém */
LM_ART.belem = ctx => {
  _r(ctx, -10, -2, 20, 2, C.water);
  _base(ctx, 7, '#cbbfa4');
  _r(ctx, -6.5, -6, 13, 4, C.stone);
  _win(ctx, -5, -5, 5, 2.2, 1, 1.6, '#7d7059');
  // Zinnen der Bastion
  for (let i = -6.5; i < 6; i += 2) _r(ctx, i, -7, 1.2, 1, C.stoneL);
  // Turm
  _r(ctx, -2.8, -16, 5.6, 10, C.stoneL);
  _r(ctx, 1, -16, 1.8, 10, C.stone);
  _win(ctx, -1.8, -14.5, 2, 2.4, 1, 1.8, '#7d7059');
  _win(ctx, -1.8, -11, 2, 2.4, 1, 1.8, '#7d7059');
  // Balkon
  _r(ctx, -3.4, -9.4, 6.8, 0.8, C.stoneD);
  // Ecktürmchen
  for (const sx of [-3.6, 3.6]) {
    _r(ctx, sx - 0.8, -13.5, 1.6, 3, C.stoneL);
    _p(ctx, [[sx - 1, -13.5], [sx + 1, -13.5], [sx, -15.4]], '#9b8c70');
  }
  // Zinnenkranz
  for (let i = -2.8; i < 2.6; i += 1.4) _r(ctx, i, -17, 0.9, 1, C.stoneL);
};

/* Spanien – Sagrada Família */
LM_ART.sagrada = ctx => {
  _base(ctx, 8, '#c9b894');
  _r(ctx, -7, -6, 14, 4, '#e3d3ac');
  // drei Portalbögen
  for (const x of [-4.4, 0, 4.4]) {
    ctx.fillStyle = '#8d7a56';
    ctx.beginPath();
    ctx.moveTo(x - 1.3, -2); ctx.lineTo(x - 1.3, -4.4);
    ctx.quadraticCurveTo(x, -6.2, x + 1.3, -4.4);
    ctx.lineTo(x + 1.3, -2); ctx.closePath(); ctx.fill();
  }
  // Türme in verschiedenen Höhen
  const towers = [[-5.6, 12], [-2.9, 16], [0, 19], [2.9, 16], [5.6, 12]];
  for (const [x, hgt] of towers) {
    const top = -6 - hgt;
    _p(ctx, [[x - 1.5, -6], [x + 1.5, -6], [x + 0.75, top + 2], [x - 0.75, top + 2]], '#efe0b8');
    _p(ctx, [[x + 0.3, -6], [x + 1.5, -6], [x + 0.75, top + 2], [x + 0.2, top + 2]], '#d9c79c');
    // Lochmuster
    for (let i = 1; i < hgt - 2; i += 2.6) {
      _r(ctx, x - 0.45, top + 2 + i, 0.9, 0.8, '#a2906a');
    }
    // bunte Spitze
      _p(ctx, [[x - 0.75, top + 2], [x + 0.75, top + 2], [x, top]], '#c9a227');
    _c(ctx, x, top - 0.3, 0.55, '#e05c4b');
    _c(ctx, x, top - 0.3, 0.28, '#f4e06a');
  }
};

/* Andorra – Pyrenäen mit Bergkirche */
LM_ART.pyrenees = ctx => {
  _p(ctx, [[-10, 0], [-4, -13], [1, 0]], '#7d8f74');
  _p(ctx, [[-4, -13], [-1.6, -8.4], [-6.4, -8.4]], C.snow);
  _p(ctx, [[-1, 0], [5, -10.5], [10, 0]], '#8b9a7e');
  _p(ctx, [[5, -10.5], [7, -7], [3, -7]], C.snow);
  _p(ctx, [[-10, 0], [10, 0], [10, -2], [-10, -2.6]], '#78a758');
  // kleine Steinkirche
  _r(ctx, -2.6, -6.6, 5, 4.6, '#e0d6bd');
  _p(ctx, [[-3.2, -6.6], [2.4, -6.6], [-0.4, -8.8]], '#9c7050');
  _r(ctx, 2.2, -9.4, 1.8, 7.4, '#d5c9ad');
  _p(ctx, [[1.9, -9.4], [4.3, -9.4], [3.1, -11.4]], '#8d6448');
  _r(ctx, -1.2, -4.6, 1.4, 2.6, '#7b6a4e');
  _r(ctx, 2.7, -8.4, 0.8, 1, '#7b6a4e');
};

/* Frankreich – Eiffelturm */
LM_ART.eiffel = ctx => {
  _base(ctx, 8, '#b8a98b');
  const col = '#8a6f52', colL = '#a98a68';
  // Beine
  _p(ctx, [[-6.5, -2], [-4.4, -2], [-1.3, -18], [-2, -18]], col);
  _p(ctx, [[6.5, -2], [4.4, -2], [1.3, -18], [2, -18]], col);
  _p(ctx, [[-5.6, -2], [-4.8, -2], [-1.6, -18], [-1.9, -18]], colL);
  // Bögen unten
  ctx.strokeStyle = col; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(-5.2, -4.4); ctx.quadraticCurveTo(0, -8.6, 5.2, -4.4); ctx.stroke();
  // Plattformen
  _r(ctx, -5.2, -7.4, 10.4, 0.9, colL);
  _r(ctx, -3.4, -12.2, 6.8, 0.8, colL);
  _r(ctx, -1.7, -17.4, 3.4, 0.7, colL);
  // Gitterstruktur
  ctx.strokeStyle = 'rgba(120,96,70,0.85)'; ctx.lineWidth = 0.22;
  for (let i = 0; i < 6; i++) {
    const y1 = -7.4 - i * 1.7, y2 = y1 - 1.7;
    const w1 = 4.6 - i * 0.55, w2 = 4.6 - (i + 1) * 0.55;
    ctx.beginPath();
    ctx.moveTo(-w1, y1); ctx.lineTo(w2, y2);
    ctx.moveTo(w1, y1); ctx.lineTo(-w2, y2);
    ctx.stroke();
  }
  // Spitze
  _p(ctx, [[-1.3, -17.4], [1.3, -17.4], [0.45, -20.6], [-0.45, -20.6]], col);
  _r(ctx, -0.5, -21.4, 1, 0.9, colL);
  _line(ctx, 0, -21.4, 0, -22.6, '#6f5942', 0.3);
};

/* Monaco – Hafen von Monte-Carlo */
LM_ART.harbor = ctx => {
  _r(ctx, -10, -4.5, 20, 4.5, C.water);
  _r(ctx, -10, -4.5, 20, 0.5, '#6dbcf0');
  // Kaimauer mit Häusern am Hang
  _p(ctx, [[-10, -4.5], [-10, -9], [-3, -11], [-1, -4.5]], '#cdbfa0');
  for (const [x, y, w, h, c] of [[-9, -8, 2.4, 3.4, '#f0e0c4'], [-6.2, -9.4, 2.2, 4.8, '#e8d2ae'], [-3.6, -10.4, 2.2, 5.8, '#f4e6cc']]) {
    _r(ctx, x, y, w, h, c);
    _p(ctx, [[x - 0.3, y], [x + w + 0.3, y], [x + w / 2, y - 1.2]], C.roof);
    _win(ctx, x + 0.4, y + 1, 2, 1.1, 0.6, 0.8, '#8f7c5e');
  }
  // Yacht
  _p(ctx, [[0.5, -4.5], [8.5, -4.5], [7.5, -6.2], [1.8, -6.2]], '#ffffff');
  _r(ctx, 2.6, -7.6, 4.4, 1.4, '#f2f2f2');
  _win(ctx, 3.1, -7.2, 3, 1.2, 0.7, 0.6, '#6ea8d8');
  _line(ctx, 6.4, -7.6, 6.4, -12.5, '#d8d8d8', 0.35);
  _p(ctx, [[6.4, -12.3], [6.4, -9.6], [3.2, -9.8]], '#e05c4b');
  // Wellen
  for (let i = -9; i < 9; i += 3.5) _r(ctx, i, -3, 2, 0.35, 'rgba(255,255,255,0.5)');
};

/* Belgien – Atomium */
LM_ART.atomium = ctx => {
  _base(ctx, 7, '#b9ad93');
  const pts = [[0, -16.5], [-5.2, -12.8], [5.2, -12.8], [-5.2, -6.6], [5.2, -6.6], [0, -9.7], [0, -3.2]];
  ctx.strokeStyle = '#9aa7ae'; ctx.lineWidth = 0.7;
  const links = [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [5, 1], [5, 2], [0, 1], [0, 2], [3, 1], [4, 2], [3, 4]];
  for (const [a, b] of links) {
    ctx.beginPath(); ctx.moveTo(pts[a][0], pts[a][1]); ctx.lineTo(pts[b][0], pts[b][1]); ctx.stroke();
  }
  for (const [x, y] of pts) {
    _c(ctx, x, y, 2.05, '#8e9aa3');
    _c(ctx, x, y, 1.85, '#c3ced6');
    _c(ctx, x - 0.55, y - 0.6, 0.8, '#eef4f8');
  }
};

/* Luxemburg – Kasematten am Bockfelsen */
LM_ART.bockfels = ctx => {
  _p(ctx, [[-10, 0], [-10, -8], [-6, -10.5], [2, -11], [7, -7], [7, 0]], '#9d8a6d');
  _p(ctx, [[-10, -8], [-6, -10.5], [2, -11], [2, -9.6], [-10, -6.8]], '#b39f80');
  // Kasematten-Bögen im Fels
  for (const x of [-7.4, -4.4, -1.4, 1.6]) {
    ctx.fillStyle = '#4e4233';
    ctx.beginPath();
    ctx.moveTo(x - 1, 0); ctx.lineTo(x - 1, -2.6);
    ctx.quadraticCurveTo(x, -4.2, x + 1, -2.6);
    ctx.lineTo(x + 1, 0); ctx.closePath(); ctx.fill();
  }
  // Turm auf dem Felsen
  _r(ctx, -3.4, -17, 4, 6.2, C.stoneL);
  _r(ctx, -0.6, -17, 1.2, 6.2, C.stone);
  _win(ctx, -2.6, -15.4, 2, 1.8, 0.8, 1.4, '#6d5f45');
  for (let i = -3.6; i < 0.4; i += 1.3) _r(ctx, i, -18, 0.9, 1, C.stoneL);
  _r(ctx, 2.4, -14, 3, 3.2, '#e0d3b4');
  _p(ctx, [[2, -14], [5.8, -14], [3.9, -16.2]], C.roof);
};

/* Niederlande – Windmühle */
LM_ART.windmill = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [10, -1.6], [-10, -2.2]], '#7fb35c');
  _p(ctx, [[-4.6, -2], [4.6, -2], [3, -12], [-3, -12]], '#9d5f3c');
  _p(ctx, [[1.2, -2], [4.6, -2], [3, -12], [1.4, -12]], '#82492c');
  _r(ctx, -3.4, -8.4, 6.8, 0.7, '#6d3d24');
  _win(ctx, -2.2, -6.6, 3, 1.6, 0.9, 1.3, '#f0e2c0');
  _p(ctx, [[-3.6, -12], [3.6, -12], [0, -15.2]], '#6d3d24');
  _c(ctx, 0, -14, 0.7, '#c6b28c');
  // Flügelkreuz
  ctx.save();
  ctx.translate(0, -14);
  ctx.rotate(0.38);
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    _r(ctx, -0.32, -8.6, 0.64, 8.6, '#7d5636');
    for (let j = 1; j < 7; j++) _r(ctx, 0.3, -1 - j, 1.5, 0.55, '#f4ecd6');
  }
  ctx.restore();
  _c(ctx, 0, -14, 0.5, '#5c4227');
};

/* Deutschland – Brandenburger Tor */
LM_ART.brandenburg = ctx => {
  _base(ctx, 9, '#b6a98d');
  // Säulen
  for (let i = 0; i < 6; i++) {
    const x = -7 + i * 2.8;
    _r(ctx, x - 0.75, -11, 1.5, 9, '#ece2cc');
    _r(ctx, x + 0.25, -11, 0.5, 9, '#d3c6a8');
    for (let k = 0; k < 5; k++) _r(ctx, x - 0.75, -10 + k * 1.8, 1.5, 0.22, '#cbbd9d');
    _r(ctx, x - 1, -11.6, 2, 0.7, '#f3ebd8');
  }
  // Gebälk
  _r(ctx, -8.4, -13.2, 16.8, 1.7, '#f0e6d0');
  _r(ctx, -8.8, -13.9, 17.6, 0.8, '#dccfaf');
  _r(ctx, -7.4, -14.7, 14.8, 0.9, '#e6dbc0');
  // Quadriga
  _r(ctx, -2.6, -16.2, 1.8, 1.5, '#8c8d8a');
  _c(ctx, -1.7, -17, 0.75, '#8c8d8a');
  for (let i = 0; i < 4; i++) {
    const x = 0.2 + i * 1.1;
    _p(ctx, [[x, -14.7], [x + 0.85, -14.7], [x + 0.7, -16.6], [x + 0.15, -16.6]], '#9a9a96');
    _p(ctx, [[x + 0.5, -16.6], [x + 1.1, -16.9], [x + 0.4, -17.3]], '#9a9a96');
  }
};

/* Dänemark – Kleine Meerjungfrau */
LM_ART.mermaid = ctx => {
  _r(ctx, -10, -3.4, 20, 3.4, C.water);
  for (let i = -9; i < 9; i += 3.2) _r(ctx, i, -2.4, 2.1, 0.35, 'rgba(255,255,255,0.55)');
  _p(ctx, [[-6, -3.4], [6, -3.4], [4.6, -7.2], [-4.4, -7.2]], '#6f6a63');
  _p(ctx, [[-4.4, -7.2], [4.6, -7.2], [3.4, -8.4], [-3.2, -8.4]], '#8b857c');
  // Figur aus Bronze
  const bz = '#7d6a4f', bzL = '#9a856a';
  _c(ctx, -0.4, -14.6, 1.25, bz);
  _c(ctx, -0.8, -14.9, 0.7, bzL);
  _p(ctx, [[-1.5, -13.6], [1.1, -13.6], [1.6, -10], [-1.8, -10]], bz);
  _p(ctx, [[-1.5, -13.6], [-0.3, -13.6], [-0.5, -10], [-1.8, -10]], bzL);
  // Schwanzflosse
  _p(ctx, [[-1.8, -10], [1.6, -10], [3.4, -8.6], [1.2, -8.4], [-1.6, -8.5]], bz);
  _p(ctx, [[2.6, -9.4], [4.8, -10.6], [4.2, -8.5]], bzL);
  // Arm
  _line(ctx, 0.8, -13.2, 1.9, -11.4, bz, 0.55);
};

/* Norwegen – Fjord mit Wikingerschiff */
LM_ART.viking = ctx => {
  _p(ctx, [[-10, -4], [-6, -14], [-1, -4]], '#6b7d68');
  _p(ctx, [[-6, -14], [-4.2, -10.6], [-7.8, -10.6]], C.snow);
  _p(ctx, [[1, -4], [6, -15.6], [10, -4]], '#5f7260');
  _p(ctx, [[6, -15.6], [8, -11.6], [4, -11.6]], C.snow);
  _r(ctx, -10, -4, 20, 4, '#3f86b8');
  for (let i = -9; i < 9; i += 3) _r(ctx, i, -3, 2, 0.35, 'rgba(255,255,255,0.4)');
  // Langschiff
  _p(ctx, [[-5.4, -4.2], [5.4, -4.2], [4.2, -6.2], [-4.2, -6.2]], C.wood);
  _p(ctx, [[-4.2, -6.2], [4.2, -6.2], [3.6, -6.9], [-3.6, -6.9]], C.woodD);
  // Schilde am Rand
  for (let i = -3.4; i < 3.4; i += 1.4) _c(ctx, i, -5.2, 0.55, i % 2.8 < 1.4 ? '#d8b24a' : '#c0392b');
  // Drachenkopf
  _p(ctx, [[-4.2, -6.2], [-5.6, -9.6], [-4.4, -9.2], [-3.4, -6.6]], C.woodD);
  _p(ctx, [[-5.6, -9.6], [-6.8, -9.9], [-5.2, -8.8]], '#8a5a2c');
  _p(ctx, [[5.4, -4.2], [6.4, -7.6], [4.8, -6.4]], C.woodD);
  // Mast und Segel
  _line(ctx, 0, -6.9, 0, -15, '#7d5228', 0.4);
  _p(ctx, [[-3.2, -14.4], [3.2, -14.4], [3.2, -8.6], [-3.2, -8.6]], '#f2efe6');
  for (let i = -2.2; i < 3; i += 1.6) _r(ctx, i, -14.4, 0.8, 5.8, '#c0392b');
};

/* Schweden – Dalapferd */
LM_ART.dalahorse = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [10, -1.4], [-10, -2]], '#86bb62');
  const red = '#c8362b', redD = '#a02a21';
  // Körper
  _p(ctx, [[-5, -4], [4.4, -4], [5, -9], [3.4, -10.6], [-2, -10.4], [-4.6, -8.4]], red);
  _p(ctx, [[-5, -4], [-2.6, -4], [-2.4, -8.8], [-4.6, -8.4]], redD);
  // Beine
  _r(ctx, -4.2, -4.6, 1.6, 4.6, red);
  _r(ctx, -1.6, -4.6, 1.5, 4.6, redD);
  _r(ctx, 2, -4.6, 1.5, 4.6, red);
  _r(ctx, 3.9, -4.6, 1.3, 4.6, redD);
  // Hals und Kopf
  _p(ctx, [[2.6, -9.6], [5.2, -9], [6.6, -14.4], [4.4, -15], [3, -12]], red);
  _p(ctx, [[5.4, -14.2], [7.8, -14.8], [7.2, -12.8], [5.6, -12.6]], red);
  _c(ctx, 6.6, -14, 0.3, '#2b2320');
  // Mähne und Schweif
  _p(ctx, [[3.2, -11.4], [4.6, -15.2], [3.2, -14.8], [2.2, -11.8]], '#f3d34c');
  _p(ctx, [[-4.8, -8.6], [-7, -10.4], [-6.4, -6.6], [-4.6, -6]], '#f3d34c');
  // Kurbits-Bemalung
  _c(ctx, -1.4, -7, 0.7, '#f3d34c');
  _c(ctx, 1.4, -6.4, 0.55, '#2e7d5f');
  _c(ctx, 0, -8.6, 0.45, '#f0f0ec');
};

/* Finnland – Nordlichter */
LM_ART.aurora = ctx => {
  _r(ctx, -10, -22, 20, 22, C.night);
  for (const [x, y, r] of [[-7, -19, 0.22], [-3, -20.5, 0.18], [4, -18, 0.25], [7, -20, 0.2], [1, -17, 0.15]])
    _c(ctx, x, y, r, '#ffffff');
  // drei Lichtbänder
  const bands = [['rgba(86,230,160,0.55)', -16, 2.4], ['rgba(140,240,190,0.45)', -13.6, 1.8], ['rgba(150,120,235,0.38)', -11.6, 1.4]];
  for (const [col, y, amp] of bands) {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(-10, y);
    for (let x = -10; x <= 10; x += 1) ctx.lineTo(x, y + Math.sin(x * 0.55 + y) * amp);
    for (let x = 10; x >= -10; x -= 1) ctx.lineTo(x, y + 2.6 + Math.sin(x * 0.55 + y) * amp);
    ctx.closePath(); ctx.fill();
  }
  // verschneite Hügel und Tannen
  _p(ctx, [[-10, 0], [-10, -4], [-4, -6], [2, -4.4], [10, -6], [10, 0]], '#dce8f2');
  for (const [x, s] of [[-7, 1], [-4.6, 0.8], [3.2, 1.1], [6.4, 0.9], [8.6, 0.7]]) {
    _p(ctx, [[x - 1.3 * s, -4.4], [x + 1.3 * s, -4.4], [x, -9 * s - 2]], '#1d4331');
    _p(ctx, [[x - 0.95 * s, -6.2], [x + 0.95 * s, -6.2], [x, -9.6 * s - 1]], '#255138');
    _r(ctx, x - 0.2, -4.6, 0.4, 1, '#3d2b1d');
  }
};

/* Estland – Altstadt von Tallinn */
LM_ART.tallinn = ctx => {
  _base(ctx, 10, '#a89c80');
  _r(ctx, -9, -8.5, 18, 6.5, C.stone);
  for (let i = -9; i < 8.5; i += 2) _r(ctx, i, -9.6, 1.2, 1.1, C.stoneL);
  _win(ctx, -7.6, -6.8, 7, 2.2, 0.8, 1.6, '#6d6048');
  // zwei Wehrtürme
  for (const [x, hgt] of [[-5.6, 7], [5.2, 9]]) {
    _r(ctx, x - 2.2, -8.5 - hgt, 4.4, hgt + 1, C.stoneL);
    _r(ctx, x + 0.6, -8.5 - hgt, 1.6, hgt + 1, C.stone);
    _win(ctx, x - 1.4, -7.4 - hgt, 2, 1.6, 0.7, 1.3, '#6d6048');
    _p(ctx, [[x - 2.8, -8.5 - hgt], [x + 2.8, -8.5 - hgt], [x, -14 - hgt]], C.roof);
    _p(ctx, [[x - 2.8, -8.5 - hgt], [x, -8.5 - hgt], [x, -14 - hgt]], C.roofL);
    _line(ctx, x, -14 - hgt, x, -15.4 - hgt, '#5c5148', 0.28);
    _c(ctx, x, -15.6 - hgt, 0.35, C.gold);
  }
  // Tor
  ctx.fillStyle = '#4e4233';
  ctx.beginPath();
  ctx.moveTo(-1.5, -2); ctx.lineTo(-1.5, -5);
  ctx.quadraticCurveTo(0, -7, 1.5, -5);
  ctx.lineTo(1.5, -2); ctx.closePath(); ctx.fill();
};

/* Lettland – Freiheitsdenkmal */
LM_ART.column = ctx => {
  _p(ctx, [[-7, 0], [7, 0], [6, -1.8], [-6, -1.8]], '#a89c84');
  _p(ctx, [[-5, -1.8], [5, -1.8], [4.2, -3.6], [-4.2, -3.6]], C.stone);
  _p(ctx, [[-3.4, -3.6], [3.4, -3.6], [2.8, -5.4], [-2.8, -5.4]], C.stoneL);
  _r(ctx, -1.5, -16.4, 3, 11, '#ddd2bb');
  _r(ctx, 0.4, -16.4, 1.1, 11, '#c2b69b');
  for (let i = 0; i < 5; i++) _r(ctx, -1.5, -15 + i * 2.1, 3, 0.25, '#b3a68a');
  _r(ctx, -2.1, -17.2, 4.2, 0.9, '#e7dcc4');
  // Figur mit drei Sternen
  _c(ctx, 0, -18.6, 0.85, '#b6b0a2');
  _p(ctx, [[-1.1, -17.8], [1.1, -17.8], [0.7, -17.2], [-0.7, -17.2]], '#b6b0a2');
  _line(ctx, -0.9, -18.6, -1.7, -20.6, '#b6b0a2', 0.45);
  _line(ctx, 0.9, -18.6, 1.7, -20.6, '#b6b0a2', 0.45);
  for (const x of [-1.9, 0, 1.9]) {
    ctx.fillStyle = C.gold;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 0.28 : 0.7;
      ctx[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, -21.4 + Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill();
  }
};

/* Litauen – Berg der Kreuze */
LM_ART.crosses = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [8, -4.4], [-1, -6.4], [-8, -4]], '#8c9e6a');
  _p(ctx, [[-8, -4], [-1, -6.4], [8, -4.4], [7, -3.4], [-1, -5.2], [-7.4, -3.2]], '#a3b57e');
  const crosses = [[-6.4, -4.2, 2.4], [-4.6, -5, 3.6], [-2.8, -5.8, 2.8], [-1, -6.4, 5.2],
                   [0.8, -6, 3.2], [2.6, -5.4, 4.4], [4.4, -4.8, 2.6], [6.2, -4.4, 3.4],
                   [-5.6, -4.6, 1.6], [1.8, -5.6, 1.8], [5.4, -4.6, 1.5], [-3.6, -5.4, 1.7]];
  for (const [x, y, hgt] of crosses) {
    const c = hgt > 3 ? '#6b4b2c' : '#8a6a44';
    const t = hgt > 3 ? 0.4 : 0.28;
    _r(ctx, x - t / 2, y - hgt, t, hgt, c);
    _r(ctx, x - hgt * 0.22, y - hgt * 0.78, hgt * 0.44, t * 0.85, c);
  }
};

/* Belarus – Schloss Mir */
LM_ART.mircastle = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [10, -1.4], [-10, -2]], '#7fae5e');
  const brick = '#b05a44', brickD = '#8e4433', brickL = '#c47059';
  _r(ctx, -7.5, -9, 15, 7, brick);
  for (let i = 0; i < 4; i++) _r(ctx, -7.5, -8.4 + i * 1.8, 15, 0.3, brickD);
  _win(ctx, -6, -7.4, 6, 2.1, 0.9, 1.5, '#f2e4c4');
  // Tor
  ctx.fillStyle = '#5b3c22';
  ctx.beginPath();
  ctx.moveTo(-1.4, -2); ctx.lineTo(-1.4, -5);
  ctx.quadraticCurveTo(0, -6.8, 1.4, -5); ctx.lineTo(1.4, -2); ctx.closePath(); ctx.fill();
  // Ecktürme
  for (const [x, hgt] of [[-7.6, 12], [7.6, 12], [-3.4, 9], [3.4, 9]]) {
    _r(ctx, x - 1.7, -hgt, 3.4, hgt - 2, brickL);
    _r(ctx, x + 0.4, -hgt, 1.3, hgt - 2, brickD);
    _win(ctx, x - 0.9, -hgt + 2, 1, 1, 0.8, 1.3, '#f2e4c4');
    _r(ctx, x - 2.1, -hgt - 0.8, 4.2, 0.9, '#e6dcc6');
    _p(ctx, [[x - 2.1, -hgt - 0.8], [x + 2.1, -hgt - 0.8], [x, -hgt - 5]], '#3f6b4f');
    _c(ctx, x, -hgt - 5.4, 0.35, C.gold);
  }
};

/* Polen – Wawel-Drache */
LM_ART.dragon = ctx => {
  _p(ctx, [[-10, 0], [8, 0], [6, -5], [-3, -6.4], [-9, -4]], '#8a7a5e');
  _p(ctx, [[-9, -4], [-3, -6.4], [6, -5], [5.4, -4], [-3, -5.2], [-8.4, -3.2]], '#a1907088');
  const gr = '#4c7a3a', grD = '#3a5f2c', grL = '#63944c';
  // Körper
  _p(ctx, [[-5, -6], [2.4, -6.6], [3.4, -11], [0.6, -12.6], [-3.4, -11.4]], gr);
  _p(ctx, [[-5, -6], [-2.2, -6.2], [-2.6, -11], [-3.4, -11.4]], grD);
  // Beine
  _r(ctx, -4, -6.6, 1.5, 1.6, grD);
  _r(ctx, 0.8, -7, 1.5, 1.8, gr);
  // Hals und Kopf
  _p(ctx, [[1, -12], [3, -11.6], [5.4, -16.2], [3, -17]], gr);
  _p(ctx, [[3, -17], [6.6, -17.4], [6.8, -15.6], [4.4, -15.4]], grL);
  _c(ctx, 5.2, -16.8, 0.32, '#f4d03f');
  // Flammen
  _p(ctx, [[6.8, -16.4], [9.4, -17.4], [8.2, -16], [9.8, -15.4], [7, -15.2]], '#f09030');
  _p(ctx, [[7, -16.3], [8.8, -16.9], [8.2, -15.9], [7.4, -15.6]], '#f7e05a');
  // Flügel
  _p(ctx, [[-1.4, -11.8], [1.6, -17.6], [3.2, -13.4], [0.4, -12.4]], grL);
  _p(ctx, [[-1.4, -11.8], [-3.2, -16.2], [0.8, -13.6]], gr);
  // Schwanz
  _p(ctx, [[-4.6, -8.4], [-8.4, -10.4], [-9.2, -8.8], [-4.8, -7]], gr);
  _p(ctx, [[-8.4, -10.4], [-9.8, -11.6], [-8.6, -9.2]], grD);
  // Rückenzacken
  for (let i = 0; i < 4; i++) _p(ctx, [[-2.6 + i * 1.5, -11.6], [-1.9 + i * 1.5, -13.2], [-1.2 + i * 1.5, -11.5]], grD);
};

/* Tschechien – Karlsbrücke */
LM_ART.charlesbridge = ctx => {
  _r(ctx, -10, -5, 20, 5, '#4f86b0');
  for (let i = -9; i < 9; i += 3.4) _r(ctx, i, -4, 2.2, 0.35, 'rgba(255,255,255,0.4)');
  // Brückenbögen
  _r(ctx, -10, -9, 20, 2.4, C.stone);
  _r(ctx, -10, -9.4, 20, 0.5, C.stoneL);
  for (const x of [-7, -2.2, 2.6, 7.4]) {
    ctx.fillStyle = '#4f86b0';
    ctx.beginPath();
    ctx.moveTo(x - 1.8, -5); ctx.lineTo(x - 1.8, -6.2);
    ctx.quadraticCurveTo(x, -8.4, x + 1.8, -6.2);
    ctx.lineTo(x + 1.8, -5); ctx.closePath(); ctx.fill();
  }
  for (const x of [-9.6, -4.6, 0.2, 5, 9.8]) _r(ctx, x - 0.7, -6.6, 1.4, 1.6, C.stoneD);
  // Statuen auf der Brüstung
  for (const x of [-8, -5, 0, 4, 8]) {
    _c(ctx, x, -11, 0.5, '#8d8579');
    _p(ctx, [[x - 0.75, -10.4], [x + 0.75, -10.4], [x + 0.5, -9.4], [x - 0.5, -9.4]], '#8d8579');
  }
  // Brückenturm
  _r(ctx, -9.4, -18, 4, 9, C.stoneL);
  _r(ctx, -6.6, -18, 1.6, 9, C.stone);
  _win(ctx, -8.6, -16, 2, 1.8, 0.8, 1.4, '#5f5342');
  for (let i = -9.6; i < -5.4; i += 1.3) _r(ctx, i, -19, 0.9, 1, C.stoneL);
  _p(ctx, [[-9.8, -19], [-4.8, -19], [-7.3, -22.4]], '#3f4b5c');
};

/* Slowakei – Burg Bratislava */
LM_ART.castle4 = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [8, -3.4], [-8, -3.4]], '#8a8f6a');
  _r(ctx, -7, -12, 14, 8.6, '#f0e8d4');
  for (let i = 0; i < 3; i++) _win(ctx, -5.6, -10.8 + i * 2.6, 5, 2.4, 0.9, 1.5, '#7e6f52');
  _p(ctx, [[-7.6, -12], [7.6, -12], [6.4, -14.2], [-6.4, -14.2]], C.roofD);
  _p(ctx, [[-7.6, -12], [0, -12], [0, -14.2], [-6.4, -14.2]], C.roof);
  // vier Ecktürme
  for (const x of [-7.4, 7.4]) {
    _r(ctx, x - 1.5, -16.4, 3, 13, '#f5eeda');
    _r(ctx, x + 0.3, -16.4, 1.2, 13, '#ddd2b6');
    _win(ctx, x - 0.9, -14.6, 1, 1, 0.8, 1.3, '#7e6f52');
    _win(ctx, x - 0.9, -11, 1, 1, 0.8, 1.3, '#7e6f52');
    _r(ctx, x - 1.9, -17.2, 3.8, 0.9, '#e2d7bb');
    _p(ctx, [[x - 1.9, -17.2], [x + 1.9, -17.2], [x, -20.8]], C.roofD);
    _c(ctx, x, -21.2, 0.32, C.gold);
  }
};

/* Österreich – Wiener Riesenrad */
LM_ART.ferris = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [10, -1.4], [-10, -2]], '#8bb968');
  const cy = -13, R = 8;
  _p(ctx, [[-4.4, -1.8], [-2.6, -1.8], [-0.4, cy], [-1.4, cy]], '#7d6a55');
  _p(ctx, [[4.4, -1.8], [2.6, -1.8], [0.4, cy], [1.4, cy]], '#7d6a55');
  ctx.strokeStyle = '#9a8468'; ctx.lineWidth = 0.42;
  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI / 8;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
  }
  ctx.strokeStyle = '#6f5d49'; ctx.lineWidth = 0.55;
  ctx.beginPath(); ctx.arc(0, cy, R, 0, Math.PI * 2); ctx.stroke();
  _c(ctx, 0, cy, 1.1, '#8d7a63');
  // Gondeln
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    const x = Math.cos(a) * R, y = cy + Math.sin(a) * R;
    _r(ctx, x - 0.85, y - 0.2, 1.7, 1.5, i % 2 ? '#c0392b' : '#e8dcc0');
    _r(ctx, x - 0.85, y - 0.2, 1.7, 0.35, '#7d6a55');
  }
};

/* Schweiz – Matterhorn */
LM_ART.matterhorn = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [9, -2.8], [-9, -3.2]], '#7fa262');
  _p(ctx, [[-9, -2.6], [-2.4, -20.6], [7.4, -3]], '#8a8f9c');
  _p(ctx, [[-2.4, -20.6], [7.4, -3], [1.4, -3.4]], '#6e7381');
  // Schneekappe mit typischem Knick
  _p(ctx, [[-2.4, -20.6], [1.6, -14.6], [-0.4, -14.2], [-1.2, -15.8], [-3.4, -14], [-5.2, -14.6]], C.snow);
  _p(ctx, [[-2.4, -20.6], [1.6, -14.6], [0.2, -14.4], [-1.8, -18.2]], '#dfe6ef');
  // Schneefelder und Felsrisse
  _p(ctx, [[-6.4, -8.6], [-4.6, -9.4], [-4, -7.4], [-6, -6.8]], '#c9d2dd');
  _p(ctx, [[3.2, -7.6], [4.8, -8.2], [5.4, -6.2], [3.6, -5.8]], '#c9d2dd');
  ctx.strokeStyle = '#5d6270'; ctx.lineWidth = 0.22;
  ctx.beginPath();
  ctx.moveTo(-2.4, -19.6); ctx.lineTo(-3.8, -11); ctx.lineTo(-6.2, -4.4);
  ctx.moveTo(-1.6, -17); ctx.lineTo(0.6, -9.4); ctx.lineTo(2.4, -3.6);
  ctx.stroke();
  // kleine Tannen am Fuß
  for (const x of [-7.8, 6.6, 8.4]) {
    _p(ctx, [[x - 1, -2.8], [x + 1, -2.8], [x, -6.4]], '#2f5f3c');
  }
};

/* Liechtenstein – Schloss Vaduz */
LM_ART.hillcastle = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [8, -5], [-1, -7.4], [-9, -4.6]], '#6f9455');
  _p(ctx, [[-9, -4.6], [-1, -7.4], [8, -5], [7.4, -4.2], [-1, -6.4], [-8.6, -3.8]], '#82a866');
  _r(ctx, -5.6, -13.4, 11, 6.6, '#efe4cb');
  for (let i = 0; i < 2; i++) _win(ctx, -4.4, -12.4 + i * 2.6, 4, 2.3, 0.9, 1.5, '#7b6c50');
  _p(ctx, [[-6.2, -13.4], [6, -13.4], [4.8, -15.6], [-5, -15.6]], C.roofD);
  _p(ctx, [[-6.2, -13.4], [-0.2, -13.4], [-0.2, -15.6], [-5, -15.6]], C.roof);
  // Bergfried
  _r(ctx, 3.4, -19.4, 3.8, 12.6, '#f4ead3');
  _r(ctx, 5.8, -19.4, 1.4, 12.6, '#ddd0b2');
  _win(ctx, 4.2, -17.6, 1, 1, 0.9, 1.4, '#7b6c50');
  _win(ctx, 4.2, -14.4, 1, 1, 0.9, 1.4, '#7b6c50');
  for (let i = 3.2; i < 7.2; i += 1.3) _r(ctx, i, -20.4, 0.9, 1.1, '#e7dcc2');
  // Turm links
  _r(ctx, -6.6, -16.6, 2.6, 9.8, '#f4ead3');
  _p(ctx, [[-7.2, -16.6], [-3.4, -16.6], [-5.3, -19.6]], C.roofD);
};

/* Slowenien – Bleder See */
LM_ART.lakechurch = ctx => {
  _p(ctx, [[-10, -5], [-5, -13], [0, -5]], '#7d8d76');
  _p(ctx, [[-5, -13], [-3.2, -10.4], [-6.8, -10.4]], C.snow);
  _p(ctx, [[2, -5], [6, -11.4], [10, -5]], '#6f8169');
  _r(ctx, -10, -5, 20, 5, '#3f9dbc');
  for (let i = -9; i < 9; i += 3) _r(ctx, i, -3.8, 2, 0.35, 'rgba(255,255,255,0.45)');
  // Insel
  _p(ctx, [[-4.4, -5], [4.4, -5], [3.4, -6.6], [-3.4, -6.6]], '#8a6f4e');
  _p(ctx, [[-3.6, -6.6], [3.6, -6.6], [3, -7.4], [-3, -7.4]], '#5f8f4a');
  // Kirche
  _r(ctx, -2.2, -11.4, 4.4, 4, '#f2e9d6');
  _p(ctx, [[-2.8, -11.4], [2.8, -11.4], [0, -13.4]], C.roofD);
  _r(ctx, 1.4, -15.4, 2.2, 8, '#f6efdd');
  _r(ctx, 3, -15.4, 0.6, 8, '#ded2b6');
  _win(ctx, 1.9, -14.2, 1, 1, 0.9, 1.3, '#7b6c50');
  _p(ctx, [[1, -15.4], [4, -15.4], [2.5, -18.6]], C.roofD);
  _c(ctx, 2.5, -19, 0.3, C.gold);
  // Ruderboot
  _p(ctx, [[5.4, -5], [8.6, -5], [8, -6], [6, -6]], '#b07840');
  _line(ctx, 6.4, -6, 5.2, -7, '#8a5c2c', 0.3);
};

/* Italien – Kolosseum */
LM_ART.colosseum = ctx => {
  _base(ctx, 10, '#b5a888');
  const arc = (x, y, w, h, c) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(x - w, y); ctx.lineTo(x - w, y - h * 0.5);
    ctx.quadraticCurveTo(x, y - h * 1.35, x + w, y - h * 0.5);
    ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  };
  // Grundkörper leicht oval
  _p(ctx, [[-9.4, -2], [9.4, -2], [9.4, -12.4], [-9.4, -12.4]], '#e3d6b4');
  _p(ctx, [[5.2, -2], [9.4, -2], [9.4, -12.4], [5.2, -12.4]], '#cdbe99');
  // teilweise eingestürzte Oberkante
  _p(ctx, [[-9.4, -12.4], [-2, -13.6], [1.4, -12.2], [4.4, -15.2], [9.4, -14.6], [9.4, -12.4]], '#e9ddbd');
  // drei Bogengeschosse
  for (let row = 0; row < 3; row++) {
    const y = -3.4 - row * 3.2;
    for (let i = 0; i < 7; i++) {
      const x = -8 + i * 2.7;
      if (row === 2 && x > 3) continue;
      arc(x, y, 0.95, 2.1, '#7d6c4c');
      arc(x, y - 0.25, 0.68, 1.7, '#5f5138');
    }
    _r(ctx, -9.4, y + 0.1, 18.8, 0.4, '#c9b993');
  }
  // Risse
  ctx.strokeStyle = '#a89873'; ctx.lineWidth = 0.22;
  ctx.beginPath(); ctx.moveTo(2.6, -12.4); ctx.lineTo(3.2, -8); ctx.stroke();
};

/* San Marino – drei Türme */
LM_ART.threetowers = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [9, -3.4], [3, -5.4], [-4, -4.6], [-9, -2.6]], '#7b8c66');
  _p(ctx, [[-9, -2.6], [-4, -4.6], [3, -5.4], [9, -3.4], [8.4, -2.6], [3, -4.4], [-4, -3.6], [-8.6, -2]], '#8fa177');
  const tower = (x, base, hgt, w) => {
    _p(ctx, [[x - w - 0.6, base], [x + w + 0.6, base], [x + w, base - 1], [x - w, base - 1]], '#b8ab8d');
    _r(ctx, x - w, base - hgt, w * 2, hgt - 1, '#efe6d0');
    _r(ctx, x + w * 0.3, base - hgt, w * 0.7, hgt - 1, '#d6c9a9');
    _win(ctx, x - w * 0.45, base - hgt + 2, 1, 1, w * 0.5, 1.3, '#7b6c50');
    for (let i = x - w; i < x + w - 0.3; i += 1.15) _r(ctx, i, base - hgt - 1.1, 0.8, 1.2, '#f2e9d3');
    _line(ctx, x, base - hgt - 1.1, x, base - hgt - 3.4, '#6f6455', 0.28);
    _p(ctx, [[x, base - hgt - 3.4], [x + 2, base - hgt - 2.7], [x, base - hgt - 2.1]], '#3f6b9c');
  };
  tower(-5.4, -4, 9, 1.7);
  tower(0.4, -5.2, 12, 2.1);
  tower(6, -4.2, 8, 1.5);
};

/* Vatikanstadt – Petersdom */
LM_ART.basilica = ctx => {
  _base(ctx, 10, '#b5a888');
  // Kolonnaden links und rechts
  for (const sx of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const x = sx * (5.2 + i * 1.35);
      _r(ctx, x - 0.38, -6.4, 0.76, 4.4, '#e8dcc2');
      _r(ctx, x - 0.55, -7, 1.1, 0.7, '#f2e9d4');
    }
    _r(ctx, sx * 4.4, -7.6, sx * 5.6, 0.8, '#ddd0b2');
  }
  // Fassade
  _r(ctx, -4.6, -11, 9.2, 9, '#f0e6cf');
  _r(ctx, 2, -11, 2.6, 9, '#ddd1b3');
  for (let i = 0; i < 5; i++) {
    const x = -3.6 + i * 1.8;
    _r(ctx, x - 0.42, -10, 0.84, 8, '#f8f1de');
    _r(ctx, x - 0.6, -10.6, 1.2, 0.7, '#e6dbc2');
  }
  _p(ctx, [[-5.2, -11], [5.2, -11], [4.4, -12.6], [-4.4, -12.6]], '#f4ecd8');
  // Tambour und Kuppel
  _r(ctx, -3.2, -16, 6.4, 3.4, '#ece2c8');
  for (let i = 0; i < 5; i++) _r(ctx, -2.7 + i * 1.2, -15.6, 0.45, 2.6, '#d3c7a9');
  ctx.fillStyle = '#c8cdbf';
  ctx.beginPath(); ctx.ellipse(0, -16, 4.2, 4.4, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#dde2d6';
  ctx.beginPath(); ctx.ellipse(-1.1, -16.4, 2.4, 3.6, 0, Math.PI, 0); ctx.fill();
  ctx.strokeStyle = '#a8ae9e'; ctx.lineWidth = 0.22;
  for (let i = -3; i <= 3; i += 1.5) {
    ctx.beginPath(); ctx.moveTo(i, -16); ctx.quadraticCurveTo(i * 0.4, -19.4, 0, -20.4); ctx.stroke();
  }
  _r(ctx, -0.9, -21.4, 1.8, 1.2, '#e6dcc4');
  _line(ctx, 0, -21.4, 0, -22.8, C.goldD, 0.35);
  _line(ctx, -0.6, -22.2, 0.6, -22.2, C.goldD, 0.35);
};

/* Malta – Hafen von Valletta */
LM_ART.valletta = ctx => {
  _r(ctx, -10, -3.6, 20, 3.6, '#3f9dc4');
  for (let i = -9; i < 9; i += 3) _r(ctx, i, -2.6, 2, 0.35, 'rgba(255,255,255,0.45)');
  // Festungsmauer aus honigfarbenem Kalkstein
  _p(ctx, [[-10, -3.6], [10, -3.6], [10, -8], [-10, -8]], '#e8d29a');
  _p(ctx, [[-10, -8], [10, -8], [10, -8.8], [-10, -8.8]], '#f2e0b4');
  for (let i = -10; i < 10; i += 2.2) _r(ctx, i, -9.8, 1.4, 1.1, '#eddaa8');
  ctx.fillStyle = '#d9c084';
  for (let i = -9.4; i < 9; i += 2.2) ctx.fillRect(i, -6.4, 1.2, 1.6);
  // Stadt dahinter
  for (const [x, y, w, h] of [[-8, -13, 3, 4.2], [-4.4, -14.4, 2.6, 5.6], [1.6, -13.4, 3.2, 4.6], [5.6, -15, 2.8, 6.2]]) {
    _r(ctx, x, y, w, h, '#f4e4bd');
    _r(ctx, x + w * 0.6, y, w * 0.4, h, '#e0cb9e');
    _win(ctx, x + 0.4, y + 1, 2, 1.2, 0.6, 0.9, '#8f7a4e');
    _r(ctx, x - 0.3, y - 0.7, w + 0.6, 0.8, '#c9a45f');
  }
  // Kuppel
  ctx.fillStyle = '#b8b3a0';
  ctx.beginPath(); ctx.ellipse(-1.4, -14.2, 2.4, 2.8, 0, Math.PI, 0); ctx.fill();
  _r(ctx, -3.8, -14.2, 4.8, 5.4, '#f0e2bd');
  _line(ctx, -1.4, -17, -1.4, -18.4, C.goldD, 0.3);
  // Boot
  _p(ctx, [[3, -3.6], [7, -3.6], [6.4, -4.8], [3.6, -4.8]], '#d9532f');
  _r(ctx, 4, -5.4, 2, 0.7, '#f0e6d2');
};

/* Kroatien – Stadtmauer von Dubrovnik */
LM_ART.citywall = ctx => {
  _r(ctx, -10, -3, 20, 3, '#3fa0cc');
  for (let i = -9; i < 9; i += 3) _r(ctx, i, -2.2, 2, 0.32, 'rgba(255,255,255,0.45)');
  _p(ctx, [[-10, -3], [10, -3], [10, -5.4], [-10, -5.4]], '#cdbd9a');
  // Mauerzug
  _r(ctx, -10, -11, 20, 5.8, '#e6d8b8');
  _r(ctx, -10, -11.6, 20, 0.8, '#f0e4c6');
  for (let i = -10; i < 10; i += 2) _r(ctx, i, -12.6, 1.3, 1.1, '#eadfbf');
  _win(ctx, -8.6, -9.6, 8, 2.1, 0.7, 1.4, '#8a7752');
  // Rundturm
  _r(ctx, 5.4, -15.4, 4.4, 10, '#f0e4c2');
  _r(ctx, 8.2, -15.4, 1.6, 10, '#dccda8');
  for (let i = 5.2; i < 9.6; i += 1.5) _r(ctx, i, -16.4, 1, 1.1, '#f4ead0');
  _win(ctx, 6.2, -13.6, 2, 1.6, 0.7, 1.4, '#8a7752');
  // rote Dächer der Altstadt
  for (const [x, y, w] of [[-8.4, -14.2, 3.4], [-4.6, -15.4, 3], [-1, -14.6, 3.2], [2.6, -15.8, 2.6]]) {
    _r(ctx, x, y, w, 2.8, '#f2e6c8');
    _p(ctx, [[x - 0.4, y], [x + w + 0.4, y], [x + w / 2, y - 1.5]], C.roof);
    _p(ctx, [[x - 0.4, y], [x + w / 2, y], [x + w / 2, y - 1.5]], C.roofL);
  }
};

/* Bosnien-Herzegowina – Alte Brücke von Mostar */
LM_ART.mostar = ctx => {
  _r(ctx, -10, -4.4, 20, 4.4, '#3fa3a8');
  for (let i = -9; i < 9; i += 3) _r(ctx, i, -3.4, 2, 0.32, 'rgba(255,255,255,0.4)');
  _p(ctx, [[-10, 0], [-6.4, 0], [-6.4, -6], [-10, -6]], '#a08e6e');
  _p(ctx, [[10, 0], [6.4, 0], [6.4, -6], [10, -6]], '#a08e6e');
  // hoher Steinbogen
  ctx.fillStyle = '#efe4c8';
  ctx.beginPath();
  ctx.moveTo(-7.6, -5.4);
  ctx.quadraticCurveTo(0, -17.4, 7.6, -5.4);
  ctx.lineTo(7.6, -4);
  ctx.quadraticCurveTo(0, -14.6, -7.6, -4);
  ctx.closePath(); ctx.fill();
  // Brüstung
  ctx.strokeStyle = '#d8c9a4'; ctx.lineWidth = 0.75;
  ctx.beginPath();
  ctx.moveTo(-7.6, -6.6); ctx.quadraticCurveTo(0, -18.6, 7.6, -6.6); ctx.stroke();
  // Treppenstufen auf dem Brückenrücken
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-7.6, -5.4);
  ctx.quadraticCurveTo(0, -17.4, 7.6, -5.4);
  ctx.lineTo(7.6, -4);
  ctx.quadraticCurveTo(0, -14.6, -7.6, -4);
  ctx.closePath(); ctx.clip();
  ctx.strokeStyle = '#d3c39c'; ctx.lineWidth = 0.3;
  for (let x = -7; x <= 7; x += 1.4) _line(ctx, x, -18, x, -3, '#d3c39c', 0.3);
  ctx.restore();
  // Wehrtürme an beiden Enden
  for (const x of [-8.6, 8.6]) {
    _r(ctx, x - 1.6, -13, 3.2, 7.4, '#e4d6b2');
    _r(ctx, x + 0.2, -13, 1.4, 7.4, '#cdbd94');
    _win(ctx, x - 0.9, -11.6, 1, 1, 0.8, 1.3, '#7d6a48');
    _p(ctx, [[x - 2, -13], [x + 2, -13], [x, -15.8]], '#8a6a46');
  }
};

/* Serbien – Festung Kalemegdan */
LM_ART.fortress = ctx => {
  _r(ctx, -10, -2.6, 20, 2.6, '#4a93c4');
  _p(ctx, [[-10, -2.6], [10, -2.6], [9, -5.4], [-9, -5.4]], '#8d9a6c');
  _r(ctx, -9, -11, 18, 5.8, '#ded0ae');
  _r(ctx, -9, -11.6, 18, 0.8, '#eadcbb');
  for (let i = -9; i < 9; i += 2.2) _r(ctx, i, -12.6, 1.4, 1.1, '#e4d7b4');
  // Schießscharten
  for (let i = -7.6; i < 8; i += 2.2) _r(ctx, i, -9.4, 0.7, 2, '#7d6e4e');
  // Tor
  ctx.fillStyle = '#5b4a30';
  ctx.beginPath();
  ctx.moveTo(-1.8, -5.2); ctx.lineTo(-1.8, -8.4);
  ctx.quadraticCurveTo(0, -10.4, 1.8, -8.4); ctx.lineTo(1.8, -5.2); ctx.closePath(); ctx.fill();
  // Turm
  _r(ctx, -8.4, -17, 4.6, 6.2, '#e8dab6');
  _r(ctx, -5.4, -17, 1.6, 6.2, '#d2c29c');
  for (let i = -8.6; i < -3.8; i += 1.4) _r(ctx, i, -18, 1, 1.1, '#efe2c0');
  _win(ctx, -7.4, -15.4, 2, 1.8, 0.8, 1.4, '#7d6e4e');
  // Uhrturm rechts
  _r(ctx, 4.6, -18.4, 3.4, 7.6, '#e8dab6');
  _c(ctx, 6.3, -16.6, 1, '#f6efdb');
  _c(ctx, 6.3, -16.6, 0.78, '#ffffff');
  _line(ctx, 6.3, -16.6, 6.3, -17.2, '#3b3128', 0.22);
  _p(ctx, [[4.2, -18.4], [8.4, -18.4], [6.3, -21.4]], '#4f5f6f');
};

/* Montenegro – Bucht von Kotor */
LM_ART.kotor = ctx => {
  _p(ctx, [[-10, -4.6], [-5, -17], [1, -4.6]], '#5d6b5a');
  _p(ctx, [[1, -4.6], [6.4, -14.4], [10, -4.6]], '#6b7a64');
  // Zickzack-Mauer den Berg hinauf
  ctx.strokeStyle = '#d6c8a6'; ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(-6.6, -5); ctx.lineTo(-3.6, -8); ctx.lineTo(-6.2, -10.4);
  ctx.lineTo(-4, -13); ctx.lineTo(-5.2, -15.4);
  ctx.stroke();
  _r(ctx, -5.8, -16.6, 1.4, 1.4, '#e4d6b2');
  _r(ctx, -10, -4.6, 20, 4.6, '#2f8fb4');
  for (let i = -9; i < 9; i += 3) _r(ctx, i, -3.4, 2, 0.32, 'rgba(255,255,255,0.4)');
  // Altstadt am Wasser
  for (const [x, y, w, h] of [[-4.4, -8.4, 2.6, 3.8], [-1.4, -9.2, 2.4, 4.6], [1.4, -8.2, 2.8, 3.6], [4.6, -9, 2.4, 4.4]]) {
    _r(ctx, x, y, w, h, '#f0e2c2');
    _p(ctx, [[x - 0.3, y], [x + w + 0.3, y], [x + w / 2, y - 1.2]], C.roof);
    _win(ctx, x + 0.4, y + 1.2, 2, 1.1, 0.6, 0.8, '#8a7550');
  }
  _r(ctx, 0.2, -12.4, 1.4, 3.4, '#f4e8ca');
  _p(ctx, [[-0.2, -12.4], [2, -12.4], [0.9, -14.4]], C.roofD);
  // Boot
  _p(ctx, [[5.6, -4.6], [8.8, -4.6], [8.2, -5.6], [6.2, -5.6]], '#ffffff');
};

/* Albanien und Kosovo – Festung aus Stein */
LM_ART.stonecastle = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [8.4, -4.4], [-1, -6.2], [-8.6, -3.8]], '#93956f');
  _p(ctx, [[-8.6, -3.8], [-1, -6.2], [8.4, -4.4], [7.8, -3.6], [-1, -5.2], [-8.2, -3]], '#a8a87e');
  // Mauerring
  _r(ctx, -8, -12, 16, 7, '#cfc4a8');
  for (let i = 0; i < 4; i++) _r(ctx, -8, -11.4 + i * 1.7, 16, 0.3, '#b8ac8e');
  _r(ctx, -8, -12.6, 16, 0.8, '#ded3b6');
  for (let i = -8; i < 8; i += 2.1) _r(ctx, i, -13.6, 1.3, 1.1, '#d8ccae');
  _win(ctx, -6.4, -10.4, 6, 2.1, 0.7, 1.5, '#6f6248');
  // Tor mit Rundbogen
  ctx.fillStyle = '#524630';
  ctx.beginPath();
  ctx.moveTo(-1.5, -5); ctx.lineTo(-1.5, -8);
  ctx.quadraticCurveTo(0, -9.8, 1.5, -8); ctx.lineTo(1.5, -5); ctx.closePath(); ctx.fill();
  // Ecktürme mit Steinplattendach
  for (const x of [-8.2, 8.2]) {
    _r(ctx, x - 1.8, -16.4, 3.6, 5.4, '#d8ccb0');
    _r(ctx, x + 0.2, -16.4, 1.6, 5.4, '#bfb294');
    _win(ctx, x - 0.9, -15, 1, 1, 0.8, 1.3, '#6f6248');
    _p(ctx, [[x - 2.4, -16.4], [x + 2.4, -16.4], [x + 1.6, -18.2], [x - 1.6, -18.2]], '#8d8a7c');
    _p(ctx, [[x - 1.6, -18.2], [x + 1.6, -18.2], [x, -19.6]], '#9d9a8a');
  }
};

/* Nordmazedonien – Kirche am Ohridsee */
LM_ART.ohrid = ctx => {
  _r(ctx, -10, -5.4, 20, 5.4, '#2f93b4');
  for (let i = -9; i < 9; i += 3) _r(ctx, i, -4.2, 2, 0.32, 'rgba(255,255,255,0.4)');
  _p(ctx, [[4, -5.4], [7, -13.4], [10, -5.4]], '#6e7f66');
  // Klippe
  _p(ctx, [[-9, -5.4], [-8.4, -11.4], [-1.4, -12.6], [2.6, -10.4], [3.4, -5.4]], '#a08b68');
  _p(ctx, [[-8.4, -11.4], [-1.4, -12.6], [2.6, -10.4], [2.4, -9.6], [-1.4, -11.6], [-8.2, -10.4]], '#5f8f4a');
  // Kirche mit Kuppel
  _r(ctx, -5.4, -17, 6.4, 4.6, '#efe2c6');
  _r(ctx, -1.6, -17, 2.6, 4.6, '#dccdab');
  _win(ctx, -4.4, -15.8, 3, 1.5, 0.7, 1.6, '#8a7550');
  _p(ctx, [[-6, -17], [1.6, -17], [0.8, -18], [-5.2, -18]], C.roofD);
  _r(ctx, -3.4, -20, 2.4, 2.2, '#e8dbbd');
  ctx.fillStyle = '#b8967a';
  ctx.beginPath(); ctx.ellipse(-2.2, -20, 1.9, 1.7, 0, Math.PI, 0); ctx.fill();
  _line(ctx, -2.2, -21.7, -2.2, -22.8, C.goldD, 0.3);
  _line(ctx, -2.8, -22.3, -1.6, -22.3, C.goldD, 0.3);
  // Zypressen
  for (const x of [1.8, 3]) _p(ctx, [[x - 0.6, -10.4], [x + 0.6, -10.4], [x, -14.4]], '#2f5f3c');
};

/* Bulgarien – Rila-Kloster */
LM_ART.monastery = ctx => {
  _p(ctx, [[-10, -4], [-5, -14], [0, -4]], '#66785f');
  _p(ctx, [[2, -4], [7, -15], [10, -4]], '#5e7058');
  _p(ctx, [[-10, 0], [10, 0], [10, -3.4], [-10, -4]], '#7fa05e');
  // Klostergebäude mit schwarz-weißen Bögen
  _r(ctx, -9, -12, 18, 8, '#f0e6d2');
  _r(ctx, -9, -12.8, 18, 0.9, '#8a5f3c');
  for (let row = 0; row < 2; row++) {
    const y = -5.4 - row * 3.2;
    for (let i = 0; i < 8; i++) {
      const x = -8 + i * 2.25;
      ctx.fillStyle = row ? '#3b3630' : '#5b5248';
      ctx.beginPath();
      ctx.moveTo(x - 0.75, y); ctx.lineTo(x - 0.75, y - 1.3);
      ctx.quadraticCurveTo(x, y - 2.5, x + 0.75, y - 1.3);
      ctx.lineTo(x + 0.75, y); ctx.closePath(); ctx.fill();
      _r(ctx, x - 1.05, y - 2.7, 2.1, 0.45, '#c9302c');
    }
    _r(ctx, -9, y + 0.1, 18, 0.5, '#d8c8a8');
  }
  // Kirche mit Kuppeln davor
  _r(ctx, -3.2, -9.4, 6.4, 5.4, '#f6efdd');
  _p(ctx, [[-3.8, -9.4], [3.8, -9.4], [3, -10.4], [-3, -10.4]], C.roofD);
  for (const [x, r] of [[-1.8, 1.1], [1.8, 1.1], [0, 1.7]]) {
    _r(ctx, x - r * 0.62, -10.4 - r * 1.5, r * 1.24, r * 1.5, '#e4d6b6');
    ctx.fillStyle = '#9c8258';
    ctx.beginPath(); ctx.ellipse(x, -10.4 - r * 1.5, r, r * 1.1, 0, Math.PI, 0); ctx.fill();
    _line(ctx, x, -10.4 - r * 1.5 - r * 1.1, x, -10.4 - r * 1.5 - r * 1.1 - 1, C.goldD, 0.28);
  }
};

/* Rumänien – Schloss Bran */
LM_ART.brancastle = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [8, -4], [-1, -6], [-9, -3.4]], '#6f7f5c');
  _p(ctx, [[-9, -3.4], [-1, -6], [8, -4], [7.4, -3.2], [-1, -5], [-8.6, -2.6]], '#85976a');
  // verschachtelte Baukörper
  _r(ctx, -6.6, -12, 6, 7, '#efe4cc');
  _r(ctx, -2.4, -14.4, 5.4, 9.2, '#f4ead4');
  _r(ctx, 1.2, -14.4, 1.8, 9.2, '#ddd0b2');
  _r(ctx, 2.6, -10.6, 4, 5.4, '#e8dcc2');
  _win(ctx, -5.6, -10.6, 3, 1.7, 0.8, 1.3, '#7b6a4e');
  _win(ctx, -1.4, -13, 3, 1.5, 0.8, 1.3, '#7b6a4e');
  _win(ctx, 3.2, -9.4, 2, 1.6, 0.8, 1.2, '#7b6a4e');
  // spitze Dächer
  _p(ctx, [[-7.2, -12], [0, -12], [-3.6, -16.4]], C.roofD);
  _p(ctx, [[-7.2, -12], [-3.6, -12], [-3.6, -16.4]], C.roof);
  _p(ctx, [[-3, -14.4], [3.6, -14.4], [0.3, -19.4]], C.roofD);
  _p(ctx, [[-3, -14.4], [0.3, -14.4], [0.3, -19.4]], C.roof);
  _p(ctx, [[2, -10.6], [7.2, -10.6], [4.6, -14]], C.roofD);
  // Rundturm
  _r(ctx, 5.6, -13.4, 2.8, 8.2, '#f0e6ce');
  _p(ctx, [[5, -13.4], [9, -13.4], [7, -17.2]], C.roofD);
  _c(ctx, -3.6, -17, 0.3, '#5c5148');
};

/* Moldau – Höhlenkloster Orheiul Vechi */
LM_ART.cavemonastery = ctx => {
  _r(ctx, -10, -2.4, 20, 2.4, '#4f9ec4');
  _p(ctx, [[-10, -2.4], [10, -2.4], [10, -14], [2, -16], [-6, -15], [-10, -12]], '#b8a17c');
  _p(ctx, [[-10, -12], [-6, -15], [2, -16], [10, -14], [10, -12.6], [2, -14.6], [-6, -13.6], [-10, -10.8]], '#8ea86a');
  // Gesteinsschichten
  for (let i = 0; i < 5; i++) _r(ctx, -10, -11 + i * 1.8, 20, 0.35, '#a08b68');
  // Eingang in den Fels
  ctx.fillStyle = '#4a3d2c';
  ctx.beginPath();
  ctx.moveTo(-2.6, -2.4); ctx.lineTo(-2.6, -6);
  ctx.quadraticCurveTo(-1.2, -8, 0.2, -6); ctx.lineTo(0.2, -2.4); ctx.closePath(); ctx.fill();
  _r(ctx, -2.2, -5.6, 1.4, 3.2, '#7d5f3c');
  // kleine Fensterluken im Fels
  for (const [x, y] of [[-6.4, -7.4], [-5, -9], [3.4, -8], [5.2, -9.4]]) _r(ctx, x, y, 1, 1.2, '#4a3d2c');
  // Glockenturm oben mit Kreuz
  _r(ctx, 0.6, -19.6, 2.8, 4.2, '#f0e6d0');
  _p(ctx, [[0.2, -19.6], [3.8, -19.6], [2, -21.8]], '#8a6a46');
  _line(ctx, 2, -21.8, 2, -22.8, C.goldD, 0.3);
  _line(ctx, 1.4, -22.4, 2.6, -22.4, C.goldD, 0.3);
  _r(ctx, 1.4, -18.6, 1.2, 1.4, '#6f5c40');
};

/* Ukraine – Sophienkathedrale */
LM_ART.sophia = ctx => {
  _base(ctx, 10, '#b5a888');
  _r(ctx, -7.4, -11, 14.8, 9, '#f4f0e4');
  _r(ctx, 3.4, -11, 4, 9, '#e0dacb');
  for (let i = 0; i < 5; i++) {
    const x = -6.2 + i * 2.6;
    ctx.fillStyle = '#7fa8c4';
    ctx.beginPath();
    ctx.moveTo(x - 0.7, -3.4); ctx.lineTo(x - 0.7, -6.4);
    ctx.quadraticCurveTo(x, -8.2, x + 0.7, -6.4); ctx.lineTo(x + 0.7, -3.4); ctx.closePath(); ctx.fill();
  }
  _r(ctx, -7.8, -11.8, 15.6, 0.9, '#e8e2d2');
  // goldene Zwiebelkuppeln
  const dome = (x, y, r) => {
    _r(ctx, x - r * 0.55, y, r * 1.1, r * 1.3, '#efe8d8');
    ctx.fillStyle = C.goldD;
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.bezierCurveTo(x - r * 1.15, y - r * 1.1, x - r * 0.5, y - r * 1.5, x, y - r * 2.1);
    ctx.bezierCurveTo(x + r * 0.5, y - r * 1.5, x + r * 1.15, y - r * 1.1, x + r, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.gold;
    ctx.beginPath();
    ctx.moveTo(x - r * 0.55, y);
    ctx.bezierCurveTo(x - r * 0.7, y - r * 1.05, x - r * 0.3, y - r * 1.4, x - r * 0.1, y - r * 1.9);
    ctx.bezierCurveTo(x + r * 0.1, y - r * 1.3, x + r * 0.2, y - r * 0.9, x + r * 0.1, y);
    ctx.closePath(); ctx.fill();
    _line(ctx, x, y - r * 2.1, x, y - r * 2.1 - 1, C.goldD, 0.28);
    _line(ctx, x - 0.4, y - r * 2.1 - 0.6, x + 0.4, y - r * 2.1 - 0.6, C.goldD, 0.25);
  };
  dome(-4.6, -12, 1.2);
  dome(4.6, -12, 1.2);
  dome(0, -13.6, 2);
};

/* Ungarn – Parlament in Budapest */
LM_ART.parliament = ctx => {
  _r(ctx, -10, -2.6, 20, 2.6, '#4a93c4');
  for (let i = -9; i < 9; i += 3) _r(ctx, i, -1.8, 2, 0.3, 'rgba(255,255,255,0.4)');
  _base(ctx, 10, '#c4b896');
  // langer Baukörper
  _r(ctx, -9.6, -10, 19.2, 7.4, '#f2ead8');
  for (let i = 0; i < 12; i++) {
    const x = -9 + i * 1.65;
    ctx.fillStyle = '#c9bd9e';
    ctx.beginPath();
    ctx.moveTo(x - 0.4, -2.6); ctx.lineTo(x - 0.4, -6.4);
    ctx.quadraticCurveTo(x, -7.6, x + 0.4, -6.4); ctx.lineTo(x + 0.4, -2.6); ctx.closePath(); ctx.fill();
  }
  _r(ctx, -9.6, -10.6, 19.2, 0.8, '#e2d7bb');
  // Türmchen entlang des Dachs
  for (const x of [-8.6, -6.4, -4.2, 4.2, 6.4, 8.6]) {
    _r(ctx, x - 0.65, -13.4, 1.3, 2.9, '#ece2ca');
    _p(ctx, [[x - 0.95, -13.4], [x + 0.95, -13.4], [x, -15.6]], '#6f8a7a');
  }
  // Mittelkuppel
  _r(ctx, -2.8, -13.4, 5.6, 3, '#f4ecd8');
  ctx.fillStyle = '#7d9c8c';
  ctx.beginPath(); ctx.ellipse(0, -13.4, 3.2, 3.6, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#93b0a0';
  ctx.beginPath(); ctx.ellipse(-0.9, -13.7, 1.7, 2.9, 0, Math.PI, 0); ctx.fill();
  _r(ctx, -0.7, -18.4, 1.4, 1.4, '#e8dec6');
  _p(ctx, [[-1, -18.4], [1, -18.4], [0, -20.6]], '#6f8a7a');
  _c(ctx, 0, -21, 0.35, '#c0392b');
};

/* Griechenland – Akropolis */
LM_ART.acropolis = ctx => {
  _p(ctx, [[-10, 0], [10, 0], [9, -4.6], [2, -6.6], [-8, -5.4]], '#b0a07c');
  _p(ctx, [[-8, -5.4], [2, -6.6], [9, -4.6], [8.4, -3.8], [2, -5.6], [-7.6, -4.4]], '#c2b38c');
  // Stufenbau
  _p(ctx, [[-8.4, -6], [8.4, -6.8], [7.8, -8], [-7.8, -7.2]], '#ded1ae');
  _p(ctx, [[-7.8, -7.2], [7.8, -8], [7.2, -9], [-7.2, -8.2]], '#eadebe');
  // Säulen
  for (let i = 0; i < 9; i++) {
    const x = -6.6 + i * 1.65;
    const top = -17.4 + i * 0.1;
    _r(ctx, x - 0.55, top, 1.1, 9.4, '#f2e9d2');
    _r(ctx, x + 0.15, top, 0.4, 9.4, '#dbceae');
    for (let k = 0; k < 4; k++) _r(ctx, x - 0.55, top + 1.8 + k * 2.1, 1.1, 0.2, '#d4c6a4');
    _r(ctx, x - 0.75, top - 0.7, 1.5, 0.75, '#f6efdb');
  }
  // Gebälk und Giebel
  _p(ctx, [[-8, -18.1], [8, -18.6], [8, -19.8], [-8, -19.3]], '#f0e7d0');
  _p(ctx, [[-8.4, -19.3], [8.4, -19.8], [0, -22.6]], '#e8ddc2');
  _p(ctx, [[-7, -19.6], [7, -20], [0, -21.9]], '#d6c8a4');
};

/* Zypern – Felsen der Aphrodite */
LM_ART.aphrodite = ctx => {
  _r(ctx, -10, -5.6, 20, 5.6, '#31a2c8');
  _p(ctx, [[-10, -5.6], [10, -5.6], [10, -4.4], [-10, -4.4]], '#4fb8d8');
  for (let i = -9; i < 9; i += 2.8) {
    _r(ctx, i, -3.4, 2, 0.4, 'rgba(255,255,255,0.55)');
    _r(ctx, i + 1.2, -2, 1.6, 0.35, 'rgba(255,255,255,0.4)');
  }
  // Kiesstrand
  _p(ctx, [[-10, 0], [10, 0], [10, -1.6], [-10, -2]], '#e0d2b0');
  // großer Felsen
  _p(ctx, [[-4.4, -5.2], [-3, -14.6], [-0.6, -17.4], [1.8, -14], [2.8, -5.2]], '#a89880');
  _p(ctx, [[-0.6, -17.4], [1.8, -14], [2.8, -5.2], [0.6, -5.2]], '#8d7e68');
  _p(ctx, [[-2.4, -12.6], [-1, -14.4], [-0.2, -12], [-1.8, -11]], '#c0b198');
  // kleinere Felsen
  _p(ctx, [[3.6, -5.2], [5, -9.4], [6.6, -5.2]], '#9c8d76');
  _p(ctx, [[-7.4, -5], [-6.4, -8], [-5.2, -5]], '#9c8d76');
  // Gischt
  _c(ctx, -4.6, -5.4, 1.2, 'rgba(255,255,255,0.75)');
  _c(ctx, 3.2, -5.6, 1, 'rgba(255,255,255,0.65)');
  _c(ctx, 6.8, -5.2, 0.8, 'rgba(255,255,255,0.55)');
};

/* ---------- Zeichnen ---------- */

/* Wahrzeichen zeichnen. cx = Mitte, groundY = Standlinie, scale = Größe */
function drawLandmark(ctx, art, cx, groundY, scale) {
  const fn = LM_ART[art];
  if (!fn) return;
  ctx.save();
  ctx.translate(cx, groundY);
  ctx.scale(scale, scale);
  fn(ctx);
  ctx.restore();
}

/* Wahrzeichen als eigenes Canvas (für Infokarte und Listen) */
const _lmCache = new Map();
function landmarkCanvas(art, w, h) {
  const key = art + '@' + w + 'x' + h;
  if (_lmCache.has(key)) return _lmCache.get(key);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cv = document.createElement('canvas');
  cv.width = w * dpr; cv.height = h * dpr;
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  const scale = Math.min(w / 21, h / 24);
  drawLandmark(ctx, art, w / 2, h - 2, scale);
  cv._cssW = w; cv._cssH = h;
  _lmCache.set(key, cv);
  return cv;
}

function landmarkEl(art, w = 96, h = 104) {
  const src = landmarkCanvas(art, w, h);
  const img = document.createElement('img');
  img.src = src.toDataURL();
  img.width = w; img.height = h;
  img.alt = '';
  img.className = 'lm-img';
  return img;
}
