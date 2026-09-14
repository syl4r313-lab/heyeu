/* ============================================================
   hey EU – Flaggen
   Alle Flaggen werden selbst gezeichnet (keine Emoji-Zeichen).
   Seitenverhältnis 3:2. Wappen und feine Details erscheinen erst
   ab einer gewissen Größe, damit kleine Flaggen sauber bleiben.
   ============================================================ */

const FlagArt = {};   // id -> function(ctx, w, h)

/* ---------- Bausteine ---------- */

function fBands(colors, horizontal) {
  return (ctx, w, h) => {
    const n = colors.length;
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = colors[i];
      if (horizontal) {
        const y0 = Math.round(h * i / n), y1 = Math.round(h * (i + 1) / n);
        ctx.fillRect(0, y0, w, y1 - y0);
      } else {
        const x0 = Math.round(w * i / n), x1 = Math.round(w * (i + 1) / n);
        ctx.fillRect(x0, 0, x1 - x0, h);
      }
    }
  };
}

/* Skandinavisches Kreuz: Balken sitzt links vom Mittelpunkt */
function fNordic(field, cross, inner) {
  return (ctx, w, h) => {
    ctx.fillStyle = field;
    ctx.fillRect(0, 0, w, h);
    const t = Math.max(2, Math.round(h * 0.22));      // Balkendicke
    const cx = Math.round(w * 0.36), cy = Math.round((h - t) / 2);
    const drawCross = (col, thick) => {
      ctx.fillStyle = col;
      const off = Math.round((t - thick) / 2);
      ctx.fillRect(0, cy + off, w, thick);
      ctx.fillRect(cx + off, 0, thick, h);
    };
    drawCross(cross, t);
    if (inner) drawCross(inner, Math.max(1, Math.round(t * 0.45)));
  };
}

/* Einfaches Wappenschild in der Mitte – nur als Andeutung */
function shield(ctx, x, y, w, h, fill, line) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h * 0.55);
  ctx.quadraticCurveTo(x + w, y + h, x + w / 2, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h * 0.55);
  ctx.closePath();
  ctx.fill();
  if (line) { ctx.strokeStyle = line; ctx.lineWidth = Math.max(0.5, w * 0.08); ctx.stroke(); }
}

function star(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const rr = i % 2 ? r * 0.42 : r;
    ctx[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

/* ---------- Die Flaggen ---------- */

/* Senkrechte Trikoloren */
FlagArt.fr = fBands(['#002395', '#ffffff', '#ed2939'], false);
FlagArt.it = fBands(['#008c45', '#f4f5f0', '#cd212a'], false);
FlagArt.ie = fBands(['#169b62', '#ffffff', '#ff883e'], false);
FlagArt.be = fBands(['#141414', '#fdda24', '#ef3340'], false);
FlagArt.ro = fBands(['#002b7f', '#fcd116', '#ce1126'], false);

/* Waagerechte Streifen */
FlagArt.de = fBands(['#141414', '#dd0000', '#ffce00'], true);
FlagArt.nl = fBands(['#ae1c28', '#ffffff', '#21468b'], true);
FlagArt.lu = fBands(['#ed2939', '#ffffff', '#00a1de'], true);
FlagArt.hu = fBands(['#ce2939', '#ffffff', '#477050'], true);
FlagArt.bg = fBands(['#ffffff', '#00966e', '#d62612'], true);
FlagArt.lt = fBands(['#fdb913', '#006a44', '#c1272d'], true);
FlagArt.ee = fBands(['#0072ce', '#141414', '#ffffff'], true);
FlagArt.at = fBands(['#ed2939', '#ffffff', '#ed2939'], true);
FlagArt.ua = fBands(['#0057b7', '#ffd700'], true);
FlagArt.pl = fBands(['#ffffff', '#dc143c'], true);
FlagArt.mc = fBands(['#ce1126', '#ffffff'], true);
FlagArt.sm = fBands(['#ffffff', '#5eb6e4'], true);

/* Skandinavische Kreuze */
FlagArt.dk = fNordic('#c60c30', '#ffffff');
FlagArt.se = fNordic('#005293', '#fecb00');
FlagArt.fi = fNordic('#ffffff', '#002f6c');
FlagArt.no = fNordic('#ba0c2f', '#ffffff', '#00205b');
FlagArt.is = fNordic('#02529c', '#ffffff', '#dc1e35');

/* Großbritannien – Union Jack */
FlagArt.uk = (ctx, w, h) => {
  ctx.fillStyle = '#012169';
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
  // diagonale Andreaskreuze: erst weiß, dann rot versetzt
  ctx.lineCap = 'butt';
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = h * 0.3;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, h); ctx.moveTo(w, 0); ctx.lineTo(0, h); ctx.stroke();
  ctx.strokeStyle = '#c8102e'; ctx.lineWidth = h * 0.12;
  const off = h * 0.09;
  ctx.beginPath();
  ctx.moveTo(0, -off); ctx.lineTo(w, h - off);
  ctx.moveTo(0, off); ctx.lineTo(w, h + off);
  ctx.moveTo(w, -off); ctx.lineTo(0, h - off);
  ctx.moveTo(w, off); ctx.lineTo(0, h + off);
  ctx.stroke();
  // gerades Georgskreuz
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = h * 0.34;
  ctx.beginPath();
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
  ctx.strokeStyle = '#c8102e'; ctx.lineWidth = h * 0.2;
  ctx.beginPath();
  ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
  ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
  ctx.restore();
};

/* Spanien */
FlagArt.es = (ctx, w, h) => {
  ctx.fillStyle = '#aa151b'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#f1bf00'; ctx.fillRect(0, Math.round(h * 0.25), w, Math.round(h * 0.5));
  if (h >= 14) shield(ctx, w * 0.22, h * 0.34, w * 0.13, h * 0.32, '#c8102e', '#7a1015');
};

/* Portugal */
FlagArt.pt = (ctx, w, h) => {
  ctx.fillStyle = '#046a38'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#da291c'; ctx.fillRect(Math.round(w * 0.4), 0, w - Math.round(w * 0.4), h);
  const cx = w * 0.4, cy = h / 2, r = h * 0.26;
  ctx.fillStyle = '#ffe900';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#046a38';
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.66, 0, Math.PI * 2); ctx.fill();
  if (h >= 14) shield(ctx, cx - r * 0.34, cy - r * 0.5, r * 0.68, r * 1.0, '#ffffff', '#da291c');
};

