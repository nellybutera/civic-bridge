"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { href: "/civic-content", label: "Civic Content" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/forum", label: "Forum" },
  { href: "/regional-tracker", label: "Regional Tracker" },
];

export default function Navbar() {
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-display text-xl italic tracking-tight text-indigo">
          Civic Bridge <span className="text-gold not-italic">Africa</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-charcoal/70 transition hover:text-indigo"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!ready ? null : user ? (
            <>
              <span className="font-mono text-xs uppercase tracking-wide text-forest">
                + {user.role}
              </span>
              <Link
                href="/dashboard"
                className="rounded-full border border-indigo/20 px-4 py-1.5 text-sm font-medium text-indigo hover:bg-indigo/5"
              >
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={logout}
                className="rounded-full bg-indigo px-4 py-1.5 text-sm font-medium text-ivory hover:bg-indigo-light"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <span className="font-mono text-xs uppercase tracking-wide text-charcoal/40">
                + Guest
              </span>
              <Link
                href="/login"
                className="rounded-full border border-indigo/20 px-4 py-1.5 text-sm font-medium text-indigo hover:bg-indigo/5"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gold px-4 py-1.5 text-sm font-medium text-indigo hover:bg-gold-light"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="text-indigo md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-ivory px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-charcoal/80">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-3 border-t border-line pt-3">
              <span className="font-mono text-xs uppercase tracking-wide text-forest">
                + {user ? user.role : "Guest"}
              </span>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium text-indigo">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="text-sm font-medium text-indigo">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-indigo">
                    Log in
                  </Link>
                  <Link href="/signup" className="text-sm font-medium text-indigo">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
