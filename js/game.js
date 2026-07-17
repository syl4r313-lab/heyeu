/* ============================================================
   hey EU – Spiel-Engine
   Bewegung, Kamera, NPCs, Chat, Aufgaben, Touch-Steuerung
   ============================================================ */

const SAVE_KEY = 'heyeu_save_v1';
const MOVE_MS = 190;

const state = {
  char: null,            // { name, homeCountry, skin, hair, hairStyle, shirt }
  stars: 0,
  tasks: [],             // { id, type:'visit', country, done }
  visited: [],           // Länder-IDs besuchter Wahrzeichen
  submissions: [],       // Pinnwand-Beiträge { id, taskId, country, text, photo, status }
  player: null,
  npcs: [],
  camera: { x: 0, y: 0 },
  scale: 3,
  keys: {},
  chat: null,            // aktiver Chat { npc, mode, ... }
  seaPhase: 0,
  lastTime: 0,
  running: false
};

const $ = id => document.getElementById(id);

/* ---------------- Speichern / Laden ---------------- */

function saveGame() {
  if (!state.char) return;
  const data = {
    char: state.char, stars: state.stars, tasks: state.tasks,
    visited: state.visited, submissions: state.submissions,
    pos: state.player ? { x: state.player.tx, y: state.player.ty } : null
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    // Speicher voll oder gesperrt: Fotos weglassen und erneut versuchen
    try {
      data.submissions = state.submissions.map(s => ({ ...s, photo: null }));
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e2) { /* Spiel läuft ohne Speichern weiter */ }
  }
}

function loadSave() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)); }
  catch (e) { return null; }
}

/* ---------------- Spieler & NPCs ---------------- */

function makeActor(cfg, x, y) {
  return {
    cfg, frames: makeCharacterSprites(cfg),
    tx: x, ty: y,          // Ziel-Kachel
    fx: x, fy: y,          // fließende Position (Kacheln)
    dir: 'down', moving: false, moveT: 0,
    fromX: x, fromY: y, animFrame: 0
  };
}

function actorStep(a, dx, dy) {
  if (a.moving) return false;
  a.dir = dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down';
  const nx = a.tx + dx, ny = a.ty + dy;
  if (!World.isWalkable(nx, ny)) return false;
  if (occupied(nx, ny, a)) return false;
  a.fromX = a.tx; a.fromY = a.ty;
  a.tx = nx; a.ty = ny;
  a.moving = true; a.moveT = 0;
  return true;
}

function occupied(x, y, self) {
  if (state.player !== self && state.player.tx === x && state.player.ty === y) return true;
  for (const n of state.npcs) {
    if (n !== self && n.tx === x && n.ty === y) return true;
  }
  return false;
}

function updateActor(a, dt) {
  if (!a.moving) { a.animFrame = 0; return; }
  a.moveT += dt;
  const p = Math.min(1, a.moveT / MOVE_MS);
  a.fx = a.fromX + (a.tx - a.fromX) * p;
  a.fy = a.fromY + (a.ty - a.fromY) * p;
  a.animFrame = (Math.floor(a.moveT / (MOVE_MS / 2)) % 2) ? 1 : 2;
  if (p >= 1) { a.moving = false; a.fx = a.tx; a.fy = a.ty; a.animFrame = 0; }
}

function spawnNpcs() {
  const rng = makeRng(424242);
  const taken = new Set();
  state.npcs = [];
  COUNTRIES.forEach((c, ci) => {
    c.kids.forEach(name => {
      const s = World.randomSpotIn(ci, rng, taken);
      const npc = makeActor(randomCharConfig(rng), s.x, s.y);
      npc.name = name;
      npc.country = ci;
      npc.role = 'student';
      npc.wanderT = 1000 + rng() * 3000;
      state.npcs.push(npc);
    });
  });
  MODERATORS.forEach(m => {
    const ci = COUNTRIES.findIndex(c => c.id === m.country);
    const s = World.randomSpotIn(ci, rng, taken);
    const cfg = randomCharConfig(rng);
    cfg.shirt = '#f4b62e'; // Moderator:innen tragen Gold
    const npc = makeActor(cfg, s.x, s.y);
    npc.name = m.name;
    npc.country = ci;
    npc.role = 'mod';
    state.npcs.push(npc);
  });
}

