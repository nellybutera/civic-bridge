"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, permissionsFor } from "@/lib/auth-context";
import RequireAuth from "@/components/RequireAuth";
import CivicPulseBar from "@/components/CivicPulseBar";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { api, ApiError } from "@/lib/api";
import { getResults } from "@/lib/progress";

function moduleBreakdown(content, quizzes, results) {
  const categories = [...new Set(content.map((c) => c.category))];
  return categories.map((category) => {
    const quizIds = quizzes
      .filter((q) => content.find((c) => c.id === q.relatedContentId)?.category === category)
      .map((q) => q.id);
    const scores = quizIds
      .map((id) => results[id]?.scorePercent)
      .filter((v) => v !== undefined);
    const value = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;
    return { category, value, hasQuiz: quizIds.length > 0 };
  });
}

function CivicPulseCard({ completed, total, avgScore }) {
  return (
    <div className="rounded-xl bg-indigo p-6 text-ivory">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-gold">Your civic pulse</p>
      <p className="mt-2 font-display text-4xl italic">{avgScore}%</p>
      <p className="mt-1 text-sm text-ivory/60">average score across everything you&apos;ve attempted</p>
      <div className="mt-4">
        <CivicPulseBar value={avgScore} />
      </div>
      <p className="mt-3 font-mono text-xs text-ivory/50">
        {completed} of {total} quizzes completed
      </p>
    </div>
  );
}

function ModuleBreakdownCard({ breakdown }) {
  return (
    <div className="rounded-xl border border-line bg-white p-6">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal/50">By module</p>
      <div className="mt-4 flex flex-col gap-4">
        {breakdown.map((m) => (
          <div key={m.category}>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-sm font-medium text-indigo">{m.category}</span>
              {m.value === null ? (
                <span className="font-mono text-xs text-charcoal/40">
                  {m.hasQuiz ? "Not started" : "No quiz yet"}
                </span>
              ) : (
                <span className="font-mono text-xs text-charcoal/70">{m.value}%</span>
              )}
            </div>
            <CivicPulseBar value={m.value ?? 0} tone="forest" />
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickLinks({ counts }) {
  const items = [
    { href: "/civic-content", label: "Civic Content", detail: `${counts.content} short reads`, desc: "Read plain-language explainers" },
    { href: "/quizzes", label: "Quizzes", detail: `${counts.completed} of ${counts.quizzes} taken`, desc: "Test what you've learned" },
    { href: "/forum", label: "Forum", detail: `${counts.posts} posts`, desc: "Discuss with other youth" },
    { href: "/regional-tracker", label: "Regional Tracker", detail: `${counts.tracker} initiatives`, desc: "See integration progress" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="rounded-xl border border-line bg-white p-5 hover:border-indigo/40">
          <p className="font-mono text-[11px] uppercase tracking-wide text-forest">{i.detail}</p>
          <h3 className="mt-1 font-display italic text-indigo">{i.label}</h3>
          <p className="mt-1 text-xs text-charcoal/60">{i.desc}</p>
        </Link>
      ))}
    </div>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const perms = permissionsFor(user);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [results, setResults] = useState({});

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!user) return;
    getResults(user.id)
      .then(setResults)
      .catch(() => {});
  }, [user]);

  function load() {
    setError("");
    setData(null);
    Promise.all([api.getContent(), api.getQuizzes(), api.getTracker(), api.getForum()])
      .then(([content, quizzes, tracker, posts]) => setData({ content, quizzes, tracker, posts }))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Couldn't reach the server."));
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return <LoadingState label="Loading your dashboard" />;

  const completed = Object.keys(results).length;
  const avgScore = completed
    ? Math.round(Object.values(results).reduce((s, r) => s + r.scorePercent, 0) / completed)
    : 0;
  const breakdown = moduleBreakdown(data.content, data.quizzes, results);
  const counts = {
    content: data.content.length,
    quizzes: data.quizzes.length,
    completed,
    posts: data.posts.length,
    tracker: data.tracker.length,
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">
        Signed in as {user.role}
      </p>
      <h1 className="mt-2 font-display text-3xl italic text-indigo">
        Good to see you, {user.name.split(" ")[0]}
      </h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <CivicPulseCard completed={completed} total={counts.quizzes} avgScore={avgScore} />
        <ModuleBreakdownCard breakdown={breakdown} />
      </div>

      <div className="mt-8">
        <QuickLinks counts={counts} />
      </div>

      {perms.canManageContent && (
        <div className="mt-10 grid gap-6 rounded-xl border border-gold/40 bg-gold/5 p-6 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">
              Admin tools · only visible to admins
            </p>
            <h2 className="mt-2 font-display text-xl italic text-indigo">Platform at a glance</h2>
            <p className="mt-1 text-sm text-charcoal/70">
              {counts.content} content items · {counts.quizzes} quizzes · {counts.tracker} tracker
              initiatives · {counts.posts} forum posts.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/regional-tracker"
              className="flex-1 rounded-lg border border-line bg-white p-4 hover:border-indigo/40"
            >
              <p className="text-sm font-medium text-indigo">Regional Tracker</p>
              <p className="mt-1 text-xs text-charcoal/60">
                {counts.tracker} initiatives · add, edit, or remove
              </p>
            </Link>
            <Link href="/forum" className="flex-1 rounded-lg border border-line bg-white p-4 hover:border-indigo/40">
              <p className="text-sm font-medium text-indigo">Forum moderation</p>
              <p className="mt-1 text-xs text-charcoal/60">{counts.posts} posts · remove any</p>
            </Link>
          </div>
        </div>
      )}

      {perms.canModerate && !perms.canManageContent && (
        <div className="mt-10 rounded-xl border border-gold/40 bg-gold/5 p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">
            Moderator tools · only visible to moderators
          </p>
          <h2 className="mt-2 font-display text-xl italic text-indigo">
            {counts.posts} posts currently in the forum
          </h2>
          <p className="mt-1 text-sm text-charcoal/70">
            You can remove any post that breaks the rules — the author is
            never notified who removed it.
          </p>
          <Link
            href="/forum"
            className="mt-4 inline-block rounded-full bg-indigo px-5 py-2 text-sm font-medium text-ivory hover:bg-indigo-light"
          >
            Open the forum
          </Link>
        </div>
      )}

      {!perms.canModerate && (
        <p className="mt-10 text-xs text-charcoal/40">
          Moderator and Admin tools appear here too for accounts that have
          them. Your account doesn&apos;t, so nothing is hidden behind a
          locked button.
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
