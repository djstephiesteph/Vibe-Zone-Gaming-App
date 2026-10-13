import { useCallback, useEffect, useRef, useState } from "react";
import type { MiniGameId } from "../types";
import { coinsForStars } from "../data/levels";

type Stars = 1 | 2 | 3;
interface GameProps {
  level: number;
  onDone: (stars: Stars | 0) => void;
}

const GAMES: { id: MiniGameId; name: string; icon: string; blurb: string }[] = [
  { id: "beat", name: "Beat Tap", icon: "🥁", blurb: "Tap the lit pad before it fades." },
  { id: "mixer", name: "Cocktail Mixer", icon: "🍸", blurb: "Repeat the VIP's drink order." },
  { id: "lights", name: "Light Show", icon: "💡", blurb: "Tap the colour the rig calls for." },
];
const MAX_LEVEL = 20;

const starsFromMistakes = (m: number): Stars => (m === 0 ? 3 : m <= 2 ? 2 : 1);

function BeatTap({ level, onDone }: GameProps) {
  const total = 8 + level;
  const window = Math.max(450, 1100 - level * 35);
  const [lit, setLit] = useState<number | null>(null);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const litRef = useRef<number | null>(null);
  const spawned = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (litRef.current !== null) setMisses((m) => m + 1);
      if (spawned.current >= total) {
        litRef.current = null;
        setLit(null);
        clearInterval(id);
        return;
      }
      spawned.current += 1;
      litRef.current = Math.floor(Math.random() * 4);
      setLit(litRef.current);
    }, window);
    return () => clearInterval(id);
  }, [total, window]);

  useEffect(() => {
    if (hits + misses >= total) {
      const ratio = hits / total;
      onDone(ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0);
    }
  }, [hits, misses, total, onDone]);

  const tap = (i: number) => {
    if (litRef.current === i) {
      litRef.current = null;
      setLit(null);
      setHits((h) => h + 1);
    } else {
      setMisses((m) => m + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-haze">Hits {hits} / {total}</p>
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`h-24 rounded-xl border ${lit === i ? "border-cyan bg-cyan shadow-neon" : "border-haze/30 bg-ink"}`}
          />
        ))}
      </div>
    </div>
  );
}

const DRINKS = ["🍋", "🍓", "🫐", "🍏"];

