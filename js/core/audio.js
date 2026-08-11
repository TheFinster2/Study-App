/* Synthesised sound effects — no audio assets, everything is generated on the fly.
   The context is created lazily on first user gesture to satisfy autoplay policies.
   Every cue routes through a master gain so the settings volume slider works. */
window.CHEM = window.CHEM || {};

CHEM.Sound = (function () {
  let ctx = null, master = null, comp = null;
  let enabled = true;
  let volume = 0.8;
  let lastPlay = 0;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      // A limiter keeps stacked cues (combo + coin + level-up) from clipping.
      comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -12;
      comp.ratio.value = 12;
      comp.attack.value = 0.003;
      comp.release.value = 0.18;
      master = ctx.createGain();
      master.gain.value = volume;
      master.connect(comp).connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  /** One shaped oscillator note. opts: {type, gain, delay, slideTo, attack, detune, pan} */
  function tone(freq, dur, opts) {
    const a = ac();
    if (!a || !enabled) return;
    const o = opts || {};
    const t0 = a.currentTime + (o.delay || 0);

    const osc = a.createOscillator();
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.slideTo), t0 + dur);
    if (o.detune) osc.detune.value = o.detune;

    const g = a.createGain();
    const peak = o.gain === undefined ? 0.12 : o.gain;
    const atk = o.attack === undefined ? 0.012 : o.attack;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    let node = osc;
    if (o.filter) {
      const f = a.createBiquadFilter();
      f.type = o.filter;
      f.frequency.value = o.filterFreq || 900;
      if (o.q) f.Q.value = o.q;
      node = node.connect(f);
    }
    node.connect(g).connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.04);
  }

  /** Filtered noise burst — fizz, whoosh, impact. */
  function noise(dur, opts) {
    const a = ac();
    if (!a || !enabled) return;
    const o = opts || {};
    const t0 = a.currentTime + (o.delay || 0);
    const frames = Math.max(1, Math.floor(a.sampleRate * dur));
    const buf = a.createBuffer(1, frames, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      const decay = o.reverse ? i / frames : 1 - i / frames;
      data[i] = (Math.random() * 2 - 1) * decay;
    }
    const src = a.createBufferSource();
    src.buffer = buf;

    const filter = a.createBiquadFilter();
    filter.type = o.filter || "bandpass";
    filter.frequency.setValueAtTime(o.freq || 1200, t0);
    if (o.sweepTo) filter.frequency.exponentialRampToValueAtTime(Math.max(40, o.sweepTo), t0 + dur);
    filter.Q.value = o.q || 1;

    const g = a.createGain();
    g.gain.value = o.gain === undefined ? 0.09 : o.gain;

    src.connect(filter).connect(g).connect(master);
    src.start(t0);
  }

  /** Play a sequence of [freq, startOffset] notes. */
  function seq(notes, dur, opts) {
    notes.forEach(([f, at], i) =>
      tone(f, dur, Object.assign({}, opts, { delay: (opts && opts.delay || 0) + at })));
  }

  /** Rate-limit chatty cues so rapid taps don't machine-gun. */
  function throttled(fn, ms) {
    return function () {
      const now = performance.now();
      if (now - lastPlay < (ms || 40)) return;
      lastPlay = now;
      fn.apply(null, arguments);
    };
  }

  const MAJOR = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];

  const api = {
    setEnabled(v) { enabled = !!v; },
    isEnabled() { return enabled; },
    setVolume(v) {
      volume = Math.max(0, Math.min(1, v));
      if (master) master.gain.value = volume;
    },
    getVolume() { return volume; },

    /* ── core feedback ─────────────────────────────────────── */
    correct()  { tone(659.25, 0.09, { type: "triangle", gain: 0.13 });
                 tone(987.77, 0.15, { type: "triangle", gain: 0.11, delay: 0.07 }); },
    wrong()    { tone(233, 0.16, { type: "sawtooth", gain: 0.09, filter: "lowpass", filterFreq: 1400 });
                 tone(155, 0.24, { type: "sawtooth", gain: 0.08, delay: 0.08, filter: "lowpass", filterFreq: 900 }); },
    error()    { tone(180, 0.1, { type: "square", gain: 0.07 });
                 tone(140, 0.14, { type: "square", gain: 0.06, delay: 0.09 }); },
    click:     throttled(() => tone(560, 0.03, { type: "square", gain: 0.045 }), 30),
    tap:       throttled(() => tone(760, 0.025, { type: "sine", gain: 0.04 }), 30),
    hover:     throttled(() => tone(1100, 0.02, { type: "sine", gain: 0.018 }), 60),
    nav()      { noise(0.16, { freq: 500, sweepTo: 2600, gain: 0.045, filter: "bandpass", q: 0.8 }); },
    type:      throttled(() => tone(320 + Math.random() * 80, 0.018, { type: "square", gain: 0.03 }), 20),
    flip()     { tone(420, 0.055, { type: "sine", gain: 0.06, slideTo: 760 });
                 noise(0.06, { freq: 2400, gain: 0.03 }); },

    /* ── streaks & scoring ─────────────────────────────────── */
    combo(n)   {
      const step = Math.min(n, 16);
      tone(523 + step * 42, 0.1, { type: "triangle", gain: 0.12 });
      tone(1046 + step * 42, 0.08, { type: "sine", gain: 0.05, delay: 0.05 });
    },
    comboBreak() { tone(400, 0.22, { type: "sawtooth", gain: 0.09, slideTo: 120 }); },
    multiplier(level) {
      seq(MAJOR.slice(0, Math.min(4 + level, 8)).map((f, i) => [f, i * 0.055]), 0.16,
          { type: "triangle", gain: 0.09 });
    },
    coin()     { tone(1180, 0.05, { type: "square", gain: 0.06 });
                 tone(1560, 0.1, { type: "square", gain: 0.05, delay: 0.045 }); },
    coinPile() { for (let i = 0; i < 6; i++)
                   tone(1000 + Math.random() * 700, 0.06, { type: "square", gain: 0.035, delay: i * 0.045 }); },
    xp()       { tone(880, 0.06, { type: "sine", gain: 0.05, slideTo: 1320 }); },

    /* ── progression ───────────────────────────────────────── */
    levelUp()  {
      seq([[523, 0], [659, 0.09], [784, 0.18], [1047, 0.27]], 0.3, { type: "triangle", gain: 0.13 });
      seq([[262, 0], [330, 0.09], [392, 0.18], [523, 0.27]], 0.34, { type: "sine", gain: 0.07 });
      noise(0.5, { freq: 400, sweepTo: 4000, gain: 0.04, reverse: true });
    },
    prestige() {
      seq([[392, 0], [523, 0.1], [659, 0.2], [784, 0.3], [1047, 0.4], [1319, 0.5]], 0.5,
          { type: "triangle", gain: 0.13 });
      seq([[196, 0.05], [262, 0.25], [392, 0.45]], 0.9, { type: "sine", gain: 0.09 });
      noise(1.1, { freq: 200, sweepTo: 6000, gain: 0.05, reverse: true });
    },
    achievement() {
      seq([[784, 0], [988, 0.1], [1319, 0.2]], 0.34, { type: "sine", gain: 0.12 });
      tone(1568, 0.5, { type: "triangle", gain: 0.05, delay: 0.3 });
    },
    rankUp()   { seq([[659, 0], [880, 0.08], [1319, 0.16]], 0.28, { type: "triangle", gain: 0.11 }); },
    unlock()   { tone(700, 0.1, { type: "sine", gain: 0.08, slideTo: 1400 });
                 tone(1400, 0.22, { type: "triangle", gain: 0.07, delay: 0.09 }); },
    quest()    { seq([[587, 0], [784, 0.09], [1175, 0.18]], 0.3, { type: "triangle", gain: 0.12 }); },
    daily()    { seq([[659, 0], [831, 0.08], [988, 0.16], [1319, 0.24]], 0.3, { type: "sine", gain: 0.11 }); },

    /* ── run outcomes ──────────────────────────────────────── */
    win()      { seq([[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3], [1319, 0.4]], 0.36,
                     { type: "triangle", gain: 0.12 }); },
    perfect()  {
      seq([[659, 0], [880, 0.08], [1047, 0.16], [1319, 0.24], [1760, 0.32]], 0.4,
          { type: "triangle", gain: 0.12 });
      seq([[330, 0.02], [440, 0.18], [660, 0.34]], 0.7, { type: "sine", gain: 0.07 });
    },
    lose()     { seq([[415, 0], [349, 0.11], [294, 0.22], [196, 0.33]], 0.3,
                     { type: "sawtooth", gain: 0.09, filter: "lowpass", filterFreq: 1100 }); },
    gameStart(){ tone(392, 0.12, { type: "triangle", gain: 0.08, slideTo: 784 });
                 noise(0.25, { freq: 300, sweepTo: 3000, gain: 0.04, reverse: true }); },
    timeout()  { seq([[440, 0], [415, 0.14], [392, 0.28]], 0.3, { type: "square", gain: 0.08 }); },

    /* ── clocks ────────────────────────────────────────────── */
    tick()     { tone(900, 0.022, { type: "square", gain: 0.035 }); },
    tickUrgent(){ tone(1250, 0.03, { type: "square", gain: 0.06 }); },
    lowTime()  { tone(1400, 0.06, { type: "sawtooth", gain: 0.05 });
                 tone(1100, 0.06, { type: "sawtooth", gain: 0.05, delay: 0.08 }); },

    /* ── power-ups ─────────────────────────────────────────── */
    puFifty()  { noise(0.18, { freq: 3000, sweepTo: 600, gain: 0.06 });
                 tone(880, 0.1, { type: "square", gain: 0.05, slideTo: 440 }); },
    puSkip()   { tone(660, 0.09, { type: "square", gain: 0.06, slideTo: 1320 });
                 tone(990, 0.08, { type: "square", gain: 0.05, delay: 0.07, slideTo: 1760 }); },
    puFreeze() { seq([[1600, 0], [1400, 0.05], [1900, 0.1], [1500, 0.16]], 0.22,
                     { type: "sine", gain: 0.06 });
                 noise(0.4, { freq: 5000, sweepTo: 2000, gain: 0.03 }); },
    puShield() { tone(300, 0.2, { type: "sine", gain: 0.09, slideTo: 600 });
                 tone(600, 0.3, { type: "triangle", gain: 0.05, delay: 0.12 }); },
    puCatalyst(){ seq([[784, 0], [1047, 0.06], [1319, 0.12], [1568, 0.18]], 0.28,
                      { type: "triangle", gain: 0.1 });
                  noise(0.5, { freq: 800, sweepTo: 6000, gain: 0.04, reverse: true }); },
    shieldBlock(){ tone(420, 0.16, { type: "sine", gain: 0.11, slideTo: 240 });
                   noise(0.18, { freq: 900, gain: 0.06 }); },
    puVitality(){ seq([[523, 0], [659, 0.1], [784, 0.2]], 0.3, { type: "sine", gain: 0.09 }); },
    puWindfall(){ tone(1047, 0.1, { type: "square", gain: 0.06, slideTo: 1568 });
                  noise(0.3, { freq: 2000, sweepTo: 4000, gain: 0.035 }); },

    /* ── lab / chemistry flavour ───────────────────────────── */
    drop()     { noise(0.12, { freq: 900, gain: 0.06 }); },
    drip()     { tone(1400, 0.045, { type: "sine", gain: 0.07, slideTo: 700 });
                 noise(0.05, { freq: 2600, gain: 0.025 }); },
    pour()     { noise(0.3, { freq: 700, sweepTo: 1600, gain: 0.045, q: 0.7 }); },
    fizz()     { noise(0.6, { freq: 2600, sweepTo: 4200, gain: 0.045 }); },
    bubble:    throttled(() => tone(500 + Math.random() * 500, 0.06,
                    { type: "sine", gain: 0.045, slideTo: 1200 }), 45),
    colourChange() { tone(660, 0.16, { type: "sine", gain: 0.08, slideTo: 1320 });
                     tone(990, 0.3, { type: "triangle", gain: 0.05, delay: 0.1 }); },
    endpoint() { seq([[880, 0], [1175, 0.09], [1568, 0.18]], 0.34, { type: "sine", gain: 0.11 });
                 noise(0.5, { freq: 1200, sweepTo: 5000, gain: 0.035, reverse: true }); },
    precipitate() { noise(0.35, { freq: 1800, sweepTo: 400, gain: 0.06 });
                    tone(220, 0.3, { type: "sine", gain: 0.06 }); },
    balanced() { seq([[784, 0], [1047, 0.07]], 0.24, { type: "triangle", gain: 0.11 });
                 tone(1568, 0.35, { type: "sine", gain: 0.045, delay: 0.14 }); },
    tallyPing(){ tone(1320, 0.05, { type: "sine", gain: 0.045 }); },
    reaction() { noise(0.28, { freq: 400, sweepTo: 2400, gain: 0.05, reverse: true });
                 tone(440, 0.2, { type: "triangle", gain: 0.07, slideTo: 880 }); },
    noReaction(){ tone(200, 0.18, { type: "square", gain: 0.07, filter: "lowpass", filterFreq: 700 }); },
    match()    { tone(880, 0.07, { type: "sine", gain: 0.09 });
                 tone(1320, 0.12, { type: "sine", gain: 0.07, delay: 0.06 }); },
    mismatch() { tone(330, 0.12, { type: "triangle", gain: 0.06, slideTo: 220 }); },

    /* ── combat ────────────────────────────────────────────── */
    hit()      { tone(190, 0.12, { type: "square", gain: 0.1, slideTo: 90 });
                 noise(0.1, { freq: 600, gain: 0.06 }); },
    crit()     { tone(260, 0.16, { type: "sawtooth", gain: 0.12, slideTo: 70 });
                 noise(0.22, { freq: 1400, sweepTo: 200, gain: 0.09 });
                 tone(1320, 0.14, { type: "square", gain: 0.06, delay: 0.02 }); },
    playerHurt(){ noise(0.3, { freq: 280, sweepTo: 90, gain: 0.12 });
                  tone(120, 0.35, { type: "sawtooth", gain: 0.09, slideTo: 60 }); },
    bossHeal() { seq([[440, 0], [523, 0.08], [659, 0.16]], 0.3, { type: "sine", gain: 0.08 });
                 noise(0.4, { freq: 600, sweepTo: 2400, gain: 0.03, reverse: true }); },
    bossDefeat(){
      noise(0.7, { freq: 900, sweepTo: 60, gain: 0.14 });
      seq([[262, 0.1], [330, 0.25], [392, 0.4], [523, 0.55]], 0.5, { type: "triangle", gain: 0.12 });
      tone(65, 0.9, { type: "sine", gain: 0.1, delay: 0.05 });
    },
    bossIntro(){ tone(98, 0.9, { type: "sawtooth", gain: 0.1, filter: "lowpass", filterFreq: 500 });
                 tone(147, 0.7, { type: "sawtooth", gain: 0.07, delay: 0.1, filter: "lowpass", filterFreq: 600 });
                 noise(1.0, { freq: 120, sweepTo: 900, gain: 0.05, reverse: true }); },
    lowHealth(){ tone(160, 0.5, { type: "sine", gain: 0.08 });
                 tone(120, 0.5, { type: "sine", gain: 0.07, delay: 0.28 }); },
    explode()  { noise(0.4, { freq: 400, sweepTo: 60, gain: 0.15 });
                 tone(80, 0.45, { type: "sawtooth", gain: 0.1, slideTo: 40 }); },

    /* ── shop ──────────────────────────────────────────────── */
    purchase() { tone(660, 0.08, { type: "square", gain: 0.06 });
                 tone(880, 0.1, { type: "square", gain: 0.055, delay: 0.07 });
                 tone(1320, 0.16, { type: "triangle", gain: 0.05, delay: 0.14 }); },
    equip()    { tone(880, 0.09, { type: "sine", gain: 0.07, slideTo: 1320 }); },
    denied()   { tone(220, 0.09, { type: "square", gain: 0.07 });
                 tone(165, 0.14, { type: "square", gain: 0.06, delay: 0.08 }); },
    open()     { noise(0.35, { freq: 300, sweepTo: 3400, gain: 0.06, reverse: true });
                 tone(392, 0.14, { type: "sine", gain: 0.07, slideTo: 880 }); },
    rareDrop() {
      seq([[880, 0], [1175, 0.09], [1568, 0.18], [2093, 0.27]], 0.44, { type: "triangle", gain: 0.12 });
      noise(0.9, { freq: 1200, sweepTo: 7000, gain: 0.045, reverse: true });
    }
  };

  return api;
})();
