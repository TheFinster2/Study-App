/* Synthesised sound effects — no audio assets, everything is generated on the fly.
   The context is created lazily on first user gesture to satisfy autoplay policies. */
window.CHEM = window.CHEM || {};

CHEM.Sound = (function () {
  let ctx = null;
  let enabled = true;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  /** One shaped oscillator note. */
  function tone(freq, dur, type, gain, delay, slideTo) {
    const a = ac();
    if (!a || !enabled) return;
    const t0 = a.currentTime + (delay || 0);
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    const peak = (gain === undefined ? 0.12 : gain);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(a.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }

  /** Filtered white noise — used for fizz/whoosh effects. */
  function noise(dur, freq, gain) {
    const a = ac();
    if (!a || !enabled) return;
    const frames = Math.floor(a.sampleRate * dur);
    const buf = a.createBuffer(1, frames, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const src = a.createBufferSource();
    src.buffer = buf;
    const filter = a.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq || 1200;
    const g = a.createGain();
    g.gain.value = gain === undefined ? 0.09 : gain;
    src.connect(filter).connect(g).connect(a.destination);
    src.start();
  }

  const api = {
    setEnabled(v) { enabled = !!v; },
    isEnabled() { return enabled; },

    correct()  { tone(660, 0.09, "triangle", 0.13); tone(880, 0.14, "triangle", 0.11, 0.07); },
    wrong()    { tone(220, 0.16, "sawtooth", 0.09); tone(150, 0.22, "sawtooth", 0.08, 0.08); },
    click()    { tone(520, 0.035, "square", 0.05); },
    flip()     { tone(400, 0.05, "sine", 0.06, 0, 700); },
    combo(n)   { tone(520 + Math.min(n, 12) * 55, 0.1, "triangle", 0.12); },
    coin()     { tone(1050, 0.06, "square", 0.07); tone(1400, 0.1, "square", 0.06, 0.05); },

    levelUp() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.28, "triangle", 0.13, i * 0.09));
    },
    achievement() {
      [784, 988, 1319].forEach((f, i) => tone(f, 0.32, "sine", 0.12, i * 0.11));
    },
    win() {
      [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.34, "triangle", 0.12, i * 0.1));
    },
    lose() {
      [400, 340, 280, 200].forEach((f, i) => tone(f, 0.26, "sawtooth", 0.09, i * 0.11));
    },
    tick()     { tone(880, 0.025, "square", 0.035); },
    drop()     { noise(0.12, 900, 0.07); },
    fizz()     { noise(0.5, 2200, 0.05); },
    explode()  { noise(0.35, 260, 0.14); tone(90, 0.4, "sawtooth", 0.1); },
    hit()      { tone(180, 0.12, "square", 0.1, 0, 90); noise(0.1, 500, 0.06); },
    open()     { tone(330, 0.1, "sine", 0.08, 0, 660); noise(0.3, 1600, 0.05); }
  };

  return api;
})();
