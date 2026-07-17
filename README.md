# hey EU 🇪🇺 – Dein Europa-Abenteuer

Eine kinderfreundliche Web-App im Stil klassischer RPGs (inspiriert von den alten
Final-Fantasy-Weltkarten): Schülerinnen und Schüler reisen über eine bunte
Pixel-Europakarte, begegnen Kindern aus anderen Ländern, chatten mit ihnen
(jeder Chat beginnt mit **„hey EU“**), entdecken Wahrzeichen und lösen Aufgaben
von Moderator:innen.

![Genre](https://img.shields.io/badge/Genre-Lern--RPG-blue)
![Plattform](https://img.shields.io/badge/Plattform-Browser%20%2B%20Handy-green)

## ✨ Funktionen

- 🗺️ **Europakarte im Retro-RPG-Stil** – 25 Länder als kleine, begehbare
  Inseln (Umriss + Wahrzeichen), verbunden durch breite Holzstege über
  das Meer, mit Küstenschaum, Wassertiefen und detailreichen Kacheln
- 🚶 **Bewegung wie in alten Final-Fantasy-Teilen** – Kachel für Kachel,
  mit Laufanimation und Kamera, die dem Spieler folgt
- 🎨 **Charakter-Editor** – Name, Heimatland, Hautfarbe, Frisur, Haarfarbe
  und Lieblingsfarbe; fein gezeichnete Pixel-Figuren mit Umriss,
  Schattierung und Laufanimation in vier Richtungen
- 💬 **Chatten mit Schimpfwortfilter** – Kinder aus jedem Land ansprechen
  und in der Chatbox schreiben; jeder Chat beginnt automatisch mit
  „hey EU!“; ein Wortfilter blockiert beleidigende Nachrichten
- 🔤 **Namensfilter** – unangemessene Spielernamen (Schimpfwörter,
  NS-Bezüge, getarnte Schreibweisen wie „H1tler“) werden abgelehnt
- ⭐ **Moderator:innen** (goldene Shirts) stellen Aufgaben:
  Quizfragen über Europa und Reise-Aufgaben („Besuche das Kolosseum!“)
- 📌 **Pinnwände in jedem Land** – mit besonderen Mitmach-Aufgaben von
  Moderator:innen (z. B. „Mach ein Foto aus deinem Klassenraum“).
  Kinder reichen Text und/oder Foto ein; Administrator:innen prüfen die
  Beiträge im Admin-Bereich und schalten sie frei (dann erscheinen sie
  in der Pinnwand-Galerie und es gibt Sterne)
- 🛡️ **Admin-Bereich** – über „?“ → „Admin-Bereich“, Demo-PIN: `2468`
  (in `js/data.js` änderbar)
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

## 🔧 Technischer Hinweis: Mehrspieler-Modus & Moderation

Diese Version läuft komplett im Browser – die anderen Kinder und
Moderator:innen werden von der App simuliert, damit sie ohne Server
funktioniert (ideal zum Ausprobieren im Unterricht). Auch die
Pinnwand-Beiträge und der Admin-Bereich laufen lokal im Browser: Die
Freigabe demonstriert den Moderations-Ablauf, ersetzt aber keinen echten
Server. Für **echte** Begegnungen zwischen Schüler:innen verschiedener
Schulen (und echte Beitragsprüfung durch Administrator:innen) braucht es
einen kleinen Server (z. B. WebSocket + Datenbank), der Positionen,
Chat-Nachrichten und Einreichungen austauscht. Die Spielstruktur
(Spieler-Objekte, Chat-System, Aufgaben- und Einreichungsverwaltung) ist
so gebaut, dass sich das ergänzen lässt. Der Wortfilter in `js/filter.js`
ist bewusst gut lesbar und von Lehrkräften erweiterbar.

## 📁 Projektstruktur

```
index.html        – App-Gerüst (Titel, Editor, Spiel, Panels)
css/style.css     – Design (bunt, rund, mobil-optimiert)
js/data.js        – Länder, Wahrzeichen, Quiz, Pinnwand-Aufgaben, Admin-PIN
js/filter.js      – Schimpfwort- und Namensfilter (leicht erweiterbar)
js/sprites.js     – Pixel-Figuren & Kachelgrafiken
js/world.js       – Weltkarte bauen & vorrendern
js/game.js        – Spiel-Engine (Bewegung, NPCs, Chat, Aufgaben, Pinnwand, Admin)
js/ui.js          – Titelbildschirm & Charakter-Editor
```
