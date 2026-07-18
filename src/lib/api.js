// Falls back to the relative path (proxied to localhost:8000 by
// vite.config.js in dev) when VITE_API_BASE_URL isn't set.
const BASE = `${import.meta.env.VITE_API_BASE_URL || ""}/api/v1`;

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function searchMonuments(query) {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}`);
  return handle(res);
}

export async function nearbyMonuments(lat, lon, radius = 3) {
  const res = await fetch(`${BASE}/nearby?lat=${lat}&lon=${lon}&radius=${radius}`);
  return handle(res);
}

export async function getMonument(id) {
  const res = await fetch(`${BASE}/monuments/${id}`);
  return handle(res);
}

export async function listInterchanges() {
  const res = await fetch(`${BASE}/interchange`);
  return handle(res);
}

export async function getInterchange(slug) {
  const res = await fetch(`${BASE}/interchange/${slug}`);
  return handle(res);
}
