let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playKeySound(isCorrect: boolean = true) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillator for the click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Connect nodes
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    if (isCorrect) {
      // Satisfying mechanical key click sound
      osc.type = "square";
      osc.frequency.setValueAtTime(1800 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.03);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(3000, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.05);
      filter.Q.setValueAtTime(2, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.start(now);
      osc.stop(now + 0.06);
    } else {
      // Error sound - slightly different tone
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2000, now);
      filter.Q.setValueAtTime(1, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);
    }

    // Add a noise burst for tactile feel
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(4000, now);
    noiseFilter.Q.setValueAtTime(0.5, now);

    noiseGain.gain.setValueAtTime(0.03, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    noiseSource.start(now);
    noiseSource.stop(now + 0.02);
  } catch {
    // Audio not supported or blocked, silently fail
  }
}

export function playSpaceSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Deeper thud for spacebar
    osc.type = "sine";
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.06);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);

    // Noise component
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();

    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseGain.gain.setValueAtTime(0.04, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    noiseSource.start(now);
    noiseSource.stop(now + 0.03);
  } catch {
    // Audio not supported
  }
}

export function playCompleteSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Play a pleasant chord
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0, now + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.5);
    });
  } catch {
    // Audio not supported
  }
}
