/* Generator: rasterisiert Länder-Polygone zu einer ASCII-Europakarte.
   Ausgabe: js/mapdata.js mit EUROPE_MAP + MAP_CHARS. */
const fs = require('fs');

const W = 92, H = 76;

/* Punkt-in-Polygon (ray casting), Koordinaten in Zellmitte */
function inside(px, py, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

/* Reihenfolge wichtig: spätere überschreiben frühere. '_' = neutrales Land */
const REGIONS = [
  // Neutrales Osteuropa (Belarus/Ukraine/Russland-Rand) bis zum Kartenrand
  ['_', [[70,19],[86,17],[86,42],[78,44],[64,38],[63,31],[68,31],[71,27],[71,19]]],
  // Neutraler Westbalkan (Bosnien, Serbien, Albanien, Bulgarien ...)
  ['_', [[58,47],[64,45],[74,47],[76,52],[71,59],[64,58],[59,53]]],

  ['I', [[4,3],[13,2],[16,5],[12,8],[5,7]]],                                     // Island
  ['J', [[15,17],[20,16],[21,20],[18,23],[14,21]]],                              // Irland
  ['U', [[24,8],[28,7],[29,12],[32,17],[32,23],[27,26],[23,24],[25,18],[22,12]]],// Großbritannien
  ['V', [[40,13],[43,5],[49,1],[62,0],[70,1],[69,4],[56,5],[50,8],[47,13],[45,17],[41,17]]], // Norwegen
  ['S', [[46,9],[52,6],[55,9],[54,15],[52,22],[48,22],[46,16]]],                 // Schweden
  ['M', [[55,5],[66,2],[70,6],[68,12],[62,17],[58,14],[57,8]]],                  // Finnland
  ['K', [[42,18],[45,18],[45,24],[41,24]]],                                      // Dänemark
  ['T', [[63,20],[70,20],[70,23],[63,23]]],                                      // Estland
  ['L', [[62,24],[71,24],[71,27],[62,27]]],                                      // Lettland
  ['Y', [[61,28],[69,28],[68,31],[61,31]]],                                      // Litauen
  ['W', [[52,26],[63,26],[64,31],[62,36],[53,37],[51,31]]],                      // Polen
  ['N', [[39,25],[44,25],[44,30],[40,30]]],                                      // Niederlande
  ['B', [[37,30],[42,30],[43,33],[38,33]]],                                      // Belgien
  ['D', [[42,24],[51,24],[53,28],[53,36],[48,39],[43,38],[41,33],[42,29]]],      // Deutschland
  ['C', [[46,37],[55,36],[57,40],[52,42],[46,41]]],                              // Tschechien
  ['F', [[27,34],[36,30],[43,33],[44,40],[40,47],[31,48],[25,44],[24,37]]],      // Frankreich
  ['Z', [[39,44],[44,43],[45,47],[39,47]]],                                      // Schweiz
  ['A', [[45,43],[55,42],[57,45],[51,47],[45,46]]],                              // Österreich
  ['H', [[56,42],[64,41],[65,45],[57,46]]],                                      // Ungarn
  ['Q', [[55,46],[61,46],[64,50],[59,53],[55,49]]],                              // Kroatien
  ['R', [[64,40],[75,39],[77,44],[72,48],[64,46]]],                              // Rumänien
  ['E', [[14,49],[31,47],[34,49],[32,55],[26,62],[18,63],[16,55]]],              // Spanien
  ['P', [[14,50],[17,49],[17,62],[13,62]]],                                      // Portugal
  ['X', [[43,47],[52,46],[54,49],[52,52],[44,51]]],                               // Norditalien
  ['X', [[49,50],[53,50],[55,55],[58,59],[61,60],[61,62],[56,64],[53,59],[50,55],[47,53]]], // Stiefel
  ['X', [[47,53],[50,50],[52,52],[49,55]]],                                      // Übergang Po-Ebene/Stiefel
  ['X', [[48,66],[54,66],[53,69],[47,68]]],                                      // Sizilien
  ['G', [[64,57],[70,57],[72,60],[68,63],[70,68],[66,70],[63,68],[64,61]]] // Griechenland
];

const grid = Array.from({ length: H }, () => Array(W).fill('.'));
for (const [ch, poly] of REGIONS) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (inside(x + 0.5, y + 0.5, poly)) grid[y][x] = ch;
    }
  }
}

// Sizilien mit Stiefelspitze verbinden (Straße von Messina, künstlerische Freiheit)
// wird nach Sichtprüfung ggf. angepasst – Verbindungszellen:
for (const [x, y] of [[54,64],[54,65],[53,65]]) grid[y][x] = 'X';


// Eingeschlossene Meere füllen: alles Meer, das den Kartenrand nicht erreicht,
// wird neutrales Land (verhindert Pfützen-Löcher an Polygon-Nahtstellen)
{
  const reach = Array.from({ length: H }, () => Array(W).fill(false));
  const stack = [];
  for (let x = 0; x < W; x++) { stack.push([x, 0], [x, H - 1]); }
  for (let y = 0; y < H; y++) { stack.push([0, y], [W - 1, y]); }
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    if (reach[y][x] || grid[y][x] !== '.') continue;
    reach[y][x] = true;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (grid[y][x] === '.' && !reach[y][x]) grid[y][x] = '_';
}

const rows = grid.map(r => r.join(''));
const out = `/* ============================================================
   hey EU – Europakarte (generiert aus Polygonen)
   Ein Zeichen = eine Kachel (vor Skalierung).
   '.' = Meer, '_' = neutrales Land (kein Spiel-Land)
   ============================================================ */

const MAP_CHARS = {
  I: 'is', J: 'ie', U: 'uk', P: 'pt', E: 'es', F: 'fr', B: 'be', N: 'nl',
  D: 'de', K: 'dk', V: 'no', S: 'se', M: 'fi', T: 'ee', L: 'lv', Y: 'lt',
  W: 'pl', C: 'cz', A: 'at', Z: 'ch', X: 'it', H: 'hu', Q: 'hr', R: 'ro', G: 'gr'
};

const EUROPE_MAP = [
${rows.map(r => `  '${r}'`).join(',\n')}
];
`;
fs.writeFileSync('/home/user/heyeu/js/mapdata.js', out);
console.log('mapdata.js geschrieben:', W + 'x' + H);

// Weltgröße anhängen
fs.appendFileSync('/home/user/heyeu/js/mapdata.js',
  `\nconst WORLD_W = ${W} * MAP_SCALE;\nconst WORLD_H = ${H} * MAP_SCALE;\n`);
console.log('Weltgröße:', W * 2, 'x', H * 2);
