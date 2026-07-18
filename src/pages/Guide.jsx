import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TransitCard from "../components/TransitCard.jsx";
import { getMonument } from "../lib/api.js";

export default function Guide() {
  const { id } = useParams();
  const [monument, setMonument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getMonument(id)
      .then((data) => !cancelled && setMonument(data))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-line-red">{error}</p>
        <Link to="/" className="focus-ring mt-4 inline-block text-signal underline">
          Back to search
        </Link>
      </div>
    );
  }

  if (!monument) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center font-mono text-sm text-slate-soft">
        Loading guide...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        to="/"
        className="focus-ring font-mono text-xs uppercase tracking-wide text-slate-soft hover:text-paper"
      >
        &larr; Back to Discover
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-5">
        {/* Primary information panel */}
        <div className="lg:col-span-3">
          <span className="eyebrow">{monument.category}</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-paper sm:text-4xl">
            {monument.monument_name}
          </h1>
          <p className="mt-4 text-slate-soft">{monument.description}</p>

          {monument.aliases?.length > 0 && (
            <div className="mt-6">
              <div className="eyebrow">Also known as</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {monument.aliases.map((alias) => (
                  <span
                    key={alias}
                    className="rounded-full border border-ink-rule px-3 py-1 font-mono text-xs text-slate-soft"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Transit matrix card */}
        <div className="lg:col-span-2">
          <h2 className="eyebrow mb-3">Transit Matrix</h2>
          <TransitCard stations={monument.nearest_stations} />
        </div>
      </div>
    </div>
  );
}
