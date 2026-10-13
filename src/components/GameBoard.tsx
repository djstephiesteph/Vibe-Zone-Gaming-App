import { useEffect, useMemo, useState } from "react";
import type { LevelConfig } from "../types";
import {
  areAdjacent,
  collapseAndRefill,
  findMatches,
  hasPossibleMove,
  makeBoard,
  reshuffle,
  swap,
  type Board,
} from "../game/match3";
import Tile from "./Tile";
import { coinsForStars } from "../data/levels";

interface GameBoardProps {
  levelIndex: number;
  config: LevelConfig;
  onExit: () => void;
  onComplete: (stars: 1 | 2 | 3) => void;
}

const POINTS_PER_TILE = 10;

function starsFor(score: number, target: number): 1 | 2 | 3 {
  if (score >= target * 1.5) return 3;
  if (score >= target * 1.15) return 2;
  return 1;
}

export default function GameBoard({ levelIndex, config, onExit, onComplete }: GameBoardProps) {
  const [board, setBoard] = useState<Board>(() => makeBoard(config.gridSize, config.noteKinds));
  const [selected, setSelected] = useState<number | null>(null);
  const [clearingSet, setClearingSet] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(config.moveLimit);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [message, setMessage] = useState<string>("Swap notes to match 3 in a row");

  const size = config.gridSize;

  useEffect(() => {
    if (status !== "playing") return;
    if (score >= config.targetScore) {
      setStatus("won");
      onComplete(starsFor(score, config.targetScore));
    } else if (movesLeft <= 0) {
      setStatus("lost");
    }
  }, [score, movesLeft, status, config.targetScore, onComplete]);

  async function resolveCascade(startBoard: Board) {
    let working = startBoard;
    let chain = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const groups = findMatches(working, size);
      if (groups.length === 0) break;
      chain += 1;

      const matchedIdx = new Set<number>();
      groups.forEach((g) => g.indices.forEach((i) => matchedIdx.add(i)));

      setClearingSet(matchedIdx);
      const gained = matchedIdx.size * POINTS_PER_TILE * chain;
      setScore((s) => s + gained);
      setMessage(chain > 1 ? `${chain}x chain! +${gained}` : `Nice! +${gained}`);

      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 220));

      working = collapseAndRefill(working, size, matchedIdx, config.noteKinds);
      setBoard(working);
      setClearingSet(new Set());
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 120));
    }

    if (!hasPossibleMove(working, size, config.noteKinds)) {
      setMessage("No moves left on the board — reshuffling the set");
      working = reshuffle(working, size, config.noteKinds);
      setBoard(working);
    }
    setBusy(false);
  }

  function handleTileClick(i: number) {
    if (busy || status !== "playing") return;

    if (selected === null) {
      setSelected(i);
      return;
    }
    if (selected === i) {
      setSelected(null);
      return;
    }
    if (!areAdjacent(size, selected, i)) {
      setSelected(i);
      return;
    }

    const attempt = swap(board, selected, i);
    const groups = findMatches(attempt, size);
    setSelected(null);

    if (groups.length === 0) {
      setMessage("That swap doesn't make a match — try again");
      return;
    }

    setBusy(true);
    setBoard(attempt);
    setMovesLeft((m) => m - 1);
    void resolveCascade(attempt);
  }

  const progressPct = useMemo(
    () => Math.min(100, Math.round((score / config.targetScore) * 100)),
    [score, config.targetScore],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-haze hover:text-bulb text-sm font-body">
          ← Club
        </button>
        <div className="text-right">
          <p className="font-display text-bulb text-sm">Set #{levelIndex}</p>
          <p className="text-haze text-xs font-body">Target {config.targetScore.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-plum/60 border border-haze/20 px-4 py-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-haze font-body">Score</p>
          <p className="font-display text-bulb text-lg">{score.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wide text-haze font-body">Moves</p>
          <p className="font-display text-lg" style={{ color: movesLeft <= 4 ? "#FF2E88" : "#F5B841" }}>
            {movesLeft}
          </p>
        </div>
      </div>

      <div className="h-2 w-full rounded-full bg-velvet overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-magenta to-cyan transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <p className="text-center text-xs text-haze font-body min-h-[1rem]">{message}</p>

      <div
        className="grid gap-1.5 sm:gap-2 mx-auto w-full max-w-sm"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0,1fr))` }}
      >
        {board.map((kind, i) => (
          <Tile
            key={i}
            kind={kind}
            selected={selected === i}
            clearing={clearingSet.has(i)}
            onClick={() => handleTileClick(i)}
          />
        ))}
      </div>

      {status === "won" && (
        <Overlay
          title="Set complete!"
          body={`+${coinsForStars(starsFor(score, config.targetScore))} coins — ${"★".repeat(starsFor(score, config.targetScore))}`}
          primaryLabel="Back to club"
          onPrimary={onExit}
        />
      )}
      {status === "lost" && (
        <Overlay
          title="Out of moves"
          body="This set didn't land. Give it another spin."
          primaryLabel="Retry"
          onPrimary={() => {
            setBoard(makeBoard(size, config.noteKinds));
            setScore(0);
            setMovesLeft(config.moveLimit);
            setStatus("playing");
            setMessage("Swap notes to match 3 in a row");
          }}
          secondaryLabel="Back to club"
          onSecondary={onExit}
        />
      )}
    </div>
  );
}

function Overlay({
  title,
  body,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  title: string;
  body: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/80 backdrop-blur-sm px-6">
      <div className="w-full max-w-xs rounded-2xl border border-magenta/40 bg-velvet p-6 text-center shadow-neon animate-popIn">
        <h3 className="font-display text-xl text-bulb">{title}</h3>
        <p className="mt-2 text-sm text-haze font-body">{body}</p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={onPrimary}
            className="rounded-full bg-magenta py-2.5 text-sm font-body font-bold text-ink"
          >
            {primaryLabel}
          </button>
          {secondaryLabel && onSecondary && (
            <button onClick={onSecondary} className="text-xs text-haze font-body underline">
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