/* Schweiz – weißes Kreuz auf Rot */
FlagArt.ch = (ctx, w, h) => {
  ctx.fillStyle = '#d52b1e'; ctx.fillRect(0, 0, w, h);
  const a = h * 0.62, t = a * 0.32;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(w / 2 - a / 2, h / 2 - t / 2, a, t);
  ctx.fillRect(w / 2 - t / 2, h / 2 - a / 2, t, a);
};

/* Griechenland – neun Streifen und Kreuzfeld */
FlagArt.gr = (ctx, w, h) => {
  const blue = '#0d5eaf';
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = i % 2 ? '#ffffff' : blue;
    const y0 = Math.round(h * i / 9), y1 = Math.round(h * (i + 1) / 9);
    ctx.fillRect(0, y0, w, y1 - y0);
  }
  const s = Math.round(h * 5 / 9);
  ctx.fillStyle = blue; ctx.fillRect(0, 0, s, s);
  const t = Math.max(1, Math.round(s * 0.2));
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, (s - t) / 2, s, t);
  ctx.fillRect((s - t) / 2, 0, t, s);
};

/* Tschechien */
FlagArt.cz = (ctx, w, h) => {
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h / 2);
  ctx.fillStyle = '#d7141a'; ctx.fillRect(0, h / 2, w, h / 2);
  ctx.fillStyle = '#11457e';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w * 0.5, h / 2); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
};

/* Lettland – schmaler weißer Streifen */
FlagArt.lv = (ctx, w, h) => {
  ctx.fillStyle = '#9e3039'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, Math.round(h * 0.4), w, Math.max(1, Math.round(h * 0.2)));
};

/* Slowakei */
FlagArt.sk = (ctx, w, h) => {
  fBands(['#ffffff', '#0b4ea2', '#ee1c25'], true)(ctx, w, h);
  if (h < 14) return;
  shield(ctx, w * 0.26, h * 0.26, w * 0.2, h * 0.48, '#ee1c25', '#ffffff');
  ctx.fillStyle = '#ffffff';
  const cx = w * 0.36, cy = h * 0.44, t = Math.max(1, h * 0.05);
  ctx.fillRect(cx - t / 2, cy - h * 0.13, t, h * 0.28);
  ctx.fillRect(cx - h * 0.07, cy - h * 0.06, h * 0.14, t);
  ctx.fillRect(cx - h * 0.05, cy - h * 0.12, h * 0.1, t);
};

