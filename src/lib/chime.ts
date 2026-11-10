type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (context) return context;
  const AudioCtor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
  if (!AudioCtor) return null;
  context = new AudioCtor();
  return context;
}

/** Создаёт аудиоконтекст по клику пользователя, чтобы браузер разрешил звук позже. */
export function primeChime(): void {
  try {
    void getContext()?.resume();
  } catch {
    // звук — необязательная часть, без него таймер работает так же
  }
}

/** Короткий двухтоновый сигнал об окончании таймера. */
export function playChime(): void {
  try {
    const ctx = getContext();
    if (!ctx || ctx.state !== "running") return;

    [880, 1320].forEach((frequency, index) => {
      const start = ctx.currentTime + index * 0.18;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);

      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.34);
    });
  } catch {
    // см. primeChime
  }
}