function updateNpcs(dt) {
  const rng = Math.random;
  for (const n of state.npcs) {
    updateActor(n, dt);
    if (n.role !== 'student' || state.chat && state.chat.npc === n) continue;
    n.wanderT -= dt;
    if (n.wanderT <= 0 && !n.moving) {
      n.wanderT = 1200 + rng() * 3500;
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      const [dx, dy] = dirs[Math.floor(rng() * 4)];
      const t = World.tileAt(n.tx + dx, n.ty + dy);
      if (t && t.c === n.country && World.isWalkable(n.tx + dx, n.ty + dy)) {
        actorStep(n, dx, dy);
      }
    }
  }
}

/* ---------------- Eingabe ---------------- */

function setupInput() {
  window.addEventListener('keydown', e => {
    if (state.chat) return; // Chat hat eigene Eingabe
    state.keys[e.key] = true;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    if (e.key === ' ' || e.key === 'Enter') interact();
  });
  window.addEventListener('keyup', e => { state.keys[e.key] = false; });

  // Touch-Steuerkreuz
  document.querySelectorAll('#dpad button').forEach(btn => {
    const d = btn.dataset.dir;
    const press = ev => { ev.preventDefault(); state.keys['pad_' + d] = true; };
    const release = ev => { ev.preventDefault(); state.keys['pad_' + d] = false; };
    btn.addEventListener('touchstart', press, { passive: false });
    btn.addEventListener('touchend', release, { passive: false });
    btn.addEventListener('touchcancel', release, { passive: false });
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
  });
  const aBtn = $('btn-action');
  const doAction = ev => { ev.preventDefault(); if (!state.chat) interact(); };
  aBtn.addEventListener('touchstart', doAction, { passive: false });
  aBtn.addEventListener('mousedown', doAction);
}

function handleMovement() {
  if (state.chat || state.player.moving) return;
  const k = state.keys;
  let dx = 0, dy = 0;
  if (k.ArrowLeft || k.a || k.pad_left) dx = -1;
  else if (k.ArrowRight || k.d || k.pad_right) dx = 1;
  else if (k.ArrowUp || k.w || k.pad_up) dy = -1;
  else if (k.ArrowDown || k.s || k.pad_down) dy = 1;
  if (dx || dy) {
    const moved = actorStep(state.player, dx, dy);
    if (moved) saveGamePosThrottled();
    updateLocationHud();
  }
}

let saveThrottle = 0;
function saveGamePosThrottled() {
  const now = Date.now();
  if (now - saveThrottle > 3000) { saveThrottle = now; saveGame(); }
}

/* ---------------- Interaktion ---------------- */

function facingTile() {
  const p = state.player;
  const d = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[p.dir];
  return { x: p.tx + d[0], y: p.ty + d[1] };
}

function npcNear() {
  const f = facingTile();
  return state.npcs.find(n => (n.tx === f.x && n.ty === f.y) ||
    (Math.abs(n.tx - state.player.tx) + Math.abs(n.ty - state.player.ty) === 1));
}

