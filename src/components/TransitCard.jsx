import { lineBgClass, lineBorderClass, lineTextClass } from "../lib/lineColors";

/**
 * Signature "route strip" element: renders one nearest-station entry as a
 * color-coded transit matrix row, matching the DMRC line's own color theme.
 */
function StationRow({ station, isPrimary }) {
  return (
    <div
      className={`rounded-lg border bg-ink-panel/60 p-4 ${
        isPrimary ? lineBorderClass(station.line_color) : "border-ink-rule"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${lineBgClass(station.line_color)}`} />
          <span className="font-display text-base font-bold text-paper">
            {station.station_name}
          </span>
        </div>
        <span className={`chip ${lineBgClass(station.line_color)}/15 ${lineTextClass(station.line_color)}`}>
          {station.line_color} Line
        </span>
      </div>

      <div className={`route-strip my-3 ${lineTextClass(station.line_color)}`} />

      <div className="grid grid-cols-3 gap-3 font-mono text-xs text-slate-soft">
        <div>
          <div className="eyebrow">Exit Gate</div>
          <div className="mt-1 text-sm text-paper">{station.best_exit_gate}</div>
        </div>
        <div>
          <div className="eyebrow">Walk Time</div>
          <div className="mt-1 text-sm text-paper">{station.walking_time_mins} min</div>
        </div>
        <div>
          <div className="eyebrow">Distance</div>
          <div className="mt-1 text-sm text-paper">{station.distance_km} km</div>
        </div>
      </div>
    </div>
  );
}

export default function TransitCard({ stations = [] }) {
  if (stations.length === 0) {
    return (
      <div className="rounded-lg border border-ink-rule bg-ink-panel/60 p-4 text-sm text-slate-soft">
        No transit data available for this location yet.
      </div>
    );
  }

  const [fastest, ...rest] = [...stations].sort(
    (a, b) => a.walking_time_mins - b.walking_time_mins
  );

  return (
    <div className="space-y-3">
      <div className="eyebrow">Fastest route</div>
      <StationRow station={fastest} isPrimary />
      {rest.length > 0 && (
        <>
          <div className="eyebrow pt-2">Alternate stations</div>
          {rest.map((s, i) => (
            <StationRow key={`${s.station_name}-${i}`} station={s} />
          ))}
        </>
      )}
    </div>
  );
}
