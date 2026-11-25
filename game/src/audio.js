export function createAudio() {
  let context = null;
  let muted = false;
  const ensure = () => {
    if (!context) context = new AudioContext();
    if (context.state === 'suspended') context.resume();
    return context;
  };
  function tone(frequency, duration, type = 'sine', volume = .075, delay = 0) {
    if (muted) return;
    try {
      const audio = ensure(); const oscillator = audio.createOscillator(); const gain = audio.createGain();
      oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, audio.currentTime + delay);
      gain.gain.setValueAtTime(volume, audio.currentTime + delay); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + delay + duration);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(audio.currentTime + delay); oscillator.stop(audio.currentTime + delay + duration);
    } catch { /* Audio is optional; the kitchen remains playable without a device. */ }
  }
  return {
    play(name) {
      if (name === 'click') tone(620, .07, 'triangle', .035);
      if (name === 'add') { tone(430, .09, 'sine', .06); tone(730, .11, 'triangle', .035, .04); }
      if (name === 'cook') { tone(170, .14, 'sawtooth', .025); tone(240, .18, 'sawtooth', .018, .12); }
      if (name === 'serve') { tone(740, .13, 'sine', .07); tone(990, .22, 'sine', .06, .1); tone(1250, .3, 'triangle', .035, .2); }
      if (name === 'fail') { tone(220, .2, 'square', .055); tone(145, .36, 'sawtooth', .04, .18); }
    },
    toggle() { muted = !muted; return muted; },
    get muted() { return muted; }
  };
}
