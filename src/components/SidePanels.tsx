import { useEffect, useRef } from "react";
import type { HighScore } from "../lib/store";
import { fmt, HALL_SIZE } from "../lib/store";
import {
  BoltIcon,
  CoinIcon,
  KeyIcon,
  MixerIcon,
  PadIcon,
  SpeakerOffIcon,
  SpeakerOnIcon,
  StickIcon,
  TrophyIcon,
} from "./icons";

export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function PanelTitle({ text }: { text: string }) {
  return (
    <h2 className="flex items-center gap-2.5 font-display text-[10px] tracking-widest text-amber">
      <span className="inline-block h-2 w-2 bg-amber" aria-hidden="true" />
      {text}
    </h2>
  );
}

/* ---------------- how to ---------------- */

const STEPS = [
  {
    icon: KeyIcon,
    tint: "text-cyan border-cyan/50",
    title: "MASH ANY KEY",
    body: "Every keypress drops a coin into the slot. So does clicking the screen.",
  },
  {
    icon: StickIcon,
    tint: "text-cherry border-cherry/50",
    title: "HIT START",
    body: "Burns one credit and boots your save back up from Checkpoint 7-3.",
  },
  {
    icon: PadIcon,
    tint: "text-amber border-amber/50",
    title: "SMASH THE PAD",
    body: "Rack up points. Every 10 smashes raises the multiplier and regrows a ship.",
  },
  {
    icon: SpeakerOnIcon,
    tint: "text-lime border-lime/50",
    title: "M FOR SOUND",
    body: "Chiptune blips on or off — the cabinet hums either way.",
  },
];