function interact() {
  const p = state.player;
  const f = facingTile();
  const adjacent = (x, y) => Math.abs(x - p.tx) + Math.abs(y - p.ty) === 1;

  // Vorrang hat immer die Kachel, die der Spieler gerade anschaut
  let npc = state.npcs.find(n => n.tx === f.x && n.ty === f.y);
  if (npc) { openChat(npc); return; }
  let lm = World.landmarks.find(l => l.x === f.x && l.y === f.y);
  if (lm) { visitLandmark(lm); return; }
  let bd = World.boards.find(b => b.x === f.x && b.y === f.y);
  if (bd) { openBoard(bd.ci); return; }

  // sonst: irgendetwas direkt daneben
  npc = state.npcs.find(n => adjacent(n.tx, n.ty));
  if (npc) { openChat(npc); return; }
  lm = World.landmarks.find(l => adjacent(l.x, l.y));
  if (lm) { visitLandmark(lm); return; }
  bd = World.boards.find(b => adjacent(b.x, b.y));
  if (bd) openBoard(bd.ci);
}

/* ---------------- Pinnwand & Einreichungen ---------------- */

let currentBoardCountry = null;
let currentBoardTask = null;
let pendingPhoto = null;

function boardTasksFor(countryId) {
  return BOARD_TASKS.filter(t => t.country === null || t.country === countryId);
}

function submissionFor(taskId, countryId) {
  return state.submissions.find(s => s.taskId === taskId && s.country === countryId &&
    s.status !== 'rejected');
}

