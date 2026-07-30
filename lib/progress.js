"use client";

import { api } from "./api";

// Returns { [quizId]: { scorePercent, completedAt } }, keeping the most
// recent attempt per quiz when a user has retaken one.
export async function getResults(userId) {
  const list = await api.getResultsForUser(userId);
  const map = {};
  for (const r of list) {
    const existing = map[r.quizId];
    if (!existing || new Date(r.completedAt) > new Date(existing.completedAt)) {
      map[r.quizId] = { scorePercent: r.scorePercent, completedAt: r.completedAt };
    }
  }
  return map;
}

export function saveResult(userId, quizId, scorePercent, token) {
  return api.submitQuizResult(quizId, userId, scorePercent, token);
}
