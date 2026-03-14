export type SoundProfile = "lubed" | "blue" | "brown" | "red" | "topre" | "membrane";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

let noiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    const length = ctx.sampleRate * 0.15;
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return noiseBuffer;
}

// ─────────────────────────────────────────────
// LUBED LINEARS - soft, muted, buttery, dampened
// ─────────────────────────────────────────────

function playLubedKey(ctx: AudioContext, isCorrect: boolean) {
  const now = ctx.currentTime;
  const pitch = 0.92 + Math.random() * 0.16;
  const vol = 0.88 + Math.random() * 0.12;

  // Soft "pop" - muted bottom-out
  const popSource = ctx.createBufferSource();
  popSource.buffer = getNoiseBuffer(ctx);
  const popLP = ctx.createBiquadFilter();
  popLP.type = "lowpass";
  popLP.frequency.setValueAtTime(600 * pitch, now);
  popLP.Q.setValueAtTime(0.8, now);
  popLP.frequency.exponentialRampToValueAtTime(200, now + 0.04);
  const popGain = ctx.createGain();
  popGain.gain.setValueAtTime(0.09 * vol, now);
  popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
  popSource.connect(popLP);
  popLP.connect(popGain);
  popGain.connect(ctx.destination);
  popSource.start(now);
  popSource.stop(now + 0.05);

  // Tiny "tik" - stem hitting housing
  const tikSource = ctx.createBufferSource();
  tikSource.buffer = getNoiseBuffer(ctx);
  const tikBP = ctx.createBiquadFilter();
  tikBP.type = "bandpass";
  tikBP.frequency.setValueAtTime(1200 * pitch, now);
  tikBP.Q.setValueAtTime(2, now);
  const tikLP = ctx.createBiquadFilter();
  tikLP.type = "lowpass";
  tikLP.frequency.setValueAtTime(2000, now);
  const tikGain = ctx.createGain();
  tikGain.gain.setValueAtTime(0.035 * vol, now);
  tikGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
  tikSource.connect(tikBP);
  tikBP.connect(tikLP);
  tikLP.connect(tikGain);
  tikGain.connect(ctx.destination);
  tikSource.start(now);
  tikSource.stop(now + 0.02);

  // Sub-bass body - case resonance
  const subSource = ctx.createBufferSource();
  subSource.buffer = getNoiseBuffer(ctx);
  const subLP = ctx.createBiquadFilter();
  subLP.type = "lowpass";
  subLP.frequency.setValueAtTime(180 * pitch, now);
  subLP.Q.setValueAtTime(1.5, now);
  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.07 * vol, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
  subSource.connect(subLP);
  subLP.connect(subGain);
  subGain.connect(ctx.destination);
  subSource.start(now);
  subSource.stop(now + 0.06);

  if (!isCorrect) {
    const errOsc = ctx.createOscillator();
    const errGain = ctx.createGain();
    const errLP = ctx.createBiquadFilter();
    errOsc.type = "sine";
    errOsc.frequency.setValueAtTime(180, now);
    errLP.type = "lowpass";
    errLP.frequency.setValueAtTime(300, now);
    errGain.gain.setValueAtTime(0.04, now);
    errGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    errOsc.connect(errLP);
    errLP.connect(errGain);
    errGain.connect(ctx.destination);
    errOsc.start(now);
    errOsc.stop(now + 0.08);
  }
}

