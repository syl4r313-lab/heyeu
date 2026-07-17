<?php
/* hey EU – Wächter: liefert die Spieldateien nur an angemeldete Tester:innen.
   Der Ordner spiel-dateien/ ist per .htaccess komplett gesperrt;
   dieser Wächter ist der einzige Weg an die Dateien. */
require __DIR__ . '/zugang-config.php';
heyeu_session_start();

if (!heyeu_ist_angemeldet()) {
    header('Location: /');
    exit;
}

$f = $_GET['f'] ?? 'index.html';

/* Nur genau die erwarteten Dateien, keine Pfad-Tricks */
if (!preg_match('~^(index\.html|css/[a-z0-9_-]+\.css|js/[a-z0-9_-]+\.js)$~', $f)) {
    http_response_code(404);
    exit;
}

$pfad = __DIR__ . '/spiel-dateien/' . $f;
if (!is_file($pfad)) {
    http_response_code(404);
    exit;
}

$mime = [
    'html' => 'text/html; charset=utf-8',
    'css'  => 'text/css; charset=utf-8',
    'js'   => 'application/javascript; charset=utf-8'
][pathinfo($f, PATHINFO_EXTENSION)];

header('Content-Type: ' . $mime);
header('Cache-Control: private, max-age=300');
readfile($pfad);