function openBoard(ci) {
  const c = COUNTRIES[ci];
  currentBoardCountry = c.id;
  $('board-title').textContent = `📌 Pinnwand ${c.flag} ${c.name}`;
  const list = $('board-list');
  list.innerHTML = '';

  boardTasksFor(c.id).forEach(task => {
    const sub = submissionFor(task.id, c.id);
    const div = document.createElement('div');
    div.className = 'board-task';
    let status = '';
    if (sub && sub.status === 'pending') status = '<span class="badge pending">⏳ Wartet auf Freigabe</span>';
    else if (sub && sub.status === 'approved') status = '<span class="badge approved">✅ Freigegeben +5 ⭐</span>';
    div.innerHTML = `<div class="board-task-head"><span class="board-emoji">${task.emoji}</span>
      <b>${task.title}</b></div>
      <p>${task.desc}</p><div class="board-task-foot">${status}</div>`;
    if (!sub) {
      const btn = document.createElement('button');
      btn.className = 'pill submit-pill';
      btn.textContent = '✍️ Beitrag einreichen';
      btn.addEventListener('click', () => openSubmitForm(task));
      div.querySelector('.board-task-foot').appendChild(btn);
    }
    list.appendChild(div);
  });

  // Galerie freigegebener Beiträge dieses Landes
  const approved = state.submissions.filter(s => s.country === c.id && s.status === 'approved');
  const gal = $('board-gallery');
  gal.innerHTML = '';
  if (approved.length) {
    const h = document.createElement('h3');
    h.textContent = '🌟 Freigegebene Beiträge';
    gal.appendChild(h);
    approved.forEach(s => {
      const task = BOARD_TASKS.find(t => t.id === s.taskId);
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.innerHTML = `<b>${task ? task.emoji + ' ' + task.title : ''}</b>` +
        (s.photo ? `<img src="${s.photo}" alt="Beitrag">` : '') +
        (s.text ? `<p>${escapeHtml(s.text)}</p>` : '') +
        `<small>von ${escapeHtml(s.player)}</small>`;
      gal.appendChild(div);
    });
  }
  $('board-panel').classList.remove('hidden');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function openSubmitForm(task) {
  currentBoardTask = task;
  pendingPhoto = null;
  $('board-panel').classList.add('hidden');
  $('submit-title').textContent = `${task.emoji} ${task.title}`;
  $('submit-desc').textContent = task.desc;
  $('submit-text').value = '';
  $('submit-photo-preview').classList.add('hidden');
  $('submit-photo-input').value = '';
  $('submit-error').textContent = '';
  $('submit-panel').classList.remove('hidden');
}

function handlePhotoInput(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      // verkleinern, damit der Browser-Speicher reicht
      const max = 480;
      const f = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.width * f);
      cv.height = Math.round(img.height * f);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      pendingPhoto = cv.toDataURL('image/jpeg', 0.75);
      const prev = $('submit-photo-preview');
      prev.src = pendingPhoto;
      prev.classList.remove('hidden');
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

let submissionCounter = 0;

function submitBoardEntry() {
  const text = $('submit-text').value.trim();
  if (!text && !pendingPhoto) {
    $('submit-error').textContent = 'Schreib einen Text oder lade ein Foto hoch. 😊';
    return;
  }
  if (text && !isTextClean(text)) {
    $('submit-error').textContent = 'Dein Text enthält Wörter, die hier nicht erlaubt sind. Bitte formuliere ihn freundlich um. 😊';
    return;
  }
  state.submissions.push({
    id: ++submissionCounter,
    taskId: currentBoardTask.id,
    country: currentBoardCountry,
    player: state.char.name,
    text, photo: pendingPhoto,
    status: 'pending',
    date: new Date().toLocaleDateString('de-DE')
  });
  saveGame();
  $('submit-panel').classList.add('hidden');
  toast('📬 Dein Beitrag wurde eingereicht! Ein Admin schaut ihn sich bald an.');
}

/* ---------------- Admin-Bereich ---------------- */

function openAdminPin() {
  $('admin-pin-input').value = '';
  $('admin-pin-error').textContent = '';
  $('help-panel').classList.add('hidden');
  $('admin-pin-panel').classList.remove('hidden');
}

function checkAdminPin() {
  if ($('admin-pin-input').value === ADMIN_PIN) {
    $('admin-pin-panel').classList.add('hidden');
    openAdminPanel();
  } else {
    $('admin-pin-error').textContent = 'Falsche PIN.';
  }
}

function openAdminPanel() {
  const list = $('admin-list');
  list.innerHTML = '';
  const pending = state.submissions.filter(s => s.status === 'pending');
  $('admin-count').textContent = pending.length
    ? `${pending.length} Beitrag/Beiträge warten auf Prüfung:`
    : 'Keine offenen Beiträge. Alles erledigt! 🎉';

  pending.forEach(s => {
    const task = BOARD_TASKS.find(t => t.id === s.taskId);
    const c = COUNTRIES.find(x => x.id === s.country);
    const div = document.createElement('div');
    div.className = 'admin-item';
    div.innerHTML =
      `<b>${task ? task.emoji + ' ' + task.title : s.taskId}</b>
       <small>${c ? c.flag + ' ' + c.name : ''} · von ${escapeHtml(s.player)} · ${s.date}</small>` +
      (s.photo ? `<img src="${s.photo}" alt="Beitrag">` : '') +
      (s.text ? `<p>${escapeHtml(s.text)}</p>` : '');
    const row = document.createElement('div');
    row.className = 'admin-actions';
    const ok = document.createElement('button');
    ok.className = 'big-btn small approve';
    ok.textContent = '✅ Freigeben';
    ok.addEventListener('click', () => {
      s.status = 'approved';
      state.stars += 5;
      updateHud(); saveGame();
      toast('✅ Beitrag freigegeben! +5 ⭐');
      openAdminPanel();
    });
    const no = document.createElement('button');
    no.className = 'big-btn small reject';
    no.textContent = '❌ Ablehnen';
    no.addEventListener('click', () => {
      s.status = 'rejected';
      saveGame();
      openAdminPanel();
    });
    row.appendChild(ok); row.appendChild(no);
    div.appendChild(row);
    list.appendChild(div);
  });
  $('admin-panel').classList.remove('hidden');
}

function visitLandmark(lm) {
  const c = COUNTRIES[lm.ci];
  $('info-emoji').textContent = c.lm.emoji;
  $('info-title').textContent = c.lm.name;
  $('info-country').textContent = `${c.flag} ${c.name}`;
  $('info-text').textContent = c.lm.info;
  $('info-card').classList.remove('hidden');

  if (!state.visited.includes(c.id)) state.visited.push(c.id);

  const task = state.tasks.find(t => t.type === 'visit' && t.country === c.id && !t.done);
  if (task) {
    task.done = true;
    state.stars += 3;
    updateHud();
    toast(`🎉 Aufgabe geschafft: ${c.lm.name} besucht! +3 ⭐`);
  }
  saveGame();
}

/* ---------------- Chat ---------------- */

function openChat(npc) {
  state.chat = { npc, log: [] };
  // NPC dreht sich zum Spieler
  const p = state.player;
  npc.dir = npc.tx < p.tx ? 'right' : npc.tx > p.tx ? 'left' : npc.ty < p.ty ? 'down' : 'up';
  npc.moving = false;

  const c = COUNTRIES[npc.country];
  $('chat-title').textContent =
    (npc.role === 'mod' ? '⭐ ' : '') + `${npc.name} · ${c.flag} ${c.name}`;
  $('chat-messages').innerHTML = '';
  $('chat-panel').classList.remove('hidden');
  $('chat-input').value = '';

  // Jeder Chat beginnt mit „hey EU!“
  addBubble('me', 'hey EU! 👋');

  if (npc.role === 'mod') {
    npcSay(`hey EU, hallo ${state.char.name}! 😊 Ich bin ${npc.name}. Ich habe eine neue Aufgabe für dich. Willst du sie hören? Übrigens: An der Pinnwand 📌 findest du besondere Mitmach-Aufgaben!`);
    setQuickReplies([
      { label: 'Ja, klar! ✨', fn: () => offerTask(npc) },
      { label: 'Später! 👋', fn: closeChat }
    ]);
  } else {
    npcSay(`hey EU! Ich bin ${npc.name} aus ${c.name} ${c.flag}. Schön, dich zu treffen!`);
    studentQuickReplies();
  }
}

function studentQuickReplies() {
  setQuickReplies([
    { label: 'Erzähl mir was über dein Land! 🌍', fn: () => studentAnswer('land') },
    { label: 'Was isst du gern? 🍽️', fn: () => studentAnswer('essen') },
    { label: 'Was machst du gern? ⚽', fn: () => studentAnswer('hobby') },
    { label: 'Tschüss! 👋', fn: () => studentAnswer('bye') }
  ]);
}

function studentAnswer(topic) {
  const npc = state.chat.npc;
  const c = COUNTRIES[npc.country];
  const labels = {
    land: 'Erzähl mir was über dein Land! 🌍',
    essen: 'Was isst du gern? 🍽️',
    hobby: 'Was machst du gern? ⚽',
    bye: 'Tschüss! 👋'
  };
  addBubble('me', labels[topic]);
  if (topic === 'land') npcSay(c.fact);
  else if (topic === 'essen') npcSay(c.food);
  else if (topic === 'hobby') npcSay(c.hobby);
  else {
    npcSay(FAREWELLS[Math.floor(Math.random() * FAREWELLS.length)], () => closeChat());
    setQuickReplies([]);
    return;
  }
  studentQuickReplies();
}

function freeTextReply(text) {
  const npc = state.chat.npc;
  const c = COUNTRIES[npc.country];
  const t = text.toLowerCase();
  if (/tsch(ü|u)ss|bye|ciao|auf wiedersehen/.test(t)) {
    npcSay(FAREWELLS[Math.floor(Math.random() * FAREWELLS.length)], () => closeChat());
  } else if (/essen|isst|hunger|lecker|food|gericht/.test(t)) {
    npcSay(c.food);
  } else if (/hobby|spielst|sport|machst|freizeit/.test(t)) {
    npcSay(c.hobby);
  } else if (/land|wohnst|kommst|sehensw|wahrzeichen/.test(t) || t.includes('?')) {
    npcSay(c.fact);
  } else if (/hallo|hi|hey|moin|servus/.test(t)) {
    npcSay(`hey EU! 😄 Schön, dass du da bist, ${state.char.name}!`);
  } else {
    npcSay(SMALLTALK[Math.floor(Math.random() * SMALLTALK.length)]);
  }
}

/* Moderator: Aufgaben */
let taskCounter = 0;

function offerTask(npc) {
  addBubble('me', 'Ja, klar! ✨');
  // abwechselnd Quiz oder Reise-Aufgabe
  const openVisits = state.tasks.filter(t => !t.done).length;
  const wantVisit = openVisits < 2 && Math.random() < 0.5;
  if (wantVisit) {
    const candidates = COUNTRIES.filter(c =>
      !state.visited.includes(c.id) &&
      !state.tasks.some(t => t.type === 'visit' && t.country === c.id && !t.done));
    if (candidates.length) {
      const c = candidates[Math.floor(Math.random() * candidates.length)];
      state.tasks.push({ id: ++taskCounter, type: 'visit', country: c.id, done: false });
      npcSay(`Deine Aufgabe: Reise nach ${c.name} ${c.flag} und besuche ${c.lm.emoji} ${c.lm.name}! Dafür bekommst du 3 ⭐. Du findest sie in deiner Aufgabenliste 📋. Viel Erfolg!`);
      setQuickReplies([{ label: 'Mach ich! 💪', fn: closeChat }]);
      updateHud(); saveGame();
      return;
    }
  }
  askQuiz(npc);
}

function askQuiz(npc) {
  const pool = COUNTRIES.filter(c => c.id !== COUNTRIES[npc.country].id);
  const c = pool[Math.floor(Math.random() * pool.length)];
  const options = [c.quiz.correct, ...c.quiz.wrong]
    .map(v => ({ v, r: Math.random() })).sort((a, b) => a.r - b.r).map(o => o.v);
  npcSay(`Quizfrage über ${c.name} ${c.flag}: ${c.quiz.q}`);
  setQuickReplies(options.map(opt => ({
    label: opt,
    fn: () => {
      addBubble('me', opt);
      if (opt === c.quiz.correct) {
        state.stars += 2;
        updateHud(); saveGame();
        npcSay('Richtig! 🎉 Super gemacht, du bekommst 2 ⭐!');
        setQuickReplies([
          { label: 'Noch eine Aufgabe! ✨', fn: () => offerTask(npc) },
          { label: 'Tschüss! 👋', fn: closeChat }
        ]);
      } else {
        npcSay('Fast! 💪 Überleg noch mal – du schaffst das!');
        askQuiz2(npc, c, options);
      }
    }
  })));
}

function askQuiz2(npc, c, options) {
  setQuickReplies(options.map(opt => ({
    label: opt,
    fn: () => {
      addBubble('me', opt);
      if (opt === c.quiz.correct) {
        state.stars += 1;
        updateHud(); saveGame();
        npcSay('Genau! 🎉 Beim zweiten Versuch – 1 ⭐ für dich!');
      } else {
        npcSay(`Die richtige Antwort war: ${c.quiz.correct}. Beim nächsten Mal klappt es bestimmt! 😊`);
      }
      setQuickReplies([
        { label: 'Noch eine Aufgabe! ✨', fn: () => offerTask(npc) },
        { label: 'Tschüss! 👋', fn: closeChat }
      ]);
    }
  })));
}

/* Chat-Hilfsfunktionen */
function addBubble(who, text) {
  const div = document.createElement('div');
  div.className = 'bubble ' + who;
  div.textContent = text;
  $('chat-messages').appendChild(div);
  $('chat-messages').scrollTop = $('chat-messages').scrollHeight;
}

function npcSay(text, after) {
  const typing = document.createElement('div');
  typing.className = 'bubble them typing';
  typing.textContent = '···';
  $('chat-messages').appendChild(typing);
  $('chat-messages').scrollTop = $('chat-messages').scrollHeight;
  setTimeout(() => {
    typing.remove();
    if (!state.chat) return;
    addBubble('them', text);
    if (after) after();
  }, 450 + Math.min(text.length * 8, 900));
}

function setQuickReplies(items) {
  const box = $('chat-quick');
  box.innerHTML = '';
  items.forEach(it => {
    const b = document.createElement('button');
    b.textContent = it.label;
    b.addEventListener('click', it.fn);
    box.appendChild(b);
  });
}

function closeChat() {
  state.chat = null;
  $('chat-panel').classList.add('hidden');
}

/* ---------------- HUD, Aufgaben, Karte ---------------- */

function updateHud() {
  $('hud-stars').textContent = state.stars;
  const open = state.tasks.filter(t => !t.done).length;
  $('hud-task-count').textContent = open ? ` (${open})` : '';
}

function updateLocationHud() {
  const t = World.tileAt(state.player.tx, state.player.ty);
  const el = $('hud-location');
  if (t && t.c >= 0) {
    const c = COUNTRIES[t.c];
    el.textContent = `${c.flag} ${c.name}`;
  } else {
    el.textContent = '🌊 Auf See';
  }
}

function toggleTasks() {
  const panel = $('task-panel');
  if (!panel.classList.contains('hidden')) { panel.classList.add('hidden'); return; }
  const list = $('task-list');
  list.innerHTML = '';
  if (!state.tasks.length) {
    list.innerHTML = '<p class="muted">Noch keine Aufgaben. Sprich mit einer Moderatorin oder einem Moderator (⭐ goldenes Shirt)!</p>';
  }
  [...state.tasks].reverse().forEach(t => {
    const c = COUNTRIES.find(x => x.id === t.country);
    const div = document.createElement('div');
    div.className = 'task' + (t.done ? ' done' : '');
    div.innerHTML = `<span>${t.done ? '✅' : '🧭'}</span><div>Besuche ${c.lm.emoji} <b>${c.lm.name}</b> in ${c.flag} ${c.name} <small>(+3 ⭐)</small></div>`;
    list.appendChild(div);
  });
  const visited = state.visited.length;
  $('task-progress').textContent = `Wahrzeichen entdeckt: ${visited} / ${COUNTRIES.length}`;
  panel.classList.remove('hidden');
}

function toggleMap() {
  const panel = $('map-panel');
  if (!panel.classList.contains('hidden')) { panel.classList.add('hidden'); return; }
  const cv = $('minimap');
  const ctx = cv.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(World.canvases[0], 0, 0, cv.width, cv.height);
  // Spielerpunkt
  const px = state.player.tx / WORLD_W * cv.width;
  const py = state.player.ty / WORLD_H * cv.height;
  ctx.fillStyle = '#ff3355';
  ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
  panel.classList.remove('hidden');
}

function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add('hidden'), 3500);
}

