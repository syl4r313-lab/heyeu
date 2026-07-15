/* ============================================================
   hey EU – UI: Titelbildschirm & Charakter-Editor
   ============================================================ */

const creator = {
  skin: SKIN_TONES[1],
  hair: HAIR_COLORS[0],
  hairStyle: 'kurz',
  shirt: SHIRT_COLORS[1],
  name: '',
  homeCountry: 'de'
};

function renderPreview() {
  const cv = $('creator-preview');
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = false;
  c.clearRect(0, 0, cv.width, cv.height);
  const frames = makeCharacterSprites(creator);
  const f = frames.down0;
  const scale = 10;
  c.drawImage(f, (cv.width - 12 * scale) / 2, (cv.height - 13 * scale) / 2, 12 * scale, 13 * scale);
}

function buildSwatches(containerId, colors, key) {
  const box = $(containerId);
  box.innerHTML = '';
  colors.forEach(col => {
    const b = document.createElement('button');
    b.className = 'swatch' + (creator[key] === col ? ' active' : '');
    b.style.background = col;
    b.setAttribute('aria-label', col);
    b.addEventListener('click', () => {
      creator[key] = col;
      buildSwatches(containerId, colors, key);
      renderPreview();
    });
    box.appendChild(b);
  });
}

function buildHairStyles() {
  const box = $('creator-hairstyles');
  box.innerHTML = '';
  HAIR_STYLES.forEach(h => {
    const b = document.createElement('button');
    b.className = 'pill' + (creator.hairStyle === h.id ? ' active' : '');
    b.textContent = h.label;
    b.addEventListener('click', () => {
      creator.hairStyle = h.id;
      buildHairStyles();
      renderPreview();
    });
    box.appendChild(b);
  });
}

function buildCountrySelect() {
  const sel = $('creator-country');
  sel.innerHTML = '';
  [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name, 'de')).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.flag} ${c.name}`;
    sel.appendChild(opt);
  });
  sel.value = creator.homeCountry;
  sel.addEventListener('change', () => { creator.homeCountry = sel.value; });
}

function openCreator(existing) {
  if (existing) Object.assign(creator, existing);
  $('screen-title').classList.add('hidden');
  $('screen-game').classList.add('hidden');
  $('screen-creator').classList.remove('hidden');
  buildSwatches('creator-skins', SKIN_TONES, 'skin');
  buildSwatches('creator-haircolors', HAIR_COLORS, 'hair');
  buildSwatches('creator-shirts', SHIRT_COLORS, 'shirt');
  buildHairStyles();
  buildCountrySelect();
  $('creator-name').value = creator.name || '';
  renderPreview();
}

function initUi() {
  const save = loadSave();

  if (save && save.char) {
    $('btn-continue').classList.remove('hidden');
    $('btn-continue').addEventListener('click', () => {
      state.stars = save.stars || 0;
      state.tasks = save.tasks || [];
      state.visited = save.visited || [];
      taskCounter = state.tasks.reduce((m, t) => Math.max(m, t.id), 0);
      startGame(save.char, save.pos);
    });
  }

  $('btn-new').addEventListener('click', () => {
    if (save && save.char && !confirm('Neues Spiel starten? Dein alter Spielstand wird überschrieben.')) return;
    openCreator(save && save.char);
  });

  $('btn-create-done').addEventListener('click', () => {
    const name = $('creator-name').value.trim();
    if (!name) { $('creator-name').focus(); $('creator-name').classList.add('shake');
      setTimeout(() => $('creator-name').classList.remove('shake'), 500); return; }
    creator.name = name.slice(0, 14);
    state.stars = 0; state.tasks = []; state.visited = [];
    startGame({ ...creator }, null);
  });

  // HUD-Buttons
  $('btn-tasks').addEventListener('click', toggleTasks);
  $('btn-map').addEventListener('click', toggleMap);
  $('btn-help').addEventListener('click', () => $('help-panel').classList.remove('hidden'));
  document.querySelectorAll('.panel-close').forEach(b =>
    b.addEventListener('click', () => b.closest('.panel').classList.add('hidden')));
  $('info-close').addEventListener('click', () => $('info-card').classList.add('hidden'));

  // Chat
  $('chat-close').addEventListener('click', closeChat);
  $('chat-send').addEventListener('click', sendChatInput);
  $('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); sendChatInput(); }
    e.stopPropagation();
  });

  window.addEventListener('resize', () => {
    if (state.running) resizeCanvas();
  });

  // Schwebende Emojis auf dem Titelbildschirm
  const floaty = $('title-floaties');
  ['🗼', '🏰', '⛵', '🌷', '🏔️', '🐉', '🏺', '🎡', '☘️', '🧜‍♀️'].forEach((e, i) => {
    const s = document.createElement('span');
    s.textContent = e;
    s.style.left = (5 + (i * 37) % 90) + '%';
    s.style.animationDelay = (i * 1.7) + 's';
    s.style.animationDuration = (14 + (i % 5) * 3) + 's';
    floaty.appendChild(s);
  });
}

function sendChatInput() {
  const input = $('chat-input');
  const text = input.value.trim();
  if (!text || !state.chat) return;
  input.value = '';
  addBubble('me', text);
  if (state.chat.npc.role === 'mod') {
    npcSay('Wenn du eine Aufgabe möchtest, tippe einfach auf einen der Knöpfe! 😊');
  } else {
    freeTextReply(text);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initUi();
  setupInput();
});
