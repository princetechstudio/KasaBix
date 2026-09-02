import { useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { Phase } from "../lib/store";
import { fmt } from "../lib/store";
import { sfx } from "../lib/sound";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CoinIcon,
  SaveIcon,
  ShipIcon,
} from "./icons";

const BOOT_LINES = [
  "> RESTORING PLAYER SAVE .......... OK",
  "> CHECKPOINT 7-3 «NEON GATE» ..... OK",
  "> REGENERATING WORLD SEED ........ OK",
  "> CALIBRATING CRT PHOSPHORS ...... OK",
  "> READY.",
];

const WAVES = [
  "WAVE 7-3 · NEON GATE — HOLD THE LINE",
  "GLITCH STORM INCOMING · SMASH TO CHARGE",
  "EVERY 10 SMASHES = +1 SHIP & +1 MULT",
  "THE GRID REMEMBERS YOUR NAME",
  "DON'T WATCH THE CLOCK · WATCH THE SCORE",
];

const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type StageProps = {
  phase: Phase;
  count: number;
  credits: number;
  score: number;
  mult: number;
  lives: number;
  smashes: number;
  coinFx: number;
  flashFx: number;
  shakeFx: number;
  pendingScore: number;
  onCoin: () => void;
  onStart: () => void;
  onSmash: () => void;
  onEject: () => void;
  onProceed: () => void;
  onEntryDone: (name: string) => void;
  onScreenTap: () => void;
};

export default function Stage(props: StageProps) {
  const { phase, coinFx, flashFx, shakeFx, onScreenTap } = props;
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (shakeFx === 0) return;
    setShaking(true);
    const t = window.setTimeout(() => setShaking(false), 400);
    return () => window.clearTimeout(t);
  }, [shakeFx]);

  const handleTap = (e: ReactMouseEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement | null;
    if (t && t.closest("button")) return; // let buttons handle themselves
    if (phase === "countdown" || phase === "gameover") onScreenTap();
  };

  return (
    <section
      aria-label="Arcade screen"
      className={`panel chamfer relative p-2.5 sm:p-3 ${shaking ? "anim-shake" : ""}`}
    >
      <div
        className="chamfer relative cursor-crosshair overflow-hidden border border-edge bg-pit"
        onClick={handleTap}
      >
        <div className="pointer-events-none absolute inset-0 z-30 crt-flicker scanlines" />
        <div className="pointer-events-none absolute inset-0 z-30 vignette" />
        <div className="pointer-events-none absolute inset-x-0 z-20 sweep" />

        <div className="relative z-10 flex min-h-[430px] flex-col items-center justify-center gap-5 px-4 py-9 text-center sm:min-h-[490px]">
          {phase === "attract" && <AttractView />}
          {phase === "countdown" && <CountdownView {...props} />}
          {phase === "boot" && <BootView />}
          {phase === "playing" && <PlayView {...props} />}
          {phase === "gameover" && <OverView score={props.score} />}
          {phase === "entry" && (
            <EntryView score={props.pendingScore} onDone={props.onEntryDone} />
          )}
        </div>

        {flashFx > 0 && (
          <div
            key={`flash-${flashFx}`}
            className="anim-flash pointer-events-none absolute inset-0 z-40 bg-fog"
          />
        )}
      </div>

      {/* bezel footer: speaker grille + plate + coin slot */}
      <div className="mt-2.5 flex items-center justify-between gap-3 px-1.5">
        <div className="flex items-end gap-1" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="w-1 bg-edge2"
              style={{
                height: `${6 + ((i * 5) % 3) * 3}px`,
                opacity: i % 2 ? 0.45 : 0.9,
              }}
            />
          ))}
        </div>
        <p className="hidden font-display text-[8px] tracking-widest text-faint xs:block sm:block">
          PVM-2790 · PHOSPHOR P22 · CAB 07
        </p>
        <div className="relative flex items-center gap-2">
          {coinFx > 0 && (
            <div
              key={`coin-${coinFx}`}
              className="anim-coin pointer-events-none absolute -top-7 right-2 z-40 text-gold"
            >
              <CoinIcon className="h-5 w-5" />
            </div>
          )}
          <span className="font-display text-[8px] text-dim">COIN</span>
          <span className="block h-4 w-9 border-2 border-edge2 bg-pit shadow-[inset_0_3px_5px_rgba(0,0,0,0.85)]" />
        </div>
      </div>
    </section>
  );
}

/* ---------------- attract ---------------- */