/* ---------------- Rendering ---------------- */

const canvas = document.createElement('canvas');
let ctx = null;

function resizeCanvas() {
  const holder = $('game-canvas-holder');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = holder.clientWidth * dpr;
  canvas.height = holder.clientHeight * dpr;
  canvas.style.width = holder.clientWidth + 'px';
  canvas.style.height = holder.clientHeight + 'px';
  // Zoom: ca. 13–15 Kacheln in der kleineren Richtung
  const minDim = Math.min(canvas.width, canvas.height);
  state.scale = Math.max(2, Math.round(minDim / (TILE * 13)));
  ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
}

function draw() {
  if (!ctx) return;
  const s = TILE * state.scale;
  const p = state.player;
  let camX = p.fx * s + s / 2 - canvas.width / 2;
  let camY = p.fy * s + s / 2 - canvas.height / 2;
  camX = Math.max(0, Math.min(WORLD_W * s - canvas.width, camX));
  camY = Math.max(0, Math.min(WORLD_H * s - canvas.height, camY));

  const world = World.canvases[state.seaPhase];
  ctx.fillStyle = '#4aa3e8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(world,
    camX / state.scale, camY / state.scale,
    canvas.width / state.scale, canvas.height / state.scale,
    0, 0, canvas.width, canvas.height);

  // Figuren (nach Y sortiert)
  const actors = [...state.npcs, p].sort((a, b) => a.fy - b.fy);
  for (const a of actors) {
    drawActor(a, camX, camY, s);
  }
}

