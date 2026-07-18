import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Discover" },
  { to: "/interchange", label: "Interchanges" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-ink-rule bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2 focus-ring rounded">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-signal font-display text-sm font-bold text-ink">
            DS
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-paper">
            Dilli Safar
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `focus-ring rounded-sm px-4 py-2 font-mono text-sm uppercase tracking-wide transition-colors ${
                  isActive
                    ? "bg-ink-panel text-signal"
                    : "text-slate-soft hover:text-paper"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
