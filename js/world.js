/* ============================================================
   hey EU – Weltkarte bauen & vorrendern
   Die Länderformen aus data.js werden mit MAP_SCALE vergrößert,
   damit jedes Land mehr Platz zum Laufen bietet.
   ============================================================ */

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
  boards: [],          // Pinnwände { x, y, ci }
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
    const S = MAP_SCALE;
    this.grid = [];
    this.landmarks = [];
    this.boards = [];
    for (let y = 0; y < WORLD_H; y++) {
      const row = [];
      for (let x = 0; x < WORLD_W; x++) row.push({ t: T_SEA, c: -1 });
      this.grid.push(row);
    }

    // Länder vergrößert stempeln (jede Formzelle wird SxS Kacheln)
    COUNTRIES.forEach((c, ci) => {
      let sx = 0, sy = 0, n = 0;
      c.shape.forEach((rowStr, ry) => {
        for (let rx = 0; rx < rowStr.length; rx++) {
          if (rowStr[rx] !== '#') continue;
          for (let dy = 0; dy < S; dy++) {
            for (let dx = 0; dx < S; dx++) {
              const x = (c.x + rx) * S + dx, y = (c.y + ry) * S + dy;
              this.grid[y][x] = { t: T_GRASS, c: ci };
              sx += x; sy += y; n++;
            }
          }
        }
      });
      this.centers[c.id] = { x: Math.round(sx / n), y: Math.round(sy / n) };
    });

    // Wahrzeichen
    COUNTRIES.forEach((c, ci) => {
      const x = (c.x + c.lm.dx) * S, y = (c.y + c.lm.dy) * S;
      this.grid[y][x] = { t: T_LANDMARK, c: ci };
      this.landmarks.push({ x, y, ci });
    });

    // Seebrücken: 2 Kacheln breite Treppenpfade zwischen Zentren
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
          carve(x, y); carve(x, y + 1);   // horizontal: 2 hoch
        } else {
          y += Math.sign(dy);
          carve(x, y); carve(x + 1, y);   // vertikal: 2 breit
        }
      }
    }

    // Pinnwand in jedem Land: freie Wiese nahe dem Zentrum
    COUNTRIES.forEach((c, ci) => {
      const center = this.centers[c.id];
      let spot = null;
      outer:
      for (let r = 1; r < 8; r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            const x = center.x + dx, y = center.y + dy;
            const t = this.tileAt(x, y);
            if (t && t.t === T_GRASS && t.c === ci &&
                !this.landmarks.some(l => Math.abs(l.x - x) + Math.abs(l.y - y) < 2)) {
              spot = { x, y }; break outer;
            }
          }
        }
      }
      if (spot) {
        this.grid[spot.y][spot.x].t = T_BOARD;
        this.boards.push({ x: spot.x, y: spot.y, ci });
      }
    });

    // Deko: Bäume, Berge, Blumen (nie neben Brücken, Wahrzeichen, Pinnwänden)
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
        if (nearType(x, y, T_BRIDGE) || nearType(x, y, T_LANDMARK) || nearType(x, y, T_BOARD)) continue;
        const r = rng();
        const country = COUNTRIES[cell.c];
        const center = this.centers[country.id];
        if (Math.abs(center.x - x) + Math.abs(center.y - y) < 3) continue;
        if (r < 0.06) cell.t = T_TREE;
        else if (r < 0.09 && ['no', 'ch', 'at', 'is', 'ro'].includes(country.id)) cell.t = T_MOUNTAIN;
        else if (r < 0.15) cell.t = T_FLOWER;
      }
    }

    // Wassertiefe: Abstand zum Land (0 = direkt an Land, 2 = tiefes Meer)
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
    const S = MAP_SCALE;
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
            const color = COUNTRIES[cell.c].grass;
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

      // Pinnwände (mit Überhang nach oben)
      for (const b of this.boards) {
        drawPinboard(ctx, b.x * TILE, b.y * TILE);
      }

      // Wahrzeichen-Embleme
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '24px "Segoe UI Emoji", "Noto Color Emoji", serif';
      for (const lm of this.landmarks) {
        ctx.fillText(COUNTRIES[lm.ci].lm.emoji, lm.x * TILE + TILE / 2, lm.y * TILE + 1);
      }

      // Ländernamen
      ctx.font = 'bold 11px "Trebuchet MS", sans-serif';
      for (const c of COUNTRIES) {
        const w = Math.max(...c.shape.map(s2 => s2.length)) * S;
        const cx = (c.x * S + w / 2) * TILE;
        const cy = c.y * S * TILE - 8;
        const label = `${c.flag} ${c.name}`;
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.strokeText(label, cx, cy);
        ctx.fillStyle = '#20406a';
        ctx.fillText(label, cx, cy);
      }
      return cv;
    });
  },

  randomSpotIn(ci, rng, taken) {
    const c = COUNTRIES[ci];
    const S = MAP_SCALE;
    const spots = [];
    c.shape.forEach((rowStr, ry) => {
      for (let rx = 0; rx < rowStr.length; rx++) {
        if (rowStr[rx] !== '#') continue;
        for (let dy = 0; dy < S; dy++) {
          for (let dx = 0; dx < S; dx++) {
            const x = (c.x + rx) * S + dx, y = (c.y + ry) * S + dy;
            const t = this.grid[y][x].t;
            if ((t === T_GRASS || t === T_FLOWER) && !taken.has(x + ',' + y)) spots.push({ x, y });
          }
        }
      }
    });
    if (!spots.length) return { ...this.centers[c.id] };
    const s = spots[Math.floor(rng() * spots.length)];
    taken.add(s.x + ',' + s.y);
    return s;
  }
};
