<?php
/* hey EU – Login-Landingpage (Test-Phase)
   Prüft Benutzername + Passwort serverseitig und startet eine Session. */
require __DIR__ . '/zugang-config.php';
heyeu_session_start();

if (heyeu_ist_angemeldet()) {
    header('Location: spiel');
    exit;
}

$fehler = '';
$gesperrt_bis = $_SESSION['heyeu_sperre'] ?? 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (time() < $gesperrt_bis) {
        $rest = $gesperrt_bis - time();
        $fehler = "Zu viele Fehlversuche. Bitte warte noch {$rest} Sekunden.";
    } else {
        usleep(400000); // bremst automatisiertes Durchprobieren
        $benutzer = trim($_POST['benutzer'] ?? '');
        $passwort = $_POST['passwort'] ?? '';

        $benutzer_ok = hash_equals(ZUGANG_BENUTZER, $benutzer);
        $passwort_ok = str_starts_with(ZUGANG_PASSWORT, '$2y$')
            ? password_verify($passwort, ZUGANG_PASSWORT)   // auch Hashes möglich
            : hash_equals(ZUGANG_PASSWORT, $passwort);

        if ($benutzer_ok && $passwort_ok) {
            session_regenerate_id(true);
            $_SESSION['heyeu_angemeldet'] = true;
            unset($_SESSION['heyeu_versuche'], $_SESSION['heyeu_sperre']);
            header('Location: spiel');
            exit;
        }

        $_SESSION['heyeu_versuche'] = ($_SESSION['heyeu_versuche'] ?? 0) + 1;
        if ($_SESSION['heyeu_versuche'] >= MAX_FEHLVERSUCHE) {
            $_SESSION['heyeu_sperre'] = time() + 60;
            $_SESSION['heyeu_versuche'] = 0;
            $fehler = 'Zu viele Fehlversuche. Bitte warte 60 Sekunden.';
        } else {
            $fehler = 'Benutzername oder Passwort ist leider falsch.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>hey EU – Anmeldung</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🇪🇺</text></svg>">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      height: 100%;
      font-family: ui-rounded, "Baloo 2", "Comic Sans MS", "Trebuchet MS", "Segoe UI", sans-serif;
      color: #1e3a5f;
    }
    body {
      background: linear-gradient(180deg, #7ec3f2 0%, #4aa3e8 55%, #3fae5c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 1rem;
    }
    .floaties { position: fixed; inset: 0; pointer-events: none; }
    .floaties span {
      position: absolute;
      bottom: -60px;
      font-size: 2.2rem;
      opacity: .85;
      animation: floatUp linear infinite;
    }
    @keyframes floatUp {
      from { transform: translateY(0) rotate(-8deg); }
      to   { transform: translateY(-115vh) rotate(8deg); }
    }
    .box {
      position: relative;
      background: rgba(255,255,255,.93);
      border-radius: 30px;
      padding: 2rem 2.2rem;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 12px 0 rgba(0,0,0,.12), 0 20px 60px rgba(0,0,0,.2);
    }
    .logo { font-size: 3rem; font-weight: 900; line-height: 1; }
    .logo .hey { color: #2d6fc2; }
    .logo .eu {
      color: #fff;
      background: linear-gradient(135deg, #2d6fc2, #4aa3e8);
      border-radius: 14px;
      padding: 0 .3em;
      margin-left: .12em;
      display: inline-block;
      transform: rotate(-3deg);
      box-shadow: 0 4px 0 #1d4e8f;
    }
    .sub { margin: .9rem 0 1.3rem; font-size: .98rem; line-height: 1.45; color: #46658a; }
    label { display: block; text-align: left; font-weight: 800; font-size: .85rem; color: #46658a; margin: .7rem 0 .25rem; }
    input {
      width: 100%;
      padding: .65rem .9rem;
      font-size: 1rem;
      font-family: inherit;
      border: 3px solid #cfe3f5;
      border-radius: 14px;
      background: #fff;
      color: #1e3a5f;
    }
    input:focus { outline: none; border-color: #4aa3e8; }
    button {
      width: 100%;
      margin-top: 1.1rem;
      padding: .85rem;
      font-size: 1.1rem;
      font-weight: 800;
      font-family: inherit;
      color: #fff;
      background: linear-gradient(180deg, #ffb628, #f4930b);
      border: none;
      border-radius: 999px;
      box-shadow: 0 5px 0 #c67207;
      cursor: pointer;
      transition: transform .08s;
    }
    button:active { transform: translateY(3px); box-shadow: 0 2px 0 #c67207; }
    .fehler {
      margin-top: .9rem;
      background: #ffe3e3;
      color: #b02734;
      font-weight: 700;
      font-size: .9rem;
      border-radius: 12px;
      padding: .55rem .8rem;
    }
    .hint { margin-top: 1.1rem; font-size: .8rem; color: #7a93ad; }
  </style>
</head>
<body>
  <div class="floaties" aria-hidden="true">
    <span style="left:6%;  animation-duration:16s; animation-delay:0s">🗼</span>
    <span style="left:22%; animation-duration:19s; animation-delay:2s">🏰</span>
    <span style="left:38%; animation-duration:15s; animation-delay:4s">⛵</span>
    <span style="left:54%; animation-duration:21s; animation-delay:1s">🌷</span>
    <span style="left:70%; animation-duration:17s; animation-delay:5s">🐉</span>
    <span style="left:86%; animation-duration:20s; animation-delay:3s">🎡</span>
  </div>

  <div class="box">
    <div class="logo"><span class="hey">hey</span><span class="eu">EU</span> 🇪🇺</div>
    <p class="sub">Dein Europa-Abenteuer befindet sich in der <b>Test-Phase</b>.<br>
       Bitte melde dich mit deinen Zugangsdaten an.</p>

    <form method="post" autocomplete="off">
      <label for="benutzer">Benutzername</label>
      <input id="benutzer" name="benutzer" type="text" required autofocus>

      <label for="passwort">Passwort</label>
      <input id="passwort" name="passwort" type="password" required>

      <button type="submit">🚀 Anmelden &amp; losspielen</button>
    </form>

    <?php if ($fehler): ?>
      <div class="fehler">⚠️ <?= htmlspecialchars($fehler) ?></div>
    <?php endif; ?>

    <p class="hint">Keine Zugangsdaten? Frag die Person, die dich zum Testen eingeladen hat. 😊</p>
  </div>
</body>
</html>
