import { THEME_REGISTRY } from "../data/themes";

interface ThemePickerProps {
  onChoose: (themeId: string) => void;
}

export default function ThemePicker({ onChoose }: ThemePickerProps) {
  const playableThemes = THEME_REGISTRY.filter((theme) => theme.availability === "playable");
  const upcomingThemes = THEME_REGISTRY.filter((theme) => theme.availability === "coming_soon");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-bulb">Choose your opening vibe</h2>
        <p className="mt-1 font-body text-sm text-haze">
          Your first music identity shapes the crowd, visual accent, dance behavior, and event tone.
        </p>
      </div>

      <div className="grid gap-3">
        {playableThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChoose(theme.id)}
            className="rounded-2xl border border-haze/30 bg-plum/70 p-4 text-left transition hover:border-magenta/60 hover:bg-plum"
            style={{ boxShadow: `inset 0 0 0 1px ${theme.palette.accent}30` }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-lg text-bulb">{theme.shortLabel}</span>
              <span className="text-xl" aria-hidden="true">{theme.signage}</span>
            </div>
            <p className="font-body text-xs text-haze">{theme.description}</p>
            <p className="mt-2 font-body text-[11px] text-gold">Dance tone: {theme.danceFlavor}</p>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-haze/20 bg-ink/60 p-3">
        <p className="font-body text-[11px] uppercase tracking-wide text-haze">Upcoming room identities</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {upcomingThemes.map((theme) => (
            <span key={theme.id} className="rounded-full border border-haze/30 px-2.5 py-1 font-body text-[10px] text-haze">
              {theme.signage} {theme.shortLabel} (locked)
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