/* Slowenien */
FlagArt.si = (ctx, w, h) => {
  fBands(['#ffffff', '#0000a0', '#d50000'], true)(ctx, w, h);
  if (h < 14) return;
  shield(ctx, w * 0.16, h * 0.16, w * 0.17, h * 0.45, '#0000a0', '#d50000');
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(w * 0.245, h * 0.26); ctx.lineTo(w * 0.31, h * 0.48); ctx.lineTo(w * 0.18, h * 0.48);
  ctx.closePath(); ctx.fill();
};

/* Kroatien */
FlagArt.hr = (ctx, w, h) => {
  fBands(['#ff0000', '#ffffff', '#171796'], true)(ctx, w, h);
  if (h < 12) return;
  const sw = w * 0.16, sh = h * 0.4, sx = (w - sw) / 2, sy = h * 0.28;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(sx, sy); ctx.lineTo(sx + sw, sy);
  ctx.lineTo(sx + sw, sy + sh * 0.5);
  ctx.quadraticCurveTo(sx + sw, sy + sh, sx + sw / 2, sy + sh);
  ctx.quadraticCurveTo(sx, sy + sh, sx, sy + sh * 0.5);
  ctx.closePath(); ctx.clip();
  const cs = sw / 4;
  for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) {
    ctx.fillStyle = (r + c) % 2 ? '#ff0000' : '#ffffff';
    ctx.fillRect(sx + c * cs, sy + r * cs, cs + 0.5, cs + 0.5);
  }
  ctx.restore();
};

/* Serbien */
FlagArt.rs = (ctx, w, h) => {
  fBands(['#c6363c', '#0c4076', '#ffffff'], true)(ctx, w, h);
  if (h >= 14) shield(ctx, w * 0.24, h * 0.24, w * 0.16, h * 0.44, '#c6363c', '#ffffff');
};

/* Montenegro */
FlagArt.me = (ctx, w, h) => {
  ctx.fillStyle = '#c40308'; ctx.fillRect(0, 0, w, h);
  const b = Math.max(1, h * 0.07);
  ctx.strokeStyle = '#d4af37'; ctx.lineWidth = b;
  ctx.strokeRect(b / 2, b / 2, w - b, h - b);
  if (h >= 12) {
    ctx.fillStyle = '#d4af37';
    ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w * 0.14, h * 0.24, 0, 0, Math.PI * 2); ctx.fill();
  }
};

/* Albanien – Doppeladler als Silhouette */
FlagArt.al = (ctx, w, h) => {
  ctx.fillStyle = '#e41e20'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#141414';
  const cx = w / 2, cy = h * 0.54, s = h * 0.3;
  // Körper mit Schwanz
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.28, cy - s * 0.45);
  ctx.lineTo(cx + s * 0.28, cy - s * 0.45);
  ctx.lineTo(cx + s * 0.22, cy + s * 0.75);
  ctx.lineTo(cx + s * 0.4, cy + s * 1.05);
  ctx.lineTo(cx - s * 0.4, cy + s * 1.05);
  ctx.lineTo(cx - s * 0.22, cy + s * 0.75);
  ctx.closePath(); ctx.fill();
  // Flügel, jeweils mit zwei Federstufen
  for (const sg of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + sg * s * 0.22, cy - s * 0.4);
    ctx.lineTo(cx + sg * s * 1.25, cy - s * 0.15);
    ctx.lineTo(cx + sg * s * 0.95, cy + s * 0.1);
    ctx.lineTo(cx + sg * s * 1.15, cy + s * 0.42);
    ctx.lineTo(cx + sg * s * 0.28, cy + s * 0.5);
    ctx.closePath(); ctx.fill();
  }
  // zwei Köpfe mit Schnäbeln
  for (const sg of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(cx + sg * s * 0.42, cy - s * 0.72, s * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + sg * s * 0.6, cy - s * 0.82);
    ctx.lineTo(cx + sg * s * 1.0, cy - s * 0.72);
    ctx.lineTo(cx + sg * s * 0.6, cy - s * 0.6);
    ctx.closePath(); ctx.fill();
  }
};