export function HowToPanel() {
  return (
    <aside className="panel chamfer h-full p-4 sm:p-5">
      <PanelTitle text="HOW TO CONTINUE" />
      <ol className="mt-4 space-y-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="group flex gap-3">
            <span
              className={`flex h-10 w-10 flex-none items-center justify-center border-2 bg-pit ${s.tint} transition-transform duration-150 group-hover:-translate-y-0.5`}
            >
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-[9px] leading-relaxed text-fog">
                <span className="text-faint">{i + 1}.</span> {s.title}
              </p>
              <p className="mt-0.5 font-body text-lg leading-tight text-dim">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/* ---------------- top scores (side) ---------------- */

export function TopScoresPanel({
  scores,
  youRow,
}: {
  scores: HighScore[];
  youRow: number | null;
}) {
  return (
    <aside className="panel chamfer h-full p-4 sm:p-5">
      <PanelTitle text="TOP SCORES" />
      {scores.length === 0 ? (
        <p className="mt-4 font-body text-xl text-faint">
          NO RECORDS YET. BE THE FIRST NAME ON THE BOARD.
        </p>
      ) : (
        <ol className="mt-3">
          {scores.slice(0, 5).map((s, i) => (
            <li
              key={`${s.name}-${s.ts}-${i}`}
              className={`flex items-baseline justify-between gap-2 border-b border-edge/60 px-2 py-1.5 font-body text-xl ${
                youRow === i ? "blink bg-raise text-gold" : ""
              }`}
            >
              <span className="flex items-baseline gap-2.5">
                <span
                  className={`font-display text-[9px] ${
                    i === 0
                      ? "text-gold"
                      : i === 1
                        ? "text-cyan"
                        : i === 2
                          ? "text-cherry"
                          : "text-faint"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-fog">{s.name}</span>
              </span>
              <span className={youRow === i ? "text-gold" : "text-dim"}>{fmt(s.score)}</span>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-3 font-body text-base leading-tight text-faint">
        FULL BOARD LIVES IN THE HALL OF FAME ↓
      </p>
    </aside>
  );
}

/* ---------------- hall of fame (wide) ---------------- */

export function HallOfFame({
  scores,
  youRow,
}: {
  scores: HighScore[];
  youRow: number | null;
}) {
  const ref = useReveal<HTMLElement>();
  const rows = Array.from({ length: HALL_SIZE }).map((_, i) => scores[i] ?? null);
  return (
    <section ref={ref} className="reveal panel chamfer p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <h2 className="flex items-center gap-3 font-display text-xs text-gold sm:text-sm">
          <TrophyIcon className="h-5 w-5" /> HALL OF FAME
        </h2>
        <p className="font-body text-lg text-faint">
          SAVED TO THIS MACHINE · TOP {HALL_SIZE}
        </p>
      </div>
      <div className="mt-4 grid gap-x-10 sm:grid-cols-2">
        {rows.map((s, i) => (
          <div
            key={i}
            className={`flex items-baseline justify-between gap-3 border-b border-edge/60 px-2 py-2 font-body text-2xl transition-colors hover:bg-raise/60 ${
              youRow === i ? "blink bg-raise" : ""
            } ${!s ? "opacity-40" : ""}`}
          >
            <span className="flex items-baseline gap-3">
              <span
                className={`w-7 font-display text-[10px] ${
                  i === 0
                    ? "text-gold"
                    : i === 1
                      ? "text-cyan"
                      : i === 2
                        ? "text-cherry"
                        : "text-faint"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={s ? "text-fog" : "text-faint"}>{s ? s.name : "———"}</span>
              {youRow === i && (
                <span className="font-display text-[8px] text-gold">◄ YOU</span>
              )}
            </span>
            <span className={s ? "text-dim" : "text-faint"}>
              {s ? fmt(s.score) : "·······"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- operator menu ---------------- */

type OperatorProps = {
  coinsSession: number;
  allTimeCoins: number;
  continues: number;
  best: number;
  soundOn: boolean;
  onToggleSound: () => void;
};

export function OperatorPanel({
  coinsSession,
  allTimeCoins,
  continues,
  best,
  soundOn,
  onToggleSound,
}: OperatorProps) {
  const ref = useReveal<HTMLElement>();
  const stats = [
    {
      icon: CoinIcon,
      label: "COINS THIS SESSION",
      value: String(coinsSession).padStart(2, "0"),
      tint: "text-gold",
    },
    {
      icon: StickIcon,
      label: "CONTINUES USED",
      value: String(continues).padStart(2, "0"),
      tint: "text-cherry",
    },
    {
      icon: BoltIcon,
      label: "ALL-TIME COINS",
      value: String(allTimeCoins).padStart(4, "0"),
      tint: "text-cyan",
    },
    {
      icon: TrophyIcon,
      label: "MACHINE BEST",
      value: fmt(best),
      tint: "text-amber",
    },
  ];
  return (
    <section ref={ref} className="reveal panel chamfer p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 font-display text-xs text-cyan sm:text-sm">
          <MixerIcon className="h-5 w-5" /> OPERATOR MENU
        </h2>
        <p className="font-body text-lg text-faint">DOOR KEY NOT REQUIRED</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {stats.map((st) => (
          <div
            key={st.label}
            className="border-2 border-edge bg-pit p-3 transition-colors duration-150 hover:border-edge2"
          >
            <st.icon className={`h-4 w-4 ${st.tint}`} />
            <p className="mt-2 font-display text-[8px] leading-relaxed text-faint">
              {st.label}
            </p>
            <p className="font-body text-3xl leading-none text-fog">{st.value}</p>
          </div>
        ))}
      </div>
      <button
        className="mt-3 flex w-full items-center justify-between border-2 border-edge bg-pit px-3 py-2.5 transition-colors duration-150 hover:border-edge2"
        onClick={(e) => {
          e.currentTarget.blur();
          onToggleSound();
        }}
        aria-pressed={soundOn}
      >
        <span className="flex items-center gap-2.5 font-display text-[8px] tracking-widest text-dim">
          {soundOn ? (
            <SpeakerOnIcon className="h-4 w-4 text-lime" />
          ) : (
            <SpeakerOffIcon className="h-4 w-4 text-cherry" />
          )}
          CABINET SOUND
        </span>
        <span
          className={`relative inline-block h-5 w-11 border-2 ${
            soundOn ? "border-lime" : "border-edge2"
          }`}
        >
          <span
            className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 transition-all duration-150 ${
              soundOn ? "left-[calc(100%-0.875rem)] bg-lime" : "left-0.5 bg-faint"
            }`}
          />
        </span>
      </button>
    </section>
  );
}

/* ---------------- ticker ---------------- */

const TICKER_ITEMS = [
  "INSERT COIN",
  "99 SECONDS TO DECIDE",
  "NO REFUNDS",
  "HIGH SCORES LIVE ON THIS MACHINE",
  "SMASH RESPONSIBLY",
  "M = SOUND",
  "CHECKPOINT 7-3 AWAITS",
  "GLITCH STORM EVERY 7 SECONDS",
];

export function Ticker() {
  const row = TICKER_ITEMS.join("  ▸▸  ");
  return (
    <div className="relative z-10 overflow-hidden border-t-2 border-edge bg-pit py-2.5">
      <div className="ticker-track flex whitespace-nowrap font-display text-[9px] tracking-widest text-amber/90">
        <span className="px-4">{row}  ▸▸  </span>
        <span className="px-4" aria-hidden="true">
          {row}  ▸▸{" "}
        </span>
      </div>
    </div>
  );
}
