# hey EU – Dein Europa-Abenteuer

Eine kinderfreundliche Web-App: Schülerinnen und Schüler laufen über eine
zusammenhängende Europakarte, begegnen Kindern aus anderen Ländern, chatten
mit ihnen (jeder Chat beginnt mit **„hey EU“**), entdecken Wahrzeichen und
lösen Aufgaben von Moderator:innen.

![Genre](https://img.shields.io/badge/Genre-Lern--RPG-blue)
![Plattform](https://img.shields.io/badge/Plattform-Browser%20%2B%20Handy-green)

## Funktionen

- **Europakarte mit offenen Grenzen** – 45 Länder: alle 27 EU-Mitglieder,
  die Zwergstaaten und die übrigen Länder des Kontinents. Die Länder gehen
  nahtlos ineinander über; Holzstege und Fähren führen nur dorthin, wo es
  sie ungefähr auch wirklich gibt (Eurotunnel, Öresundbrücke, Helsinki–Tallinn …).
- **Alles von Hand gezeichnet** – keine Emojis. Flaggen (`js/flags.js`),
  Wahrzeichen (`js/landmarks.js`), Bediensymbole (`js/icons.js`), Gelände
  (`js/terrain.js`) und Figuren (`js/sprites.js`) werden als Vektorgrafik
  auf Canvas gezeichnet und sehen in jeder Größe sauber aus.
- **Laufen und Hüpfen** – Kachel für Kachel mit Laufanimation; Hüpfen per
  Taste `J` oder Sprung-Knopf, auch mitten im Laufen. Die anderen Kinder
  hüpfen ab und zu von selbst und winken bei der Begrüßung.
- **Charakter-Editor** – Name, Heimatland (frei eintippbar), Hautfarbe,
  sechs Frisuren, Haarfarbe und Lieblingsfarbe. Die Vorschau hüpft auf
  Antippen.
- **Heimatland frei wählbar** – Kinder tippen ihr Land selbst ein. Liegt es
  auf der Karte, startet man dort; liegt es außerhalb Europas, startet man
  in Brüssel. Erkannt werden deutsche, englische und landessprachliche
  Schreibweisen.
- **Chatten mit Wortfilter** – Kinder ansprechen und frei schreiben; ein
  Filter blockiert beleidigende Nachrichten und unangemessene Spielernamen,
  auch getarnte Schreibweisen wie „H1tler“.
- **Moderator:innen** (goldene Shirts) stellen Quizfragen über Europa und
  Reise-Aufgaben („Besuche das Kolosseum!“).
- **Pinnwände in jedem Land** – mit Mitmach-Aufgaben. Kinder reichen Text
  und/oder Foto ein, Administrator:innen prüfen und schalten frei.
- **Admin-Bereich** – über „?“ → „Admin-Bereich“, Demo-PIN `2468`
  (in `js/data.js`). **Achtung:** Die PIN steht im Quelltext und ist damit
  für alle sichtbar. Echter Schutz kommt erst mit einem Server.
- **Mobil spielbar** – Touch-Steuerkreuz, Aktions- und Sprung-Knopf,
  Layout passt sich an.
- **Automatisches Speichern** im Browser (localStorage).

## Starten

Es gibt nichts zu installieren – die App ist reines HTML, CSS und JavaScript.

**Option 1:** `index.html` im Browser öffnen (Doppelklick). Die
Hintergrundmusik bleibt dabei stumm, weil Browser lokale Dateien nicht
nachladen dürfen.

**Option 2 (empfohlen):**

```bash
python3 -m http.server 8000
# Browser: http://localhost:8000
# Handy im gleichen WLAN: http://<IP-des-Computers>:8000
```

## Steuerung

| Aktion | Computer | Handy |
|---|---|---|
| Laufen | Pfeiltasten oder WASD | Steuerkreuz links unten |
| Sprechen / Ansehen | Leertaste oder Enter | runder Knopf rechts unten |
| Hüpfen | `J` (oder Leertaste, wenn nichts in der Nähe ist) | gelber Knopf rechts unten |
| Aufgaben, Karte, Hilfe | Knöpfe oben rechts | Knöpfe oben rechts |

## Für Lehrkräfte und Moderator:innen

Alle Ländertexte, Quizfragen und Pinnwand-Aufgaben stehen gut lesbar in
`js/data.js` und lassen sich dort ohne Programmierkenntnisse ändern –
Text anpassen, Seite neu laden, fertig. Der Wortfilter in `js/filter.js`
ist ebenso bewusst einfach gehalten und erweiterbar.

## Karte ändern

Die Europakarte wird aus Länder-Polygonen erzeugt:

```bash
node tools/mapgen.js     # schreibt js/mapdata.js neu
```

`js/mapdata.js` **nicht von Hand ändern** – stattdessen die Polygone in
`tools/mapgen.js` anpassen. Das Skript warnt, wenn ein Land von einem
anderen überdeckt wurde oder zu klein geraten ist.

Hinweis zum Maßstab: Eine Kartenkachel entspricht etwa 24 Kilometern.
Andorra wäre damit genau eine Kachel groß – so breit wie die Spielfigur
selbst. Die Zwergstaaten (Andorra, Monaco, San Marino, Liechtenstein,
Vatikanstadt, Malta) sind deshalb bewusst viel größer gezeichnet, damit
man sie besuchen kann. Der echte Größenunterschied steht jeweils im
Info-Fenster des Wahrzeichens.

## Mehrspieler-Modus und Moderation

Diese Version läuft komplett im Browser: Die anderen Kinder und die
Moderator:innen werden von der App simuliert, Pinnwand-Beiträge und
Admin-Freigaben liegen nur lokal auf dem jeweiligen Gerät. Zwei Kinder,
die gleichzeitig spielen, sehen einander also **nicht**.

Für echte Begegnungen zwischen Schulen braucht es einen kleinen Server
(Node.js mit WebSocket und Datenbank), der Positionen, Chat-Nachrichten
und Einreichungen austauscht – und der den Wortfilter serverseitig
ausführt, weil ein Filter im Browser umgangen werden kann. Die
Spielstruktur ist so gebaut, dass sich das ergänzen lässt.

## Projektstruktur

```
index.html          App-Gerüst (Titel, Editor, Spiel, Fenster)
css/style.css       Gestaltung
js/data.js          Länder, Wahrzeichen, Quiz, Pinnwand-Aufgaben, Admin-PIN,
                    Länder-Erkennung und deutsche Beugung der Ländernamen
js/mapdata.js       erzeugte Europakarte (nicht von Hand ändern)
js/icons.js         Bediensymbole als SVG
js/flags.js         Flaggen aller Länder, auf Canvas gezeichnet
js/landmarks.js     44 gezeichnete Wahrzeichen
js/terrain.js       Gras, Küste, Bäume, Berge, Wege, Häuser, Meer
js/sprites.js       Figuren, Frisuren, Lauf- und Sprungposen
js/world.js         Welt aufbauen, Kartenstücke zeichnen, Übersichtskarte
js/game.js          Spiel-Engine (Bewegung, Hüpfen, NPCs, Chat, Aufgaben,
                    Pinnwand, Admin, Darstellung)
js/ui.js            Titelbildschirm und Charakter-Editor
js/filter.js        Wort- und Namensfilter
js/audio.js         Hintergrundmusik
tools/mapgen.js     erzeugt js/mapdata.js aus Länder-Polygonen
deploy-ionos/       Paket für den Upload auf heyeu.de (Login + Spiel)
```
