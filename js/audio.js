/* ============================================================
   hey EU – Hintergrundmusik
   Spielt musik/hintergrund.mp3 als nahtlose Schleife in
   gedämpfter Lautstärke. Startet erst nach der ersten
   Nutzer-Interaktion (Browser-Autoplay-Regeln) und lässt sich
   über den 🔊-Knopf an- und ausschalten.
   ============================================================ */

const Music = {
  VOLUME: 0.22,   // gedämpft – die Musik soll begleiten, nicht dröhnen
  SRC: (typeof MUSIC_SRC_OVERRIDE !== 'undefined') ? MUSIC_SRC_OVERRIDE : 'musik/hintergrund.mp3',

  ctx: null, gain: null, source: null, fallback: null,
  started: false, enabled: true, loading: false,

  init() {
    try { this.enabled = localStorage.getItem('heyeu_musik') !== 'aus'; }
    catch (e) { this.enabled = true; }
    this.updateButton();

    // Beim ersten Klick/Tastendruck/Touch loslegen
    const kick = () => this.start();
    window.addEventListener('pointerdown', kick, { once: true });
    window.addEventListener('keydown', kick, { once: true });
  },

  async start() {
    if (this.started || this.loading || !this.enabled) return;
    this.loading = true;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new Ctx();
      const res = await fetch(this.SRC);
      if (!res.ok) throw new Error('Laden fehlgeschlagen');
      const buf = await this.ctx.decodeAudioData(await res.arrayBuffer());
      if (!this.enabled) { this.loading = false; return; } // inzwischen ausgeschaltet
      this.gain = this.ctx.createGain();
      this.gain.gain.value = this.VOLUME;
      this.gain.connect(this.ctx.destination);
      this.source = this.ctx.createBufferSource();
      this.source.buffer = buf;
      this.source.loop = true;
      this.source.connect(this.gain);
      this.source.start();
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.started = true;
    } catch (e) {
      // Fallback: einfaches Audio-Element (z. B. wenn fetch blockiert ist)
      try {
        this.fallback = new Audio(this.SRC);
        this.fallback.loop = true;
        this.fallback.volume = this.VOLUME;
        await this.fallback.play();
        this.started = true;
      } catch (e2) { /* kein Ton möglich – Spiel läuft trotzdem */ }
    }
    this.loading = false;
    this.updateButton();
  },

  stop() {
    if (this.source) { try { this.source.stop(); } catch (e) {} this.source = null; }
    if (this.ctx) { try { this.ctx.close(); } catch (e) {} this.ctx = null; }
    if (this.fallback) { this.fallback.pause(); this.fallback = null; }
    this.started = false;
  },

  toggle() {
    this.enabled = !this.enabled;
    try { localStorage.setItem('heyeu_musik', this.enabled ? 'an' : 'aus'); }
    catch (e) { /* Speichern optional */ }
    if (this.enabled) this.start();
    else this.stop();
    this.updateButton();
  },

  updateButton() {
    const btn = document.getElementById('btn-music');
    if (btn) btn.textContent = this.enabled ? '🔊' : '🔇';
  }
};
