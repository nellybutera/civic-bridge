"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { readStore, writeStore } from "./storage";
import { SEED_USERS } from "./data";

const USERS_KEY = "civicbridge_users";
const SESSION_KEY = "civicbridge_session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = guest, undefined = loading
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // seed users on first load
    const existing = readStore(USERS_KEY, null);
    if (!existing) {
      writeStore(USERS_KEY, SEED_USERS);
    }
    const session = readStore(SESSION_KEY, null);
// eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage on mount
    setUser(session);
    setReady(true);
  }, []);

  function login(email, password) {
    const users = readStore(USERS_KEY, SEED_USERS);
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: "Incorrect email or password." };
    const session = { id: found.id, name: found.name, email: found.email, role: found.role };
    writeStore(SESSION_KEY, session);
    setUser(session);
    return { ok: true };
  }

  function signup(name, email, password) {
    const users = readStore(USERS_KEY, SEED_USERS);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: "An account with that email already exists." };
    }
    const newUser = {
      id: "u-" + Date.now(),
      name,
      email,
      password,
      role: "Youth User",
    };
    const updated = [...users, newUser];
    writeStore(USERS_KEY, updated);
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    writeStore(SESSION_KEY, session);
    setUser(session);
    return { ok: true };
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
