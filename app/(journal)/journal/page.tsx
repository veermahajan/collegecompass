"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SiteNav } from "@/components/ui/nav";
import { CompassDivider } from "@/components/ui/compass-mark";
import { JOURNAL_TAGS, JOURNAL_TAG_LABELS, type JournalTag } from "@/lib/journal-tags";

// Phase B1 — Journal / Persistent Writing Space (spec Sec 6, Workflow B).
// Notebook-style two-pane layout: entry list on the left, editor on the
// right. Autosave fires on a debounce after typing, on a standing
// interval while dirty, and immediately on blur — never only on a
// manual "Save" click. Entries are private to the signed-in user by
// default; there is no sharing surface in this MVP.

type JournalEntry = {
  id: string;
  title: string;
  body: string;
  tag: JournalTag | null;
  createdAt: string;
  updatedAt: string;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DEBOUNCE_MS = 1200;
const AUTOSAVE_INTERVAL_MS = 8000;

function snippet(body: string) {
  const trimmed = body.trim().replace(/\s+/g, " ");
  return trimmed.length > 90 ? `${trimmed.slice(0, 90)}…` : trimmed || "Empty entry";
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<JournalTag | "all">("all");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftTag, setDraftTag] = useState<JournalTag | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [loadError, setLoadError] = useState<string | null>(null);

  const dirtyRef = useRef(false);
  const savingRef = useRef(false);
  const selectedIdRef = useRef<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Save reads from this ref rather than the draft* state values directly —
  // state setters are async, so a `save` closure captured at keystroke time
  // (before React re-renders) would otherwise persist a version one
  // keystroke stale. The ref is always current the instant the user types.
  const draftRef = useRef({ title: "", body: "", tag: null as JournalTag | null });

  selectedIdRef.current = selectedId;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/journal")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load entries (${res.status})`);
        return res.json();
      })
      .then((data: { entries: JournalEntry[] }) => {
        if (cancelled) return;
        setEntries(data.entries);
        if (data.entries.length > 0) selectEntry(data.entries[0]);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message ?? "Failed to load entries");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectEntry(entry: JournalEntry) {
    setSelectedId(entry.id);
    setDraftTitle(entry.title);
    setDraftBody(entry.body);
    setDraftTag(entry.tag);
    draftRef.current = { title: entry.title, body: entry.body, tag: entry.tag };
    dirtyRef.current = false;
    setSaveStatus("idle");
  }

  const save = useCallback(async () => {
    const id = selectedIdRef.current;
    if (!id || !dirtyRef.current || savingRef.current) return;

    savingRef.current = true;
    setSaveStatus("saving");
    const payload = draftRef.current;
    dirtyRef.current = false;

    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("save failed");
      const { entry }: { entry: JournalEntry } = await res.json();
      setEntries((prev) =>
        prev
          ? [entry, ...prev.filter((e) => e.id !== entry.id)].sort(
              (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)
            )
          : prev
      );
      setSaveStatus("saved");
    } catch {
      dirtyRef.current = true; // let the next trigger retry
      setSaveStatus("error");
    } finally {
      savingRef.current = false;
    }
  }, []);

  function markDirty(patch: Partial<{ title: string; body: string; tag: JournalTag | null }>) {
    draftRef.current = { ...draftRef.current, ...patch };
    dirtyRef.current = true;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(save, AUTOSAVE_DEBOUNCE_MS);
  }

  // Standing interval flush, independent of the debounce, so a long pause
  // between keystrokes without a blur still gets persisted periodically.
  useEffect(() => {
    const interval = setInterval(() => {
      if (dirtyRef.current) save();
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [save]);

  function handleBlur() {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    save();
  }

  async function handleNewEntry() {
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "", body: "", tag: null }),
    });
    if (!res.ok) return;
    const { entry }: { entry: JournalEntry } = await res.json();
    setEntries((prev) => (prev ? [entry, ...prev] : [entry]));
    selectEntry(entry);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry? This can't be undone.")) return;
    const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
    if (!res.ok) return;

    const next = (entries ?? []).filter((e) => e.id !== id);
    setEntries(next);

    if (id === selectedIdRef.current) {
      if (next.length > 0) {
        selectEntry(next[0]);
      } else {
        setSelectedId(null);
        setDraftTitle("");
        setDraftBody("");
        setDraftTag(null);
        draftRef.current = { title: "", body: "", tag: null };
        dirtyRef.current = false;
        setSaveStatus("idle");
      }
    }
  }

  const visibleEntries = useMemo(() => {
    if (!entries) return [];
    return tagFilter === "all" ? entries : entries.filter((e) => e.tag === tagFilter);
  }, [entries, tagFilter]);

  const statusLabel: Record<SaveStatus, string> = {
    idle: "",
    saving: "Saving…",
    saved: "Saved",
    error: "Couldn't save — retrying",
  };

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1180px] px-6 py-12">
        <div className="mb-2 flex items-center gap-2 font-mono text-[0.78rem] font-medium uppercase tracking-[0.08em] text-sage-deep">
          <span className="h-px w-4 bg-sage-deep" />
          Private journal
        </div>
        <h1 className="mb-2 text-4xl leading-[1.1]">Your writing space</h1>
        <p className="mb-8 max-w-[560px] text-[1.02rem] text-ink-soft">
          Drafts, story ideas, and things worth remembering — visible only to
          you. Nothing here is shared.
        </p>

        <CompassDivider />

        {loadError && (
          <p className="mt-6 rounded-xl border border-line bg-white p-4 text-sm text-ink-soft">
            {loadError}
          </p>
        )}

        {!loadError && (
          <div className="mt-8 grid gap-6 md:grid-cols-[280px_1fr]">
            <aside className="rounded-2xl border border-line bg-canvas-deep p-4">
              <button
                type="button"
                onClick={handleNewEntry}
                className="mb-4 w-full rounded-full bg-sage-deep px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink"
              >
                + New entry
              </button>

              <div className="mb-4 flex flex-wrap gap-1.5">
                <TagPill
                  active={tagFilter === "all"}
                  onClick={() => setTagFilter("all")}
                  label="All"
                />
                {JOURNAL_TAGS.map((tag) => (
                  <TagPill
                    key={tag}
                    active={tagFilter === tag}
                    onClick={() => setTagFilter(tag)}
                    label={JOURNAL_TAG_LABELS[tag]}
                  />
                ))}
              </div>

              {entries === null && (
                <p className="px-1 text-sm text-ink-soft">Loading…</p>
              )}
              {entries !== null && visibleEntries.length === 0 && (
                <p className="px-1 text-sm text-ink-soft">
                  No entries yet. Start one above.
                </p>
              )}

              <ul className="flex flex-col gap-1.5">
                {visibleEntries.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => selectEntry(entry)}
                      className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                        entry.id === selectedId
                          ? "border-sage-deep bg-white"
                          : "border-transparent hover:bg-white/60"
                      }`}
                    >
                      <div className="truncate font-display text-[0.95rem] font-semibold text-ink">
                        {entry.title || "Untitled entry"}
                      </div>
                      <div className="truncate text-[0.8rem] text-ink-soft">
                        {snippet(entry.body)}
                      </div>
                      {entry.tag && (
                        <div className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.06em] text-sky">
                          {JOURNAL_TAG_LABELS[entry.tag]}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <section className="rounded-2xl border border-line bg-white p-7">
              {selectedId ? (
                <>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {JOURNAL_TAGS.map((tag) => (
                        <TagPill
                          key={tag}
                          active={draftTag === tag}
                          onClick={() => {
                            const nextTag = draftTag === tag ? null : tag;
                            setDraftTag(nextTag);
                            markDirty({ tag: nextTag });
                            // Discrete action, not continuous typing — save
                            // right away instead of waiting on the debounce.
                            handleBlur();
                          }}
                          label={JOURNAL_TAG_LABELS[tag]}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[0.75rem] text-ink-soft">
                        {statusLabel[saveStatus]}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(selectedId)}
                        className="font-mono text-[0.75rem] text-ink-soft underline decoration-line underline-offset-2 hover:text-ink"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <input
                    value={draftTitle}
                    onChange={(e) => {
                      setDraftTitle(e.target.value);
                      markDirty({ title: e.target.value });
                    }}
                    onBlur={handleBlur}
                    placeholder="Untitled entry"
                    className="mb-4 w-full border-none bg-transparent font-display text-[1.8rem] font-semibold text-ink outline-none placeholder:text-ink-soft/50"
                  />

                  <textarea
                    value={draftBody}
                    onChange={(e) => {
                      setDraftBody(e.target.value);
                      markDirty({ body: e.target.value });
                    }}
                    onBlur={handleBlur}
                    placeholder="Start writing…"
                    className="min-h-[420px] w-full resize-y border-none bg-transparent text-[1rem] leading-[1.7] text-ink outline-none placeholder:text-ink-soft/50"
                  />
                </>
              ) : (
                <p className="text-ink-soft">
                  {entries === null ? "Loading…" : "Select or create an entry to start writing."}
                </p>
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
}

function TagPill({
  active,
  onClick,
  onBlurCapture,
  label,
}: {
  active: boolean;
  onClick: () => void;
  onBlurCapture?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onBlurCapture={onBlurCapture}
      className={`rounded-full border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.04em] transition-colors ${
        active
          ? "border-sage-deep bg-sage-deep text-white"
          : "border-line text-ink-soft hover:border-ink-soft"
      }`}
    >
      {label}
    </button>
  );
}
