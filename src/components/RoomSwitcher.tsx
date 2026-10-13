import { ZONES } from "../data/zones";

interface RoomSwitcherProps {
  viewedZone: string;
  activeZone: string | null;
  clearedZoneSet: Set<string>;
  onSelect: (zoneName: string) => void;
}

// Walk into any room you've reached (finished rooms + the one under
// construction). Later rooms stay locked until their turn.
export default function RoomSwitcher({ viewedZone, activeZone, clearedZoneSet, onSelect }: RoomSwitcherProps) {
  const activeOrder = activeZone ? (ZONES.find((z) => z.name === activeZone)?.order ?? 1) : ZONES.length + 1;
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
      {ZONES.map((z) => {
        const reached = z.order <= activeOrder;
        const done = clearedZoneSet.has(z.name);
        const viewed = viewedZone === z.name;
        return (
          <button
            key={z.name}
            onClick={() => reached && onSelect(z.name)}
            disabled={!reached}
            className="shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 font-body text-[11px]"
            style={{
              borderColor: viewed ? z.theme.accent : reached ? "rgba(123,108,168,0.3)" : "rgba(123,108,168,0.1)",
              background: viewed ? "rgba(255,255,255,0.08)" : reached ? "rgba(46,27,78,0.5)" : "rgba(46,27,78,0.2)",
              color: viewed ? "#FFF3D6" : reached ? "#7B6CA8" : "rgba(123,108,168,0.35)",
            }}
          >
            {done ? "✅ " : reached ? "" : "🔒 "}
            {z.name}
          </button>
        );
      })}
    </div>
  );
}