/* Nordmazedonien – Sonne mit Strahlen */
FlagArt.mk = (ctx, w, h) => {
  ctx.fillStyle = '#d20000'; ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;
  ctx.fillStyle = '#ffe600';
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a - 0.13) * w, cy + Math.sin(a - 0.13) * w);
    ctx.lineTo(cx + Math.cos(a + 0.13) * w, cy + Math.sin(a + 0.13) * w);
    ctx.closePath(); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(cx, cy, h * 0.17, 0, Math.PI * 2); ctx.fill();
};

/* Bosnien-Herzegowina */
FlagArt.ba = (ctx, w, h) => {
  ctx.fillStyle = '#002395'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#fecb00';
  ctx.beginPath();
  ctx.moveTo(w * 0.26, 0); ctx.lineTo(w * 0.78, 0); ctx.lineTo(w * 0.26, h); ctx.closePath(); ctx.fill();
  if (h < 12) return;
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
  for (let i = 0; i < 6; i++) {
    star(ctx, w * 0.19 + i * w * 0.105, h * 0.9 - i * h * 0.17, h * 0.075, '#ffffff');
  }
  ctx.restore();
};

/* Kosovo */
FlagArt.xk = (ctx, w, h) => {
  ctx.fillStyle = '#244aa5'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#d0a650';
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.62, w * 0.17, h * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();
  if (h < 12) return;
  for (let i = 0; i < 6; i++) {
    const t = (i - 2.5) / 2.5;
    star(ctx, w / 2 + t * w * 0.21, h * 0.2 + Math.abs(t) * h * 0.07, h * 0.06, '#ffffff');
  }
};

/* Zypern */
FlagArt.cy = (ctx, w, h) => {
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#d57800';
  ctx.beginPath();
  ctx.moveTo(w * 0.34, h * 0.36); ctx.lineTo(w * 0.58, h * 0.32);
  ctx.lineTo(w * 0.7, h * 0.44); ctx.lineTo(w * 0.52, h * 0.52);
  ctx.lineTo(w * 0.36, h * 0.48); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#4e9c3f'; ctx.lineWidth = Math.max(1, h * 0.05);
  ctx.beginPath();
  ctx.moveTo(w * 0.42, h * 0.6); ctx.quadraticCurveTo(w * 0.5, h * 0.74, w * 0.46, h * 0.8);
  ctx.moveTo(w * 0.58, h * 0.6); ctx.quadraticCurveTo(w * 0.5, h * 0.74, w * 0.54, h * 0.8);
  ctx.stroke();
};

/* Malta */
FlagArt.mt = (ctx, w, h) => {
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#cf142b'; ctx.fillRect(w / 2, 0, w / 2, h);
  if (h < 12) return;
  ctx.strokeStyle = '#a0a0a8'; ctx.lineWidth = Math.max(1, h * 0.04);
  const cx = w * 0.17, cy = h * 0.22, s = h * 0.1;
  ctx.beginPath();
  ctx.moveTo(cx - s, cy); ctx.lineTo(cx + s, cy);
  ctx.moveTo(cx, cy - s); ctx.lineTo(cx, cy + s);
  ctx.stroke();
};

/* Vatikanstadt */
FlagArt.va = (ctx, w, h) => {
  ctx.fillStyle = '#ffe000'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(w / 2, 0, w / 2, h);
  if (h < 12) return;
  ctx.strokeStyle = '#d4af37'; ctx.lineWidth = Math.max(1, h * 0.055);
  ctx.beginPath();
  ctx.moveTo(w * 0.64, h * 0.66); ctx.lineTo(w * 0.82, h * 0.34);
  ctx.moveTo(w * 0.82, h * 0.66); ctx.lineTo(w * 0.64, h * 0.34);
  ctx.stroke();
  ctx.fillStyle = '#c0392b';
  ctx.beginPath(); ctx.arc(w * 0.73, h * 0.3, h * 0.07, 0, Math.PI * 2); ctx.fill();
};

/* Liechtenstein */
FlagArt.li = (ctx, w, h) => {
  ctx.fillStyle = '#002b7f'; ctx.fillRect(0, 0, w, h / 2);
  ctx.fillStyle = '#ce1126'; ctx.fillRect(0, h / 2, w, h / 2);
  if (h < 12) return;
  ctx.fillStyle = '#ffd83d';
  const cx = w * 0.26, cy = h * 0.26, s = h * 0.13;
  ctx.beginPath();
  ctx.moveTo(cx - s, cy + s * 0.5); ctx.lineTo(cx - s, cy - s * 0.4);
  ctx.lineTo(cx - s * 0.4, cy + s * 0.1); ctx.lineTo(cx, cy - s * 0.7);
  ctx.lineTo(cx + s * 0.4, cy + s * 0.1); ctx.lineTo(cx + s, cy - s * 0.4);
  ctx.lineTo(cx + s, cy + s * 0.5); ctx.closePath(); ctx.fill();
};

