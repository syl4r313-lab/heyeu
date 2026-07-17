<?php
/* ============================================================
   hey EU – Zugangsdaten für die Test-Phase
   ------------------------------------------------------------
   >>> HIER änderst du Benutzername und Passwort. <<<
   Einfach die Werte zwischen den Anführungszeichen ersetzen
   und die Datei neu hochladen.

   Diese Datei wird vom Server ausgeführt und NIE als Text an
   den Browser geschickt – die Zugangsdaten sind im Quelltext
   der Webseite nicht sichtbar (anders als bei JavaScript).
   ============================================================ */

const ZUGANG_BENUTZER = 'heyeu-tester';
const ZUGANG_PASSWORT = 'Anker-Delfin-3630';

/* Nach so vielen Fehlversuchen wird diese Sitzung 60 Sekunden gesperrt */
const MAX_FEHLVERSUCHE = 5;

/* ---------- ab hier nichts ändern ---------- */

function heyeu_session_start() {
    session_name('HEYEUSESS');
    session_set_cookie_params([
        'lifetime' => 0,                                   // bis Browser schließt
        'path'     => '/',
        'secure'   => !empty($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

function heyeu_ist_angemeldet(): bool {
    return !empty($_SESSION['heyeu_angemeldet']);
}
