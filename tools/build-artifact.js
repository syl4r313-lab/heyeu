/* Baut aus dem Projekt eine einzelne HTML-Datei für die Web-Testversion.
   Alle Skripte, das Aussehen und die Musik werden eingebettet.
   Aufruf:  node tools/build-artifact.js <zieldatei> */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const ziel = process.argv[2] || path.join(root, 'heyeu-artifact.html');

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');

// Skripte in der Reihenfolge aus index.html einsammeln
const skripte = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
if (!skripte.length) throw new Error('Keine Skripte in index.html gefunden');

// Musik als Daten-URL einbetten
const mp3 = fs.readFileSync(path.join(root, 'musik/hintergrund.mp3'));
const musikUrl = 'data:audio/mpeg;base64,' + mp3.toString('base64');

// Körper aus index.html herausschneiden
const body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'))
  .replace(/<script src="[^"]+"><\/script>\s*/g, '')
  .trim();

const titel = (html.match(/<title>([^<]+)<\/title>/) || [, 'hey EU'])[1];
const favicon = (html.match(/<link rel="icon"[^>]*>/) || [''])[0];

const teile = [];
teile.push(`<title>${titel}</title>`);
if (favicon) teile.push(favicon);
teile.push(`<style>\n${css}\n</style>`);
teile.push(body);
teile.push(`<script>\n/* Musik direkt eingebettet, damit die Seite ohne Server auskommt */\nconst MUSIC_SRC_OVERRIDE = ${JSON.stringify(musikUrl)};\n</script>`);
for (const s of skripte) {
  const code = fs.readFileSync(path.join(root, s), 'utf8');
  teile.push(`<script>\n/* ===== ${s} ===== */\n${code}\n</script>`);
}

const out = teile.join('\n\n');
fs.writeFileSync(ziel, out);
const mb = (Buffer.byteLength(out) / 1048576).toFixed(2);
console.log('Geschrieben:', ziel);
console.log('Größe:', mb, 'MB |', skripte.length, 'Skripte eingebettet |', 'Musik:', (mp3.length / 1024).toFixed(0), 'KB');
if (mb > 15) console.warn('ACHTUNG: über 15 MB – Artifact-Grenze liegt bei 16 MB');
