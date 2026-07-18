import { useState } from "react";

const CATEGORIES = [
  { key: "Historical", label: "Historical", emoji: "\ud83c\udff0" },
  { key: "Shopping", label: "Shopping", emoji: "\ud83d\udecd\ufe0f" },
  { key: "Food", label: "Food", emoji: "\ud83c\udf5b" },
  { key: "Nearby", label: "Nearby", emoji: "\ud83d\udccd" },
];

export default function SearchBar({
  value,
  onChange,
  activeCategory,
  onCategoryChange,
  onUseLocation,
  locationStatus,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        className={`flex items-center gap-3 rounded-xl border bg-ink-panel px-4 py-3 transition-colors ${
          focused ? "border-signal" : "border-ink-rule"
        }`}
      >
        <span className="font-mono text-slate-soft">{"\u2315"}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search 'CP', 'Qutub Minar', 'ISBT'..."
          className="focus-ring w-full bg-transparent font-body text-paper placeholder:text-slate-soft"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() =>
              onCategoryChange(activeCategory === cat.key ? null : cat.key)
            }
            className={`focus-ring rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              activeCategory === cat.key
                ? "border-signal bg-signal/15 text-signal"
                : "border-ink-rule text-slate-soft hover:text-paper"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}

        <button
          onClick={onUseLocation}
          className="focus-ring rounded-full border border-ink-rule px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-slate-soft transition-colors hover:text-paper"
        >
          {locationStatus === "loading" ? "Locating..." : "Use Live Location"}
        </button>
      </div>
    </div>
  );
}