function playLubedSpace(ctx: AudioContext) {
  const now = ctx.currentTime;
  const vol = 0.9 + Math.random() * 0.1;

  const popSource = ctx.createBufferSource();
  popSource.buffer = getNoiseBuffer(ctx);
  const popLP = ctx.createBiquadFilter();
  popLP.type = "lowpass";
  popLP.frequency.setValueAtTime(450, now);
  popLP.Q.setValueAtTime(1, now);
  popLP.frequency.exponentialRampToValueAtTime(120, now + 0.06);
  const popGain = ctx.createGain();
  popGain.gain.setValueAtTime(0.11 * vol, now);
  popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  popSource.connect(popLP);
  popLP.connect(popGain);
  popGain.connect(ctx.destination);
  popSource.start(now);
  popSource.stop(now + 0.07);

  const subSource = ctx.createBufferSource();
  subSource.buffer = getNoiseBuffer(ctx);
  const subLP = ctx.createBiquadFilter();
  subLP.type = "lowpass";
  subLP.frequency.setValueAtTime(130, now);
  subLP.Q.setValueAtTime(2, now);
  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.09 * vol, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  subSource.connect(subLP);
  subLP.connect(subGain);
  subGain.connect(ctx.destination);
  subSource.start(now);
  subSource.stop(now + 0.08);

  const tapSource = ctx.createBufferSource();
  tapSource.buffer = getNoiseBuffer(ctx);
  const tapBP = ctx.createBiquadFilter();
  tapBP.type = "bandpass";
  tapBP.frequency.setValueAtTime(800, now);
  tapBP.Q.setValueAtTime(1.5, now);
  const tapLP = ctx.createBiquadFilter();
  tapLP.type = "lowpass";
  tapLP.frequency.setValueAtTime(1200, now);
  const tapGain = ctx.createGain();
  tapGain.gain.setValueAtTime(0.025 * vol, now);
  tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  tapSource.connect(tapBP);
  tapBP.connect(tapLP);
  tapLP.connect(tapGain);
  tapGain.connect(ctx.destination);
  tapSource.start(now);
  tapSource.stop(now + 0.025);
}

// ─────────────────────────────────────────────────────
// STOCK CHERRY MX BLUE
//
// The signature Cherry Blue sound comes from:
// 1. Click jacket: a sharp, bright, crisp "tick" - almost
//    like snapping a thin plastic piece. Very fast (~5ms),
//    concentrated around 2-5kHz.
// 2. Bottom-out: a fuller thud a few ms after the click,
//    as the stem hits the housing floor.
// 3. Housing resonance: the plastic housing rings briefly.
// 4. Spring crunch: very subtle metallic texture.
//
// The click is THE defining sound - it needs to be crisp,
// bright, and have that distinctive "tick" character.
// ─────────────────────────────────────────────────────

// Pre-generate a click impulse buffer for sharper transient
let clickBuffer: AudioBuffer | null = null;

function getClickBuffer(ctx: AudioContext): AudioBuffer {
  if (!clickBuffer || clickBuffer.sampleRate !== ctx.sampleRate) {
    // Very short impulse (~3ms) with shaped envelope
    const len = Math.floor(ctx.sampleRate * 0.004);
    clickBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = clickBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      // Sharp attack, fast decay envelope
      const env = t < 0.1 ? t / 0.1 : Math.exp(-12 * (t - 0.1));
      // Mix of noise + high-freq tone for metallic character
      data[i] = env * (
        (Math.random() * 2 - 1) * 0.6 +
        Math.sin(i * 2 * Math.PI * 5500 / ctx.sampleRate) * 0.4
      );
    }
  }
  return clickBuffer;
}