/* Andorra */
FlagArt.ad = (ctx, w, h) => {
  fBands(['#10069f', '#fedd00', '#d0103a'], false)(ctx, w, h);
  if (h >= 14) shield(ctx, w * 0.42, h * 0.3, w * 0.16, h * 0.4, '#fdf3c8', '#b08b1e');
};

/* Moldau */
FlagArt.md = (ctx, w, h) => {
  fBands(['#0046ae', '#ffd200', '#cc092f'], false)(ctx, w, h);
  if (h >= 14) shield(ctx, w * 0.42, h * 0.3, w * 0.16, h * 0.4, '#b08b1e', '#7a5e12');
};

/* Belarus */
FlagArt.by = (ctx, w, h) => {
  ctx.fillStyle = '#c8313e'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#4aa657'; ctx.fillRect(0, Math.round(h * 0.66), w, h - Math.round(h * 0.66));
  const bw = Math.max(3, Math.round(w * 0.14));
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, bw, h);
  ctx.fillStyle = '#c8313e';
  const s = Math.max(1, Math.round(bw / 5));
  for (let y = 0; y < h; y += s * 4) {
    ctx.fillRect(s, y + s, s, s);
    ctx.fillRect(s * 3, y + s, s, s);
    ctx.fillRect(s * 2, y + s * 2, s, s);
  }
};

/* Europaflagge */
FlagArt.eu = (ctx, w, h) => {
  ctx.fillStyle = '#003399'; ctx.fillRect(0, 0, w, h);
  const r = h * 0.3, cx = w / 2, cy = h / 2;
  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 6;
    star(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, Math.max(1.1, h * 0.075), '#ffcc00');
  }
};

/* ---------- Zeichnen und Zwischenspeichern ---------- */

const _flagCache = new Map();

/* Liefert ein fertiges Canvas mit der Flagge (Höhe h, Breite 1.5*h) */
function flagCanvas(id, h) {
  h = Math.max(6, Math.round(h));
  const key = id + '@' + h;
  if (_flagCache.has(key)) return _flagCache.get(key);

  const w = Math.round(h * 1.5);
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cv = document.createElement('canvas');
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(h * dpr);
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);

  const art = FlagArt[id] || FlagArt.eu;
  art(ctx, w, h);

  // feiner Rahmen, damit weiße Flaggen auf hellem Grund sichtbar bleiben
  ctx.strokeStyle = 'rgba(0,0,0,0.28)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

  cv._cssW = w; cv._cssH = h;
  _flagCache.set(key, cv);
  return cv;
}

/* Flagge auf ein anderes Canvas zeichnen (für die Weltkarte) */
function drawFlagAt(ctx, id, x, y, h) {
  const cv = flagCanvas(id, h);
  ctx.drawImage(cv, x, y, cv._cssW, cv._cssH);
}

const _flagUrlCache = new Map();
function flagDataUrl(id, h) {
  const key = id + '@' + h;
  if (!_flagUrlCache.has(key)) _flagUrlCache.set(key, flagCanvas(id, h).toDataURL());
  return _flagUrlCache.get(key);
}

/* <img>-Element für die Oberfläche */
function flagEl(id, h = 14) {
  const img = document.createElement('img');
  img.className = 'flag';
  img.src = flagDataUrl(id, h);
  img.alt = '';
  img.width = Math.round(h * 1.5);
  img.height = h;
  return img;
}

/* Flagge als HTML-Schnipsel (für innerHTML) */
function flagHtml(id, h = 14) {
  return `<img class="flag" src="${flagDataUrl(id, h)}" alt="" width="${Math.round(h * 1.5)}" height="${h}">`;
}

/* Setzt Flagge + Text in ein Element – ohne innerHTML */
function setFlagLabel(el, countryId, text) {
  el.innerHTML = '';
  if (countryId) el.appendChild(flagEl(countryId, 14));
  const span = document.createElement('span');
  span.textContent = text;
  el.appendChild(span);
}
