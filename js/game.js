/* ============================================================
   hey EU – Spiel-Engine
   Bewegung, Hüpfen, Kamera, NPCs, Chat, Aufgaben, Pinnwände
   ============================================================ */

const SAVE_KEY = 'heyeu_save_v2';
const MOVE_MS = 175;
const JUMP_MS = 520;
const JUMP_HEIGHT = 0.85;     // in Kacheln

const state = {
  char: null,
  stars: 0,
  tasks: [],
  visited: [],
  submissions: [],
  player: null,
  npcs: [],
  camera: { x: 0, y: 0 },
  tilePx: 48,
  keys: {},
  chat: null,
  lastTime: 0,
  running: false
};

const $ = id => document.getElementById(id);

/* ---------------- Speichern und Laden ---------------- */

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
    try {
      data.submissions = state.submissions.map(s => ({ ...s, photo: null }));
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e2) { /* Spiel läuft auch ohne Speichern weiter */ }
  }
}

function loadSave() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)); }
  catch (e) { return null; }
}

/* ---------------- Figuren ---------------- */

function makeActor(cfg, x, y) {
  return {
    cfg, frames: makeCharacterSprites(cfg),
    tx: x, ty: y,
    fx: x, fy: y,
    dir: 'down', moving: false, moveT: 0,
    fromX: x, fromY: y,
    jumpT: -1, waveT: 0, stepPhase: 0
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
  a.stepPhase = 1 - a.stepPhase;
  return true;
}

function occupied(x, y, self) {
  if (state.player !== self && state.player.tx === x && state.player.ty === y) return true;
  for (const n of state.npcs) {
    if (n !== self && n.tx === x && n.ty === y) return true;
  }
  return false;
}

function actorJump(a) {
  if (a.jumpT >= 0) return false;
  a.jumpT = 0;
  return true;
}

function updateActor(a, dt) {
  if (a.jumpT >= 0) {
    a.jumpT += dt;
    if (a.jumpT > JUMP_MS) a.jumpT = -1;
  }
  if (a.waveT > 0) a.waveT -= dt;
  if (!a.moving) return;
  a.moveT += dt;
  const p = Math.min(1, a.moveT / MOVE_MS);
  a.fx = a.fromX + (a.tx - a.fromX) * p;
  a.fy = a.fromY + (a.ty - a.fromY) * p;
  if (p >= 1) { a.moving = false; a.fx = a.tx; a.fy = a.ty; }
}

/* Höhe über dem Boden (in Kacheln) während des Sprungs */
function jumpOffset(a) {
  if (a.jumpT < 0) return 0;
  const p = a.jumpT / JUMP_MS;
  return Math.sin(Math.PI * p) * JUMP_HEIGHT;
}

function actorPose(a) {
  if (a.jumpT >= 0) return 'jump';
  if (a.waveT > 0) return 'wave';
  if (a.moving) {
    const half = a.moveT < MOVE_MS / 2;
    return (a.stepPhase === 0) === half ? 'walk1' : 'walk2';
  }
  return 'stand';
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
      npc.hopT = 4000 + rng() * 14000;
      state.npcs.push(npc);
    });
  });
  MODERATORS.forEach(m => {
    const ci = COUNTRIES.findIndex(c => c.id === m.country);
    if (ci < 0) return;
    const s = World.randomSpotIn(ci, rng, taken);
    const cfg = randomCharConfig(rng);
    cfg.shirt = '#f4b62e';        // Moderator:innen tragen Gold
    const npc = makeActor(cfg, s.x, s.y);
    npc.name = m.name;
    npc.country = ci;
    npc.role = 'mod';
    npc.hopT = 6000 + rng() * 10000;
    state.npcs.push(npc);
  });
}

