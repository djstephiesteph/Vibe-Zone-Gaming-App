import type { ReactNode } from "react";

interface RoomStageProps {
  wallGradient: string;
  floorGradient: string;
  grimeOpacity?: number;
  tiltUp?: boolean; // Lighting: it's a ceiling, so the trapezoid flips
  children: ReactNode; // absolutely positioned items, left/top in 0-100 room %
}

// One zone = one room. Back wall in the zone's own colors, plus a
// perspective floor (trapezoid: narrow at the wall, wide up front) so the
// room reads as having depth. No real 3D transforms — that keeps it solid
// in iOS/Android WebViews, and every CSS animation still works on the
// children. Items get a depth scale from their y (see depthScale) so
// things further back look smaller.
export default function RoomStage({ wallGradient, floorGradient, grimeOpacity = 0, tiltUp, children }: RoomStageProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-haze/20"
      style={{ aspectRatio: "4 / 5", background: wallGradient }}
    >
      <div
        className="absolute inset-x-0"
        style={{
          [tiltUp ? "top" : "bottom"]: 0,
          height: "58%",
          background: floorGradient,
          clipPath: tiltUp
            ? "polygon(0% 0%, 100% 0%, 82% 100%, 18% 100%)"
            : "polygon(18% 0%, 82% 0%, 100% 100%, 0% 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: grimeOpacity * 0.5,
          background: "repeating-linear-gradient(135deg, rgba(90,80,60,0.25) 0 2px, transparent 2px 14px)",
          mixBlendMode: "multiply",
        }}
      />
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

export function depthScale(y: number): number {
  return 0.65 + 0.35 * (y / 100);
}
