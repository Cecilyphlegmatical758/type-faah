let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

// Pre-generate noise buffers for performance
let noiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    // Create 0.1s of white noise
    const length = ctx.sampleRate * 0.1;
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return noiseBuffer;
}

/**
 * Thocky mechanical keyboard sound.
 * Built from shaped noise bursts - no oscillators, no buzzy tones.
 * A "thock" = fast attack noise filtered through a resonant lowpass
 * to give it a warm, deep, satisfying character.
 */
export function playKeySound(isCorrect: boolean = true) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Small random variation for natural feel
    const pitchVar = 0.9 + Math.random() * 0.2;
    const volVar = 0.85 + Math.random() * 0.15;

    // === Layer 1: The "thock" body ===
    // Noise burst shaped by a bandpass to give it the warm thock character
    const thockSource = ctx.createBufferSource();
    thockSource.buffer = getNoiseBuffer(ctx);

    const thockFilter = ctx.createBiquadFilter();
    thockFilter.type = "bandpass";
    thockFilter.frequency.setValueAtTime(800 * pitchVar, now);
    thockFilter.Q.setValueAtTime(1.2, now);

    const thockGain = ctx.createGain();
    thockGain.gain.setValueAtTime(0.12 * volVar, now);
    thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    thockSource.connect(thockFilter);
    thockFilter.connect(thockGain);
    thockGain.connect(ctx.destination);

    thockSource.start(now);
    thockSource.stop(now + 0.08);

    // === Layer 2: The "click" top ===
    // Higher frequency short burst for the initial impact
    const clickSource = ctx.createBufferSource();
    clickSource.buffer = getNoiseBuffer(ctx);

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = "highpass";
    clickFilter.frequency.setValueAtTime(2500 * pitchVar, now);
    clickFilter.Q.setValueAtTime(0.7, now);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.06 * volVar, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    clickSource.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickSource.start(now);
    clickSource.stop(now + 0.03);

    // === Layer 3: Low-end "bottom out" thud ===
    const thudSource = ctx.createBufferSource();
    thudSource.buffer = getNoiseBuffer(ctx);

    const thudFilter = ctx.createBiquadFilter();
    thudFilter.type = "lowpass";
    thudFilter.frequency.setValueAtTime(400 * pitchVar, now);
    thudFilter.Q.setValueAtTime(2, now);

    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(0.08 * volVar, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    thudSource.connect(thudFilter);
    thudFilter.connect(thudGain);
    thudGain.connect(ctx.destination);

    thudSource.start(now);
    thudSource.stop(now + 0.06);

    // If incorrect, add a subtle lower-pitched resonance
    if (!isCorrect) {
      const errSource = ctx.createBufferSource();
      errSource.buffer = getNoiseBuffer(ctx);

      const errFilter = ctx.createBiquadFilter();
      errFilter.type = "bandpass";
      errFilter.frequency.setValueAtTime(350, now);
      errFilter.Q.setValueAtTime(3, now);

      const errGain = ctx.createGain();
      errGain.gain.setValueAtTime(0.06, now);
      errGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      errSource.connect(errFilter);
      errFilter.connect(errGain);
      errGain.connect(ctx.destination);

      errSource.start(now);
      errSource.stop(now + 0.1);
    }
  } catch {
    // Audio not supported or blocked
  }
}

/**
 * Spacebar has a deeper, longer thock - like a stabilizer bar bottoming out.
 */
export function playSpaceSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const volVar = 0.9 + Math.random() * 0.1;

    // === Deep thock body ===
    const bodySource = ctx.createBufferSource();
    bodySource.buffer = getNoiseBuffer(ctx);

    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = "bandpass";
    bodyFilter.frequency.setValueAtTime(500, now);
    bodyFilter.Q.setValueAtTime(1.5, now);

    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(0.14 * volVar, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    bodySource.connect(bodyFilter);
    bodyFilter.connect(bodyGain);
    bodyGain.connect(ctx.destination);

    bodySource.start(now);
    bodySource.stop(now + 0.12);

    // === Low thud (stabilizer rattle) ===
    const thudSource = ctx.createBufferSource();
    thudSource.buffer = getNoiseBuffer(ctx);

    const thudFilter = ctx.createBiquadFilter();
    thudFilter.type = "lowpass";
    thudFilter.frequency.setValueAtTime(250, now);
    thudFilter.Q.setValueAtTime(2.5, now);

    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(0.1 * volVar, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    thudSource.connect(thudFilter);
    thudFilter.connect(thudGain);
    thudGain.connect(ctx.destination);

    thudSource.start(now);
    thudSource.stop(now + 0.09);

    // === Subtle click on top ===
    const clickSource = ctx.createBufferSource();
    clickSource.buffer = getNoiseBuffer(ctx);

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = "highpass";
    clickFilter.frequency.setValueAtTime(1800, now);
    clickFilter.Q.setValueAtTime(0.5, now);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.04 * volVar, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    clickSource.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickSource.start(now);
    clickSource.stop(now + 0.02);
  } catch {
    // Audio not supported
  }
}

/**
 * Completion sound - gentle warm chime, not harsh.
 */
export function playCompleteSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Soft sine chord with gentle attack
    const notes = [440, 554.37, 659.25]; // A4, C#5, E5 (A major)
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2000, now);

      // Gentle fade in, slow fade out
      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.06, now + i * 0.12 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.8);
    });
  } catch {
    // Audio not supported
  }
}
