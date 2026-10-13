import { NOTE_GLYPHS } from "../game/match3";

interface TileProps {
  kind: number;
  selected: boolean;
  clearing: boolean;
  onClick: () => void;
}

const TILE_STYLES: Record<number, string> = {
  0: "bg-magenta/20 text-magenta border-magenta/50",
  1: "bg-cyan/20 text-cyan border-cyan/50",
  2: "bg-gold/20 text-gold border-gold/50",
  3: "bg-haze/20 text-haze border-haze/60",
  4: "bg-[#FF7A45]/20 text-[#FF7A45] border-[#FF7A45]/50",
  5: "bg-[#4EE0A0]/20 text-[#4EE0A0] border-[#4EE0A0]/50",
};

export default function Tile({ kind, selected, clearing, onClick }: TileProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Tile ${NOTE_GLYPHS[kind]}`}
      className={[
        "aspect-square w-full rounded-xl border text-[clamp(1rem,4vw,1.6rem)]",
        "flex items-center justify-center transition-all duration-150 select-none",
        TILE_STYLES[kind] ?? TILE_STYLES[0],
        selected ? "scale-95 ring-2 ring-bulb shadow-neon" : "hover:scale-[1.03]",
        clearing ? "opacity-0 scale-50" : "opacity-100 animate-popIn",
      ].join(" ")}
    >
      {NOTE_GLYPHS[kind]}
    </button>
  );
}
