"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CivicPulseBar from "@/components/CivicPulseBar";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";

const ROLES = [
  { role: "Guest", desc: "Read every article, quiz, forum thread and tracker item." },
  { role: "Youth User", desc: "Take quizzes, keep your scores, post in the forum." },
  { role: "Moderator", desc: "Everything a Youth User can do, plus remove posts that break the rules." },
  { role: "Admin", desc: "Publish civic content and maintain the regional tracker." },
];

export default function Home() {
  const [content, setContent] = useState(null);
  const [tracker, setTracker] = useState(null);

  useEffect(() => {
    api.getContent().then(setContent).catch(() => setContent([]));
    api.getTracker().then(setTracker).catch(() => setTracker([]));
  }, []);

  const avgProgress = tracker?.length
    ? Math.round(tracker.reduce((sum, r) => sum + r.progress, 0) / tracker.length)
    : 0;
  const quickestReads = content ? [...content].sort((a, b) => a.readMinutes - b.readMinutes).slice(0, 3) : [];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-indigo px-5 py-24 text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_320px]">
          <div className="max-w-2xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-gold">
              For youth aged 16–35 across the region
            </p>
            <h1 className="font-display text-5xl italic leading-[1.05] sm:text-6xl">
              Governance shouldn&apos;t need a law degree to understand.
            </h1>
            <p className="mt-6 text-lg text-ivory/75">
              Civic Bridge Africa translates parliamentary process, civic rights,
              and regional integration into plain language — then gives you a
              place to test what you&apos;ve learned and talk it through with
              others.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-indigo hover:bg-gold-light"
              >
                Create a free account
              </Link>
              <Link
                href="/civic-content"
                className="rounded-full border border-ivory/30 px-6 py-3 text-sm font-semibold text-ivory hover:bg-ivory/10"
              >
                Browse as a guest
              </Link>
            </div>
          </div>

          <div className="self-start rounded-xl border border-ivory/15 bg-ivory/5 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-gold">
              Start with the shortest reads
            </p>
            {content === null ? (
              <p className="mt-4 text-xs text-ivory/40">Loading…</p>
            ) : quickestReads.length === 0 ? (
              <p className="mt-4 text-xs text-ivory/40">Couldn&apos;t load content right now.</p>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {quickestReads.map((item, i) => (
                  <li key={item.id} className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-ivory/40">0{i + 1}</span>
                    <div>
                      <p className="text-sm text-ivory/90">{item.title}</p>
                      <p className="font-mono text-xs text-ivory/40">{item.readMinutes} min read</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-line px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">
              The problem
            </p>
            <h2 className="mt-3 font-display text-3xl italic text-indigo">
              Youth are locked out of governance by design, not by choice.
            </h2>
            <p className="mt-4 text-charcoal/75">
              Parliamentary bulletins, AU communiqués, and EAC protocols are
              published in dense legal language, scattered across dozens of
              institutional websites, and rarely translated into anything a
              16-year-old — or a working 28-year-old — has time to parse.
              The result: low civic participation, weak accountability, and a
              generation shut out of decisions about its own future.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">
              The solution
            </p>
            <h2 className="mt-3 font-display text-3xl italic text-indigo">
              One plain-language bridge into the systems that govern you.
            </h2>
            <p className="mt-4 text-charcoal/75">
              Civic Bridge Africa pulls from publicly available AU, EAC, and
              national parliamentary data and reshapes it into short reads,
              quizzes that check real understanding, a moderated discussion
              forum, and a live tracker of regional integration initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Regional pulse — signature element on the landing page */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">
                Regional integration pulse
              </p>
              <h2 className="mt-2 font-display text-2xl italic text-indigo">
                Where regional initiatives actually stand today
              </h2>
            </div>
            <Link href="/regional-tracker" className="text-sm font-medium text-indigo underline">
              View full tracker →
            </Link>
          </div>

          <div className="mb-10 rounded-2xl border border-line bg-white p-6">
            <CivicPulseBar value={avgProgress} label="Average implementation progress" segments={20} />
          </div>

          {tracker === null ? (
            <p className="text-sm text-charcoal/50">Loading the regional tracker…</p>
          ) : tracker.length === 0 ? (
            <p className="text-sm text-charcoal/50">Couldn&apos;t load the tracker right now.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {tracker.map((item) => (
                <div key={item.id} className="rounded-xl border border-line bg-white p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="font-medium text-indigo">{item.initiative}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <CivicPulseBar value={item.progress} tone="forest" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Actors */}
      <section className="border-t border-line bg-ivory px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">
              Who does what
            </p>
            <h2 className="mt-2 font-display text-2xl italic text-indigo">
              Four roles, plainly stated
            </h2>
            <p className="mt-4 max-w-md text-sm text-charcoal/70">
              You can read everything without an account. An account is for
              taking part.
            </p>
          </div>
          <div className="flex flex-col gap-4 divide-y divide-line">
            {ROLES.map((a) => (
              <div key={a.role} className="flex items-baseline justify-between gap-4 pt-4 first:pt-0">
                <span className="whitespace-nowrap font-mono text-xs uppercase tracking-wide text-forest">
                  + {a.role}
                </span>
                <p className="text-right text-sm text-charcoal/70">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-indigo px-5 py-16 text-ivory">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <h2 className="max-w-lg font-display text-2xl italic leading-snug">
            Start with one read and one quiz. Fifteen minutes.
          </h2>
          <Link
            href="/signup"
            className="whitespace-nowrap rounded-full bg-gold px-6 py-3 text-sm font-semibold text-indigo hover:bg-gold-light"
          >
            Create a free account
          </Link>
        </div>
      </section>
    </div>
  );
}
