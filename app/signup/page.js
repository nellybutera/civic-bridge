"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [slow, setSlow] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setSubmitting(true);
    const slowTimer = setTimeout(() => setSlow(true), 4000);
    const result = await signup(name, email, password);
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
    <div className="mx-auto grid max-w-4xl gap-10 px-5 py-16 lg:grid-cols-[1fr_300px] lg:items-start">
      <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Takes about a minute</p>
      <h1 className="mt-2 font-display text-3xl italic text-indigo">Create your account</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal/70">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
          />
        </div>
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        {submitting && slow && (
          <p className="text-xs text-charcoal/40">
            The backend is waking up from sleep — this can take up to a
            couple of minutes on the free tier. Hang tight.
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-indigo hover:bg-gold-light disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-charcoal/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo underline">
          Log in
        </Link>
        .
      </p>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal/50">
          What you get
        </p>
        <p className="mt-3 text-sm text-charcoal/70">
          This creates a <span className="font-medium text-indigo">Youth User</span> account:
          quizzes, scores and forum posting. Moderator and Admin roles are
          granted by the team.
        </p>
        <ul className="mt-4 flex flex-col gap-3 border-t border-line pt-4 text-sm text-charcoal/70">
          <li>
            <span className="font-medium text-indigo">Scores that stick.</span> Quiz results are
            kept over time, not measured once — one lucky guess doesn&apos;t define you.
          </li>
          <li>
            <span className="font-medium text-indigo">A voice in the forum.</span> Ask the
            question you were told was obvious. Moderators keep it civil.
          </li>
          <li>
            <span className="font-medium text-indigo">Your own pulse.</span> One bar that shows
            what you&apos;ve actually covered.
          </li>
        </ul>
      </div>
    </div>
  );
}
