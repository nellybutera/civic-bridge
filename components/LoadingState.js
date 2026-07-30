"use client";

import { useEffect, useState } from "react";

// The API is a Render free-tier instance that sleeps after ~15 min idle —
// a cold request can take up to ~2 minutes. A GitHub Actions cron pings it
// every 10 min to keep this rare, but this message covers the case it isn't.
export default function LoadingState({ label = "Loading" }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-indigo" />
      <p className="mt-4 text-sm text-charcoal/60">{label}…</p>
      {slow && (
        <p className="mt-3 text-xs text-charcoal/40">
          The backend is a free-tier server that sleeps when idle — waking it
          up can take up to a couple of minutes. Thanks for your patience.
        </p>
      )}
    </div>
  );
}