function playBlueKey(ctx: AudioContext, isCorrect: boolean) {
  const now = ctx.currentTime;
  const pitch = 0.95 + Math.random() * 0.1;
  const vol = 0.92 + Math.random() * 0.08;

  // === THE CLICK (the signature Blue sound) ===
  // Short, bright, crisp impulse through a peaky bandpass
  const clickSrc = ctx.createBufferSource();
  clickSrc.buffer = getClickBuffer(ctx);
  clickSrc.playbackRate.value = pitch;

  const clickHP = ctx.createBiquadFilter();
  clickHP.type = "highpass";
  clickHP.frequency.setValueAtTime(1800, now);

  const clickPeak = ctx.createBiquadFilter();
  clickPeak.type = "peaking";
  clickPeak.frequency.setValueAtTime(4000 * pitch, now);
  clickPeak.gain.setValueAtTime(8, now);
  clickPeak.Q.setValueAtTime(2, now);

  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.35 * vol, now);

  clickSrc.connect(clickHP);
  clickHP.connect(clickPeak);
  clickPeak.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickSrc.start(now);

  // === BOTTOM-OUT THUD (delayed ~8ms after click) ===
  const thudDelay = 0.008;
  const thudSrc = ctx.createBufferSource();
  thudSrc.buffer = getNoiseBuffer(ctx);

  const thudLP = ctx.createBiquadFilter();
  thudLP.type = "lowpass";
  thudLP.frequency.setValueAtTime(1200 * pitch, now + thudDelay);
  thudLP.Q.setValueAtTime(0.7, now);
  thudLP.frequency.exponentialRampToValueAtTime(350, now + thudDelay + 0.035);

  const thudGain = ctx.createGain();
  thudGain.gain.setValueAtTime(0, now);
  thudGain.gain.linearRampToValueAtTime(0.13 * vol, now + thudDelay);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + thudDelay + 0.045);

  thudSrc.connect(thudLP);
  thudLP.connect(thudGain);
  thudGain.connect(ctx.destination);
  thudSrc.start(now);
  thudSrc.stop(now + thudDelay + 0.05);

  // === HOUSING RESONANCE (plastic ring) ===
  const resSrc = ctx.createBufferSource();
  resSrc.buffer = getNoiseBuffer(ctx);

  const resBP = ctx.createBiquadFilter();
  resBP.type = "bandpass";
  resBP.frequency.setValueAtTime(2200 * pitch, now);
  resBP.Q.setValueAtTime(5, now);

  const resGain = ctx.createGain();
  resGain.gain.setValueAtTime(0.04 * vol, now);
  resGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  resSrc.connect(resBP);
  resBP.connect(resGain);
  resGain.connect(ctx.destination);
  resSrc.start(now);
  resSrc.stop(now + 0.055);

  // === CASE THUMP (low end body) ===
  const caseSrc = ctx.createBufferSource();
  caseSrc.buffer = getNoiseBuffer(ctx);

  const caseLP = ctx.createBiquadFilter();
  caseLP.type = "lowpass";
  caseLP.frequency.setValueAtTime(300, now);
  caseLP.Q.setValueAtTime(1.5, now);

  const caseGain = ctx.createGain();
  caseGain.gain.setValueAtTime(0.08 * vol, now + 0.005);
  caseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  caseSrc.connect(caseLP);
  caseLP.connect(caseGain);
  caseGain.connect(ctx.destination);
  caseSrc.start(now);
  caseSrc.stop(now + 0.065);

  if (!isCorrect) {
    const errSrc = ctx.createBufferSource();
    errSrc.buffer = getNoiseBuffer(ctx);
    const errBP = ctx.createBiquadFilter();
    errBP.type = "bandpass";
    errBP.frequency.setValueAtTime(300, now);
    errBP.Q.setValueAtTime(2, now);
    const errGain = ctx.createGain();
    errGain.gain.setValueAtTime(0.05, now);
    errGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    errSrc.connect(errBP);
    errBP.connect(errGain);
    errGain.connect(ctx.destination);
    errSrc.start(now);
    errSrc.stop(now + 0.085);
  }
}