function AttractView() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-display text-[10px] tracking-widest text-cyan glow-cyan">
        NEONWORKS ARCADE SYSTEM
      </p>
      <p className="font-display text-4xl text-fog glow-white sm:text-6xl">88</p>
      <p className="blink font-body text-2xl text-dim">SELF TEST … OK</p>
      <p className="font-body text-lg text-faint">STAND BY</p>
    </div>
  );
}

/* ---------------- countdown ---------------- */

function CountdownView({ count, credits, onCoin, onStart }: StageProps) {
  const pct = Math.max(0, (count / 99) * 100);
  return (
    <>
      <p className="flex items-center justify-center gap-2 font-body text-lg text-dim sm:text-xl">
        <SaveIcon className="h-4 w-4 flex-none text-cyan" />
        SAVE FILE DETECTED — CHECKPOINT 7-3 «NEON GATE»
      </p>
      <h2 className="blink glow-amber font-display text-xl text-amber sm:text-3xl">
        CONTINUE?
      </h2>
      <div
        key={count}
        className={`anim-pop font-body text-[clamp(6.5rem,22vw,10.5rem)] leading-[0.8] ${
          count <= 10 ? "anim-pulse-red" : "glow-white text-fog"
        }`}
      >
        {String(count).padStart(2, "0")}
      </div>
      <div className="h-3 w-full max-w-xs border-2 border-edge bg-pit p-[2px]">
        <div
          className="h-full transition-[width] duration-300 ease-linear"
          style={{
            width: `${pct}%`,
            background: count <= 10 ? "var(--color-cherry)" : "var(--color-amber)",
          }}
        />
      </div>
      <p className="blink-fast font-body text-xl text-cyan">
        MASH ANY KEY — A COIN DROPS. CLICKING THE SCREEN WORKS TOO.
      </p>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
        <button
          className="btn btn-amber"
          onClick={(e) => {
            e.currentTarget.blur();
            onCoin();
          }}
        >
          <span className="flex items-center gap-2">
            <CoinIcon className="h-4 w-4" /> INSERT COIN
          </span>
        </button>
        <button
          className="btn btn-cherry"
          disabled={credits < 1}
          onClick={(e) => {
            e.currentTarget.blur();
            onStart();
          }}
        >
          PRESS START
          {credits > 0 ? ` · ${credits} CREDIT${credits > 1 ? "S" : ""}` : " · NEED COIN"}
        </button>
      </div>
      <p className="font-body text-lg text-faint">ENTER = START · M = SOUND</p>
    </>
  );
}

/* ---------------- boot ---------------- */

function BootView() {
  return (
    <div className="w-full max-w-md text-left">
      <p className="blink glow-cyan mb-5 text-center font-display text-sm text-cyan">
        CONTINUING
      </p>
      <div className="space-y-2 font-body text-xl text-lime sm:text-2xl">
        {BOOT_LINES.map((l, i) => (
          <p key={l} className="anim-rise" style={{ animationDelay: `${i * 0.42}s` }}>
            {l}
          </p>
        ))}
      </div>
      <div className="mt-6 h-4 border-2 border-edge bg-pit p-[3px]">
        <div className="anim-bar h-full bg-cyan" />
      </div>
      <p className="mt-2 text-right font-body text-lg text-dim">DO NOT POWER OFF</p>
    </div>
  );
}

/* ---------------- playing ---------------- */

function PlayView({ score, mult, lives, smashes, onSmash, onEject }: StageProps) {
  const [wave, setWave] = useState(0);
  useEffect(() => {
    const iv = window.setInterval(() => setWave((w) => w + 1), 2600);
    return () => window.clearInterval(iv);
  }, []);

  const tier =
    mult >= 7
      ? "anim-pulse-red"
      : mult >= 5
        ? "glow-amber text-amber"
        : mult >= 3
          ? "glow-cyan text-cyan"
          : "text-dim";

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-5">
      <div className="flex w-full items-start justify-between gap-3">
        <div className="text-left">
          <p className="font-display text-[8px] text-dim">SCORE</p>
          <p
            key={score}
            className="anim-pop glow-white font-body text-4xl leading-tight text-fog sm:text-5xl"
          >
            {fmt(score)}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1.5 pt-0.5">
          <p className="font-display text-[8px] text-dim">SHIPS</p>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <ShipIcon
                key={i}
                className={`h-5 w-5 ${i < lives ? "glow-lime text-lime" : "text-edge"}`}
              />
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-[8px] text-dim">MULT</p>
          <p className={`font-body text-4xl leading-tight sm:text-5xl ${tier}`}>×{mult}</p>
        </div>
      </div>

      <div className="relative">
        <button className="smash-btn" onClick={onSmash} aria-label="Smash for points">
          <span className="font-display text-sm text-[#3a0713]">SMASH</span>
        </button>
        {smashes > 0 && (
          <span
            key={smashes}
            className="anim-float-up pointer-events-none absolute -top-1 left-1/2 font-body text-3xl text-gold"
          >
            +{150 * mult}
          </span>
        )}
      </div>
      <p className="font-body text-xl leading-tight text-dim">
        SPACE / CLICK = SMASH · EVERY 10 SMASHES: +1 SHIP, +1 MULT
      </p>

      <div className="flex w-full items-center justify-between gap-3 border-t-2 border-edge pt-3.5">
        <p key={wave} className="anim-rise text-left font-body text-lg leading-tight text-cyan">
          {WAVES[wave % WAVES.length]}
        </p>
        <button
          className="btn btn-ghost flex-none"
          onClick={(e) => {
            e.currentTarget.blur();
            onEject();
          }}
        >
          EJECT (E)
        </button>
      </div>
    </div>
  );
}

