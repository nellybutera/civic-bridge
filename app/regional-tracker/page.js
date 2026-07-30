"use client";

import { useEffect, useState } from "react";
import { useAuth, permissionsFor } from "@/lib/auth-context";
import { api, ApiError } from "@/lib/api";
import CivicPulseBar from "@/components/CivicPulseBar";
import StatusBadge from "@/components/StatusBadge";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

const STATUS_OPTIONS = ["Early Stage", "Active Implementation", "In Force", "Stalled"];

export default function RegionalTrackerPage() {
  const { user, logout } = useAuth();
  const perms = permissionsFor(user);
  const [items, setItems] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [form, setForm] = useState({ initiative: "", status: "Early Stage", progress: 10, note: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoadError("");
    setItems(null);
    api
      .getTracker()
      .then(setItems)
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
    if (!form.initiative.trim()) return;
    setActionError("");
    try {
      const created = await api.createTracker({ ...form, progress: Number(form.progress) }, user.token);
      setItems((prev) => [created, ...prev]);
      setForm({ initiative: "", status: "Early Stage", progress: 10, note: "" });
    } catch (e) {
      handleApiError(e);
    }
  }

  async function handleRemove(id) {
    setActionError("");
    try {
      await api.deleteTracker(id, user.token);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (e) {
      handleApiError(e);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditForm({ initiative: item.initiative, status: item.status, progress: item.progress, note: item.note });
  }

  async function saveEdit(id) {
    setActionError("");
    try {
      const updated = await api.updateTracker(id, { ...editForm, progress: Number(editForm.progress) }, user.token);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      setEditingId(null);
      setEditForm(null);
    } catch (e) {
      handleApiError(e);
    }
  }

  if (loadError) return <ErrorState message={loadError} onRetry={load} />;
  if (!items) return <LoadingState label="Loading the regional tracker" />;

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-forest">Regional Tracker</p>
      <h1 className="mt-2 font-display text-3xl italic text-indigo">
        Regional integration, tracked
      </h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Live progress on AU and EAC initiatives that affect you directly.
        {perms.canManageContent
          ? " You can add, edit, or remove items below."
          : " Guests and Youth Users read the tracker; adding and updating is an Admin action."}
      </p>
      {actionError && <p className="mt-4 text-sm text-red-600">{actionError}</p>}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const editing = editingId === item.id;
          if (editing) {
            return (
              <form
                key={item.id}
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit(item.id);
                }}
                className="flex flex-col gap-3 rounded-xl border border-indigo/40 bg-white p-5"
              >
                <input
                  value={editForm.initiative}
                  onChange={(e) => setEditForm({ ...editForm, initiative: e.target.value })}
                  className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-indigo"
                />
                <div className="flex gap-2">
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-indigo"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.progress}
                    onChange={(e) => setEditForm({ ...editForm, progress: e.target.value })}
                    className="w-20 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-indigo"
                  />
                </div>
                <textarea
                  value={editForm.note}
                  onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                  rows={2}
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
            <div key={item.id} className="rounded-xl border border-line bg-white p-5">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-medium text-indigo">{item.initiative}</h3>
                <StatusBadge status={item.status} />
              </div>
              <CivicPulseBar value={item.progress} tone="forest" />
              <p className="mt-3 text-sm text-charcoal/60">{item.note}</p>
              {perms.canManageContent && (
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-xs font-medium text-indigo hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {perms.canManageContent && (
        <form onSubmit={handleAdd} className="mt-10 flex flex-col gap-3 rounded-xl border border-gold/40 bg-gold/5 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-forest">
            Admin: add tracker item
          </p>
          <input
            placeholder="Initiative name"
            value={form.initiative}
            onChange={(e) => setForm({ ...form, initiative: e.target.value })}
            className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo"
          />
          <div className="flex gap-3">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              max="100"
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: e.target.value })}
              className="w-28 rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo"
            />
          </div>
          <textarea
            placeholder="Short note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            rows={2}
            className="rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-indigo"
          />
          <button
            type="submit"
            className="self-start rounded-full bg-indigo px-5 py-2 text-sm font-medium text-ivory hover:bg-indigo-light"
          >
            Add item
          </button>
        </form>
      )}
    </div>
  );
}