function CocktailMixer({ level, onDone }: GameProps) {
  const length = 2 + Math.ceil(level / 2);
  const [seq] = useState(() => Array.from({ length }, () => Math.floor(Math.random() * 4)));
  const [showing, setShowing] = useState(true);
  const [flash, setFlash] = useState<number | null>(null);
  const [pos, setPos] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const step = Math.max(350, 750 - level * 20);

  const play = useCallback(() => {
    setShowing(true);
    seq.forEach((d, i) => {
      setTimeout(() => setFlash(d), 400 + i * step);
      setTimeout(() => setFlash(null), 400 + i * step + step * 0.6);
    });
    setTimeout(() => setShowing(false), 400 + seq.length * step);
  }, [seq, step]);

  useEffect(() => {
    play();
  }, [play]);

  const tap = (d: number) => {
    if (showing) return;
    if (seq[pos] === d) {
      if (pos + 1 === seq.length) onDone(starsFromMistakes(mistakes));
      else setPos(pos + 1);
    } else if (mistakes >= 3) {
      onDone(0);
    } else {
      setMistakes(mistakes + 1);
      setPos(0);
      play();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-haze">{showing ? "Watch the order…" : `Your turn: ${pos}/${seq.length}`}</p>
      <div className="grid grid-cols-2 gap-3">
        {DRINKS.map((icon, d) => (
          <button
            key={d}
            onClick={() => tap(d)}
            className={`h-24 rounded-xl border text-4xl ${flash === d ? "border-magenta bg-magenta/30 shadow-neon" : "border-haze/30"}`}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

const COLORS = ["#ff2bd6", "#22d3ee", "#facc15", "#4ade80"];

function LightShow({ level, onDone }: GameProps) {
  const needed = 6 + level;
  const [target, setTarget] = useState(0);
  const [cells, setCells] = useState<number[]>([0, 1, 2, 3]);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(Math.max(10, 28 - level));

  const shuffle = () => {
    setCells([0, 1, 2, 3].sort(() => Math.random() - 0.5));
    setTarget(Math.floor(Math.random() * 4));
  };

  useEffect(() => {
    shuffle();
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (correct >= needed) onDone(starsFromMistakes(mistakes));
    else if (timeLeft <= 0) onDone(0);
  }, [correct, timeLeft, needed, mistakes, onDone]);

  const tap = (c: number) => {
    if (c === target) setCorrect((n) => n + 1);
    else setMistakes((m) => m + 1);
    shuffle();
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-haze">
        Tap <span style={{ color: COLORS[target] }}>●</span> — {correct}/{needed} · {timeLeft}s
      </p>
      <div className="grid grid-cols-2 gap-3">
        {cells.map((c) => (
          <button key={c} onClick={() => tap(c)} className="h-24 rounded-xl" style={{ background: COLORS[c] }} />
        ))}
      </div>
    </div>
  );
}

const COMPONENTS: Record<MiniGameId, (p: GameProps) => JSX.Element> = {
  beat: BeatTap,
  mixer: CocktailMixer,
  lights: LightShow,
};

interface Props {
  levels: Partial<Record<MiniGameId, number>>;
  onWin: (id: MiniGameId, level: number, stars: Stars) => void;
  onExit: () => void;
}

export default function MiniGames({ levels, onWin, onExit }: Props) {
  const [active, setActive] = useState<{ id: MiniGameId; level: number; run: number } | null>(null);
  const [result, setResult] = useState<Stars | 0 | null>(null);

  const finish = useCallback(
    (stars: Stars | 0) => {
      if (!active) return;
      if (stars > 0) onWin(active.id, active.level, stars);
      setResult(stars);
    },
    [active, onWin],
  );

  if (active && result !== null) {
    return (
      <div className="flex flex-col items-center gap-4 pt-10 text-center">
        <p className="font-display text-2xl text-magenta">{result > 0 ? "Nice!" : "Try again"}</p>
        {result > 0 && <p>{"★".repeat(result)} · +{coinsForStars(result)} coins</p>}
        <button
          className="rounded-full bg-gradient-to-r from-magenta to-cyan px-6 py-2 font-display text-ink"
          onClick={() => {
            const next = result > 0 ? Math.min(active.level + 1, MAX_LEVEL) : active.level;
            setResult(null);
            setActive({ id: active.id, level: next, run: active.run + 1 });
          }}
        >
          {result > 0 ? "Next level" : "Retry"}
        </button>
        <button className="text-xs text-haze underline" onClick={() => { setResult(null); setActive(null); }}>
          Back to games
        </button>
      </div>
    );
  }

  if (active) {
    const Game = COMPONENTS[active.id];
    return (
      <div className="flex flex-col gap-4">
        <p className="font-display text-magenta">Level {active.level}</p>
        <Game key={active.run} level={active.level} onDone={finish} />
        <button className="text-xs text-haze underline" onClick={() => setActive(null)}>Quit</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="font-display text-magenta">Mini games</p>
      {GAMES.map((g) => {
        const unlocked = Math.min(levels[g.id] ?? 1, MAX_LEVEL);
        return (
          <div key={g.id} className="rounded-xl border border-haze/30 p-3">
            <p className="font-display">{g.icon} {g.name}</p>
            <p className="mb-2 text-xs text-haze">{g.blurb}</p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map((lv) => (
                <button
                  key={lv}
                  disabled={lv > unlocked}
                  onClick={() => setActive({ id: g.id, level: lv, run: 0 })}
                  className="h-8 w-8 rounded-full border border-cyan text-xs text-cyan disabled:border-haze/30 disabled:text-haze/30"
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <button className="text-xs text-haze underline" onClick={onExit}>Back to club</button>
    </div>
  );
}
