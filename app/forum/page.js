"use client";

import { useEffect, useState } from "react";
import { useAuth, permissionsFor } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function ForumPage() {
  const { user, logout } = useAuth();
  const perms = permissionsFor(user);
  const [posts, setPosts] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoadError("");
    setPosts(null);
    api
      .getForum()
      .then(setPosts)
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : "Couldn't reach the server."));
  }

  function handleApiError(e) {
    if (e instanceof ApiError && e.status === 401) {
      logout();
      return;
    }
    setActionError(e instanceof ApiError ? e.message : "Couldn't reach the server.");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setActionError("");
    setPosting(true);
    try {
      const created = await api.postForum(
        { authorName: user.name, authorRole: user.role, title: title.trim(), body: body.trim() },
        user.token
      );
      setPosts((prev) => [created, ...prev]);
      setTitle("");
      setBody("");
    } catch (e) {
      handleApiError(e);
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(id) {
    setActionError("");
    try {
      await api.deleteForum(id, user.token);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      handleApiError(e);
    }
  }

  if (loadError) return <ErrorState message={loadError} onRetry={load} />;
  if (!posts) return <LoadingState label="Loading the forum" />;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Discussion Forum</p>
      <h1 className="mt-2 font-display text-3xl italic text-indigo">Talk it through</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        {perms.canPost
          ? "Post a question or a thought — keep it respectful and specific."
          : "Log in to start or reply to a discussion."}
      </p>
      {actionError && <p className="mt-4 text-sm text-red-600">{actionError}</p>}

      {perms.canPost && (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
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
            disabled={posting}
            className="self-start rounded-full bg-indigo px-5 py-2 text-sm font-medium text-ivory hover:bg-indigo-light disabled:opacity-60"
          >
            {posting ? "Posting…" : "Post"}
          </button>
        </form>
      )}

      <div className="mt-10 flex flex-col gap-4">
        {posts.map((p) => (
          <div key={p.id} className="rounded-xl border border-line bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display italic text-indigo">{p.title}</h2>
                <p className="mt-1 text-xs text-charcoal/50">
                  {p.authorName} · {p.authorRole} ·{" "}
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
              {perms.canModerate && (
                <button
                  onClick={() => handleDelete(p.id)}
                  className="whitespace-nowrap text-xs font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="mt-3 text-sm text-charcoal/75">{p.body}</p>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-charcoal/50">No posts yet — be the first to start a thread.</p>
        )}
      </div>
    </div>
  );
}
