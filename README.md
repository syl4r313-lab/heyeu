# hey EU 🇪🇺 – Dein Europa-Abenteuer

Eine kinderfreundliche Web-App im Stil klassischer RPGs (inspiriert von den alten
Final-Fantasy-Weltkarten): Schülerinnen und Schüler reisen über eine bunte
Pixel-Europakarte, begegnen Kindern aus anderen Ländern, chatten mit ihnen
(jeder Chat beginnt mit **„hey EU“**), entdecken Wahrzeichen und lösen Aufgaben
von Moderator:innen.

![Genre](https://img.shields.io/badge/Genre-Lern--RPG-blue)
![Plattform](https://img.shields.io/badge/Plattform-Browser%20%2B%20Handy-green)

## ✨ Funktionen

- 🗺️ **Europakarte im Retro-RPG-Stil** – 25 Länder, jedes bewusst klein
  (nur Umriss + Wahrzeichen, gefühlt ~70 m² pro Land), verbunden durch
  begehbare Holzstege über das Meer
- 🚶 **Bewegung wie in alten Final-Fantasy-Teilen** – Kachel für Kachel,
  mit Laufanimation und Kamera, die dem Spieler folgt
- 🎨 **Charakter-Editor** – Name, Heimatland, Hautfarbe, Frisur, Haarfarbe
  und Lieblingsfarbe frei wählbar
- 💬 **Chatten** – Kinder aus jedem Land ansprechen und in der Chatbox
  schreiben; jeder Chat beginnt automatisch mit „hey EU!“
- ⭐ **Moderator:innen** (goldene Shirts) stellen Aufgaben:
  Quizfragen über Europa und Reise-Aufgaben („Besuche das Kolosseum!“)
- 🗼 **Wahrzeichen & Länderwissen** – jedes Land hat sein typisches
  Wahrzeichen (Eiffelturm, Wawel-Drache, Kleine Meerjungfrau …) mit
  kindgerechter Erklärung
- 📱 **Mobil spielbar** – Touch-Steuerkreuz, A-Knopf, responsives Layout
- 💾 **Automatisches Speichern** im Browser (localStorage)

## 🚀 Starten

Es gibt nichts zu installieren – die App ist reines HTML/CSS/JavaScript.

**Option 1:** `index.html` einfach im Browser öffnen (Doppelklick).

**Option 2 (empfohlen, z. B. fürs Handy im gleichen WLAN):**

```bash
# im Projektordner:
python3 -m http.server 8000
# dann im Browser: http://localhost:8000
# am Handy: http://<IP-des-Computers>:8000
```

## 🎮 Steuerung

| Aktion | Computer | Handy |
|---|---|---|
| Laufen | Pfeiltasten / WASD | Steuerkreuz (links unten) |
| Sprechen / Ansehen | Leertaste oder Enter | A-Knopf (rechts unten) |
| Aufgaben / Karte / Hilfe | Knöpfe oben rechts | Knöpfe oben rechts |

## 🧑‍🏫 Für Lehrkräfte & Moderator:innen

Die Aufgaben (Quizfragen, Reiseziele) und alle Ländertexte liegen gut
lesbar in `js/data.js` und lassen sich dort ohne Programmierkenntnisse
anpassen oder erweitern – einfach Texte ändern und Seite neu laden.

## 🔧 Technischer Hinweis: Mehrspieler-Modus

Diese Version läuft komplett im Browser – die anderen Kinder und
Moderator:innen werden von der App simuliert, damit sie ohne Server
funktioniert (ideal zum Ausprobieren im Unterricht). Für **echte**
Begegnungen zwischen Schüler:innen verschiedener Schulen braucht es einen
kleinen Server (z. B. WebSocket), der Positionen und Chat-Nachrichten
zwischen den Spielern austauscht. Die Spielstruktur (Spieler-Objekte,
Chat-System, Aufgabenverwaltung) ist so gebaut, dass sich das ergänzen lässt.

## 📁 Projektstruktur

```
index.html        – App-Gerüst (Titel, Editor, Spiel, Panels)
css/style.css     – Design (bunt, rund, mobil-optimiert)
js/data.js        – Länder, Wahrzeichen, Fakten, Quiz, Brücken
js/sprites.js     – Pixel-Figuren & Kachelgrafiken
js/world.js       – Weltkarte bauen & vorrendern
js/game.js        – Spiel-Engine (Bewegung, NPCs, Chat, Aufgaben)
js/ui.js          – Titelbildschirm & Charakter-Editor
```