function playBlueSpace(ctx: AudioContext) {
  const now = ctx.currentTime;
  const vol = 0.9 + Math.random() * 0.1;

  // Click (slightly lower pitch for bigger key)
  const clickSrc = ctx.createBufferSource();
  clickSrc.buffer = getClickBuffer(ctx);
  clickSrc.playbackRate.value = 0.85;

  const clickHP = ctx.createBiquadFilter();
  clickHP.type = "highpass";
  clickHP.frequency.setValueAtTime(1500, now);

  const clickPeak = ctx.createBiquadFilter();
  clickPeak.type = "peaking";
  clickPeak.frequency.setValueAtTime(3200, now);
  clickPeak.gain.setValueAtTime(6, now);
  clickPeak.Q.setValueAtTime(2, now);

  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.3 * vol, now);

  clickSrc.connect(clickHP);
  clickHP.connect(clickPeak);
  clickPeak.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickSrc.start(now);

  // Deeper thud
  const thudSrc = ctx.createBufferSource();
  thudSrc.buffer = getNoiseBuffer(ctx);
  const thudLP = ctx.createBiquadFilter();
  thudLP.type = "lowpass";
  thudLP.frequency.setValueAtTime(800, now + 0.01);
  thudLP.Q.setValueAtTime(1, now);
  thudLP.frequency.exponentialRampToValueAtTime(200, now + 0.06);
  const thudGain = ctx.createGain();
  thudGain.gain.setValueAtTime(0, now);
  thudGain.gain.linearRampToValueAtTime(0.15 * vol, now + 0.01);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  thudSrc.connect(thudLP);
  thudLP.connect(thudGain);
  thudGain.connect(ctx.destination);
  thudSrc.start(now);
  thudSrc.stop(now + 0.075);

  // Low case thump
  const caseSrc = ctx.createBufferSource();
  caseSrc.buffer = getNoiseBuffer(ctx);
  const caseLP = ctx.createBiquadFilter();
  caseLP.type = "lowpass";
  caseLP.frequency.setValueAtTime(200, now);
  caseLP.Q.setValueAtTime(2, now);
  const caseGain = ctx.createGain();
  caseGain.gain.setValueAtTime(0.1 * vol, now + 0.008);
  caseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  caseSrc.connect(caseLP);
  caseLP.connect(caseGain);
  caseGain.connect(ctx.destination);
  caseSrc.start(now);
  caseSrc.stop(now + 0.085);

  // Stab rattle
  const rattleSrc = ctx.createBufferSource();
  rattleSrc.buffer = getNoiseBuffer(ctx);
  const rattleBP = ctx.createBiquadFilter();
  rattleBP.type = "bandpass";
  rattleBP.frequency.setValueAtTime(2000, now + 0.012);
  rattleBP.Q.setValueAtTime(4, now);
  const rattleGain = ctx.createGain();
  rattleGain.gain.setValueAtTime(0, now);
  rattleGain.gain.linearRampToValueAtTime(0.035 * vol, now + 0.012);
  rattleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
  rattleSrc.connect(rattleBP);
  rattleBP.connect(rattleGain);
  rattleGain.connect(ctx.destination);
  rattleSrc.start(now);
  rattleSrc.stop(now + 0.06);
}

// ─────────────────────────────────────────────
// CHERRY MX BROWN - tactile bump, no click
// Softer than blue, has a subtle bump feel
// ─────────────────────────────────────────────

