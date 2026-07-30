"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { readStore, writeStore } from "./storage";
import { api, ApiError } from "./api";

const SESSION_KEY = "civicbridge_session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = guest; otherwise {token, id, name, email, role}
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readStore(SESSION_KEY, null);
// eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage on mount
    setUser(session);
    setReady(true);
  }, []);

  async function login(email, password) {
    try {
      const res = await api.login(email, password);
      const session = { token: res.token, id: res.id, name: res.name, email: res.email, role: res.role };
      writeStore(SESSION_KEY, session);
      setUser(session);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof ApiError ? e.message : "Couldn't reach the server. Try again." };
    }
  }

  async function signup(name, email, password) {
    try {
      const res = await api.signup(name, email, password);
      const session = { token: res.token, id: res.id, name: res.name, email: res.email, role: res.role };
      writeStore(SESSION_KEY, session);
      setUser(session);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof ApiError ? e.message : "Couldn't reach the server. Try again." };
    }
  }

  function logout() {
    writeStore(SESSION_KEY, null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const ROLE_PERMISSIONS = {
  Guest: { canPost: false, canModerate: false, canManageContent: false, canTakeQuiz: false },
  "Youth User": { canPost: true, canModerate: false, canManageContent: false, canTakeQuiz: true },
  Moderator: { canPost: true, canModerate: true, canManageContent: false, canTakeQuiz: true },
  Admin: { canPost: true, canModerate: true, canManageContent: true, canTakeQuiz: true },
};

export function permissionsFor(user) {
  const role = user?.role || "Guest";
  return { role, ...ROLE_PERMISSIONS[role] };
}