function drawActor(a, camX, camY, s) {
  const x = a.fx * s - camX + s / 2;
  const y = a.fy * s - camY + s;
  if (x < -s || y < -s || x > canvas.width + s || y > canvas.height + s) return;

  // Schatten
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath();
  ctx.ellipse(x, y - state.scale, 6 * state.scale * 0.8, 2.2 * state.scale * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  const frame = a.frames[a.dir + a.animFrame];
  const w = SPRITE_W * state.scale, h = SPRITE_H * state.scale;
  ctx.drawImage(frame, Math.round(x - w / 2), Math.round(y - h), w, h);

  if (a !== state.player) {
    // Namensschild
    ctx.font = `bold ${5 * state.scale}px "Trebuchet MS", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const label = (a.role === 'mod' ? '⭐ ' : '') + a.name;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.strokeText(label, x, y - h - 3);
    ctx.fillStyle = a.role === 'mod' ? '#a06a00' : '#274b78';
    ctx.fillText(label, x, y - h - 3);

    // Sprechblase, wenn der Spieler daneben steht
    const near = Math.abs(a.tx - state.player.tx) + Math.abs(a.ty - state.player.ty) === 1;
    if (near && !state.chat) {
      ctx.font = `${7 * state.scale}px serif`;
      ctx.fillText('💬', x, y - h - 6 * state.scale);
    }
  }
}

/* ---------------- Hauptschleife ---------------- */

let waveTimer = 0;

function loop(time) {
  if (!state.running) return;
  const dt = Math.min(50, time - state.lastTime || 16);
  state.lastTime = time;

  waveTimer += dt;
  if (waveTimer > 600) { waveTimer = 0; state.seaPhase = 1 - state.seaPhase; }

  handleMovement();
  updateActor(state.player, dt);
  updateNpcs(dt);
  draw();
  requestAnimationFrame(loop);
}

/* ---------------- Spielstart ---------------- */

function startGame(charCfg, savedPos) {
  state.char = charCfg;
  World.build();
  World.prerender();
  spawnNpcs();

  let spawn = savedPos;
  if (!spawn || !World.isWalkable(spawn.x, spawn.y)) {
    spawn = { ...World.centers[charCfg.homeCountry] };
    if (!World.isWalkable(spawn.x, spawn.y)) {
      // Notfalls Nachbarkachel suchen
      outer: for (let r = 1; r < 4; r++)
        for (let dy = -r; dy <= r; dy++)
          for (let dx = -r; dx <= r; dx++)
            if (World.isWalkable(spawn.x + dx, spawn.y + dy)) {
              spawn = { x: spawn.x + dx, y: spawn.y + dy }; break outer;
            }
    }
  }

  state.player = makeActor(charCfg, spawn.x, spawn.y);

  $('screen-title').classList.add('hidden');
  $('screen-creator').classList.add('hidden');
  $('screen-game').classList.remove('hidden');
  $('game-canvas-holder').appendChild(canvas);
  resizeCanvas();

  $('hud-name').textContent = charCfg.name;
  const home = COUNTRIES.find(c => c.id === charCfg.homeCountry);
  $('hud-flag').textContent = home ? home.flag : '🇪🇺';
  updateHud();
  updateLocationHud();
  saveGame();

  if (!state.running) {
    state.running = true;
    requestAnimationFrame(t => { state.lastTime = t; loop(t); });
  }
  toast('Willkommen bei hey EU! Lauf über die Holzstege in andere Länder – und schau an die Pinnwände! 📌🌍');
}
