/* Synthesised sound effects. No audio files: nothing to download, nothing to
   precache, nothing to license, and the whole vocabulary costs zero bytes
   offline. The context is created lazily on the first user gesture to satisfy
   autoplay policies, and everything routes through one gain + limiter so the
   volume slider works and stacked cues don't clip. */
window.MQ = window.MQ || {};

MQ.Sound = (function () {
  let ctx = null, master = null, comp = null;
  let enabled = true;
  let volume = 0.8;
  let lastPlay = 0;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
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

  /** One shaped oscillator note. opts: {type, gain, delay, slideTo, attack, detune, filter} */
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

  /** Filtered noise burst — whoosh, impact, chalk, static. */
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
    notes.forEach(([f, at]) =>
      tone(f, dur, Object.assign({}, opts, { delay: ((opts && opts.delay) || 0) + at })));
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
  /* A whole-tone run — deliberately unresolved. Used for anything "approaching
     but not reaching" a value, which in this app is a running theme. */
  const WHOLE = [523.25, 587.33, 659.25, 739.99, 830.61, 932.33];

  const api = {
    setEnabled(v) { enabled = !!v; },
    isEnabled() { return enabled; },
    setVolume(v) { volume = Math.max(0, Math.min(1, v)); if (master) master.gain.value = volume; },
    getVolume() { return volume; },

    /* ── core feedback ─────────────────────────────────────── */
    correct()  { tone(659.25, 0.09, { type: "triangle", gain: 0.13 });
                 tone(987.77, 0.15, { type: "triangle", gain: 0.11, delay: 0.07 }); },
    wrong()    { tone(233, 0.16, { type: "sawtooth", gain: 0.09, filter: "lowpass", filterFreq: 1400 });
                 tone(155, 0.24, { type: "sawtooth", gain: 0.08, delay: 0.08, filter: "lowpass", filterFreq: 900 }); },
    close()    { tone(494, 0.12, { type: "triangle", gain: 0.09 });
                 tone(466, 0.16, { type: "triangle", gain: 0.07, delay: 0.09 }); },
    error()    { tone(180, 0.1, { type: "square", gain: 0.07 });
                 tone(140, 0.14, { type: "square", gain: 0.06, delay: 0.09 }); },
    click:     throttled(() => tone(560, 0.03, { type: "square", gain: 0.045 }), 30),
    tap:       throttled(() => tone(760, 0.025, { type: "sine", gain: 0.04 }), 30),
    hover:     throttled(() => tone(1100, 0.02, { type: "sine", gain: 0.018 }), 60),
    nav()      { noise(0.16, { freq: 500, sweepTo: 2600, gain: 0.045, filter: "bandpass", q: 0.8 }); },
    type:      throttled(() => tone(320 + Math.random() * 80, 0.018, { type: "square", gain: 0.03 }), 20),
    flip()     { tone(420, 0.055, { type: "sine", gain: 0.06, slideTo: 760 });
                 noise(0.06, { freq: 2400, gain: 0.03 }); },
    swipe()    { noise(0.12, { freq: 900, sweepTo: 3200, gain: 0.035 }); },
    pop:       throttled(() => tone(880, 0.04, { type: "sine", gain: 0.06, slideTo: 1320 }), 25),
    thud()     { tone(110, 0.12, { type: "sine", gain: 0.09, slideTo: 60 }); },

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
    tally:     throttled(() => tone(1320, 0.045, { type: "sine", gain: 0.045 }), 30),

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
    mastery()  { seq([[523, 0], [784, 0.09], [1047, 0.18], [1568, 0.27]], 0.4, { type: "sine", gain: 0.11 }); },

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
    puFreeze() { seq([[1600, 0], [1400, 0.05], [1900, 0.1], [1500, 0.16]], 0.22, { type: "sine", gain: 0.06 });
                 noise(0.4, { freq: 5000, sweepTo: 2000, gain: 0.03 }); },
    puShield() { tone(300, 0.2, { type: "sine", gain: 0.09, slideTo: 600 });
                 tone(600, 0.3, { type: "triangle", gain: 0.05, delay: 0.12 }); },
    puBoost()  { seq([[784, 0], [1047, 0.06], [1319, 0.12], [1568, 0.18]], 0.28, { type: "triangle", gain: 0.1 });
                 noise(0.5, { freq: 800, sweepTo: 6000, gain: 0.04, reverse: true }); },
    puInsight(){ tone(1046, 0.1, { type: "sine", gain: 0.07 });
                 tone(1568, 0.24, { type: "sine", gain: 0.05, delay: 0.08 });
                 noise(0.3, { freq: 3000, sweepTo: 7000, gain: 0.025, reverse: true }); },
    puAdrenaline(){ tone(220, 0.3, { type: "sawtooth", gain: 0.08, slideTo: 660 });
                    seq([[660, 0.2], [880, 0.3], [1320, 0.4]], 0.3, { type: "triangle", gain: 0.1 }); },
    shieldBlock(){ tone(420, 0.16, { type: "sine", gain: 0.11, slideTo: 240 });
                   noise(0.18, { freq: 900, gain: 0.06 }); },

    /* ── maths flavour ─────────────────────────────────────── */
    /* A rising whole-tone run that never resolves — for the Asymptote and
       for anything else that approaches a limit without reaching it. */
    asymptote() { seq(WHOLE.map((f, i) => [f, i * 0.06]), 0.3, { type: "sine", gain: 0.07 }); },
    chalk:     throttled(() => noise(0.05, { freq: 2800 + Math.random() * 1200, gain: 0.028 }), 35),
    graph()    { noise(0.3, { freq: 400, sweepTo: 3600, gain: 0.04, reverse: true });
                 tone(523, 0.2, { type: "sine", gain: 0.05, slideTo: 1047 }); },
    dragStart(){ tone(440, 0.05, { type: "sine", gain: 0.05 }); },
    dragTick:  throttled(() => tone(1200 + Math.random() * 300, 0.015, { type: "sine", gain: 0.022 }), 45),
    snap()     { tone(1568, 0.05, { type: "square", gain: 0.055 });
                 tone(2093, 0.07, { type: "sine", gain: 0.035, delay: 0.04 }); },
    tangent()  { tone(784, 0.09, { type: "triangle", gain: 0.08 });
                 tone(1175, 0.14, { type: "sine", gain: 0.06, delay: 0.06 }); },
    integrate(){ noise(0.45, { freq: 200, sweepTo: 2200, gain: 0.045, reverse: true });
                 seq([[262, 0], [392, 0.12], [523, 0.24]], 0.35, { type: "sine", gain: 0.08 }); },
    /* Two notes a fifth apart, played together — "these are the same thing". */
    equivalent(){ tone(523.25, 0.28, { type: "triangle", gain: 0.1 });
                  tone(783.99, 0.28, { type: "triangle", gain: 0.08 });
                  tone(1046.5, 0.4, { type: "sine", gain: 0.05, delay: 0.12 }); },
    notEquivalent(){ tone(523.25, 0.26, { type: "triangle", gain: 0.09 });
                     tone(554.37, 0.26, { type: "triangle", gain: 0.09 }); },   // a semitone — deliberately sour
    match()    { tone(880, 0.07, { type: "sine", gain: 0.09 });
                 tone(1320, 0.12, { type: "sine", gain: 0.07, delay: 0.06 }); },
    mismatch() { tone(330, 0.12, { type: "triangle", gain: 0.06, slideTo: 220 }); },
    stepPlace(){ tone(660, 0.06, { type: "square", gain: 0.05 });
                 noise(0.05, { freq: 1800, gain: 0.025 }); },
    stepWrong(){ tone(196, 0.14, { type: "square", gain: 0.07, slideTo: 130 }); },
    proofDone(){ seq([[392, 0], [523, 0.1], [659, 0.2], [784, 0.3], [1047, 0.42]], 0.42,
                     { type: "triangle", gain: 0.11 });
                 noise(0.7, { freq: 600, sweepTo: 5000, gain: 0.035, reverse: true }); },
    /* Q.E.D. — a definitive, closed cadence. Induction gets its own. */
    qed()      { seq([[784, 0], [659, 0.1], [523, 0.2]], 0.42, { type: "triangle", gain: 0.12 });
                 tone(261.63, 0.7, { type: "sine", gain: 0.09, delay: 0.2 }); },
    dominoes() { for (let i = 0; i < 7; i++)
                   tone(300 + i * 90, 0.05, { type: "square", gain: 0.045, delay: i * 0.055 }); },
    launch()   { tone(180, 0.35, { type: "sawtooth", gain: 0.09, slideTo: 900 });
                 noise(0.4, { freq: 300, sweepTo: 3000, gain: 0.05, reverse: true }); },
    hitTarget(){ seq([[1047, 0], [1319, 0.07], [1568, 0.14], [2093, 0.21]], 0.3,
                     { type: "triangle", gain: 0.12 });
                 noise(0.3, { freq: 2000, sweepTo: 500, gain: 0.06 }); },
    missTarget(){ noise(0.25, { freq: 600, sweepTo: 140, gain: 0.07 });
                  tone(150, 0.3, { type: "sine", gain: 0.06, slideTo: 80 }); },
    dice()     { for (let i = 0; i < 5; i++)
                   noise(0.05, { freq: 1600 + Math.random() * 900, gain: 0.045, delay: i * 0.06 }); },
    gridFill:  throttled(() => tone(1046, 0.035, { type: "square", gain: 0.04 }), 25),
    gridWrong(){ tone(260, 0.1, { type: "square", gain: 0.06, slideTo: 180 }); },

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
    bossRotate(){ noise(0.22, { freq: 800, sweepTo: 2400, gain: 0.045 });
                  tone(660, 0.18, { type: "triangle", gain: 0.05, slideTo: 990 }); },
    bossDefeat(){
      noise(0.7, { freq: 900, sweepTo: 60, gain: 0.14 });
      seq([[262, 0.1], [330, 0.25], [392, 0.4], [523, 0.55]], 0.5, { type: "triangle", gain: 0.12 });
      tone(65, 0.9, { type: "sine", gain: 0.1, delay: 0.05 });
    },
    bossIntro(){ tone(98, 0.9, { type: "sawtooth", gain: 0.1, filter: "lowpass", filterFreq: 500 });
                 tone(147, 0.7, { type: "sawtooth", gain: 0.07, delay: 0.1, filter: "lowpass", filterFreq: 600 });
                 noise(1.0, { freq: 120, sweepTo: 900, gain: 0.05, reverse: true }); },
    phaseUp()  { seq([[330, 0], [415, 0.08], [494, 0.16], [659, 0.24]], 0.3, { type: "sawtooth", gain: 0.09 }); },
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
    },
    ticket()   { noise(0.14, { freq: 2200, sweepTo: 900, gain: 0.05 });
                 tone(988, 0.08, { type: "square", gain: 0.05, delay: 0.06 }); },

    /* ── arcade ────────────────────────────────────────────── */
    crush:     throttled(() => { tone(700 + Math.random() * 500, 0.05, { type: "square", gain: 0.05 });
                                 noise(0.06, { freq: 2000, gain: 0.03 }); }, 30),
    cascade(n) { tone(523 + Math.min(n, 8) * 60, 0.08, { type: "triangle", gain: 0.08 }); },
    jump()     { tone(420, 0.09, { type: "square", gain: 0.06, slideTo: 880 }); },
    duck()     { tone(600, 0.07, { type: "square", gain: 0.05, slideTo: 260 }); },
    crash()    { noise(0.35, { freq: 700, sweepTo: 90, gain: 0.11 });
                 tone(140, 0.3, { type: "sawtooth", gain: 0.08, slideTo: 60 }); },
    merge(v)   { tone(330 * Math.pow(1.09, Math.log2(v || 2)), 0.09, { type: "triangle", gain: 0.08 }); },
    slide:     throttled(() => noise(0.08, { freq: 1400, sweepTo: 600, gain: 0.03 }), 40)
  };

  return api;
})();
