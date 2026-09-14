/* Generator: rasterisiert Länder-Polygone zu einer ASCII-Europakarte.
   Ausgabe: js/mapdata.js mit EUROPE_MAP + MAP_CHARS.

   Wichtig: Die Zwergstaaten (Andorra, Monaco, San Marino, Liechtenstein,
   Vatikanstadt, Malta) sind auf der Karte bewusst viel größer gezeichnet
   als in Wirklichkeit. Bei maßstabsgetreuer Darstellung wäre Andorra
   genau eine Kachel groß – also so breit wie die Spielfigur selbst.
   Aufruf:  node tools/mapgen.js
*/
const fs = require('fs');
const path = require('path');

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

/* Zeichen -> Länder-ID */
const MAP_CHARS = {
  I: 'is', J: 'ie', U: 'uk', P: 'pt', E: 'es', a: 'ad', F: 'fr', o: 'mc',
  B: 'be', u: 'lu', N: 'nl', D: 'de', K: 'dk', V: 'no', S: 'se', M: 'fi',
  T: 'ee', L: 'lv', Y: 'lt', b: 'by', W: 'pl', C: 'cz', k: 'sk', A: 'at',
  Z: 'ch', i: 'li', n: 'si', X: 'it', s: 'sm', v: 'va', t: 'mt', Q: 'hr',
  h: 'ba', r: 'rs', m: 'me', x: 'xk', l: 'al', d: 'mk', G: 'bg', R: 'ro',
  e: 'md', y: 'ua', H: 'hu', g: 'gr', c: 'cy'
};

/* Achteckiger Umriss um einen Mittelpunkt – für die Zwergstaaten,
   damit sie nicht als Rechteck auf der Karte kleben. */
function blob(cx, cy, rx, ry) {
  const k = 0.42;
  return [
    [cx - rx * k, cy - ry], [cx + rx * k, cy - ry],
    [cx + rx, cy - ry * k], [cx + rx, cy + ry * k],
    [cx + rx * k, cy + ry], [cx - rx * k, cy + ry],
    [cx - rx, cy + ry * k], [cx - rx, cy - ry * k]
  ];
}

/* Reihenfolge wichtig: spätere Einträge überschreiben frühere.
   Deshalb zuerst die großen Flächen, dann die kleineren Länder und
   ganz zuletzt die Zwergstaaten. '_' = neutrales Land. */
const REGIONS = [
  // --- neutrale Randgebiete ---
  ['_', [[77,14],[91,12],[91,46],[84,46],[80,36],[78,28],[76,20]]],          // Russland-Rand
  ['_', [[72,59],[91,56],[91,64],[76,65],[70,63]]],                          // Türkei-Rand

  // --- große Flächen zuerst ---
  ['V', [[40,13],[43,5],[49,1],[62,0],[70,1],[69,4],[56,5],[50,8],[47,13],[45,17],[41,17]]], // Norwegen
  ['S', [[46,9],[52,6],[55,9],[54,15],[52,22],[48,22],[46,16]]],             // Schweden
  ['M', [[55,5],[66,2],[70,6],[68,12],[62,17],[58,14],[57,8]]],              // Finnland
  ['y', [[64,30],[84,28],[87,34],[82,40],[70,41],[64,36]]],                  // Ukraine
  ['b', [[64,24],[77,23],[78,30],[66,32],[63,29]]],                          // Belarus
  ['F', [[26,33],[35,30],[42,34],[44,41],[40,48],[31,49],[24,45],[23,37]]],  // Frankreich
  ['E', [[13,48],[31,46],[34,49],[32,56],[26,63],[17,64],[15,55]]],          // Spanien
  ['D', [[41,24],[51,24],[53,28],[53,37],[48,40],[43,39],[41,34],[42,29]]],  // Deutschland
  ['W', [[51,26],[64,26],[65,31],[63,37],[53,38],[50,31]]],                  // Polen
  ['R', [[64,39],[78,38],[80,44],[74,49],[65,47]]],                          // Rumänien

  // --- Inseln und Nordwesten ---
  ['I', [[4,3],[13,2],[16,5],[12,8],[5,7]]],                                 // Island
  ['J', [[14,16],[20,15],[21,20],[18,23],[13,21]]],                          // Irland
  ['U', [[24,8],[28,7],[29,12],[32,17],[32,23],[27,26],[23,24],[25,18],[22,12]]], // Großbritannien
  ['K', [[41,18],[46,18],[46,24],[41,24]]],                                  // Dänemark

  // --- Baltikum nach Belarus und Polen, damit es sichtbar bleibt ---
  ['T', [[62,19],[70,19],[70,23],[62,23]]],                                  // Estland
  ['L', [[61,23],[72,23],[72,27],[61,27]]],                                  // Lettland
  ['Y', [[62,27],[71,27],[71,31],[62,31]]],                                  // Litauen
  ['e', [[76,35],[81,34],[81,40],[75,41]]],                                  // Moldau (nach Ukraine)

  // --- Benelux nach Deutschland und Frankreich ---
  ['N', [[37,24],[43,24],[44,29],[38,30]]],                                  // Niederlande
  ['B', [[36,29],[43,29],[44,33],[37,34]]],                                  // Belgien

  // --- Mitteleuropa ---
  ['C', [[46,36],[56,35],[58,40],[52,42],[46,41]]],                          // Tschechien
  ['k', [[56,36],[65,35],[66,40],[57,41]]],                                  // Slowakei
  ['A', [[45,42],[57,41],[58,46],[51,48],[45,47]]],                          // Österreich
  ['H', [[56,41],[66,40],[67,46],[57,47]]],                                  // Ungarn
  ['Z', [[38,43],[45,42],[46,47],[39,48]]],                                  // Schweiz
  ['P', [[12,49],[17,48],[17,63],[12,63]]],                                  // Portugal

  // --- Italien ---
  ['X', [[42,46],[52,45],[54,49],[52,53],[43,51]]],                          // Norditalien
  ['X', [[48,50],[53,50],[55,55],[58,59],[60,60],[60,62],[55,64],[52,59],[49,55],[46,53]]], // Stiefel
  ['X', [[46,53],[50,50],[52,52],[49,55]]],                                  // Übergang
  ['X', [[47,66],[54,66],[53,69],[46,68]]],                                  // Sizilien
  ['X', [[40,60],[44,59],[45,64],[41,65]]],                                  // Sardinien

  // --- Südosten ---
  ['G', [[70,48],[81,47],[82,54],[72,56]]],                                  // Bulgarien
  ['r', [[63,44],[71,44],[72,51],[65,53]]],                                  // Serbien
  ['Q', [[56,45],[63,44],[66,50],[60,54],[56,49]]],                          // Kroatien
  ['n', [[50,45],[57,44],[58,48],[51,49]]],                                  // Slowenien
  ['h', [[58,49],[64,48],[64,54],[59,56]]],                                  // Bosnien-Herzegowina
  ['m', [[60,54],[65,53],[65,57],[60,57]]],                                  // Montenegro
  ['x', [[65,50],[70,50],[70,54],[65,54]]],                                  // Kosovo
  ['d', [[65,54],[71,53],[71,58],[66,59]]],                                  // Nordmazedonien
  ['l', [[61,56],[65,55],[65,62],[61,62]]],                                  // Albanien
  ['g', [[62,62],[71,60],[73,64],[68,66],[70,70],[65,72],[61,70],[62,65]]],  // Griechenland

  // --- Zwergstaaten ganz zuletzt (bewusst übergroß, sonst unspielbar) ---
  // blob() macht achteckige statt rechteckige Umrisse – sieht natürlicher aus
  ['u', blob(43,   34.5, 2.3, 1.9)],                                         // Luxemburg
  ['a', blob(27,   46.5, 2.3, 1.9)],                                         // Andorra
  ['o', blob(44.5, 48.5, 2.1, 1.9)],                                         // Monaco
  ['i', blob(45.5, 42.5, 2.1, 1.9)],                                         // Liechtenstein
  ['s', blob(52.5, 53.5, 2.1, 1.9)],                                         // San Marino
  ['v', blob(51.5, 57.5, 2.1, 1.9)],                                         // Vatikanstadt
  ['t', blob(51,   72.5, 2.3, 1.9)],                                         // Malta
  ['c', blob(83,   67.5, 3.2, 1.9)]                                          // Zypern
];