/* ---------------- game over ---------------- */

function OverView({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <h2 className="anim-pulse-red font-display text-3xl sm:text-5xl">GAME OVER</h2>
      <p className="font-body text-2xl text-dim">THE GLITCH STORM TOOK THE LAST SHIP</p>
      <div className="border-2 border-edge bg-panel/70 px-8 py-4">
        <p className="font-display text-[9px] text-dim">FINAL SCORE</p>
        <p className="glow-amber mt-1 font-body text-6xl text-gold">{fmt(score)}</p>
      </div>
      <p className="blink font-body text-2xl text-cyan">PRESS ENTER</p>
    </div>
  );
}

/* ---------------- initials entry ---------------- */

function EntryView({
  score,
  onDone,
}: {
  score: number;
  onDone: (name: string) => void;
}) {
  const [pos, setPos] = useState(0);
  const [letters, setLetters] = useState<string[]>(["A", "A", "A"]);

  const nudgeAt = (i: number, d: number) => {
    sfx.move();
    setLetters((ls) =>
      ls.map((l, k) => (k === i ? AZ[(AZ.indexOf(l) + d + 26) % 26] : l))
    );
  };
  const movePos = (d: number) => {
    sfx.move();
    setPos((p) => Math.min(2, Math.max(0, p + d)));
  };
  const confirm = () => {
    sfx.lock();
    onDone(letters.join(""));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        nudgeAt(pos, 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        nudgeAt(pos, -1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        movePos(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        movePos(1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        confirm();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        sfx.move();
        const ch = e.key.toUpperCase();
        setLetters((ls) => ls.map((l, i) => (i === pos ? ch : l)));
        setPos((p) => Math.min(2, p + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="blink glow-amber font-display text-[10px] tracking-widest text-gold">
        ★ NEW RECORD ★
      </p>
      <p className="font-body text-2xl text-dim">
        SCORE LOCKED AT <span className="text-fog">{fmt(score)}</span> — CARVE YOUR INITIALS
      </p>
      <div className="flex items-center gap-2 sm:gap-3">
        {letters.map((ch, i) => (
          <button
            key={i}
            className={`flex flex-col items-center border-2 px-4 py-2 transition-colors sm:px-6 ${
              i === pos
                ? "border-amber bg-raise"
                : "border-edge bg-panel/60 hover:border-edge2"
            }`}
            onClick={() => {
              sfx.move();
              setPos(i);
            }}
            aria-label={`Initial slot ${i + 1}: ${ch}`}
          >
            <span
              role="button"
              tabIndex={-1}
              className="text-cyan hover:text-fog"
              onClick={(e) => {
                e.stopPropagation();
                setPos(i);
                nudgeAt(i, 1);
              }}
            >
              <ArrowUpIcon className="h-4 w-4" />
            </span>
            <span
              className={`my-1 font-display text-2xl sm:text-3xl ${
                i === pos ? "blink text-amber" : "text-fog"
              }`}
            >
              {ch}
            </span>
            <span
              role="button"
              tabIndex={-1}
              className="text-cyan hover:text-fog"
              onClick={(e) => {
                e.stopPropagation();
                setPos(i);
                nudgeAt(i, -1);
              }}
            >
              <ArrowDownIcon className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>
      <p className="font-body text-lg text-faint">ARROWS / A–Z TO PICK · ENTER TO LOCK</p>
      <button
        className="btn btn-amber"
        onClick={(e) => {
          e.currentTarget.blur();
          confirm();
        }}
      >
        LOCK IT IN
      </button>
    </div>
  );
}