function playBrownKey(ctx: AudioContext, isCorrect: boolean) {
  const now = ctx.currentTime;
  const pitch = 0.94 + Math.random() * 0.12;
  const vol = 0.9 + Math.random() * 0.1;

  // Tactile bump - softer than blue, more like a dull tick
  const bumpSrc = ctx.createBufferSource();
  bumpSrc.buffer = getNoiseBuffer(ctx);
  const bumpBP = ctx.createBiquadFilter();
  bumpBP.type = "bandpass";
  bumpBP.frequency.setValueAtTime(2200 * pitch, now);
  bumpBP.Q.setValueAtTime(2, now);
  const bumpGain = ctx.createGain();
  bumpGain.gain.setValueAtTime(0.1 * vol, now);
  bumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  bumpSrc.connect(bumpBP);
  bumpBP.connect(bumpGain);
  bumpGain.connect(ctx.destination);
  bumpSrc.start(now);
  bumpSrc.stop(now + 0.025);

  // Bottom-out thud
  const thudSrc = ctx.createBufferSource();
  thudSrc.buffer = getNoiseBuffer(ctx);
  const thudLP = ctx.createBiquadFilter();
  thudLP.type = "lowpass";
  thudLP.frequency.setValueAtTime(800 * pitch, now + 0.006);
  thudLP.Q.setValueAtTime(0.8, now);
  thudLP.frequency.exponentialRampToValueAtTime(250, now + 0.05);
  const thudGain = ctx.createGain();
  thudGain.gain.setValueAtTime(0.11 * vol, now + 0.005);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
  thudSrc.connect(thudLP);
  thudLP.connect(thudGain);
  thudGain.connect(ctx.destination);
  thudSrc.start(now);
  thudSrc.stop(now + 0.06);

  // Case resonance
  const caseSrc = ctx.createBufferSource();
  caseSrc.buffer = getNoiseBuffer(ctx);
  const caseLP = ctx.createBiquadFilter();
  caseLP.type = "lowpass";
  caseLP.frequency.setValueAtTime(280, now);
  caseLP.Q.setValueAtTime(1.5, now);
  const caseGain = ctx.createGain();
  caseGain.gain.setValueAtTime(0.06 * vol, now);
  caseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  caseSrc.connect(caseLP);
  caseLP.connect(caseGain);
  caseGain.connect(ctx.destination);
  caseSrc.start(now);
  caseSrc.stop(now + 0.055);

  if (!isCorrect) {
    const e = ctx.createOscillator(); const eg = ctx.createGain();
    e.type = "sine"; e.frequency.setValueAtTime(200, now);
    eg.gain.setValueAtTime(0.04, now); eg.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    e.connect(eg); eg.connect(ctx.destination); e.start(now); e.stop(now + 0.08);
  }
}

function playBrownSpace(ctx: AudioContext) {
  const now = ctx.currentTime;
  const vol = 0.9 + Math.random() * 0.1;
  // Deeper bump
  const bSrc = ctx.createBufferSource(); bSrc.buffer = getNoiseBuffer(ctx);
  const bBP = ctx.createBiquadFilter(); bBP.type = "bandpass"; bBP.frequency.setValueAtTime(1600, now); bBP.Q.setValueAtTime(1.5, now);
  const bG = ctx.createGain(); bG.gain.setValueAtTime(0.08 * vol, now); bG.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
  bSrc.connect(bBP); bBP.connect(bG); bG.connect(ctx.destination); bSrc.start(now); bSrc.stop(now + 0.03);
  // Thud
  const tSrc = ctx.createBufferSource(); tSrc.buffer = getNoiseBuffer(ctx);
  const tLP = ctx.createBiquadFilter(); tLP.type = "lowpass"; tLP.frequency.setValueAtTime(500, now); tLP.Q.setValueAtTime(1.2, now);
  tLP.frequency.exponentialRampToValueAtTime(140, now + 0.06);
  const tG = ctx.createGain(); tG.gain.setValueAtTime(0.14 * vol, now); tG.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  tSrc.connect(tLP); tLP.connect(tG); tG.connect(ctx.destination); tSrc.start(now); tSrc.stop(now + 0.085);
}

// ─────────────────────────────────────────────
// CHERRY MX RED - linear, no bump, no click
// Similar to lubed but slightly scratchier/louder
// ─────────────────────────────────────────────

