"use client";

import { readStore, writeStore } from "./storage";

const RESULTS_KEY = "civicbridge_quiz_results";

export function getResults(userId) {
  const all = readStore(RESULTS_KEY, {});
  return all[userId] || {};
}

export function saveResult(userId, quizId, scorePercent) {
  const all = readStore(RESULTS_KEY, {});
  const forUser = all[userId] || {};
  forUser[quizId] = { scorePercent, completedAt: new Date().toISOString() };
  all[userId] = forUser;
  writeStore(RESULTS_KEY, all);
}
