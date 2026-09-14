/* ============================================================
   hey EU – Weltkarte
   Liest die ASCII-Europakarte aus js/mapdata.js. Gezeichnet wird
   in Kartenstücken („Chunks“), die bei Bedarf entstehen und in
   doppelter Auflösung gezeichnet werden. Dadurch sieht die Welt
   fein aus und der Speicher bleibt klein – auch auf dem Handy.
   ============================================================ */

const CHUNK = 8;        // Kacheln je Kartenstück
const CHUNK_PX = 48;    // Zeichenauflösung je Kachel (feiner als das Spielraster)
const CHUNK_CACHE_MAX = 36;

function makeRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* Die Länder haben eigene Grastöne, damit man Grenzen ahnen kann.
   Weil die Grenzen offen sind, werden sie aber stark zur gemeinsamen
   Grundfarbe hin gemischt – sonst wirkt Europa wie ein Flickenteppich. */
const BASE_GRASS = '#74bd63';
const GRASS_MIX = 0.62;          // 0 = Landesfarbe pur, 1 = alles gleich
const NEUTRAL_GRASS = '#8cbb75';

function mixHex(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
}

const GRASS_OF = COUNTRIES.map(c => mixHex(c.grass, BASE_GRASS, GRASS_MIX));

const World = {
  grid: null,
  centers: {},
  countryCells: [],
  landmarks: [],
  boards: [],
  chunks: new Map(),
  chunkOrder: [],

  isWalkable(x, y) {
    if (x < 0 || y < 0 || x >= WORLD_W || y >= WORLD_H) return false;
    const t = this.grid[y][x].t;
    return t === T_GRASS || t === T_BRIDGE || t === T_FLOWER || t === T_PATH;
  },

  tileAt(x, y) {
    if (x < 0 || y < 0 || x >= WORLD_W || y >= WORLD_H) return null;
    return this.grid[y][x];
  },

  isLand(x, y) {
    const t = this.tileAt(x, y);
    return !!t && t.t !== T_SEA && t.t !== T_BRIDGE;
  },

  build() {
    const rng = makeRng(20260914);
    const S = MAP_SCALE;
    const idToIndex = {};
    COUNTRIES.forEach((c, ci) => { idToIndex[c.id] = ci; });

    this.grid = [];
    this.landmarks = [];
    this.boards = [];
    this.chunks.clear();
    this.chunkOrder = [];
    this.countryCells = COUNTRIES.map(() => []);
    const sums = COUNTRIES.map(() => ({ x: 0, y: 0, n: 0 }));

    for (let y = 0; y < WORLD_H; y++) {
      const row = [];
      const mapRow = EUROPE_MAP[Math.floor(y / S)];
      for (let x = 0; x < WORLD_W; x++) {
        const ch = mapRow[Math.floor(x / S)];
        if (ch === '.') { row.push({ t: T_SEA, c: -1 }); continue; }
        if (ch === '_') { row.push({ t: T_GRASS, c: -1 }); continue; }
        const id = MAP_CHARS[ch];
        const ci = idToIndex[id];
        if (ci === undefined) { row.push({ t: T_GRASS, c: -1 }); continue; }
        row.push({ t: T_GRASS, c: ci });
        this.countryCells[ci].push({ x, y });
        sums[ci].x += x; sums[ci].y += y; sums[ci].n++;
      }
      this.grid.push(row);
    }

    // Landesmitte: begehbare Landeskachel nahe am Schwerpunkt
    COUNTRIES.forEach((c, ci) => {
      const s = sums[ci];
      if (!s.n) { this.centers[c.id] = { x: 2, y: 2 }; return; }
      const cx = s.x / s.n, cy = s.y / s.n;
      let best = null, bestD = Infinity;
      for (const cell of this.countryCells[ci]) {
        const d = (cell.x - cx) ** 2 + (cell.y - cy) ** 2;
        if (d < bestD) { bestD = d; best = cell; }
      }
      this.centers[c.id] = { x: best.x, y: best.y };
    });

    // Wahrzeichen in die Landesmitte
    COUNTRIES.forEach((c, ci) => {
      const p = this.centers[c.id];
      this.grid[p.y][p.x].t = T_LANDMARK;
      this.landmarks.push({ x: p.x, y: p.y, ci, art: c.lm.art });
    });

    // Brücken und Fähren
    for (const [a, b] of BRIDGES) {
      const p = this.centers[a], q = this.centers[b];
      if (!p || !q) continue;
      let x = p.x, y = p.y;
      const carve = (cx, cy) => {
        const cell = this.tileAt(cx, cy);
        if (cell && cell.t === T_SEA) cell.t = T_BRIDGE;
      };
      let guard = 0;
      while ((x !== q.x || y !== q.y) && guard++ < 4000) {
        const dx = q.x - x, dy = q.y - y;
        if (Math.abs(dx) >= Math.abs(dy)) {
          x += Math.sign(dx);
          carve(x, y); carve(x, y + 1);
        } else {
          y += Math.sign(dy);
          carve(x, y); carve(x + 1, y);
        }
      }
    }

    // Pinnwand in der Nähe des Wahrzeichens
    COUNTRIES.forEach((c, ci) => {
      const center = this.centers[c.id];
      let spot = null;
      outer:
      for (let r = 2; r < 12; r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
            const x = center.x + dx, y = center.y + dy;
            const t = this.tileAt(x, y);
            if (t && t.t === T_GRASS && t.c === ci) { spot = { x, y }; break outer; }
          }
        }
      }
      // Zwergstaaten: notfalls jede freie Kachel in der Nähe nehmen
      if (!spot) {
        outer2:
        for (let r = 1; r < 8; r++) {
          for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
              const x = center.x + dx, y = center.y + dy;
              const t = this.tileAt(x, y);
              if (t && t.t === T_GRASS) { spot = { x, y }; break outer2; }
            }
          }
        }
      }
      if (spot) {
        this.grid[spot.y][spot.x].t = T_BOARD;
        this.boards.push({ x: spot.x, y: spot.y, ci });
      }
    });

    // Platz rund um jedes Wahrzeichen
    for (const lm of this.landmarks) {
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const t = this.tileAt(lm.x + dx, lm.y + dy);
          if (t && t.t === T_GRASS) t.t = T_PATH;
        }
    }

    // Deko verteilen
    const nearType = (x, y, type, r = 1) => {
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const t = this.tileAt(x + dx, y + dy);
          if (t && t.t === type) return true;
        }
      return false;
    };
    const bergLaender = ['no', 'ch', 'at', 'is', 'ro', 'es', 'it', 'sk', 'si', 'ad', 'li', 'me', 'xk', 'al', 'bg'];
    const nadelLaender = ['no', 'se', 'fi', 'ee', 'lv', 'lt', 'by', 'pl', 'ru'];
    const tinyIds = new Set(COUNTRIES.filter(c => c.tiny).map(c => c.id));

    for (let y = 0; y < WORLD_H; y++) {
      for (let x = 0; x < WORLD_W; x++) {
        const cell = this.grid[y][x];
        if (cell.t !== T_GRASS) continue;
        if (nearType(x, y, T_BRIDGE) || nearType(x, y, T_LANDMARK) || nearType(x, y, T_BOARD)) continue;
        const country = cell.c >= 0 ? COUNTRIES[cell.c] : null;
        // Zwergstaaten bleiben frei begehbar – dort ist kaum Platz
        if (country && tinyIds.has(country.id)) continue;
        const r = rng();
        if (!country) {
          if (r < 0.085) cell.t = T_TREE;
          else if (r < 0.105) cell.t = T_BUSH;
          else if (r < 0.125) cell.t = T_FLOWER;
          continue;
        }
        cell.nadel = nadelLaender.includes(country.id);
        if (r < 0.05) cell.t = T_TREE;
        else if (r < 0.068 && bergLaender.includes(country.id)) cell.t = T_MOUNTAIN;
        else if (r < 0.082) cell.t = T_ROCK;
        else if (r < 0.10) cell.t = T_BUSH;
        else if (r < 0.115) cell.t = T_HOUSE;
        else if (r < 0.165) cell.t = T_FLOWER;
      }
    }
  },

  /* ---------- Kartenstücke ---------- */

  chunkKey(cx, cy) { return cx + ',' + cy; },

  getChunk(cx, cy) {
    const key = this.chunkKey(cx, cy);
    let cv = this.chunks.get(key);
    if (cv) return cv;

    cv = document.createElement('canvas');
    cv.width = CHUNK * CHUNK_PX;
    cv.height = CHUNK * CHUNK_PX;
    const ctx = cv.getContext('2d');
    this.renderChunk(ctx, cx, cy);

    this.chunks.set(key, cv);
    this.chunkOrder.push(key);
    while (this.chunkOrder.length > CHUNK_CACHE_MAX) {
      const old = this.chunkOrder.shift();
      if (old !== key) this.chunks.delete(old);
    }
    return cv;
  },

  renderChunk(ctx, cx, cy) {
    const x0 = cx * CHUNK, y0 = cy * CHUNK;
    const s = CHUNK_PX;
    const px = tx => (tx - x0) * s;
    const py = ty => (ty - y0) * s;

    // 1. Boden – eine Kachel über den Rand hinaus, damit an den Nahtstellen
    //    zwischen zwei Kartenstücken keine sichtbare Kante entsteht
    //    (Gras und Küstensaum ragen absichtlich etwas über die Kachel hinaus).
    for (let ty = y0 - 1; ty <= y0 + CHUNK; ty++) {
      for (let tx = x0 - 1; tx <= x0 + CHUNK; tx++) {
        const cell = this.tileAt(tx, ty);
        if (!cell || cell.t === T_SEA) continue;   // Meer bleibt frei (wird live gezeichnet)
        const X = px(tx), Y = py(ty);
        if (cell.t === T_BRIDGE) {
          const horiz = this.tileAt(tx - 1, ty) && this.tileAt(tx - 1, ty).t === T_BRIDGE ||
                        this.tileAt(tx + 1, ty) && this.tileAt(tx + 1, ty).t === T_BRIDGE;
          drawBridge(ctx, X, Y, s, tx, ty, !horiz);
          continue;
        }
        if (cell.t === T_PATH) { drawPath(ctx, X, Y, s, tx, ty); }
        else {
          const color = cell.c >= 0 ? GRASS_OF[cell.c] : NEUTRAL_GRASS;
          drawGrass(ctx, X, Y, s, tx, ty, color);
        }
        const sea = (xx, yy) => !this.isLand(xx, yy);
        const edges = { n: sea(tx, ty - 1), s: sea(tx, ty + 1), w: sea(tx - 1, ty), e: sea(tx + 1, ty) };
        if (edges.n || edges.s || edges.w || edges.e) drawCoast(ctx, X, Y, s, edges);
      }
    }

    // 2. Aufbauten – auch aus Nachbarkacheln, damit nichts abgeschnitten wird
    const M = 3;
    for (let ty = y0 - M; ty < y0 + CHUNK + M; ty++) {
      for (let tx = x0 - M; tx < x0 + CHUNK + M; tx++) {
        const cell = this.tileAt(tx, ty);
        if (!cell) continue;
        const X = px(tx), Y = py(ty);
        switch (cell.t) {
          case T_TREE: drawTree(ctx, X, Y, s, tx, ty, cell.nadel ? 'nadel' : 'laub'); break;
          case T_BUSH: drawBush(ctx, X, Y, s, tx, ty); break;
          case T_MOUNTAIN: drawMountain(ctx, X, Y, s, tx, ty); break;
          case T_ROCK: drawRock(ctx, X, Y, s, tx, ty); break;
          case T_FLOWER: drawFlowers(ctx, X, Y, s, tx, ty); break;
          case T_HOUSE: drawHouse(ctx, X, Y, s, tx, ty); break;
          case T_BOARD: drawPinboard(ctx, X, Y, s); break;
          case T_LANDMARK: {
            drawPlaza(ctx, X, Y, s);
            const lm = this.landmarks.find(l => l.x === tx && l.y === ty);
            if (lm) {
              tShadow(ctx, X + s * 0.55, Y + s * 0.95, s * 0.72, s * 0.18);
              drawLandmark(ctx, lm.art, X + s * 0.5, Y + s * 0.96, s / 8.6);
            }
            break;
          }
        }
      }
    }
  },

  /* Sichtbaren Ausschnitt zeichnen.
     camX/camY in Weltpixeln (Kachelgröße tilePx), ctx ist der Bildschirm. */
  drawView(ctx, camX, camY, viewW, viewH, tilePx) {
    const chunkScreen = CHUNK * tilePx;
    const cx0 = Math.floor(camX / chunkScreen);
    const cy0 = Math.floor(camY / chunkScreen);
    const cx1 = Math.floor((camX + viewW) / chunkScreen);
    const cy1 = Math.floor((camY + viewH) / chunkScreen);
    const maxCX = Math.ceil(WORLD_W / CHUNK) - 1;
    const maxCY = Math.ceil(WORLD_H / CHUNK) - 1;

    for (let cy = cy0; cy <= cy1; cy++) {
      for (let cx = cx0; cx <= cx1; cx++) {
        if (cx < 0 || cy < 0 || cx > maxCX || cy > maxCY) continue;
        const cv = this.getChunk(cx, cy);
        const dx = Math.round(cx * chunkScreen - camX);
        const dy = Math.round(cy * chunkScreen - camY);
        ctx.drawImage(cv, 0, 0, cv.width, cv.height,
          dx, dy, Math.ceil(chunkScreen), Math.ceil(chunkScreen));
      }
    }
  },

  randomSpotIn(ci, rng, taken) {
    const cells = this.countryCells[ci].filter(p => {
      const t = this.grid[p.y][p.x].t;
      return (t === T_GRASS || t === T_FLOWER || t === T_PATH) && !taken.has(p.x + ',' + p.y);
    });
    if (!cells.length) {
      const c = this.centers[COUNTRIES[ci].id];
      return { x: c.x, y: c.y };
    }
    const s = cells[Math.floor(rng() * cells.length)];
    taken.add(s.x + ',' + s.y);
    return s;
  },

  /* Übersichtskarte für das Kartenfenster */
  renderMinimap(ctx, w, h) {
    const sx = w / WORLD_W, sy = h / WORLD_H;
    ctx.fillStyle = '#4398e0';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < WORLD_H; y++) {
      for (let x = 0; x < WORLD_W; x++) {
        const cell = this.grid[y][x];
        if (cell.t === T_SEA) continue;
        ctx.fillStyle = cell.t === T_BRIDGE ? '#d8a862'
          : cell.c >= 0 ? COUNTRIES[cell.c].grass : NEUTRAL_GRASS;   // Übersichtskarte: kräftige Farben
        ctx.fillRect(x * sx, y * sy, Math.ceil(sx), Math.ceil(sy));
      }
    }
    // Wahrzeichen als kleine Punkte
    ctx.fillStyle = 'rgba(60,40,20,0.75)';
    for (const lm of this.landmarks) {
      ctx.beginPath();
      ctx.arc(lm.x * sx, lm.y * sy, Math.max(1.4, sx * 0.9), 0, Math.PI * 2);
      ctx.fill();
    }
  }
};
