/* ============================================================
   hey EU – Symbole
   Ein eigener, einheitlicher Satz gezeichneter Symbole.
   Alle in einem 24x24-Raster, mit runden Enden, Strichstärke 2.
   Gefüllte Teile nutzen fill="currentColor", Linien stroke.
   ============================================================ */

const ICONS = {
  /* Navigation und Bedienung */
  tasks: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v2.5H9z" fill="currentColor"/><path d="M8.5 11h7M8.5 15h4.5"/>',
  map: '<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',
  sound: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9.5a4 4 0 0 1 0 5M18 7.5a7 7 0 0 1 0 9"/>',
  mute: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="m16 10 4 4m0-4-4 4"/>',
  help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.5 2.5 0 1 1 2.9 2.9v1.4"/><circle cx="12.4" cy="16.8" r="1" fill="currentColor" stroke="none"/>',
  close: '<path d="m7 7 10 10M17 7 7 17"/>',
  send: '<path d="M4 12 20 5l-3.2 14.5-4.4-5.3z"/><path d="m12.4 14.2 8.6-9.2"/>',
  back: '<path d="M15 5 8 12l7 7"/>',

  /* Spielinhalte */
  star: '<path d="m12 4 2.4 5.1 5.6.7-4.1 3.9 1.1 5.5L12 16.5 7 19.2l1.1-5.5L4 9.8l5.6-.7z" fill="currentColor"/>',
  starOutline: '<path d="m12 4 2.4 5.1 5.6.7-4.1 3.9 1.1 5.5L12 16.5 7 19.2l1.1-5.5L4 9.8l5.6-.7z"/>',
  board: '<rect x="3.5" y="4.5" width="17" height="11" rx="1.5"/><path d="M8 15.5 6.5 20M16 15.5 17.5 20"/><path d="M7.5 8h4M7.5 11h7"/>',
  chat: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-5 4v-4a2 2 0 0 1-2-2z"/>',
  jump: '<circle cx="12" cy="5.2" r="2.2"/><path d="M12 7.6v5M12 12.6 9 17m3-4.4L15 17M8.5 10.5 12 9l3.5 1.5"/><path d="M4.5 20.5c2-4.5 5-6.8 7.5-6.8s5.5 2.3 7.5 6.8" stroke-dasharray="2.5 2.5"/>',
  walk: '<circle cx="13" cy="5" r="2.2"/><path d="m13 7.4-1.5 5 3 3.2.8 4.4M11.5 12.4 8.5 15l-.8 4M13.5 9l3.5 2"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><ellipse cx="12" cy="12" rx="4" ry="8.5"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5.2-5.2 2 2-5.2z" fill="currentColor" stroke="none"/>',
  flag: '<path d="M6 20V4"/><path d="M6 5h11l-2 3.2 2 3.2H6z"/>',
  landmarkPin: '<path d="M12 21s6.5-6.3 6.5-10.6A6.5 6.5 0 0 0 5.5 10.4C5.5 14.7 12 21 12 21z"/><circle cx="12" cy="10.3" r="2.4"/>',

  /* Aufgaben an der Pinnwand */
  camera: '<rect x="3" y="7" width="18" height="12.5" rx="2.5"/><path d="M8.5 7 10 4.5h4L15.5 7"/><circle cx="12" cy="13.2" r="3.6"/>',
  brush: '<path d="M14.5 4.5 19.5 9.5 11 18H6v-5z"/><path d="m13 6 5 5"/><path d="M6 18c-1.5 1-2 2.5-2 2.5s1.6-.3 2.5-1.3"/>',
  pen: '<path d="M4 20v-4L16 4l4 4L8 20z"/><path d="m14 6 4 4"/>',
  plate: '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="4"/>',
  note: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  book: '<path d="M4 5.5C6.5 4 9.5 4 12 5.5c2.5-1.5 5.5-1.5 8 0v13c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0z"/><path d="M12 5.5v13"/>',
  tree: '<path d="M12 3 6.5 11h11z"/><path d="M12 8 7 16h10z"/><path d="M12 16v5"/>',
  speech: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-5 4v-4a2 2 0 0 1-2-2z"/><path d="M8 8.5h8M8 11.5h5"/>',

  /* Verwaltung */
  shield: '<path d="M12 3.5 5 6.2v5.4c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6.2z"/><path d="m8.8 12 2.3 2.3 4.1-4.6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  cross: '<path d="m7 7 10 10M17 7 7 17"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.3l3.4 2"/>',
  inbox: '<path d="M3.5 13.5h4l1.5 3h6l1.5-3h4"/><path d="M3.5 13.5 6 5h12l2.5 8.5v5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z"/>',
  upload: '<path d="M12 16V5m0 0L8 9m4-4 4 4"/><path d="M4.5 15v3.5A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5V15"/>',
  people: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><path d="M15.5 5.2a3.2 3.2 0 0 1 0 5.6M17 14.9c2.2.6 3.5 2.4 3.5 4.6"/>',

  /* Titelbildschirm */
  play: '<path d="M8 5.5 19 12 8 18.5z" fill="currentColor"/>',
  sparkle: '<path d="M12 3.5c.6 3.8 1.7 5 5.5 5.5-3.8.6-4.9 1.7-5.5 5.5-.6-3.8-1.7-4.9-5.5-5.5 3.8-.5 4.9-1.7 5.5-5.5z" fill="currentColor"/><path d="M18 15c.3 1.9.8 2.5 2.7 2.8-1.9.3-2.4.9-2.7 2.7-.3-1.8-.8-2.4-2.7-2.7 1.9-.3 2.4-.9 2.7-2.8z" fill="currentColor"/>',
  device: '<rect x="2.5" y="5" width="12" height="9" rx="1.5"/><path d="M5.5 17.5h6"/><path d="M8.5 14v3.5"/><rect x="16" y="8" width="5.5" height="11.5" rx="1.5"/>',
  rocket: '<path d="M12 3c3.5 2.5 5 6 5 9.5L12 17l-5-4.5C7 9 8.5 5.5 12 3z"/><circle cx="12" cy="9.5" r="1.8"/><path d="M9.5 15.5 7 18m10-2.5L19.5 18M12 17v3.5"/>',
  wave: '<path d="M8 12V5.5a1.8 1.8 0 0 1 3.5 0V11"/><path d="M11.5 10.5V4.8a1.8 1.8 0 0 1 3.5 0V11"/><path d="M15 10.8V7.2a1.7 1.7 0 0 1 3.4 0v6.6c0 3.8-2.6 6.7-6.4 6.7-3.5 0-5-1.8-6.6-4.6L4 13.2a1.7 1.7 0 0 1 2.8-1.9L8 12.8"/>'
};

