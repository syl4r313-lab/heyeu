# hey EU – Geschützte Test-Version für IONOS

Dieser Ordner enthält die komplette App **mit Login-Landingpage**.
Nur wer Benutzername und Passwort kennt, kommt an das Spiel – die
Prüfung passiert **auf dem Server (PHP)**, die Zugangsdaten stehen
nirgends im JavaScript und sind im Browser-Quelltext nicht sichtbar.

## 1. Zugangsdaten festlegen

Öffne `zugang-config.php` in einem Texteditor und ändere:

```php
const ZUGANG_BENUTZER = 'heyeu-tester';
const ZUGANG_PASSWORT = 'Anker-Delfin-3630';
```

Diese Daten schickst du deinen Tester:innen.

## 2. Hochladen

Lade **den gesamten Inhalt dieses Ordners** (inklusive der versteckten
`.htaccess`-Dateien!) in den Webspace-Ordner, auf den deine Domain zeigt –
per Webspace-Explorer oder SFTP (FileZilla: Ansicht → „Versteckte Dateien
anzeigen" aktivieren, sonst siehst du die `.htaccess` nicht).

Struktur auf dem Server:

```
/                      ← Domain-Ordner
├── .htaccess          ← HTTPS-Zwang + Weiterleitung über den Wächter
├── index.php          ← Login-Landingpage
├── serve.php          ← Wächter: prüft die Sitzung, liefert die Spieldateien
├── logout.php         ← Abmelden (Aufruf: deine-domain.de/logout.php)
├── zugang-config.php  ← Benutzername + Passwort (wird nie ausgeliefert)
└── spiel-dateien/     ← das Spiel selbst (per .htaccess komplett gesperrt)
```

## 3. Prüfen

- `https://deine-domain.de` → Login-Seite erscheint
- Falsches Passwort → Fehlermeldung (nach 5 Versuchen: 60 s Sperre)
- Richtiges Passwort → Spiel startet
- `https://deine-domain.de/spiel-dateien/index.html` → **403 Verboten** ✓
- `https://deine-domain.de/js/data.js` ohne Login → Weiterleitung zur Anmeldung ✓

## Updates einspielen

Neue Versionen von `index.html`, `css/` und `js/` einfach in
`spiel-dateien/` hochladen und überschreiben. Die Login-Schicht bleibt
unverändert.

## Wie sicher ist das?

- Passwort-Prüfung und Dateiauslieferung laufen serverseitig; ohne
  gültige Sitzung gibt der Server keine einzige Spieldatei heraus.
- Bremse gegen Durchprobieren: Verzögerung pro Fehlversuch + Sperre
  nach 5 Fehlversuchen.
- Statt des Klartext-Passworts kannst du in `zugang-config.php` auch
  einen bcrypt-Hash eintragen (Wert, der mit `$2y$` beginnt) – wird
  automatisch erkannt.
- Hinweis: Die Admin-PIN im Spiel (`js/data.js`) ist weiterhin nur eine
  Demo und für angemeldete Tester:innen im Quelltext sichtbar. Da jetzt
  aber nur eingeladene Personen überhaupt an die App kommen, ist das
  für die Test-Phase in Ordnung. Echte Admin-Konten kommen mit dem
  Server-Backend.
