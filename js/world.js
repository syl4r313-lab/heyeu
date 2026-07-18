/* ============================================================
   hey EU – Weltkarte: zusammenhängendes Europa
   Liest die ASCII-Europakarte aus js/mapdata.js, skaliert sie
   mit MAP_SCALE und rendert sie vor. Länder gehen ohne Grenzen
   ineinander über; Brücken gibt es nur zu den Inseln.
   ============================================================ */

function makeRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const World = {
  grid: null,          // [y][x] -> { t: Kacheltyp, c: Länderindex | -1 }
  centers: {},         // Länder-ID -> begehbare Kachel nahe der Landesmitte
  countryCells: [],    // pro Länderindex: Liste aller Landeskacheln
  landmarks: [],       // { x, y, ci }
  boards: [],          // Pinnwände { x, y, ci }
  canvases: [],

  isWalkable(x, y) {
    if (x < 0 || y < 0 || x >= WORLD_W || y >= WORLD_H) return false;
    const t = this.grid[y][x].t;
    return t === T_GRASS || t === T_BRIDGE || t === T_FLOWER;
  },

  tileAt(x, y) {
    if (x < 0 || y < 0 || x >= WORLD_W || y >= WORLD_H) return null;
    return this.grid[y][x];
  },

  build() {
    const rng = makeRng(20260718);
    const S = MAP_SCALE;
    const idToIndex = {};
    COUNTRIES.forEach((c, ci) => { idToIndex[c.id] = ci; });

    this.grid = [];
    this.landmarks = [];
    this.boards = [];
    this.countryCells = COUNTRIES.map(() => []);
    const sums = COUNTRIES.map(() => ({ x: 0, y: 0, n: 0 }));

    for (let y = 0; y < WORLD_H; y++) {
      const row = [];
      const mapRow = EUROPE_MAP[Math.floor(y / S)];
      for (let x = 0; x < WORLD_W; x++) {
        const ch = mapRow[Math.floor(x / S)];
        if (ch === '.') { row.push({ t: T_SEA, c: -1 }); continue; }
        if (ch === '_') { row.push({ t: T_GRASS, c: -1 }); continue; }
        const ci = idToIndex[MAP_CHARS[ch]];
        row.push({ t: T_GRASS, c: ci });
        this.countryCells[ci].push({ x, y });
        sums[ci].x += x; sums[ci].y += y; sums[ci].n++;
      }
      this.grid.push(row);
    }

    // Landesmitte: begehbare Landeskachel, die dem Schwerpunkt am nächsten ist
    COUNTRIES.forEach((c, ci) => {
      const s = sums[ci];
      const cx = s.x / s.n, cy = s.y / s.n;
      let best = null, bestD = Infinity;
      for (const cell of this.countryCells[ci]) {
        const d = (cell.x - cx) ** 2 + (cell.y - cy) ** 2;
        if (d < bestD) { bestD = d; best = cell; }
      }
      this.centers[c.id] = { x: best.x, y: best.y };
    });

    // Wahrzeichen an der Landesmitte
    COUNTRIES.forEach((c, ci) => {
      const p = this.centers[c.id];
      this.grid[p.y][p.x].t = T_LANDMARK;
      this.landmarks.push({ x: p.x, y: p.y, ci });
    });

    // Brücken/Fähren: 2 Kacheln breiter Treppenpfad, nur über Meer
    for (const [a, b] of BRIDGES) {
      const p = this.centers[a], q = this.centers[b];
      let x = p.x, y = p.y;
      const carve = (cx, cy) => {
        const cell = this.tileAt(cx, cy);
        if (cell && cell.t === T_SEA) cell.t = T_BRIDGE;
      };
      while (x !== q.x || y !== q.y) {
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

    // Pinnwand: freie Kachel in der Nähe des Wahrzeichens
    COUNTRIES.forEach((c, ci) => {
      const center = this.centers[c.id];
      let spot = null;
      outer:
      for (let r = 2; r < 10; r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
            const x = center.x + dx, y = center.y + dy;
            const t = this.tileAt(x, y);
            if (t && t.t === T_GRASS && t.c === ci) { spot = { x, y }; break outer; }
          }
        }
      }
      if (spot) {
        this.grid[spot.y][spot.x].t = T_BOARD;
        this.boards.push({ x: spot.x, y: spot.y, ci });
      }
    });

    // Deko: Bäume, Berge, Blumen (nicht neben Brücken, Wahrzeichen, Pinnwänden)
    const nearType = (x, y, type) => {
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const t = this.tileAt(x + dx, y + dy);
          if (t && t.t === type) return true;
        }
      return false;
    };
    const bergLaender = ['no', 'ch', 'at', 'is', 'ro', 'es', 'it'];
    for (let y = 0; y < WORLD_H; y++) {
      for (let x = 0; x < WORLD_W; x++) {
        const cell = this.grid[y][x];
        if (cell.t !== T_GRASS) continue;
        if (nearType(x, y, T_BRIDGE) || nearType(x, y, T_LANDMARK) || nearType(x, y, T_BOARD)) continue;
        const r = rng();
        if (cell.c === -1) {           // neutrales Land: etwas mehr Wald
          if (r < 0.10) cell.t = T_TREE;
          else if (r < 0.13) cell.t = T_FLOWER;
          continue;
        }
        const country = COUNTRIES[cell.c];
        if (r < 0.055) cell.t = T_TREE;
        else if (r < 0.085 && bergLaender.includes(country.id)) cell.t = T_MOUNTAIN;
        else if (r < 0.14) cell.t = T_FLOWER;
      }
    }

    // Wassertiefe (für Farbverlauf im Meer)
    this.depth = [];
    const queue = [];
    for (let y = 0; y < WORLD_H; y++) {
      const row = [];
      for (let x = 0; x < WORLD_W; x++) {
        const isLand = this.grid[y][x].t !== T_SEA && this.grid[y][x].t !== T_BRIDGE;
        row.push(isLand ? 0 : 99);
        if (isLand) queue.push([x, y]);
      }
      this.depth.push(row);
    }
    let qi = 0;
    while (qi < queue.length) {
      const [x, y] = queue[qi++];
      const d = this.depth[y][x];
      if (d >= 2) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= WORLD_W || ny >= WORLD_H) continue;
        if (this.depth[ny][nx] > d + 1) {
          this.depth[ny][nx] = d + 1;
          queue.push([nx, ny]);
        }
      }
    }
  },

  prerender() {
    const NEUTRAL_GRASS = '#a3c48b';
    this.canvases = [0, 1].map(phase => {
      const cv = document.createElement('canvas');
      cv.width = WORLD_W * TILE;
      cv.height = WORLD_H * TILE;
      const ctx = cv.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      const isLandAt = (x, y) => {
        const t = this.tileAt(x, y);
        return t && t.t !== T_SEA && t.t !== T_BRIDGE;
      };

      for (let y = 0; y < WORLD_H; y++) {
        for (let x = 0; x < WORLD_W; x++) {
          const cell = this.grid[y][x];
          const px = x * TILE, py = y * TILE;
          if (cell.t === T_SEA) {
            const d = Math.min(this.depth[y][x] - 1, 2);
            const foam = {
              n: isLandAt(x, y - 1), s: isLandAt(x, y + 1),
              w: isLandAt(x - 1, y), e: isLandAt(x + 1, y)
            };
            drawSeaTile(ctx, px, py, x, y, phase, d,
              (foam.n || foam.s || foam.w || foam.e) ? foam : null);
          } else if (cell.t === T_BRIDGE) {
            drawBridgeTile(ctx, px, py, x, y, phase);
          } else {
            const color = cell.c >= 0 ? COUNTRIES[cell.c].grass : NEUTRAL_GRASS;
            const sea = (xx, yy) => {
              const t = this.tileAt(xx, yy);
              return !t || t.t === T_SEA || t.t === T_BRIDGE;
            };
            drawGrassTile(ctx, px, py, x, y, color, {
              n: sea(x, y - 1), s: sea(x, y + 1), w: sea(x - 1, y), e: sea(x + 1, y)
            });
            if (cell.t === T_TREE) drawTree(ctx, px, py, x, y);
            else if (cell.t === T_MOUNTAIN) drawMountain(ctx, px, py, x, y);
            else if (cell.t === T_FLOWER) drawFlowers(ctx, px, py, x, y);
            else if (cell.t === T_LANDMARK) drawLandmarkBase(ctx, px, py);
          }
        }
      }

      for (const b of this.boards) {
        drawPinboard(ctx, b.x * TILE, b.y * TILE);
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '24px "Segoe UI Emoji", "Noto Color Emoji", serif';
      for (const lm of this.landmarks) {
        ctx.fillText(COUNTRIES[lm.ci].lm.emoji, lm.x * TILE + TILE / 2, lm.y * TILE + 1);
      }

      // Ländernamen über dem Wahrzeichen
      ctx.font = 'bold 11px "Trebuchet MS", sans-serif';
      for (const c of COUNTRIES) {
        const p = this.centers[c.id];
        const label = `${c.flag} ${c.name}`;
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.strokeText(label, p.x * TILE + TILE / 2, p.y * TILE - 22);
        ctx.fillStyle = '#20406a';
        ctx.fillText(label, p.x * TILE + TILE / 2, p.y * TILE - 22);
      }
      return cv;
    });
  },

  randomSpotIn(ci, rng, taken) {
    const cells = this.countryCells[ci].filter(p => {
      const t = this.grid[p.y][p.x].t;
      return (t === T_GRASS || t === T_FLOWER) && !taken.has(p.x + ',' + p.y);
    });
    if (!cells.length) return { ...this.centers[COUNTRIES[ci].id] };
    const s = cells[Math.floor(rng() * cells.length)];
    taken.add(s.x + ',' + s.y);
    return s;
  }
};
