"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@civicbridge.africa", password: "admin123" },
  { role: "Moderator", email: "moderator@civicbridge.africa", password: "mod123" },
  { role: "Youth User", email: "youth@civicbridge.africa", password: "youth123" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [slow, setSlow] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const slowTimer = setTimeout(() => setSlow(true), 4000);
    const result = await login(email, password);
    clearTimeout(slowTimer);
    setSubmitting(false);
    setSlow(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/dashboard");
  }

  function fillDemo(acc) {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-10 px-5 py-16 lg:grid-cols-[1fr_320px] lg:items-start">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Welcome back</p>
        <h1 className="mt-2 font-display text-3xl italic text-indigo">Log in</h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-charcoal/70">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
            />
          </div>
          {error && (
            <p className="flex items-start gap-2 text-sm text-red-600">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-600" />
              {error} Try again, or use a demo account on the right.
            </p>
          )}
          {submitting && slow && (
            <p className="text-xs text-charcoal/40">
              The backend is waking up from sleep — this can take up to a
              couple of minutes on the free tier. Hang tight.
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-indigo px-6 py-2.5 text-sm font-semibold text-ivory hover:bg-indigo-light disabled:opacity-60"
          >
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-charcoal/60">
          No account?{" "}
          <Link href="/signup" className="font-medium text-indigo underline">
            Sign up
          </Link>{" "}
          or{" "}
          <Link href="/civic-content" className="font-medium text-indigo underline">
            continue as a guest
          </Link>
          .
        </p>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal/50">
          Demo accounts
        </p>
        <p className="mt-1 text-xs text-charcoal/50">
          Each one shows a different set of permissions.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.role}
              onClick={() => fillDemo(acc)}
              className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 text-left hover:border-indigo/40"
            >
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-wide text-forest">
                  + {acc.role}
                </span>
                <span className="block text-xs text-charcoal/50">{acc.email}</span>
              </span>
              <span className="whitespace-nowrap text-xs font-medium text-indigo">Fill in →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
