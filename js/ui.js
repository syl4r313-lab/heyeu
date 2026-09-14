/* ============================================================
   hey EU – Oberfläche: Titelbildschirm und Charakter-Editor
   ============================================================ */

const creator = {
  skin: SKIN_TONES[1],
  hair: HAIR_COLORS[0],
  hairStyle: 'kurz',
  shirt: SHIRT_COLORS[1],
  name: '',
  homeText: '',
  homeCountry: null
};

/* ---------- Vorschau der Figur ---------- */

let previewPose = 'stand';
let previewTimer = null;

function renderPreview() {
  const cv = $('creator-preview');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = 170, h = 190;
  cv.width = w * dpr; cv.height = h * dpr;
  cv.style.width = w + 'px'; cv.style.height = h + 'px';
  const c = cv.getContext('2d');
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, w, h);

  // weicher Boden unter der Figur
  c.fillStyle = 'rgba(60,90,50,0.16)';
  c.beginPath();
  c.ellipse(w / 2, h - 22, 38, 11, 0, 0, Math.PI * 2);
  c.fill();

  const scale = 4.6;
  c.save();
  c.translate(w / 2, h - 24 - (previewPose === 'jump' ? 26 : 0));
  c.scale(scale, scale);
  drawCharacter(c, creator, 'down', CHAR_POSES[previewPose]);
  c.restore();
}

function previewHop() {
  clearTimeout(previewTimer);
  previewPose = 'jump';
  renderPreview();
  previewTimer = setTimeout(() => { previewPose = 'stand'; renderPreview(); }, 420);
}

/* ---------- Auswahlfelder ---------- */

function buildSwatches(containerId, colors, key) {
  const box = $(containerId);
  box.innerHTML = '';
  colors.forEach(col => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch' + (creator[key] === col ? ' active' : '');
    b.style.background = col;
    b.setAttribute('aria-label', 'Farbe wählen');
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
    b.type = 'button';
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

/* Vorschlagsliste für das Heimatland – eintippen bleibt trotzdem frei */
function buildCountryList() {
  const list = $('country-list');
  list.innerHTML = '';
  [...COUNTRIES]
    .sort((a, b) => a.name.localeCompare(b.name, 'de'))
    .forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      list.appendChild(opt);
    });
}

/* Zeigt die erkannte Flagge neben dem Eingabefeld */
function updateHomeCountry() {
  const input = $('creator-country');
  const text = input.value.trim();
  creator.homeText = text;
  creator.homeCountry = matchCountry(text);

  const hint = $('creator-country-hint');
  hint.innerHTML = '';
  if (!text) {
    hint.className = 'field-hint';
    hint.textContent = 'Schreib einfach dein Land hin – egal wo auf der Welt es liegt.';
    return;
  }
  if (creator.homeCountry) {
    const c = COUNTRIES.find(x => x.id === creator.homeCountry);
    hint.className = 'field-hint ok';
    hint.appendChild(flagEl(c.id, 15));
    const s = document.createElement('span');
    s.textContent = `${c.name} – dort startest du!`;
    hint.appendChild(s);
  } else {
    hint.className = 'field-hint';
    hint.appendChild(iconEl('globe', 15));
    const s = document.createElement('span');
    s.textContent = `${text} liegt nicht auf unserer Europakarte. Du startest in Brüssel – alles andere geht genauso.`;
    hint.appendChild(s);
  }
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
  buildCountryList();
  $('creator-name').value = creator.name || '';
  $('creator-country').value = creator.homeText || '';
  updateHomeCountry();
  renderPreview();
}

/* ---------- Titelbildschirm ---------- */

function buildTitleScene() {
  const box = $('title-floaties');
  box.innerHTML = '';
  // ein paar Wahrzeichen ziehen langsam vorbei
  const arts = ['eiffel', 'colosseum', 'windmill', 'acropolis', 'bigben', 'matterhorn',
                'sagrada', 'dalahorse', 'atomium', 'tallinn'];
  arts.forEach((art, i) => {
    const img = landmarkEl(art, 74, 80);
    img.className = 'floaty';
    img.style.left = (4 + (i * 37) % 88) + '%';
    img.style.animationDelay = (i * 2.1) + 's';
    img.style.animationDuration = (17 + (i % 5) * 4) + 's';
    box.appendChild(img);
  });
}

