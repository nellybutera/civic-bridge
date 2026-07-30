// Lightweight localStorage wrapper. This app persists demo data client-side
// (see README for the production data-layer note) so it works with zero
// external services and can be deployed to Vercel with a single click.

export function readStore(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStore(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / serialization errors in the demo environment
  }
}