function playRedKey(ctx: AudioContext, isCorrect: boolean) {
  const now = ctx.currentTime;
  const pitch = 0.93 + Math.random() * 0.14;
  const vol = 0.9 + Math.random() * 0.1;

  // Bottom-out - louder than lubed, less dampened
  const popSrc = ctx.createBufferSource(); popSrc.buffer = getNoiseBuffer(ctx);
  const popLP = ctx.createBiquadFilter(); popLP.type = "lowpass";
  popLP.frequency.setValueAtTime(900 * pitch, now); popLP.Q.setValueAtTime(0.6, now);
  popLP.frequency.exponentialRampToValueAtTime(280, now + 0.04);
  const popG = ctx.createGain(); popG.gain.setValueAtTime(0.11 * vol, now);
  popG.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  popSrc.connect(popLP); popLP.connect(popG); popG.connect(ctx.destination);
  popSrc.start(now); popSrc.stop(now + 0.055);

  // Scratch/contact noise - reds are slightly scratchy unlubed
  const scrSrc = ctx.createBufferSource(); scrSrc.buffer = getNoiseBuffer(ctx);
  const scrBP = ctx.createBiquadFilter(); scrBP.type = "bandpass";
  scrBP.frequency.setValueAtTime(1800 * pitch, now); scrBP.Q.setValueAtTime(1.5, now);
  const scrG = ctx.createGain(); scrG.gain.setValueAtTime(0.04 * vol, now);
  scrG.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  scrSrc.connect(scrBP); scrBP.connect(scrG); scrG.connect(ctx.destination);
  scrSrc.start(now); scrSrc.stop(now + 0.025);

  // Case thump
  const cSrc = ctx.createBufferSource(); cSrc.buffer = getNoiseBuffer(ctx);
  const cLP = ctx.createBiquadFilter(); cLP.type = "lowpass";
  cLP.frequency.setValueAtTime(200, now); cLP.Q.setValueAtTime(1.8, now);
  const cG = ctx.createGain(); cG.gain.setValueAtTime(0.07 * vol, now);
  cG.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  cSrc.connect(cLP); cLP.connect(cG); cG.connect(ctx.destination);
  cSrc.start(now); cSrc.stop(now + 0.055);

  // Spring ping
  const spOsc = ctx.createOscillator(); spOsc.type = "sine";
  spOsc.frequency.setValueAtTime(3200 * pitch, now);
  spOsc.frequency.exponentialRampToValueAtTime(2600, now + 0.04);
  const spG = ctx.createGain(); spG.gain.setValueAtTime(0.008 * vol, now);
  spG.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  spOsc.connect(spG); spG.connect(ctx.destination); spOsc.start(now); spOsc.stop(now + 0.045);

  if (!isCorrect) {
    const e = ctx.createOscillator(); const eg = ctx.createGain();
    e.type = "sine"; e.frequency.setValueAtTime(200, now);
    eg.gain.setValueAtTime(0.035, now); eg.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    e.connect(eg); eg.connect(ctx.destination); e.start(now); e.stop(now + 0.07);
  }
}

function playRedSpace(ctx: AudioContext) {
  const now = ctx.currentTime;
  const vol = 0.9 + Math.random() * 0.1;
  const pSrc = ctx.createBufferSource(); pSrc.buffer = getNoiseBuffer(ctx);
  const pLP = ctx.createBiquadFilter(); pLP.type = "lowpass";
  pLP.frequency.setValueAtTime(600, now); pLP.Q.setValueAtTime(0.8, now);
  pLP.frequency.exponentialRampToValueAtTime(160, now + 0.06);
  const pG = ctx.createGain(); pG.gain.setValueAtTime(0.14 * vol, now);
  pG.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  pSrc.connect(pLP); pLP.connect(pG); pG.connect(ctx.destination);
  pSrc.start(now); pSrc.stop(now + 0.085);
  // Sub
  const sSrc = ctx.createBufferSource(); sSrc.buffer = getNoiseBuffer(ctx);
  const sLP = ctx.createBiquadFilter(); sLP.type = "lowpass"; sLP.frequency.setValueAtTime(150, now); sLP.Q.setValueAtTime(2, now);
  const sG = ctx.createGain(); sG.gain.setValueAtTime(0.09 * vol, now); sG.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  sSrc.connect(sLP); sLP.connect(sG); sG.connect(ctx.destination); sSrc.start(now); sSrc.stop(now + 0.075);
}

// ─────────────────────────────────────────────
// TOPRE - electrostatic capacitive rubber dome
// Distinctive "thock" + "clack" - deep, round,
// very clean with almost no rattle
// ─────────────────────────────────────────────