const grid = Array.from({ length: H }, () => Array(W).fill('.'));
for (const [ch, poly] of REGIONS) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (inside(x + 0.5, y + 0.5, poly)) grid[y][x] = ch;
    }
  }
}

/* Sizilien mit der Stiefelspitze verbinden (Straße von Messina) */
for (const [x, y] of [[53,64],[53,65],[52,65]]) grid[y][x] = 'X';

/* Eingeschlossene Meere füllen: Meer, das den Kartenrand nicht erreicht,
   wird neutrales Land – verhindert Löcher an den Polygon-Nahtstellen. */
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

/* Kontrolle: wie viele Zellen hat jedes Land bekommen? */
const counts = {};
for (const row of grid) for (const ch of row) counts[ch] = (counts[ch] || 0) + 1;
const fehlend = [];
for (const ch in MAP_CHARS) {
  const n = counts[ch] || 0;
  if (n < 4) fehlend.push(`${MAP_CHARS[ch]} (${ch}): nur ${n} Zellen`);
}
if (fehlend.length) {
  console.error('ACHTUNG – zu kleine oder fehlende Länder:');
  fehlend.forEach(f => console.error('   ' + f));
} else {
  console.log('Alle', Object.keys(MAP_CHARS).length, 'Länder haben genug Platz.');
}

const rows = grid.map(r => r.join(''));
const charLines = Object.entries(MAP_CHARS)
  .map(([ch, id]) => `${ch}: '${id}'`);
const chunked = [];
for (let i = 0; i < charLines.length; i += 8) chunked.push('  ' + charLines.slice(i, i + 8).join(', '));

const out = `/* ============================================================
   hey EU – Europakarte (erzeugt aus Polygonen, tools/mapgen.js)
   Ein Zeichen = eine Kachel vor der Skalierung.
   '.' = Meer, '_' = neutrales Land (kein Spiel-Land)
   Nicht von Hand ändern – stattdessen tools/mapgen.js anpassen
   und "node tools/mapgen.js" ausführen.
   ============================================================ */

const MAP_CHARS = {
${chunked.join(',\n')}
};

const EUROPE_MAP = [
${rows.map(r => `  '${r}'`).join(',\n')}
];

const WORLD_W = ${W} * MAP_SCALE;
const WORLD_H = ${H} * MAP_SCALE;
`;

const target = path.join(__dirname, '..', 'js', 'mapdata.js');
fs.writeFileSync(target, out);
console.log('js/mapdata.js geschrieben:', W + 'x' + H, 'Zeichen =', W * 2 + 'x' + H * 2, 'Kacheln');
