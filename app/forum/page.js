"use client";

import { useEffect, useState } from "react";
import { useAuth, permissionsFor } from "@/lib/auth-context";
import { readStore, writeStore } from "@/lib/storage";
import { SEED_FORUM_POSTS } from "@/lib/data";
import CivicPulseBar from "@/components/CivicPulseBar";

const POSTS_KEY = "civicbridge_forum_posts";

function normalize(posts) {
  return posts.map((p) => ({ flaggedBy: 0, ...p }));
}

export default function ForumPage() {
  const { user } = useAuth();
  const perms = permissionsFor(user);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    const existing = readStore(POSTS_KEY, null);
    const initial = normalize(existing || SEED_FORUM_POSTS);
    if (!existing) writeStore(POSTS_KEY, initial);
// eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage on mount
    setPosts(initial);
  }, []);

  function persist(next) {
    setPosts(next);
    writeStore(POSTS_KEY, next);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const newPost = {
      id: "f-" + Date.now(),
      authorName: user.name,
      authorRole: user.role,
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
      flaggedBy: 0,
    };
    persist([newPost, ...posts]);
    setTitle("");
    setBody("");
  }

  function handleDelete(id) {
    persist(posts.filter((p) => p.id !== id));
  }

  function handleFlag(id) {
    persist(posts.map((p) => (p.id === id ? { ...p, flaggedBy: p.flaggedBy + 1 } : p)));
  }

  function handleClearFlag(id) {
    persist(posts.map((p) => (p.id === id ? { ...p, flaggedBy: 0 } : p)));
  }

  const flaggedCount = posts.filter((p) => p.flaggedBy > 0).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Discussion Forum</p>
      <h1 className="mt-2 font-display text-3xl italic text-indigo">Talk it through</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        {perms.canPost
          ? "Post a question or a thought — keep it respectful and specific."
          : "Log in to start or reply to a discussion."}
      </p>

      {perms.canModerate && flaggedCount > 0 && (
        <div className="mt-6 rounded-xl border border-gold/40 bg-gold/10 px-5 py-3 text-sm text-indigo">
          {flaggedCount} post{flaggedCount === 1 ? "" : "s"} flagged by readers — reviewable below.
        </div>
      )}

      <div className={`mt-8 grid gap-8 ${perms.canModerate ? "lg:grid-cols-[1fr_280px]" : ""}`}>
        <div>
          {perms.canPost && (
            <form
              onSubmit={handleSubmit}
              className="mb-8 flex flex-col gap-3 rounded-xl border border-line bg-white p-5"
            >
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
              />
              <textarea
                placeholder="What's on your mind?"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo focus:ring-2 focus:ring-indigo/20"
              />
              <button
                type="submit"
                className="self-start rounded-full bg-indigo px-5 py-2 text-sm font-medium text-ivory hover:bg-indigo-light"
              >
                Post
              </button>
            </form>
          )}

          <div className="flex flex-col gap-4">
            {posts.map((p) => {
              const flagged = p.flaggedBy > 0;
              return (
                <div
                  key={p.id}
                  className={`rounded-xl border p-5 ${
                    flagged && perms.canModerate
                      ? "border-gold bg-gold/5"
                      : "border-line bg-white"
                  }`}
                >
                  {flagged && perms.canModerate && (
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gold">
                      Flagged by {p.flaggedBy} reader{p.flaggedBy === 1 ? "" : "s"}
                    </p>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display italic text-indigo">{p.title}</h2>
                      <p className="mt-1 text-xs text-charcoal/50">
                        {p.authorName} · {p.authorRole} ·{" "}
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {perms.canModerate ? (
                      <div className="flex shrink-0 gap-2">
                        {flagged && (
                          <button
                            onClick={() => handleClearFlag(p.id)}
                            className="whitespace-nowrap rounded-full border border-line px-3 py-1 text-xs font-medium text-charcoal/70 hover:border-indigo/40"
                          >
                            Keep it up
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="whitespace-nowrap rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Delete post
                        </button>
                      </div>
                    ) : (
                      perms.canPost &&
                      p.authorName !== user.name && (
                        <button
                          onClick={() => handleFlag(p.id)}
                          className="whitespace-nowrap text-xs font-medium text-charcoal/50 hover:text-gold"
                        >
                          Flag
                        </button>
                      )
                    )}
                  </div>
                  <p className="mt-3 text-sm text-charcoal/75">{p.body}</p>
                </div>
              );
            })}
            {posts.length === 0 && (
              <p className="text-sm text-charcoal/50">No posts yet — be the first to start a thread.</p>
            )}
          </div>
        </div>

        {perms.canModerate && (
          <aside className="self-start rounded-xl border border-line bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal/50">
              Moderator tools
            </p>
            <p className="mt-3 font-display text-2xl italic text-indigo">{posts.length} posts</p>
            <p className="mt-1 text-xs text-charcoal/50">{flaggedCount} currently flagged</p>
            <div className="mt-4">
              <CivicPulseBar
                value={posts.length ? Math.round(((posts.length - flaggedCount) / posts.length) * 100) : 100}
                label="Clean posts"
                tone="forest"
              />
            </div>
            <p className="mt-4 border-t border-line pt-4 text-xs text-charcoal/50">
              Youth Users write and reply. Removing a post is a Moderator
              action; clearing a flag keeps it visible.
            </p>
          </aside>
        )}
      </div>
    </div>
  );
}