function updateNpcs(dt) {
  const rng = Math.random;
  for (const n of state.npcs) {
    updateActor(n, dt);
    if (state.chat && state.chat.npc === n) continue;
    // ab und zu hüpfen – wirkt lebendig
    n.hopT -= dt;
    if (n.hopT <= 0) {
      n.hopT = 6000 + rng() * 16000;
      if (!n.moving) actorJump(n);
    }
    if (n.role !== 'student') continue;
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
    if (state.chat) return;
    state.keys[e.key] = true;
    const k = e.key.toLowerCase();
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    if (k === 'j') { playerJump(); return; }
    if (e.key === ' ' || e.key === 'Enter') interactOrJump();
  });
  window.addEventListener('keyup', e => { state.keys[e.key] = false; });

  // Steuerkreuz
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
  const doAction = ev => { ev.preventDefault(); if (!state.chat) interactOrJump(); };
  aBtn.addEventListener('touchstart', doAction, { passive: false });
  aBtn.addEventListener('mousedown', doAction);

  const jBtn = $('btn-jump');
  const doJump = ev => { ev.preventDefault(); if (!state.chat) playerJump(); };
  jBtn.addEventListener('touchstart', doJump, { passive: false });
  jBtn.addEventListener('mousedown', doJump);
}

function playerJump() {
  actorJump(state.player);
}

