"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { useAuth, permissionsFor } from "@/lib/auth-context";
import { saveResult } from "@/lib/progress";
import CivicPulseBar from "@/components/CivicPulseBar";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function QuizDetailPage() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const perms = permissionsFor(user);

  const [quiz, setQuiz] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  function load() {
    setLoadError("");
    setQuiz(null);
    api
      .getQuiz(id)
      .then(setQuiz)
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : "Couldn't reach the server."));
  }

  if (loadError) return <ErrorState message={loadError} onRetry={load} />;
  if (!quiz) return <LoadingState label="Loading quiz" />;

  if (!perms.canTakeQuiz) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="font-display text-2xl italic text-indigo">Log in to take this quiz</h1>
        <p className="mt-3 text-sm text-charcoal/60">
          Guests can preview quiz topics, but results are saved to your account.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-full bg-indigo px-6 py-2.5 text-sm font-semibold text-ivory hover:bg-indigo-light"
        >
          Log in
        </Link>
      </div>
    );
  }

  const score = submitted
    ? Math.round(
        (quiz.questions.filter((q) => answers[q.id] === q.answerIndex).length /
          quiz.questions.length) *
          100
      )
    : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    const scorePercent = Math.round(
      (quiz.questions.filter((q) => answers[q.id] === q.answerIndex).length /
        quiz.questions.length) *
        100
    );
    try {
      await saveResult(user.id, quiz.id, scorePercent, user.token);
      setSubmitted(true);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout();
        return;
      }
      setSubmitError(e instanceof ApiError ? e.message : "Couldn't save your result. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    const correctCount = quiz.questions.filter((q) => answers[q.id] === q.answerIndex).length;
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Result saved</p>
          <h1 className="mt-2 font-display text-3xl italic text-indigo">
            You got {correctCount} of {quiz.questions.length} — {score}%
          </h1>
          <div className="mx-auto mt-6 max-w-xs">
            <CivicPulseBar value={score} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {quiz.questions.map((q, idx) => {
            const yourIndex = answers[q.id];
            const correct = yourIndex === q.answerIndex;
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-4 ${correct ? "border-line bg-white" : "border-gold/40 bg-gold/5"}`}
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${correct ? "bg-forest" : "bg-gold"}`} />
                  <div>
                    <p className="text-sm font-medium text-indigo">
                      {idx + 1}. {q.prompt}
                    </p>
                    <p className="mt-1 text-xs text-charcoal/60">
                      Your answer: {q.options[yourIndex] ?? "—"}
                      {!correct && <span className="text-charcoal/40"> · Correct: {q.options[q.answerIndex]}</span>}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/quizzes" className="rounded-full border border-indigo/20 px-5 py-2 text-sm font-medium text-indigo">
            Back to quizzes
          </Link>
          <Link href="/dashboard" className="rounded-full bg-indigo px-5 py-2 text-sm font-medium text-ivory">
            View dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Quiz</p>
      <h1 className="mt-2 font-display text-3xl italic text-indigo">{quiz.title}</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        {quiz.questions.map((q, idx) => (
          <fieldset key={q.id} className="rounded-xl border border-line bg-white p-5">
            <legend className="mb-3 text-sm font-medium text-indigo">
              {idx + 1}. {q.prompt}
            </legend>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm hover:border-indigo/40 has-[:checked]:border-indigo has-[:checked]:bg-indigo/5"
                >
                  <input
                    type="radio"
                    name={q.id}
                    required
                    checked={answers[q.id] === i}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-indigo hover:bg-gold-light disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit answers"}
        </button>
      </form>
    </div>
  );
}
