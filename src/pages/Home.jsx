import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import useDebounce from "../hooks/useDebounce.js";
import { searchMonuments, nearbyMonuments } from "../lib/api.js";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");

  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data = debouncedQuery.trim()
          ? await searchMonuments(debouncedQuery)
          : await searchMonuments("a"); // broad seed query for the default feed
        if (!cancelled) setResults(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  async function handleUseLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation isn't supported in this browser.");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const data = await nearbyMonuments(latitude, longitude, 10);
          setResults(data);
          setCategory("Nearby");
          setLocationStatus("done");
        } catch (err) {
          setError(err.message);
          setLocationStatus("idle");
        }
      },
      () => {
        setError("Location access was denied.");
        setLocationStatus("idle");
      }
    );
  }

  const filtered = useMemo(() => {
    if (!category || category === "Nearby") return results;
    return results.filter((m) => m.category === category);
  }, [results, category]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <section className="flex flex-col items-center text-center">
        <span className="eyebrow mb-3">National Capital Region</span>
        <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight text-paper sm:text-5xl">
          Find it. Reach it. Exit the right gate.
        </h1>
        <p className="mt-4 max-w-xl text-slate-soft">
          Search any Delhi monument, market, or landmark in your own words —
          Dilli Safar maps it straight to the fastest metro route and the
          exact exit gate you need.
        </p>

        <div className="mt-10 w-full">
          <SearchBar
            value={query}
            onChange={setQuery}
            activeCategory={category}
            onCategoryChange={setCategory}
            onUseLocation={handleUseLocation}
            locationStatus={locationStatus}
          />
        </div>
      </section>

      <section className="mt-14">
        {error && (
          <p className="mb-4 rounded-lg border border-line-red/40 bg-line-red/10 px-4 py-3 text-sm text-line-red">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-center font-mono text-sm text-slate-soft">
            Searching...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center font-mono text-sm text-slate-soft">
            No matches. Try a different spelling or landmark.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <ResultCard key={m.id} monument={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ResultCard({ monument }) {
  const primaryStation = monument.nearest_stations?.[0];
  return (
    <Link
      to={`/guide/${monument.id}`}
      className="focus-ring group flex flex-col rounded-xl border border-ink-rule bg-ink-panel p-5 transition-colors hover:border-signal"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-paper group-hover:text-signal">
          {monument.monument_name}
        </h3>
        <span className="eyebrow shrink-0">{monument.category}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-slate-soft">
        {monument.description}
      </p>
      {primaryStation && (
        <div className="mt-4 flex items-center gap-2 font-mono text-xs text-slate-soft">
          <span>{primaryStation.station_name}</span>
          <span>&middot;</span>
          <span>{primaryStation.walking_time_mins} min walk</span>
          {typeof monument.distance_km === "number" && (
            <>
              <span>&middot;</span>
              <span>{monument.distance_km} km away</span>
            </>
          )}
        </div>
      )}
    </Link>
  );
}