function playTopreKey(ctx: AudioContext, isCorrect: boolean) {
  const now = ctx.currentTime;
  const pitch = 0.95 + Math.random() * 0.1;
  const vol = 0.9 + Math.random() * 0.1;

  // The "clack" - Topre has a distinctive mid-high clack
  const clkSrc = ctx.createBufferSource(); clkSrc.buffer = getNoiseBuffer(ctx);
  const clkBP = ctx.createBiquadFilter(); clkBP.type = "bandpass";
  clkBP.frequency.setValueAtTime(1600 * pitch, now); clkBP.Q.setValueAtTime(3, now);
  const clkG = ctx.createGain(); clkG.gain.setValueAtTime(0.12 * vol, now);
  clkG.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
  clkSrc.connect(clkBP); clkBP.connect(clkG); clkG.connect(ctx.destination);
  clkSrc.start(now); clkSrc.stop(now + 0.03);

  // The deep "thock" body - Topre is famous for this
  const thkSrc = ctx.createBufferSource(); thkSrc.buffer = getNoiseBuffer(ctx);
  const thkLP = ctx.createBiquadFilter(); thkLP.type = "lowpass";
  thkLP.frequency.setValueAtTime(500 * pitch, now); thkLP.Q.setValueAtTime(1.8, now);
  thkLP.frequency.exponentialRampToValueAtTime(150, now + 0.05);
  const thkG = ctx.createGain(); thkG.gain.setValueAtTime(0.13 * vol, now);
  thkG.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  thkSrc.connect(thkLP); thkLP.connect(thkG); thkG.connect(ctx.destination);
  thkSrc.start(now); thkSrc.stop(now + 0.065);

  // Dome snap - rubber dome collapsing has a unique character
  const dOsc = ctx.createOscillator(); dOsc.type = "sine";
  dOsc.frequency.setValueAtTime(800 * pitch, now);
  dOsc.frequency.exponentialRampToValueAtTime(200, now + 0.015);
  const dG = ctx.createGain(); dG.gain.setValueAtTime(0.04 * vol, now);
  dG.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  dOsc.connect(dG); dG.connect(ctx.destination); dOsc.start(now); dOsc.stop(now + 0.025);

  if (!isCorrect) {
    const e = ctx.createBufferSource(); e.buffer = getNoiseBuffer(ctx);
    const eBP = ctx.createBiquadFilter(); eBP.type = "bandpass"; eBP.frequency.setValueAtTime(280, now); eBP.Q.setValueAtTime(2, now);
    const eG = ctx.createGain(); eG.gain.setValueAtTime(0.04, now); eG.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    e.connect(eBP); eBP.connect(eG); eG.connect(ctx.destination); e.start(now); e.stop(now + 0.085);
  }
}

function playTopreSpace(ctx: AudioContext) {
  const now = ctx.currentTime; const vol = 0.9 + Math.random() * 0.1;
  // Deeper clack
  const cSrc = ctx.createBufferSource(); cSrc.buffer = getNoiseBuffer(ctx);
  const cBP = ctx.createBiquadFilter(); cBP.type = "bandpass"; cBP.frequency.setValueAtTime(1200, now); cBP.Q.setValueAtTime(2.5, now);
  const cG = ctx.createGain(); cG.gain.setValueAtTime(0.1 * vol, now); cG.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  cSrc.connect(cBP); cBP.connect(cG); cG.connect(ctx.destination); cSrc.start(now); cSrc.stop(now + 0.035);
  // Deep thock
  const tSrc = ctx.createBufferSource(); tSrc.buffer = getNoiseBuffer(ctx);
  const tLP = ctx.createBiquadFilter(); tLP.type = "lowpass"; tLP.frequency.setValueAtTime(350, now); tLP.Q.setValueAtTime(2.2, now);
  tLP.frequency.exponentialRampToValueAtTime(100, now + 0.06);
  const tG = ctx.createGain(); tG.gain.setValueAtTime(0.15 * vol, now); tG.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  tSrc.connect(tLP); tLP.connect(tG); tG.connect(ctx.destination); tSrc.start(now); tSrc.stop(now + 0.085);
}

// ─────────────────────────────────────────────
// MEMBRANE - mushy, dull, no tactile feedback
// Very muted, mostly low-freq, rubbery
// ─────────────────────────────────────────────

