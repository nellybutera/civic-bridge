"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function CivicContentPage() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    load();
  }, []);

  function load() {
    setError("");
    setContent(null);
    api
      .getContent()
      .then(setContent)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Couldn't reach the server."));
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!content) return <LoadingState label="Loading civic content" />;

  const categories = ["All", ...new Set(content.map((c) => c.category))];
  const visible = filter === "All" ? content : content.filter((c) => c.category === filter);

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Civic Content</p>
      <h1 className="mt-2 font-display text-3xl italic text-indigo">
        Governance, explained plainly
      </h1>
      <p className="mt-2 max-w-xl text-sm text-charcoal/60">
        Short reads pulled from public AU, EAC, and national parliamentary
        sources — no legal background required.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
              filter === c
                ? "border-indigo bg-indigo text-ivory"
                : "border-line text-charcoal/60 hover:border-indigo/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {visible.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id} className="rounded-xl border border-line bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-forest">
                    {item.category}
                  </span>
                  <h2 className="mt-1 font-display text-xl italic text-indigo">{item.title}</h2>
                  <p className="mt-2 text-sm text-charcoal/70">{item.summary}</p>
                </div>
                <span className="whitespace-nowrap font-mono text-xs text-charcoal/40">
                  {item.readMinutes} min
                </span>
              </div>
              {open && (
                <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-charcoal/80">
                  {item.body}
                </p>
              )}
              <button
                onClick={() => setOpenId(open ? null : item.id)}
                className="mt-4 text-sm font-medium text-indigo underline"
              >
                {open ? "Show less" : "Read more"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
