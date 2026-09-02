import type { Phase } from "../lib/store";
import { fmt } from "../lib/store";
import { CoinIcon, SpeakerOffIcon, SpeakerOnIcon } from "./icons";

type HudProps = {
  phase: Phase;
  score: number;
  best: number;
  credits: number;
  soundOn: boolean;
  onToggleSound: () => void;
};

const PHASE_META: Record<Phase, { text: string; cls: string }> = {
  attract: { text: "ATTRACT MODE", cls: "border-edge text-dim" },
  countdown: { text: "CONTINUE WINDOW", cls: "border-amber/70 text-amber" },
  boot: { text: "RESUMING RUN", cls: "border-cyan/70 text-cyan" },
  playing: { text: "RUN IN PROGRESS", cls: "border-lime/70 text-lime" },
  gameover: { text: "RUN LOST", cls: "border-cherry/70 text-cherry" },
  entry: { text: "RECORD ENTRY", cls: "border-gold/70 text-gold" },
};

export default function Hud({
  phase,
  score,
  best,
  credits,
  soundOn,
  onToggleSound,
}: HudProps) {
  const meta = PHASE_META[phase];
  return (
    <header className="panel chamfer relative z-10">
      <div className="flex justify-between gap-1.5 overflow-hidden border-b border-edge bg-pit px-3 py-1.5">
        {Array.from({ length: 42 }).map((_, i) => (
          <span
            key={i}
            className="bulb"
            style={{ animationDelay: `${(i % 2) * 0.75}s` }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
        <div>
          <p className="font-body text-base tracking-[0.28em] text-faint">
            NEONWORKS ARCADE SYSTEM · CABINET 07
          </p>
          <h1 className="glow-amber mt-1.5 font-display text-2xl leading-none text-amber sm:text-4xl">
            CONTINUE?
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`border-2 bg-pit px-3 py-2 font-display text-[8px] tracking-widest ${meta.cls}`}
          >
            {meta.text}
          </span>
          <button
            className="btn btn-ghost px-3 py-2.5"
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleSound();
            }}
            aria-pressed={soundOn}
            aria-label="Toggle cabinet sound (M)"
            title="Toggle sound (M)"
          >
            {soundOn ? (
              <SpeakerOnIcon className="h-4 w-4 text-cyan" />
            ) : (
              <SpeakerOffIcon className="h-4 w-4 text-cherry" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px border-t-2 border-edge bg-edge">
        <div className="bg-pit px-3 py-3 sm:px-6">
          <p className="blink font-display text-[9px] text-cherry">1UP</p>
          <p
            key={score}
            className="anim-pop mt-1 font-body text-2xl leading-none text-fog sm:text-4xl"
          >
            {fmt(score)}
          </p>
        </div>
        <div className="bg-pit px-3 py-3 text-center sm:px-6">
          <p className="font-display text-[9px] text-cyan">HI-SCORE</p>
          <p
            key={best}
            className="anim-pop mt-1 font-body text-2xl leading-none text-gold sm:text-4xl"
          >
            {fmt(best)}
          </p>
        </div>
        <div className="bg-pit px-3 py-3 text-right sm:px-6">
          <p className="font-display text-[9px] text-amber">CREDITS</p>
          <p
            key={credits}
            className="anim-pop mt-1 flex items-center justify-end gap-2 font-body text-2xl leading-none text-fog sm:text-4xl"
          >
            <CoinIcon className="h-4 w-4 text-gold sm:h-5 sm:w-5" />
            {credits}
          </p>
        </div>
      </div>
    </header>
  );
}