function playMembraneKey(ctx: AudioContext, isCorrect: boolean) {
  const now = ctx.currentTime;
  const pitch = 0.9 + Math.random() * 0.2;
  const vol = 0.85 + Math.random() * 0.15;

  // Mushy thud - very low-passed, dull
  const mSrc = ctx.createBufferSource(); mSrc.buffer = getNoiseBuffer(ctx);
  const mLP = ctx.createBiquadFilter(); mLP.type = "lowpass";
  mLP.frequency.setValueAtTime(400 * pitch, now); mLP.Q.setValueAtTime(0.5, now);
  mLP.frequency.exponentialRampToValueAtTime(100, now + 0.05);
  const mG = ctx.createGain(); mG.gain.setValueAtTime(0.1 * vol, now);
  mG.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  mSrc.connect(mLP); mLP.connect(mG); mG.connect(ctx.destination);
  mSrc.start(now); mSrc.stop(now + 0.065);

  // Rubber dome squish - very quiet mid
  const rSrc = ctx.createBufferSource(); rSrc.buffer = getNoiseBuffer(ctx);
  const rBP = ctx.createBiquadFilter(); rBP.type = "bandpass";
  rBP.frequency.setValueAtTime(700 * pitch, now); rBP.Q.setValueAtTime(1, now);
  const rG = ctx.createGain(); rG.gain.setValueAtTime(0.04 * vol, now);
  rG.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  rSrc.connect(rBP); rBP.connect(rG); rG.connect(ctx.destination);
  rSrc.start(now); rSrc.stop(now + 0.035);

  if (!isCorrect) {
    const e = ctx.createOscillator(); const eg = ctx.createGain();
    e.type = "sine"; e.frequency.setValueAtTime(160, now);
    eg.gain.setValueAtTime(0.03, now); eg.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    e.connect(eg); eg.connect(ctx.destination); e.start(now); e.stop(now + 0.07);
  }
}

function playMembraneSpace(ctx: AudioContext) {
  const now = ctx.currentTime; const vol = 0.9 + Math.random() * 0.1;
  const mSrc = ctx.createBufferSource(); mSrc.buffer = getNoiseBuffer(ctx);
  const mLP = ctx.createBiquadFilter(); mLP.type = "lowpass";
  mLP.frequency.setValueAtTime(300, now); mLP.Q.setValueAtTime(0.7, now);
  mLP.frequency.exponentialRampToValueAtTime(80, now + 0.06);
  const mG = ctx.createGain(); mG.gain.setValueAtTime(0.12 * vol, now);
  mG.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  mSrc.connect(mLP); mLP.connect(mG); mG.connect(ctx.destination);
  mSrc.start(now); mSrc.stop(now + 0.085);
}

// ─────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────

const keyFns: Record<SoundProfile, (ctx: AudioContext, ok: boolean) => void> = {
  lubed: playLubedKey, blue: playBlueKey, brown: playBrownKey,
  red: playRedKey, topre: playTopreKey, membrane: playMembraneKey,
};
const spaceFns: Record<SoundProfile, (ctx: AudioContext) => void> = {
  lubed: playLubedSpace, blue: playBlueSpace, brown: playBrownSpace,
  red: playRedSpace, topre: playTopreSpace, membrane: playMembraneSpace,
};

export function playKeySound(profile: SoundProfile, isCorrect: boolean = true) {
  try {
    const ctx = getAudioContext();
    (keyFns[profile] || playLubedKey)(ctx, isCorrect);
  } catch { /* */ }
}

export function playSpaceSound(profile: SoundProfile) {
  try {
    const ctx = getAudioContext();
    (spaceFns[profile] || playLubedSpace)(ctx);
  } catch { /* */ }
}

export function playCompleteSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [392, 493.88, 587.33]; // G major
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1500, now);
      filter.Q.setValueAtTime(0.5, now);

      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.045, now + i * 0.15 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 1.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 1.0);
    });
  } catch {
    // Audio not available
  }
}
