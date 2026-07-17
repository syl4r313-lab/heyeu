/* ============================================================
   hey EU – Wortfilter für Kinderschutz
   Prüft Chatnachrichten, Spielernamen und Pinnwand-Beiträge.
   Die Listen sind bewusst gut lesbar, damit Lehrkräfte sie
   einfach erweitern können.
   ============================================================ */

/* Begriffe, die NIRGENDS vorkommen dürfen – auch nicht versteckt
   in einem Wort oder mit Leerzeichen/Zahlen getarnt
   (z. B. "P e n 1 s" wird trotzdem erkannt). */
const BAD_SUBSTRINGS = [
  // Beleidigungen / Vulgäres (Deutsch)
  'fick', 'fotze', 'hurensohn', 'hurentochter', 'wichs', 'arschloch',
  'schlampe', 'missgeburt', 'schwuchtel', 'drecksau', 'kackbratze',
  // Körper / Sexuelles
  'penis', 'vagina', 'pimmel', 'muschi', 'titten', 'porno', 'sperma', 'dildo',
  // Beleidigungen (Englisch)
  'fuck', 'bitch', 'asshole', 'motherfucker', 'wanker', 'dickhead',
  // Rassistische / menschenfeindliche Begriffe
  'nigger', 'neger', 'kanake', 'judensau', 'faggot',
  // NS-Bezüge
  'hitler', 'nazi', 'siegheil', 'hakenkreuz', 'swastika', 'holocaustleugn'
];

/* Begriffe, die nur als eigenes Wort gesperrt werden
   ("arsch" ja, aber "Marschkapelle" bleibt erlaubt). */
const BAD_WORDS = [
  'arsch', 'sex', 'sexy', 'hure', 'nutte', 'spast', 'spasti',
  'idiot', 'depp', 'fettsack', 'opfa',
  'ass', 'cunt', 'slut', 'whore', 'hoe', 'retard',
  'heil', 'sieg'
];

/* Zusätzlich gesperrte Namen (nur bei der Namenswahl geprüft) */
const BAD_NAMES = ['adolf', 'stalin', 'satan', 'putin', 'osama', 'admin', 'moderator'];

/* Tarnungen sichtbar machen: Kleinbuchstaben, Umlaute vereinfachen,
   Zahlen-Tricks (4dolf, h1tler) auflösen, gestreckte Buchstaben kürzen */
function normalizeText(text) {
  let t = text.toLowerCase();
  t = t.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss');
  t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const leet = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '@': 'a', '$': 's', '!': 'i', '€': 'e' };
  t = t.replace(/[0134578@$!€]/g, ch => leet[ch] || ch);
  t = t.replace(/(.)\1{2,}/g, '$1$1'); // "fiiiick" -> "fiick"
  return t;
}

/* true = Text ist in Ordnung */
function isTextClean(text) {
  const norm = normalizeText(text);
  const squeezed = norm.replace(/[^a-z]/g, '');           // ohne Leer-/Sonderzeichen
  const collapsed = squeezed.replace(/(.)\1+/g, '$1');    // Doppelbuchstaben einfach

  for (const bad of BAD_SUBSTRINGS) {
    if (squeezed.includes(bad) || collapsed.includes(bad)) return false;
  }
  const words = norm.split(/[^a-z]+/).filter(Boolean);
  for (const w of words) {
    if (BAD_WORDS.includes(w)) return false;
  }
  return true;
}

/* Namensprüfung: Wortfilter + gesperrte Namen + Mindestlänge.
   Gibt null zurück, wenn alles gut ist, sonst eine kindgerechte Meldung. */
function checkName(name) {
  const trimmed = name.trim();
  if (trimmed.length < 2) return 'Dein Name braucht mindestens 2 Buchstaben.';
  if (!isTextClean(trimmed)) return 'Diesen Namen kannst du leider nicht wählen. Such dir bitte einen anderen aus. 😊';
  const squeezed = normalizeText(trimmed).replace(/[^a-z]/g, '');
  for (const bad of BAD_NAMES) {
    if (squeezed.includes(bad)) return 'Diesen Namen kannst du leider nicht wählen. Such dir bitte einen anderen aus. 😊';
  }
  return null;
}
