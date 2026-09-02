/* Tiny WebAudio chiptune engine — square/triangle blips, no assets. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

let enabled: boolean = (() => {
  try {
    return localStorage.getItem("nw.sound") !== "0";
  } catch {
    return true;
  }
})();

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

type ToneOpts = {
  f: number;
  f2?: number;
  t?: OscillatorType;
  d?: number;
  v?: number;
  at?: number;
};

function tone({ f, f2, t = "square", d = 0.12, v = 0.14, at = 0 }: ToneOpts) {
  const c = ac();
  if (!c || !master) return;
  try {
    const o = c.createOscillator();
    const g = c.createGain();
    const t0 = c.currentTime + at;
    o.type = t;
    o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(30, f2), t0 + d);
    g.gain.setValueAtTime(v, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g);
    g.connect(master);
    o.start(t0);
    o.stop(t0 + d + 0.03);
  } catch {
    /* audio is decoration — never break the game */
  }
}

export const sfx = {
  get enabled() {
    return enabled;
  },
  toggle(): boolean {
    enabled = !enabled;
    try {
      localStorage.setItem("nw.sound", enabled ? "1" : "0");
    } catch {
      /* ignore */
    }
    return enabled;
  },
  coin() {
    if (!enabled) return;
    tone({ f: 988, d: 0.08 });
    tone({ f: 1319, d: 0.22, at: 0.08 });
  },
  tick(urgent = false) {
    if (!enabled) return;
    tone({ f: urgent ? 1180 : 620, d: 0.045, v: 0.06 });
  },
  start() {
    if (!enabled) return;
    [523, 659, 784, 1047].forEach((f, i) => tone({ f, d: 0.1, at: i * 0.08 }));
  },
  over() {
    if (!enabled) return;
    [392, 330, 262, 196].forEach((f, i) =>
      tone({ f, d: 0.17, at: i * 0.15, t: "triangle", v: 0.18 })
    );
  },
  smash(mult: number) {
    if (!enabled) return;
    tone({ f: 220 + mult * 46, f2: 130, d: 0.09, v: 0.11 });
  },
  life() {
    if (!enabled) return;
    [660, 880, 1320].forEach((f, i) => tone({ f, d: 0.09, at: i * 0.07, t: "triangle", v: 0.16 }));
  },
  glitch() {
    if (!enabled) return;
    tone({ f: 190, f2: 55, d: 0.26, t: "sawtooth", v: 0.13 });
  },
  move() {
    if (!enabled) return;
    tone({ f: 520, d: 0.04, v: 0.05 });
  },
  lock() {
    if (!enabled) return;
    tone({ f: 784, d: 0.08 });
    tone({ f: 1175, d: 0.14, at: 0.08 });
  },
};
