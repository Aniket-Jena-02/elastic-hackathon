import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { listInterchanges } from "../lib/api.js";
import { lineBgClass, lineTextClass } from "../lib/lineColors.js";

export default function Interchange() {
  const [hubs, setHubs] = useState([]);
  const [activeHub, setActiveHub] = useState(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    listInterchanges()
      .then((data) => {
        setHubs(data);
        if (data.length > 0) setActiveHub(data[0]);
      })
      .catch((err) => setError(err.message));
  }, []);

  function selectHub(hub) {
    setActiveHub(hub);
    setStep(0);
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-line-red">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <span className="eyebrow">Junction Hubs</span>
      <h1 className="mt-2 font-display text-3xl font-bold text-paper sm:text-4xl">
        Interchange Walkthroughs
      </h1>
      <p className="mt-3 max-w-2xl text-slate-soft">
        Step-by-step guides for switching platforms at Delhi's busiest,
        most chaotic interchange stations.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {hubs.map((hub) => (
          <button
            key={hub.station_name}
            onClick={() => selectHub(hub)}
            className={`focus-ring rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              activeHub?.station_name === hub.station_name
                ? "border-signal bg-signal/15 text-signal"
                : "border-ink-rule text-slate-soft hover:text-paper"
            }`}
          >
            {hub.station_name}
          </button>
        ))}
      </div>

      {activeHub && (
        <div className="mt-10">
          <div className="flex items-center gap-2">
            {activeHub.lines.map((line) => (
              <span key={line} className={`chip ${lineBgClass(line)}/15 ${lineTextClass(line)}`}>
                {line} Line
              </span>
            ))}
          </div>

          {/* Step progress rail — order genuinely matters here (a real
              sequence of physical actions), so numbering is meaningful. */}
          <div className="mt-6 flex items-center gap-2">
            {activeHub.steps.map((s, i) => (
              <div key={s.step} className="flex flex-1 items-center gap-2">
                <button
                  onClick={() => setStep(i)}
                  className={`focus-ring flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors ${
                    i === step
                      ? "bg-signal text-ink"
                      : i < step
                      ? "bg-ink-rule text-paper"
                      : "border border-ink-rule text-slate-soft"
                  }`}
                >
                  {s.step}
                </button>
                {i < activeHub.steps.length - 1 && (
                  <div className="route-strip flex-1 text-ink-rule" />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeHub.station_name}-${step}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-6 rounded-xl border border-ink-rule bg-ink-panel p-6"
            >
              <div className="eyebrow">Step {activeHub.steps[step].step} of {activeHub.steps.length}</div>
              <p className="mt-2 text-lg text-paper">
                {activeHub.steps[step].instruction}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="focus-ring rounded-full border border-ink-rule px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-slate-soft transition-colors hover:text-paper disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setStep((s) => Math.min(activeHub.steps.length - 1, s + 1))
              }
              disabled={step === activeHub.steps.length - 1}
              className="focus-ring rounded-full border border-signal px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-signal transition-colors disabled:opacity-30"
            >
              Next Step
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