function handleMovement() {
  if (state.chat || state.player.moving) return;
  const k = state.keys;
  let dx = 0, dy = 0;
  if (k.ArrowLeft || k.a || k.A || k.pad_left) dx = -1;
  else if (k.ArrowRight || k.d || k.D || k.pad_right) dx = 1;
  else if (k.ArrowUp || k.w || k.W || k.pad_up) dy = -1;
  else if (k.ArrowDown || k.s || k.S || k.pad_down) dy = 1;
  if (dx || dy) {
    if (actorStep(state.player, dx, dy)) saveGamePosThrottled();
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

/* Gibt es etwas zum Anschauen? Sonst wird gehüpft. */
function interactOrJump() {
  if (!interact()) playerJump();
}

function interact() {
  const p = state.player;
  const f = facingTile();
  const adjacent = (x, y) => Math.abs(x - p.tx) + Math.abs(y - p.ty) === 1;

  let npc = state.npcs.find(n => n.tx === f.x && n.ty === f.y);
  if (npc) { openChat(npc); return true; }
  let lm = World.landmarks.find(l => l.x === f.x && l.y === f.y);
  if (lm) { visitLandmark(lm); return true; }
  let bd = World.boards.find(b => b.x === f.x && b.y === f.y);
  if (bd) { openBoard(bd.ci); return true; }

  npc = state.npcs.find(n => adjacent(n.tx, n.ty));
  if (npc) { openChat(npc); return true; }
  lm = World.landmarks.find(l => adjacent(l.x, l.y));
  if (lm) { visitLandmark(lm); return true; }
  bd = World.boards.find(b => adjacent(b.x, b.y));
  if (bd) { openBoard(bd.ci); return true; }
  return false;
}

/* ---------------- Pinnwand ---------------- */

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
  setFlagLabel($('board-title'), c.id, 'Pinnwand ' + c.name);
  const list = $('board-list');
  list.innerHTML = '';

  boardTasksFor(c.id).forEach(task => {
    const sub = submissionFor(task.id, c.id);
    const div = document.createElement('div');
    div.className = 'board-task';

    const head = document.createElement('div');
    head.className = 'board-task-head';
    head.appendChild(iconEl(task.icon, 22, 'board-icon'));
    const b = document.createElement('b');
    b.textContent = task.title;
    head.appendChild(b);
    div.appendChild(head);

    const p = document.createElement('p');
    p.textContent = task.desc;
    div.appendChild(p);

    const foot = document.createElement('div');
    foot.className = 'board-task-foot';
    if (sub && sub.status === 'pending') {
      const badge = document.createElement('span');
      badge.className = 'badge pending';
      setIconLabel(badge, 'clock', 'Wartet auf Freigabe', 15);
      foot.appendChild(badge);
    } else if (sub && sub.status === 'approved') {
      const badge = document.createElement('span');
      badge.className = 'badge approved';
      setIconLabel(badge, 'check', 'Freigegeben, +5 Sterne', 15);
      foot.appendChild(badge);
    } else {
      const btn = document.createElement('button');
      btn.className = 'pill submit-pill';
      setIconLabel(btn, 'pen', 'Beitrag einreichen', 16);
      btn.addEventListener('click', () => openSubmitForm(task));
      foot.appendChild(btn);
    }
    div.appendChild(foot);
    list.appendChild(div);
  });

  const approved = state.submissions.filter(s => s.country === c.id && s.status === 'approved');
  const gal = $('board-gallery');
  gal.innerHTML = '';
  if (approved.length) {
    const h = document.createElement('h3');
    setIconLabel(h, 'star', 'Freigegebene Beiträge', 18);
    gal.appendChild(h);
    approved.forEach(s => {
      const task = BOARD_TASKS.find(t => t.id === s.taskId);
      const div = document.createElement('div');
      div.className = 'gallery-item';
      const t = document.createElement('b');
      t.textContent = task ? task.title : '';
      div.appendChild(t);
      if (s.photo) {
        const img = document.createElement('img');
        img.src = s.photo; img.alt = 'Beitrag';
        div.appendChild(img);
      }
      if (s.text) {
        const p = document.createElement('p');
        p.textContent = s.text;
        div.appendChild(p);
      }
      const sm = document.createElement('small');
      sm.textContent = 'von ' + s.player;
      div.appendChild(sm);
      gal.appendChild(div);
    });
  }
  $('board-panel').classList.remove('hidden');
}

function openSubmitForm(task) {
  currentBoardTask = task;
  pendingPhoto = null;
  $('board-panel').classList.add('hidden');
  setIconLabel($('submit-title'), task.icon, task.title, 20);
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
    $('submit-error').textContent = 'Schreib einen Text oder lade ein Foto hoch.';
    return;
  }
  if (text && !isTextClean(text)) {
    $('submit-error').textContent = 'Dein Text enthält Wörter, die hier nicht erlaubt sind. Bitte formuliere ihn freundlich um.';
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
  toast('Dein Beitrag wurde eingereicht. Ein Admin schaut ihn sich bald an.', 'inbox');
}

/* ---------------- Admin ---------------- */

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
    : 'Keine offenen Beiträge. Alles erledigt.';

  pending.forEach(s => {
    const task = BOARD_TASKS.find(t => t.id === s.taskId);
    const c = COUNTRIES.find(x => x.id === s.country);
    const div = document.createElement('div');
    div.className = 'admin-item';

    const t = document.createElement('b');
    t.textContent = task ? task.title : s.taskId;
    div.appendChild(t);

    const meta = document.createElement('small');
    if (c) meta.appendChild(flagEl(c.id, 12));
    const mt = document.createElement('span');
    mt.textContent = (c ? c.name + ' · ' : '') + 'von ' + s.player + ' · ' + s.date;
    meta.appendChild(mt);
    div.appendChild(meta);

    if (s.photo) {
      const img = document.createElement('img');
      img.src = s.photo; img.alt = 'Beitrag';
      div.appendChild(img);
    }
    if (s.text) {
      const p = document.createElement('p');
      p.textContent = s.text;
      div.appendChild(p);
    }

    const row = document.createElement('div');
    row.className = 'admin-actions';
    const ok = document.createElement('button');
    ok.className = 'big-btn small approve';
    setIconLabel(ok, 'check', 'Freigeben', 18);
    ok.addEventListener('click', () => {
      s.status = 'approved';
      state.stars += 5;
      updateHud(); saveGame();
      toast('Beitrag freigegeben. +5 Sterne', 'check');
      openAdminPanel();
    });
    const no = document.createElement('button');
    no.className = 'big-btn small reject';
    setIconLabel(no, 'cross', 'Ablehnen', 18);
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

/* ---------------- Wahrzeichen ---------------- */

function visitLandmark(lm) {
  const c = COUNTRIES[lm.ci];
  const box = $('info-art');
  box.innerHTML = '';
  box.appendChild(landmarkEl(c.lm.art, 132, 140));
  $('info-title').textContent = c.lm.name;
  setFlagLabel($('info-country'), c.id, c.name);
  $('info-text').textContent = c.lm.info;
  $('info-card').classList.remove('hidden');

  if (!state.visited.includes(c.id)) state.visited.push(c.id);

  const task = state.tasks.find(t => t.type === 'visit' && t.country === c.id && !t.done);
  if (task) {
    task.done = true;
    state.stars += 3;
    updateHud();
    actorJump(state.player);
    toast(`Aufgabe geschafft: ${c.lm.name} besucht! +3 Sterne`, 'star');
  }
  saveGame();
}

/* ---------------- Chat ---------------- */

function openChat(npc) {
  state.chat = { npc };
  const p = state.player;
  npc.dir = npc.tx < p.tx ? 'right' : npc.tx > p.tx ? 'left' : npc.ty < p.ty ? 'down' : 'up';
  npc.moving = false;
  npc.waveT = 900;

  const c = COUNTRIES[npc.country];
  const title = $('chat-title');
  title.innerHTML = '';
  if (npc.role === 'mod') title.appendChild(iconEl('star', 16, 'mod-star'));
  title.appendChild(flagEl(c.id, 14));
  const nm = document.createElement('span');
  nm.textContent = `${npc.name} · ${c.name}`;
  title.appendChild(nm);

  $('chat-messages').innerHTML = '';
  $('chat-panel').classList.remove('hidden');
  $('chat-input').value = '';

  addBubble('me', 'hey EU!');

  if (npc.role === 'mod') {
    npcSay(`hey EU, hallo ${state.char.name}! Ich bin ${npc.name}. Ich habe eine Aufgabe für dich. Willst du sie hören? Übrigens: An der Pinnwand findest du besondere Mitmach-Aufgaben.`);
    setQuickReplies([
      { label: 'Ja, klar!', fn: () => offerTask(npc) },
      { label: 'Später!', fn: closeChat }
    ]);
  } else {
    npcSay(`hey EU! Ich bin ${npc.name} ${landForm(c, 'aus')}. Schön, dich zu treffen!`);
    studentQuickReplies();
  }
}

function studentQuickReplies() {
  setQuickReplies([
    { label: 'Erzähl mir was über dein Land!', fn: () => studentAnswer('land') },
    { label: 'Was isst du gern?', fn: () => studentAnswer('essen') },
    { label: 'Was machst du gern?', fn: () => studentAnswer('hobby') },
    { label: 'Tschüss!', fn: () => studentAnswer('bye') }
  ]);
}

function studentAnswer(topic) {
  const npc = state.chat.npc;
  const c = COUNTRIES[npc.country];
  const labels = {
    land: 'Erzähl mir was über dein Land!',
    essen: 'Was isst du gern?',
    hobby: 'Was machst du gern?',
    bye: 'Tschüss!'
  };
  addBubble('me', labels[topic]);
  if (topic === 'land') npcSay(c.fact);
  else if (topic === 'essen') npcSay(c.food);
  else if (topic === 'hobby') npcSay(c.hobby);
  else {
    npc.waveT = 900;
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
    npc.waveT = 900;
    npcSay(FAREWELLS[Math.floor(Math.random() * FAREWELLS.length)], () => closeChat());
  } else if (/essen|isst|hunger|lecker|food|gericht/.test(t)) {
    npcSay(c.food);
  } else if (/hobby|spielst|sport|machst|freizeit/.test(t)) {
    npcSay(c.hobby);
  } else if (/h(ü|u)pf|spring/.test(t)) {
    npc.jumpT = 0;
    npcSay('Schau mal, so geht das! Drück einfach den Sprung-Knopf, dann hüpfst du auch.');
  } else if (/land|wohnst|kommst|sehensw|wahrzeichen/.test(t) || t.includes('?')) {
    npcSay(c.fact);
  } else if (/hallo|hi|hey|moin|servus/.test(t)) {
    npc.waveT = 900;
    npcSay(`hey EU! Schön, dass du da bist, ${state.char.name}!`);
  } else {
    npcSay(SMALLTALK[Math.floor(Math.random() * SMALLTALK.length)]);
  }
}

/* Moderator: Aufgaben */
let taskCounter = 0;

function offerTask(npc) {
  addBubble('me', 'Ja, klar!');
  const openVisits = state.tasks.filter(t => !t.done).length;
  const wantVisit = openVisits < 2 && Math.random() < 0.55;
  if (wantVisit) {
    const candidates = COUNTRIES.filter(c =>
      !state.visited.includes(c.id) &&
      !state.tasks.some(t => t.type === 'visit' && t.country === c.id && !t.done));
    if (candidates.length) {
      const c = candidates[Math.floor(Math.random() * candidates.length)];
      state.tasks.push({ id: ++taskCounter, type: 'visit', country: c.id, done: false });
      npcSay(`Deine Aufgabe: Reise ${landForm(c, 'nach')} und besuche ${c.lm.name}. Dafür bekommst du 3 Sterne. Du findest die Aufgabe in deiner Aufgabenliste. Viel Erfolg!`);
      setQuickReplies([{ label: 'Mach ich!', fn: closeChat }]);
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
  npcSay(`Quizfrage ${landForm(c, 'ueber')}: ${c.quiz.q}`);
  setQuickReplies(options.map(opt => ({
    label: opt,
    fn: () => {
      addBubble('me', opt);
      if (opt === c.quiz.correct) {
        state.stars += 2;
        updateHud(); saveGame();
        npcSay('Richtig! Super gemacht, du bekommst 2 Sterne.');
        setQuickReplies([
          { label: 'Noch eine Aufgabe!', fn: () => offerTask(npc) },
          { label: 'Tschüss!', fn: closeChat }
        ]);
      } else {
        npcSay('Fast! Überleg noch mal, du schaffst das.');
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
        npcSay('Genau! Beim zweiten Versuch – 1 Stern für dich.');
      } else {
        npcSay(`Die richtige Antwort war: ${c.quiz.correct}. Beim nächsten Mal klappt es bestimmt!`);
      }
      setQuickReplies([
        { label: 'Noch eine Aufgabe!', fn: () => offerTask(npc) },
        { label: 'Tschüss!', fn: closeChat }
      ]);
    }
  })));
}

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
  typing.innerHTML = '<i></i><i></i><i></i>';
  $('chat-messages').appendChild(typing);
  $('chat-messages').scrollTop = $('chat-messages').scrollHeight;
  setTimeout(() => {
    typing.remove();
    if (!state.chat) return;
    addBubble('them', text);
    if (after) after();
  }, 420 + Math.min(text.length * 7, 850));
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
  const badge = $('hud-task-count');
  badge.textContent = open || '';
  badge.classList.toggle('hidden', !open);
}

let lastCountry = null, lastWelcome = 0;

function updateLocationHud() {
  const t = World.tileAt(state.player.tx, state.player.ty);
  const el = $('hud-location');
  if (!t) return;
  if (t.c >= 0) {
    const c = COUNTRIES[t.c];
    setFlagLabel(el, c.id, c.name);
    if (lastCountry !== c.id) {
      lastCountry = c.id;
      const now = Date.now();
      if (now - lastWelcome > 3500) {
        lastWelcome = now;
        toast('Willkommen ' + landForm(c, 'in') + '!', null, c.id);
      }
    }
  } else if (t.t === T_BRIDGE) {
    setIconLabel(el, 'wave', 'Auf der Überfahrt', 15);
    lastCountry = null;
  } else {
    setIconLabel(el, 'globe', 'Europa', 15);
    lastCountry = null;
  }
}

function toggleTasks() {
  const panel = $('task-panel');
  if (!panel.classList.contains('hidden')) { panel.classList.add('hidden'); return; }
  const list = $('task-list');
  list.innerHTML = '';
  if (!state.tasks.length) {
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = 'Noch keine Aufgaben. Sprich mit einer Moderatorin oder einem Moderator – sie tragen goldene Shirts.';
    list.appendChild(p);
  }
  [...state.tasks].reverse().forEach(t => {
    const c = COUNTRIES.find(x => x.id === t.country);
    if (!c) return;
    const div = document.createElement('div');
    div.className = 'task' + (t.done ? ' done' : '');
    div.appendChild(iconEl(t.done ? 'check' : 'landmarkPin', 20, 'task-icon'));
    const body = document.createElement('div');
    const line = document.createElement('div');
    line.appendChild(document.createTextNode('Besuche '));
    const b = document.createElement('b');
    b.textContent = c.lm.name;
    line.appendChild(b);
    body.appendChild(line);
    const sm = document.createElement('small');
    sm.appendChild(flagEl(c.id, 12));
    const cn = document.createElement('span');
    cn.textContent = c.name + ' · +3 Sterne';
    sm.appendChild(cn);
    body.appendChild(sm);
    div.appendChild(body);
    list.appendChild(div);
  });
  $('task-progress').textContent =
    `Wahrzeichen entdeckt: ${state.visited.length} von ${COUNTRIES.length}`;
  panel.classList.remove('hidden');
}

function toggleMap() {
  const panel = $('map-panel');
  if (!panel.classList.contains('hidden')) { panel.classList.add('hidden'); return; }
  const cv = $('minimap');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = cv.clientWidth || 336;
  const cssH = Math.round(cssW * WORLD_H / WORLD_W);
  cv.width = cssW * dpr; cv.height = cssH * dpr;
  cv.style.height = cssH + 'px';
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  World.renderMinimap(ctx, cssW, cssH);
  // Spielerpunkt
  const px = state.player.tx / WORLD_W * cssW;
  const py = state.player.ty / WORLD_H * cssH;
  ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ff3355'; ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
  panel.classList.remove('hidden');
}

/* Kurzmeldung unten. icon = Symbolname, flagId = Länderflagge */
function toast(msg, icon, flagId) {
  const el = $('toast');
  el.innerHTML = '';
  if (flagId) el.appendChild(flagEl(flagId, 16));
  else if (icon) el.appendChild(iconEl(icon, 18));
  const s = document.createElement('span');
  s.textContent = msg;
  el.appendChild(s);
  el.classList.remove('hidden');
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add('hidden'), 3400);
}

/* ---------------- Darstellung ---------------- */

const canvas = document.createElement('canvas');
let ctx = null;

function resizeCanvas() {
  const holder = $('game-canvas-holder');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(holder.clientWidth * dpr));
  canvas.height = Math.max(1, Math.round(holder.clientHeight * dpr));
  canvas.style.width = holder.clientWidth + 'px';
  canvas.style.height = holder.clientHeight + 'px';
  // etwa 14 Kacheln in der kürzeren Richtung
  const minDim = Math.min(canvas.width, canvas.height);
  state.tilePx = Math.max(26, Math.round(minDim / 14));
  ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}

function draw(time) {
  if (!ctx) return;
  const tp = state.tilePx;
  const p = state.player;
  let camX = p.fx * tp + tp / 2 - canvas.width / 2;
  let camY = p.fy * tp + tp / 2 - canvas.height / 2;
  camX = Math.max(0, Math.min(WORLD_W * tp - canvas.width, camX));
  camY = Math.max(0, Math.min(WORLD_H * tp - canvas.height, camY));

  drawSeaRegion(ctx, canvas.width, canvas.height, camX / tp, camY / tp, tp, time);
  World.drawView(ctx, camX, camY, canvas.width, canvas.height, tp);

  const actors = [...state.npcs, p].sort((a, b) => a.fy - b.fy);
  for (const a of actors) drawActor(a, camX, camY, tp);

  drawCountryLabels(camX, camY, tp);
}

function drawActor(a, camX, camY, tp) {
  const x = a.fx * tp - camX + tp / 2;
  const groundY = a.fy * tp - camY + tp;
  if (x < -tp * 3 || groundY < -tp * 4 || x > canvas.width + tp * 3 || groundY > canvas.height + tp * 3) return;

  const lift = jumpOffset(a) * tp;
  const y = groundY - lift;

  // Schatten wird beim Sprung kleiner
  const shrink = 1 - jumpOffset(a) * 0.45;
  ctx.fillStyle = `rgba(30,50,25,${0.24 * shrink})`;
  ctx.beginPath();
  ctx.ellipse(x, groundY - tp * 0.06, tp * 0.3 * shrink, tp * 0.11 * shrink, 0, 0, Math.PI * 2);
  ctx.fill();

  const frame = a.frames.get(a.dir, actorPose(a));
  if (!frame) return;
  const scale = (tp * 1.75) / SPRITE_H;
  const w = SPRITE_W * scale, h = SPRITE_H * scale;
  ctx.drawImage(frame, Math.round(x - w / 2), Math.round(y - h), Math.round(w), Math.round(h));

  if (a !== state.player) {
    const label = a.name;
    const fs = Math.max(10, Math.round(tp * 0.26));
    ctx.font = `700 ${fs}px "Segoe UI", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const ly = y - h - fs * 0.45;
    ctx.lineWidth = Math.max(2.5, fs * 0.32);
    ctx.strokeStyle = 'rgba(255,255,255,0.92)';
    ctx.lineJoin = 'round';
    ctx.strokeText(label, x, ly);
    ctx.fillStyle = a.role === 'mod' ? '#8a5c00' : '#2a4b74';
    ctx.fillText(label, x, ly);

    // Sprechblasenzeichen, wenn man daneben steht
    const near = Math.abs(a.tx - state.player.tx) + Math.abs(a.ty - state.player.ty) === 1;
    if (near && !state.chat) drawChatHint(x, ly - fs * 1.5, tp);
  }
}

function drawChatHint(x, y, tp) {
  const r = tp * 0.2;
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.strokeStyle = 'rgba(40,60,90,0.6)';
  ctx.lineWidth = Math.max(1.2, tp * 0.03);
  ctx.beginPath();
  ctx.moveTo(x - r, y - r * 1.5);
  ctx.arcTo(x + r, y - r * 1.5, x + r, y + r * 0.4, r * 0.55);
  ctx.arcTo(x + r, y + r * 0.4, x - r, y + r * 0.4, r * 0.55);
  ctx.lineTo(x - r * 0.1, y + r * 0.4);
  ctx.lineTo(x - r * 0.45, y + r * 1.05);
  ctx.lineTo(x - r * 0.5, y + r * 0.4);
  ctx.arcTo(x - r, y + r * 0.4, x - r, y - r * 1.5, r * 0.55);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3d6ea8';
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.arc(x + i * r * 0.45, y - r * 0.55, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* Ländernamen mit Flagge über dem Wahrzeichen */
function drawCountryLabels(camX, camY, tp) {
  const fs = Math.max(11, Math.round(tp * 0.3));
  ctx.font = `700 ${fs}px "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const lm of World.landmarks) {
    const x = lm.x * tp - camX + tp / 2;
    const y = lm.y * tp - camY - tp * 2.35;   // hoch genug, damit hohe Wahrzeichen frei bleiben
    if (x < -tp * 6 || y < -tp * 2 || x > canvas.width + tp * 6 || y > canvas.height + tp * 2) continue;
    const c = COUNTRIES[lm.ci];
    const tw = ctx.measureText(c.name).width;
    const fh = Math.round(fs * 0.85), fw = Math.round(fh * 1.5);
    const totalW = tw + fw + fs * 0.4;
    // Hintergrundpille
    const padX = fs * 0.45, padY = fs * 0.3;
    ctx.fillStyle = 'rgba(255,255,255,0.86)';
    const bx = x - totalW / 2 - padX, by = y - fh / 2 - padY;
    const bw = totalW + padX * 2, bh = fh + padY * 2, br = bh / 2;
    ctx.beginPath();
    ctx.moveTo(bx + br, by);
    ctx.arcTo(bx + bw, by, bx + bw, by + bh, br);
    ctx.arcTo(bx + bw, by + bh, bx, by + bh, br);
    ctx.arcTo(bx, by + bh, bx, by, br);
    ctx.arcTo(bx, by, bx + bw, by, br);
    ctx.closePath();
    ctx.fill();
    const fc = flagCanvas(c.id, fh);
    ctx.drawImage(fc, Math.round(x - totalW / 2), Math.round(y - fh / 2), fw, fh);
    ctx.fillStyle = '#23405f';
    ctx.fillText(c.name, x - totalW / 2 + fw + fs * 0.4 + tw / 2, y + 1);
  }
}

/* ---------------- Hauptschleife ---------------- */

function loop(time) {
  if (!state.running) return;
  const dt = Math.min(50, time - state.lastTime || 16);
  state.lastTime = time;

  handleMovement();
  updateActor(state.player, dt);
  updateNpcs(dt);
  draw(time);
  requestAnimationFrame(loop);
}

/* ---------------- Spielstart ---------------- */

function startGame(charCfg, savedPos) {
  state.char = charCfg;
  World.build();
  spawnNpcs();

  const homeId = charCfg.homeCountry && COUNTRIES.some(c => c.id === charCfg.homeCountry)
    ? charCfg.homeCountry : null;

  let spawn = savedPos;
  if (!spawn || !World.isWalkable(spawn.x, spawn.y)) {
    // Kinder aus Ländern außerhalb der Karte starten in Brüssel
    const startId = homeId || 'be';
    spawn = { ...World.centers[startId] };
    if (!World.isWalkable(spawn.x, spawn.y)) {
      outer: for (let r = 1; r < 8; r++)
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
  const flagBox = $('hud-flag');
  flagBox.innerHTML = '';
  flagBox.appendChild(flagEl(homeId || 'eu', 16));
  flagBox.title = charCfg.homeText || '';

  updateHud();
  updateLocationHud();
  saveGame();

  if (!state.running) {
    state.running = true;
    requestAnimationFrame(t => { state.lastTime = t; loop(t); });
  }

  if (!homeId && charCfg.homeText) {
    toast(`Schön, dass du da bist! Du startest in Brüssel, im Herzen Europas.`, 'globe');
  } else {
    toast('Willkommen bei hey EU! Lauf einfach los – über die Stege kommst du auf die Inseln.', 'sparkle');
  }
}
