// Client for the Civic Bridge Africa Spring Boot API. The base URL points at
// the live Render deployment by default; override with NEXT_PUBLIC_API_URL
// for local backend development.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://civic-bridge-api.onrender.com";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty body (e.g. 204 No Content) — leave data as null
  }

  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status);
  }
  return data;
}

export const api = {
  login: (email, password) => request("/api/auth/login", { method: "POST", body: { email, password } }),
  signup: (name, email, password) =>
    request("/api/auth/signup", { method: "POST", body: { name, email, password } }),

  getContent: () => request("/api/content"),
  createContent: (item, token) => request("/api/content", { method: "POST", token, body: item }),
  updateContent: (id, item, token) => request(`/api/content/${id}`, { method: "PUT", token, body: item }),
  deleteContent: (id, token) => request(`/api/content/${id}`, { method: "DELETE", token }),

  getQuizzes: () => request("/api/quizzes"),
  getQuiz: (id) => request(`/api/quizzes/${id}`),
  submitQuizResult: (quizId, userId, scorePercent, token) =>
    request(`/api/quizzes/${quizId}/results`, { method: "POST", token, body: { userId, scorePercent } }),
  getResultsForUser: (userId) => request(`/api/quizzes/results/${userId}`),

  getForum: () => request("/api/forum"),
  postForum: (post, token) => request("/api/forum", { method: "POST", token, body: post }),
  deleteForum: (id, token) => request(`/api/forum/${id}`, { method: "DELETE", token }),

  getTracker: () => request("/api/tracker"),
  createTracker: (item, token) => request("/api/tracker", { method: "POST", token, body: item }),
  updateTracker: (id, item, token) => request(`/api/tracker/${id}`, { method: "PUT", token, body: item }),
  deleteTracker: (id, token) => request(`/api/tracker/${id}`, { method: "DELETE", token }),
};
