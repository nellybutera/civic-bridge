"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QUIZZES } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { getResults } from "@/lib/progress";

export default function QuizzesPage() {
  const { user } = useAuth();
  const [results, setResults] = useState({});

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage on mount
    if (user) setResults(getResults(user.id));
  }, [user]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Quizzes</p>
      <h1 className="mt-2 font-display text-3xl italic text-indigo">
        Check what actually stuck
      </h1>
      <p className="mt-2 max-w-xl text-sm text-charcoal/60">
        Each quiz pairs with a civic content piece. {!user && "Log in or sign up to save your results."}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {QUIZZES.map((quiz) => {
          const result = results[quiz.id];
          return (
            <Link
              key={quiz.id}
              href={`/quizzes/${quiz.id}`}
              className="rounded-xl border border-line bg-white p-6 hover:border-indigo/40"
            >
              <h2 className="font-display text-xl italic text-indigo">{quiz.title}</h2>
              <p className="mt-1 text-xs text-charcoal/50">{quiz.questions.length} questions</p>
              {result ? (
                <p className="mt-3 font-mono text-sm text-forest">
                  Completed · {result.scorePercent}%
                </p>
              ) : (
                <p className="mt-3 text-sm text-gold">Not attempted yet</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