/* Liefert ein fertiges <svg> als HTML-Text */
function iconSvg(name, size = 20, extraClass = '') {
  const body = ICONS[name] || ICONS.help;
  return `<svg class="icon ${extraClass}" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
    `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ` +
    `stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/* Liefert ein DOM-Element */
function iconEl(name, size = 20, extraClass = '') {
  const span = document.createElement('span');
  span.className = 'icon-wrap';
  span.innerHTML = iconSvg(name, size, extraClass);
  return span.firstChild;
}

/* Symbol + Text in ein Element setzen (ersetzt den Inhalt) */
function setIconLabel(el, name, text, size = 18) {
  el.innerHTML = '';
  el.appendChild(iconEl(name, size));
  if (text) {
    const s = document.createElement('span');
    s.textContent = text;
    el.appendChild(s);
  }
}

/* Alle Elemente mit data-icon="name" befüllen */
function applyIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    if (el.dataset.iconDone) return;
    const size = parseInt(el.dataset.iconSize || '20', 10);
    const label = el.dataset.iconLabel;
    el.insertAdjacentHTML('afterbegin', iconSvg(el.dataset.icon, size));
    if (label) {
      const s = document.createElement('span');
      s.textContent = label;
      el.appendChild(s);
    }
    el.dataset.iconDone = '1';
  });
}