function initUi() {
  applyIcons();
  const save = loadSave();

  if (save && save.char) {
    $('btn-continue').classList.remove('hidden');
    $('btn-continue').addEventListener('click', () => {
      state.stars = save.stars || 0;
      state.tasks = save.tasks || [];
      state.visited = save.visited || [];
      state.submissions = save.submissions || [];
      taskCounter = state.tasks.reduce((m, t) => Math.max(m, t.id), 0);
      submissionCounter = state.submissions.reduce((m, s) => Math.max(m, s.id), 0);
      startGame(save.char, save.pos);
    });
  }

  $('btn-new').addEventListener('click', () => {
    if (save && save.char && !confirm('Neues Spiel starten? Dein alter Spielstand wird überschrieben.')) return;
    openCreator(save && save.char);
  });

  $('creator-country').addEventListener('input', updateHomeCountry);
  $('creator-preview').addEventListener('click', previewHop);
  $('btn-preview-hop').addEventListener('click', previewHop);

  $('btn-create-done').addEventListener('click', () => {
    const name = $('creator-name').value.trim();
    const problem = checkName(name);
    if (problem) {
      $('creator-name-error').textContent = problem;
      $('creator-name').focus();
      $('creator-name').classList.add('shake');
      setTimeout(() => $('creator-name').classList.remove('shake'), 500);
      return;
    }
    const home = $('creator-country').value.trim();
    if (!home) {
      $('creator-country').focus();
      $('creator-country').classList.add('shake');
      setTimeout(() => $('creator-country').classList.remove('shake'), 500);
      return;
    }
    if (!isTextClean(home)) {
      $('creator-country-hint').className = 'field-hint bad';
      $('creator-country-hint').textContent = 'Bitte schreibe hier nur einen Ländernamen.';
      return;
    }
    $('creator-name-error').textContent = '';
    creator.name = name.slice(0, 14);
    creator.homeText = home.slice(0, 30);
    creator.homeCountry = matchCountry(home);
    state.stars = 0; state.tasks = []; state.visited = []; state.submissions = [];
    startGame({ ...creator }, null);
  });

  // HUD
  $('btn-tasks').addEventListener('click', toggleTasks);
  $('btn-map').addEventListener('click', toggleMap);
  $('btn-help').addEventListener('click', () => $('help-panel').classList.remove('hidden'));
  document.querySelectorAll('.panel-close').forEach(b =>
    b.addEventListener('click', () => b.closest('.panel').classList.add('hidden')));
  $('info-close').addEventListener('click', () => $('info-card').classList.add('hidden'));

  // Pinnwand
  $('submit-photo-input').addEventListener('change', e => handlePhotoInput(e.target.files[0]));
  $('submit-send').addEventListener('click', submitBoardEntry);
  $('submit-cancel').addEventListener('click', () => $('submit-panel').classList.add('hidden'));

  // Admin
  $('btn-admin').addEventListener('click', openAdminPin);
  $('admin-pin-ok').addEventListener('click', checkAdminPin);
  $('admin-pin-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkAdminPin();
    e.stopPropagation();
  });

  // Chat
  $('chat-close').addEventListener('click', closeChat);
  $('chat-send').addEventListener('click', sendChatInput);
  $('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); sendChatInput(); }
    e.stopPropagation();
  });

  window.addEventListener('resize', () => { if (state.running) resizeCanvas(); });

  buildTitleScene();
}

function sendChatInput() {
  const input = $('chat-input');
  const text = input.value.trim();
  if (!text || !state.chat) return;
  if (!isTextClean(text)) {
    input.value = '';
    const div = document.createElement('div');
    div.className = 'bubble system';
    div.appendChild(iconEl('shield', 16));
    const s = document.createElement('span');
    s.textContent = 'Diese Nachricht enthält Wörter, die hier nicht erlaubt sind. Bleib bitte freundlich.';
    div.appendChild(s);
    $('chat-messages').appendChild(div);
    $('chat-messages').scrollTop = $('chat-messages').scrollHeight;
    return;
  }
  input.value = '';
  addBubble('me', text);
  if (state.chat.npc.role === 'mod') {
    npcSay('Wenn du eine Aufgabe möchtest, tippe einfach auf einen der Knöpfe.');
  } else {
    freeTextReply(text);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initUi();
  setupInput();
  Music.init();
  $('btn-music').addEventListener('click', () => Music.toggle());
});
