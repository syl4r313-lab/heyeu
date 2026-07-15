/* ============================================================
   hey EU – Weltkarte bauen & vorrendern
   ============================================================ */

/* Einfacher, deterministischer Zufallsgenerator */
function makeRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const World = {
  grid: null,          // [y][x] -> { t: Kacheltyp, c: Länderindex|-1 }
  centers: {},         // Länder-ID -> {x, y}
  landmarks: [],       // { x, y, ci }
  canvases: [],        // 2 vorgerenderte Karten (Wellen-Phasen)

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
    const rng = makeRng(20260715);
    this.grid = [];
    for (let y = 0; y < WORLD_H; y++) {
      const row = [];
      for (let x = 0; x < WORLD_W; x++) row.push({ t: T_SEA, c: -1 });
      this.grid.push(row);
    }

    // Länder stempeln
    COUNTRIES.forEach((c, ci) => {
      let sx = 0, sy = 0, n = 0;
      c.shape.forEach((rowStr, ry) => {
        for (let rx = 0; rx < rowStr.length; rx++) {
          if (rowStr[rx] !== '#') continue;
          const x = c.x + rx, y = c.y + ry;
          this.grid[y][x] = { t: T_GRASS, c: ci };
          sx += x; sy += y; n++;
        }
      });
      this.centers[c.id] = { x: Math.round(sx / n), y: Math.round(sy / n) };
    });

    // Wahrzeichen setzen
    COUNTRIES.forEach((c, ci) => {
      const x = c.x + c.lm.dx, y = c.y + c.lm.dy;
      this.grid[y][x] = { t: T_LANDMARK, c: ci };
      this.landmarks.push({ x, y, ci });
    });

    // Seebrücken: 4-Richtungs-Treppenpfad zwischen Länderzentren
    for (const [a, b] of BRIDGES) {
      const p = this.centers[a], q = this.centers[b];
      let x = p.x, y = p.y;
      while (x !== q.x || y !== q.y) {
        const dx = q.x - x, dy = q.y - y;
        if (Math.abs(dx) >= Math.abs(dy)) x += Math.sign(dx);
        else y += Math.sign(dy);
        const cell = this.grid[y][x];
        if (cell.t === T_SEA) cell.t = T_BRIDGE;
      }
    }

    // Deko: Bäume, Berge, Blumen (nie neben Brücken oder Wahrzeichen)
    const nearType = (x, y, type) => {
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const t = this.tileAt(x + dx, y + dy);
          if (t && t.t === type) return true;
        }
      return false;
    };
    for (let y = 0; y < WORLD_H; y++) {
      for (let x = 0; x < WORLD_W; x++) {
        const cell = this.grid[y][x];
        if (cell.t !== T_GRASS) continue;
        if (nearType(x, y, T_BRIDGE) || nearType(x, y, T_LANDMARK)) continue;
        const r = rng();
        const country = COUNTRIES[cell.c];
        const center = this.centers[country.id];
        if (Math.abs(center.x - x) + Math.abs(center.y - y) < 2) continue;
        if (r < 0.07) cell.t = T_TREE;
        else if (r < 0.10 && ['no', 'ch', 'at', 'is', 'ro'].includes(country.id)) cell.t = T_MOUNTAIN;
        else if (r < 0.16) cell.t = T_FLOWER;
      }
    }
  },

  /* Zwei komplette Kartenbilder rendern (Wellen-Animation) */
  prerender() {
    this.canvases = [0, 1].map(phase => {
      const cv = document.createElement('canvas');
      cv.width = WORLD_W * TILE;
      cv.height = WORLD_H * TILE;
      const ctx = cv.getContext('2d');
      ctx.imageSmoothingEnabled = false;

      for (let y = 0; y < WORLD_H; y++) {
        for (let x = 0; x < WORLD_W; x++) {
          const cell = this.grid[y][x];
          const px = x * TILE, py = y * TILE;
          const isLand = cell.t !== T_SEA && cell.t !== T_BRIDGE;
          if (cell.t === T_SEA) {
            drawSeaTile(ctx, px, py, x, y, phase);
          } else if (cell.t === T_BRIDGE) {
            drawBridgeTile(ctx, px, py, x, y, phase);
          }
          if (isLand) {
            const color = COUNTRIES[cell.c].grass;
            const sea = (xx, yy) => {
              const t = this.tileAt(xx, yy);
              return !t || t.t === T_SEA || t.t === T_BRIDGE;
            };
            drawGrassTile(ctx, px, py, x, y, color, {
              n: sea(x, y - 1), s: sea(x, y + 1), w: sea(x - 1, y), e: sea(x + 1, y)
            });
            if (cell.t === T_TREE) drawTree(ctx, px, py);
            else if (cell.t === T_MOUNTAIN) drawMountain(ctx, px, py);
            else if (cell.t === T_FLOWER) drawFlowers(ctx, px, py, x, y);
            else if (cell.t === T_LANDMARK) drawLandmarkBase(ctx, px, py);
          }
        }
      }

      // Wahrzeichen-Emojis (über die Kacheln hinaus)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '15px "Segoe UI Emoji", "Noto Color Emoji", serif';
      for (const lm of this.landmarks) {
        ctx.fillText(COUNTRIES[lm.ci].lm.emoji, lm.x * TILE + TILE / 2, lm.y * TILE + 5);
      }

      // Ländernamen
      ctx.font = 'bold 8px "Trebuchet MS", sans-serif';
      for (const c of COUNTRIES) {
        const w = Math.max(...c.shape.map(s => s.length));
        const lx = (c.x + w / 2) * TILE;
        const ly = c.y * TILE - 6;
        const label = `${c.flag} ${c.name}`;
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.strokeText(label, lx, ly);
        ctx.fillStyle = '#20406a';
        ctx.fillText(label, lx, ly);
      }
      return cv;
    });
  },

  /* Freie Graskachel in einem Land finden */
  randomSpotIn(ci, rng, taken) {
    const c = COUNTRIES[ci];
    const spots = [];
    c.shape.forEach((rowStr, ry) => {
      for (let rx = 0; rx < rowStr.length; rx++) {
        if (rowStr[rx] !== '#') continue;
        const x = c.x + rx, y = c.y + ry;
        const t = this.grid[y][x].t;
        if ((t === T_GRASS || t === T_FLOWER) && !taken.has(x + ',' + y)) spots.push({ x, y });
      }
    });
    if (!spots.length) return { ...this.centers[c.id] };
    const s = spots[Math.floor(rng() * spots.length)];
    taken.add(s.x + ',' + s.y);
    return s;
  }
};
