"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth, permissionsFor } from "@/lib/auth-context";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

const CATEGORY_OPTIONS = ["Parliamentary Process", "Civic Rights", "Regional Integration", "Governance Literacy"];
const EMPTY_FORM = { title: "", category: CATEGORY_OPTIONS[0], summary: "", body: "", readMinutes: 4, sourceUrl: "" };

export default function CivicContentPage() {
  const { user, logout } = useAuth();
  const perms = permissionsFor(user);
  const [content, setContent] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoadError("");
    setContent(null);
    api
      .getContent()
      .then(setContent)
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : "Couldn't reach the server."));
  }

  function handleApiError(e) {
    if (e instanceof ApiError && e.status === 401) {
      logout();
      return;
    }
    setActionError(e instanceof ApiError ? e.message : "Couldn't reach the server.");
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setActionError("");
    try {
      const created = await api.createContent({ ...form, readMinutes: Number(form.readMinutes) }, user.token);
      setContent((prev) => [created, ...prev]);
      setForm(EMPTY_FORM);
    } catch (e) {
      handleApiError(e);
    }
  }

  async function handleRemove(id) {
    setActionError("");
    try {
      await api.deleteContent(id, user.token);
      setContent((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (e) {
      handleApiError(e);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      category: item.category,
      summary: item.summary,
      body: item.body,
      readMinutes: item.readMinutes,
      sourceUrl: item.sourceUrl || "",
    });
  }

  async function saveEdit(id) {
    setActionError("");
    try {
      const updated = await api.updateContent(id, { ...editForm, readMinutes: Number(editForm.readMinutes) }, user.token);
      setContent((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
      setEditForm(null);
    } catch (e) {
      handleApiError(e);
    }
  }

  if (loadError) return <ErrorState message={loadError} onRetry={load} />;
  if (!content) return <LoadingState label="Loading civic content" />;

  const categories = ["All", ...new Set(content.map((c) => c.category))];
  const visible = filter === "All" ? content : content.filter((c) => c.category === filter);

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Civic Content</p>
      <h1 className="mt-2 font-display text-3xl italic text-indigo">
        Governance, explained plainly
      </h1>
      <p className="mt-2 max-w-xl text-sm text-charcoal/60">
        Short reads pulled from public AU, EAC, and national parliamentary
        sources — no legal background required.
      </p>
      {actionError && <p className="mt-4 text-sm text-red-600">{actionError}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
              filter === c
                ? "border-indigo bg-indigo text-ivory"
                : "border-line text-charcoal/60 hover:border-indigo/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {visible.map((item) => {
          const open = openId === item.id;
          const editing = editingId === item.id;

          if (editing) {
            return (
              <form
                key={item.id}
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit(item.id);
                }}
                className="flex flex-col gap-3 rounded-xl border border-indigo/40 bg-white p-6"
              >
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-indigo"
                  placeholder="Title"
                />
                <div className="flex gap-2">
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-indigo"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={editForm.readMinutes}
                    onChange={(e) => setEditForm({ ...editForm, readMinutes: e.target.value })}
                    className="w-24 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-indigo"
                  />
                </div>
                <textarea
                  value={editForm.summary}
                  onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                  rows={2}
                  placeholder="Summary (max ~150 words)"
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-indigo"
                />
                <textarea
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                  rows={4}
                  placeholder="Full body"
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-indigo"
                />
                <input
                  value={editForm.sourceUrl}
                  onChange={(e) => setEditForm({ ...editForm, sourceUrl: e.target.value })}
                  placeholder="Source URL"
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-indigo"
                />
                <div className="flex gap-2">
                  <button type="submit" className="rounded-full bg-indigo px-4 py-1.5 text-xs font-medium text-ivory">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-charcoal/70"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            );
          }

          return (
            <div key={item.id} className="rounded-xl border border-line bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-forest">
                    {item.category}
                  </span>
                  <h2 className="mt-1 font-display text-xl italic text-indigo">{item.title}</h2>
                  <p className="mt-2 text-sm text-charcoal/70">{item.summary}</p>
                </div>
                <span className="whitespace-nowrap font-mono text-xs text-charcoal/40">
                  {item.readMinutes} min
                </span>
              </div>
              {open && (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="text-sm leading-[1.7] text-charcoal/80">{item.body}</p>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-xs font-medium text-indigo underline"
                    >
                      View original source →
                    </a>
                  )}
                  <p className="mt-3 text-xs text-charcoal/40">
                    This summary is for informational purposes only. Refer to
                    the original source above for anything legally binding.
                  </p>
                </div>
              )}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="text-sm font-semibold text-indigo hover:text-indigo-light"
                >
                  {open ? "Show less ↑" : "Read more →"}
                </button>
                {perms.canManageContent && (
                  <>
                    <button
                      onClick={() => startEdit(item)}
                      className="rounded-full border border-line px-3 py-1 text-xs font-medium text-indigo hover:border-indigo/40 hover:bg-indigo/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="rounded-full border border-line px-3 py-1 text-xs font-medium text-red-600 hover:border-red-300 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {perms.canManageContent && (
        <form onSubmit={handleAdd} className="mt-10 flex flex-col gap-3 rounded-xl border border-gold/40 bg-gold/5 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-forest">
            Admin: publish new content
          </p>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo"
          />
          <div className="flex gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="flex-1 rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={form.readMinutes}
              onChange={(e) => setForm({ ...form, readMinutes: e.target.value })}
              className="w-28 rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo"
              placeholder="Read min"
            />
          </div>
          <textarea
            placeholder="Summary (max ~150 words)"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
            className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo"
          />
          <textarea
            placeholder="Full body"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={4}
            className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo"
          />
          <input
            placeholder="Source URL (required — no verifiable source, no publish)"
            value={form.sourceUrl}
            onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
            required
            className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo"
          />
          <button
            type="submit"
            className="self-start rounded-full bg-indigo px-5 py-2 text-sm font-medium text-ivory hover:bg-indigo-light"
          >
            Publish
          </button>
        </form>
      )}
    </div>
  );
}
