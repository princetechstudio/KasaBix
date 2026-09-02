import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hud from "./components/Hud";
import Stage from "./components/Stage";
import {
  HallOfFame,
  HowToPanel,
  OperatorPanel,
  Ticker,
  TopScoresPanel,
} from "./components/SidePanels";
import { sfx } from "./lib/sound";
import {
  insertScore,
  loadNumber,
  loadScores,
  qualifies,
  saveNumber,
  saveScores,
} from "./lib/store";
import type { HighScore, Phase } from "./lib/store";

const START_COUNT = 99;

export default function App() {
  const [phase, setPhase] = useState<Phase>("attract");
  const [count, setCount] = useState(START_COUNT);
  const [credits, setCredits] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [smashes, setSmashes] = useState(0);
  const [coinsSession, setCoinsSession] = useState(0);
  const [allTimeCoins, setAllTimeCoins] = useState(() => loadNumber("nw.coins", 4811));
  const [continues, setContinues] = useState(0);
  const [scores, setScores] = useState<HighScore[]>(() => loadScores());
  const [pendingScore, setPendingScore] = useState(0);
  const [youRow, setYouRow] = useState<number | null>(null);
  const [coinFx, setCoinFx] = useState(0);
  const [flashFx, setFlashFx] = useState(0);
  const [shakeFx, setShakeFx] = useState(0);
  const [soundOn, setSoundOn] = useState(sfx.enabled);
  const lastCoinKey = useRef(0);

  const mult = Math.min(8, 1 + Math.floor(smashes / 10));
  const best = Math.max(scores.length ? scores[0].score : 0, phase === "playing" ? score : 0);

  /* ---- lifecycle ---- */

  /* keep a live ref to phase for stable callbacks */
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const endRun = useCallback(() => {
    setPhase("gameover");
    sfx.over();
  }, []);

  const resetToCountdown = useCallback(() => {
    setCount(START_COUNT);
    setPhase("countdown");
  }, []);

  const proceedFromGameOver = useCallback(() => {
    if (phaseRef.current !== "gameover") return;
    if (qualifies(scores, score)) {
      setPendingScore(score);
      setPhase("entry");
    } else {
      resetToCountdown();
    }
  }, [scores, score, resetToCountdown]);

  const insertCoin = useCallback(() => {
    setCredits((c) => Math.min(9, c + 1));
    setCoinsSession((n) => n + 1);
    setAllTimeCoins((n) => {
      const v = n + 1;
      saveNumber("nw.coins", v);
      return v;
    });
    setCoinFx((n) => n + 1);
    setYouRow(null);
    sfx.coin();
  }, []);

  const coinAction = useCallback(() => {
    if (phaseRef.current === "countdown" || phaseRef.current === "gameover") {
      insertCoin();
    }
  }, [insertCoin]);

  const start = useCallback(() => {
    if (phase !== "countdown" || credits < 1) return;
    setCredits((c) => c - 1);
    setContinues((n) => n + 1);
    setScore(0);
    setSmashes(0);
    setLives(3);
    setFlashFx((n) => n + 1);
    sfx.start();
    setPhase("boot");
  }, [phase, credits]);

  const smash = useCallback(() => {
    if (phase !== "playing") return;
    const next = smashes + 1;
    setSmashes(next);
    setScore((s) => s + 150 * mult);
    sfx.smash(mult);
    if (next % 10 === 0) {
      setLives((l) => Math.min(3, l + 1));
      sfx.life();
    }
  }, [phase, smashes, mult]);

  const entryDone = useCallback(
    (name: string) => {
      const { list, index } = insertScore(scores, {
        name,
        score: pendingScore,
        ts: Date.now(),
      });
      saveScores(list);
      setScores(list);
      setYouRow(index);
      resetToCountdown();
    },
    [scores, pendingScore, resetToCountdown]
  );

  const toggleSound = useCallback(() => setSoundOn(sfx.toggle()), []);

  /* ---- timers ---- */

  useEffect(() => {
    if (phase !== "attract") return;
    const t = window.setTimeout(() => setPhase("countdown"), 2200);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "countdown" || count <= 0) return;
    const urgent = count <= 10;
    const t = window.setTimeout(() => {
      sfx.tick(urgent);
      setCount((c) => c - 1);
    }, urgent ? 480 : 820);
    return () => window.clearTimeout(t);
  }, [phase, count]);

  useEffect(() => {
    if (phase === "countdown" && count <= 0) endRun();
  }, [phase, count, endRun]);

  useEffect(() => {
    if (phase !== "boot") return;
    const t = window.setTimeout(() => setPhase("playing"), 2600);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    const iv = window.setInterval(() => {
      setScore((s) => s + (Math.floor(Math.random() * 3) + 1) * 25 * mult);
    }, 420);
    return () => window.clearInterval(iv);
  }, [phase, mult]);

  useEffect(() => {
    if (phase !== "playing") return;
    const iv = window.setInterval(() => {
      sfx.glitch();
      setShakeFx((n) => n + 1);
      setLives((l) => l - 1);
    }, 7000);
    return () => window.clearInterval(iv);
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && lives <= 0) endRun();
  }, [phase, lives, endRun]);

  useEffect(() => {
    if (phase !== "gameover") return;
    const t = window.setTimeout(proceedFromGameOver, 2400);
    return () => window.clearTimeout(t);
  }, [phase, proceedFromGameOver]);

  /* ---- global keyboard ---- */

  const keyRef = useRef<(e: KeyboardEvent) => void>(() => {});
  keyRef.current = (e: KeyboardEvent) => {
    const p = phaseRef.current;
    if (p === "entry") return; // initials entry owns the keyboard
    if (e.key === "m" || e.key === "M") {
      toggleSound();
      return;
    }
    if (p === "countdown") {
      if (e.key === "Enter") {
        e.preventDefault();
        start();
        return;
      }
      if (e.key === " ") e.preventDefault();
      const now = Date.now();
      if (now - lastCoinKey.current > 320) {
        lastCoinKey.current = now;
        insertCoin();
      }
    } else if (p === "playing") {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        smash();
      } else if (e.key === "e" || e.key === "E") {
        endRun();
      }
    } else if (p === "gameover") {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        proceedFromGameOver();
      }
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => keyRef.current(e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 46 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 68,
        size: Math.random() > 0.78 ? 3 : 2,
        delay: Math.random() * 4,
        dur: 2.4 + Math.random() * 3.2,
        color: ["var(--color-cyan)", "var(--color-amber)", "var(--color-fog)"][i % 3],
      })),
    []
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden font-body text-fog">
      {/* ambient layers */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              background: s.color,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>
      <div className="glow-a" aria-hidden="true" />
      <div className="glow-b" aria-hidden="true" />
      <div className="grid-floor" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-4 px-3 pt-4 sm:px-5 sm:pt-6">
        <Hud
          phase={phase}
          score={score}
          best={best}
          credits={credits}
          soundOn={soundOn}
          onToggleSound={toggleSound}
        />

        <main className="grid gap-4 lg:grid-cols-[228px_minmax(0,1fr)_256px]">
          <div className="order-2 lg:order-1">
            <HowToPanel />
          </div>
          <div className="order-1 lg:order-2">
            <Stage
              phase={phase}
              count={count}
              credits={credits}
              score={score}
              mult={mult}
              lives={lives}
              smashes={smashes}
              coinFx={coinFx}
              flashFx={flashFx}
              shakeFx={shakeFx}
              pendingScore={pendingScore}
              onCoin={coinAction}
              onStart={start}
              onSmash={smash}
              onEject={endRun}
              onProceed={proceedFromGameOver}
              onEntryDone={entryDone}
              onScreenTap={coinAction}
            />
          </div>
          <div className="order-3">
            <TopScoresPanel scores={scores} youRow={youRow} />
          </div>
        </main>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_330px]">
          <HallOfFame scores={scores} youRow={youRow} />
          <OperatorPanel
            coinsSession={coinsSession}
            allTimeCoins={allTimeCoins}
            continues={continues}
            best={best}
            soundOn={soundOn}
            onToggleSound={toggleSound}
          />
        </div>

        <p className="pb-3 text-center font-body text-base text-faint">
          © 1987 NEONWORKS · EMULATED IN YOUR BROWSER · NO QUARTERS REQUIRED · SAVE FILES
          LIVE IN LOCALSTORAGE
        </p>
      </div>

      <Ticker />
    </div>
  );
}
