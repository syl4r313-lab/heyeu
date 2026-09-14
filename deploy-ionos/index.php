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
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%23003399'/><g fill='%23ffcc00'><circle cx='16' cy='7' r='1.9'/><circle cx='16' cy='25' r='1.9'/><circle cx='7' cy='16' r='1.9'/><circle cx='25' cy='16' r='1.9'/><circle cx='9.6' cy='9.6' r='1.9'/><circle cx='22.4' cy='22.4' r='1.9'/><circle cx='22.4' cy='9.6' r='1.9'/><circle cx='9.6' cy='22.4' r='1.9'/></g></svg>">
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
    .floaties svg {
      width: 46px; height: 46px;
      fill: none; stroke: #ffffff; stroke-width: 1.6;
      stroke-linecap: round; stroke-linejoin: round;
    }
    .btn-inhalt { display: inline-flex; align-items: center; justify-content: center; gap: .5em; }
    .btn-inhalt svg, .fehler svg { fill: none; stroke: currentColor; stroke-width: 2;
      stroke-linecap: round; stroke-linejoin: round; flex: none; }
    .fehler { display: flex; align-items: center; gap: .5em; }

    /* Partner-Logos unten links und rechts */
    .logo-ecke {
      position: fixed;
      bottom: 1rem;
      background: rgba(255,255,255,.95);
      border-radius: 16px;
      padding: .5rem .8rem;
      box-shadow: 0 4px 14px rgba(0,0,0,.18);
      z-index: 5;
    }
    .logo-ecke img { display: block; height: 52px; width: auto; max-width: 40vw; object-fit: contain; }
    .logo-ecke.links { left: 1rem; }
    .logo-ecke.rechts { right: 1rem; }
    @media (max-width: 620px), (max-height: 620px) {
      .logo-ecke { bottom: .5rem; padding: .35rem .55rem; border-radius: 12px; }
      .logo-ecke img { height: 36px; }
      .logo-ecke.links { left: .5rem; }
      .logo-ecke.rechts { right: .5rem; }
    }
  </style>
</head>
<body>
  <div class="floaties" aria-hidden="true">
    <span style="left:6%;  animation-duration:16s; animation-delay:0s"><svg viewBox="0 0 24 24"><path d="M12 1.5 13.2 6h-2.4zM10.8 6h2.4l1.1 5h-4.6zM9.3 11h5.4l1.6 7.5h-8.6zM7.7 18.5h8.6L17 22H7zM9 13.5h6M8.3 16.5h7.4"/></svg></span>
    <span style="left:22%; animation-duration:19s; animation-delay:2s"><svg viewBox="0 0 24 24"><path d="M3 22V9h3V6h2v3h3V6h2v3h3V6h2v3h3v13zM10 22v-6h4v6"/></svg></span>
    <span style="left:38%; animation-duration:15s; animation-delay:4s"><svg viewBox="0 0 24 24"><path d="M12 2v14M12 15 4 16l8-13zM13.5 4.5 20 15l-6.5 1zM2 18h20l-2.5 4h-15z"/></svg></span>
    <span style="left:54%; animation-duration:21s; animation-delay:1s"><svg viewBox="0 0 24 24"><path d="M12 12c-3 0-4.5-2.5-4.5-5.5C7.5 4 9 2.5 12 2.5s4.5 1.5 4.5 4c0 3-1.5 5.5-4.5 5.5zM12 3v9M12 12v10M12 16c-3.5 0-5-1.5-5-4M12 16c3.5 0 5-1.5 5-4"/></svg></span>
    <span style="left:70%; animation-duration:17s; animation-delay:5s"><svg viewBox="0 0 24 24"><path d="M3 21h18M6 21V9l6-5 6 5v12M9.5 21v-5h5v5M8 12h2M14 12h2"/></svg></span>
    <span style="left:86%; animation-duration:20s; animation-delay:3s"><svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="8"/><path d="M12 2v16M4 10h16M6.3 4.3l11.4 11.4M17.7 4.3 6.3 15.7M8 22h8l-4-8z"/></svg></span>
  </div>

  <div class="box">
    <div class="logo"><span class="hey">hey</span><span class="eu">EU</span></div>
    <p class="sub">Dein Europa-Abenteuer befindet sich in der <b>Test-Phase</b>.<br>
       Bitte melde dich mit deinen Zugangsdaten an.</p>

    <form method="post" autocomplete="off">
      <label for="benutzer">Benutzername</label>
      <input id="benutzer" name="benutzer" type="text" required autofocus>

      <label for="passwort">Passwort</label>
      <input id="passwort" name="passwort" type="password" required>

      <button type="submit"><span class="btn-inhalt"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3c3.5 2.5 5 6 5 9.5L12 17l-5-4.5C7 9 8.5 5.5 12 3z"/><circle cx="12" cy="9.5" r="1.8"/><path d="M9.5 15.5 7 18m10-2.5L19.5 18M12 17v3.5"/></svg>Anmelden &amp; losspielen</span></button>
    </form>

    <?php if ($fehler): ?>
      <div class="fehler"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 4 2.5 20.5h19z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.6" r="1" fill="currentColor" stroke="none"/></svg><span><?= htmlspecialchars($fehler) ?></span></div>
    <?php endif; ?>

    <p class="hint">Keine Zugangsdaten? Frag die Person, die dich zum Testen eingeladen hat.</p>
  </div>

  <div class="logo-ecke links">
    <img src="logos/logo-links.png" alt="Europa-Schecks – Eine Initiative des Landes Nordrhein-Westfalen"
         onerror="this.parentElement.style.display='none'">
  </div>
  <div class="logo-ecke rechts">
    <img src="logos/logo-rechts.png" alt="Gesamtschule Nordstadt Neuss"
         onerror="this.parentElement.style.display='none'">
  </div>
</body>
</html>
