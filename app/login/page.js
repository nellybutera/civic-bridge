"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

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

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-16">
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
            {error}
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
  );
}
