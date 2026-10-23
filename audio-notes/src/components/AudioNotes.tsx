"use client";

import { useEffect, useState } from "react";
import { deleteNote, loadNotes, saveNote } from "@/lib/db";
import { summarize } from "@/lib/summarize";
import type { AudioNote, Note, RecordingResult } from "@/lib/types";
import { useRecorder } from "@/hooks/useRecorder";
import TopNavbar from "./TopNavbar";
import NoteList from "./NoteList";
import { ProcessingCard, RecordingCard, SummaryCard, TranscriptCard } from "./cards";
import { MicIcon, SendIcon } from "./icons";

type Draft = Omit<AudioNote, "id" | "kind" | "createdAt">;

type Phase =
  | { name: "idle" }
  | { name: "recording" }
  | { name: "processing"; recording: RecordingResult }
  | { name: "summary"; draft: Draft }
  | { name: "transcript"; draft: Draft };

const MIN_PROCESSING_MS = 1200;

export default function AudioNotes() {
  const recorder = useRecorder();
  const [phase, setPhase] = useState<Phase>({ name: "idle" });
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadNotes().then(setNotes).catch(() => {});
  }, []);

  const addNote = (note: Note) => {
    setNotes((n) => [...n, note]);
    saveNote(note).catch(() => recorder.setError("Couldn't save the note on this device."));
  };

  const startRecording = async () => {
    if (await recorder.start()) setPhase({ name: "recording" });
  };

  const finishRecording = async () => {
    const recording = await recorder.stop();
    if (!recording) return setPhase({ name: "idle" });
    setPhase({ name: "processing", recording });
    setNotice(null);
    const [{ summary, tags, source, error }] = await Promise.all([
      summarize(recording.transcript),
      new Promise((r) => setTimeout(r, MIN_PROCESSING_MS)),
    ]);
    if (source === "local" && error) setNotice(`AI summary unavailable (${error}). Showing a basic summary.`);
    setPhase({ name: "summary", draft: { ...recording, summary, tags } });
  };

  const discardRecording = () => {
    recorder.cancel();
    setPhase({ name: "idle" });
  };

  const saveDraft = (draft: Draft) => {
    addNote({ ...draft, id: crypto.randomUUID(), kind: "audio", createdAt: Date.now() });
    setNotice(null);
    setPhase({ name: "idle" });
  };

  const submitText = () => {
    const value = text.trim();
    if (!value) return;
    addNote({ id: crypto.randomUUID(), kind: "text", createdAt: Date.now(), text: value });
    setText("");
  };

  const removeNote = (id: string) => {
    setNotes((n) => n.filter((x) => x.id !== id));
    deleteNote(id).catch(() => {});
  };

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-surface sm:my-0 sm:shadow-xl">
      <TopNavbar label="Screening" sublabel="Oral" />

      <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        <NoteList notes={notes} onDelete={removeNote} />
      </main>

      <div className="shrink-0">
        {recorder.error && (
          <p role="alert" className="mx-4 mb-2 rounded-lg bg-danger-bg px-3 py-2 text-xs leading-4 tracking-wide text-danger">
            {recorder.error}
          </p>
        )}
        {notice && (
          <p role="status" className="mx-4 mb-2 rounded-lg bg-surface-muted px-3 py-2 text-xs leading-4 tracking-wide text-content-tertiary">
            {notice}
          </p>
        )}

        {phase.name === "idle" && (
          <form
            className="flex items-center gap-4 px-4 pt-2 pb-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) submitText();
              else startRecording();
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add Note ..."
              aria-label="Add a note"
              className="h-14 min-w-0 flex-1 rounded-lg border border-border bg-surface-muted px-4 text-sm tracking-wide outline-none placeholder:text-xs placeholder:font-medium placeholder:text-content-disabled focus:border-brand"
            />
            <button
              type="submit"
              aria-label={text.trim() ? "Add note" : "Record audio note"}
              className="shrink-0 rounded-full bg-brand p-4 text-white transition hover:brightness-110 active:scale-95"
            >
              {text.trim() ? <SendIcon size={24} /> : <MicIcon size={24} />}
            </button>
          </form>
        )}

        <div className="px-2 pb-2">
          {phase.name === "recording" && (
            <RecordingCard
              status={recorder.status}
              elapsedMs={recorder.elapsedMs}
              levels={recorder.levels}
              transcript={recorder.transcript}
              onDelete={discardRecording}
              onTogglePause={recorder.status === "paused" ? recorder.resume : recorder.pause}
              onDone={finishRecording}
            />
          )}
          {phase.name === "processing" && (
            <ProcessingCard
              blob={phase.recording.blob}
              durationMs={phase.recording.durationMs}
              levels={phase.recording.levels}
            />
          )}
          {phase.name === "summary" && (
            <SummaryCard
              summary={phase.draft.summary}
              tags={phase.draft.tags}
              onTranscript={() => setPhase({ name: "transcript", draft: phase.draft })}
              onSave={() => saveDraft(phase.draft)}
            />
          )}
          {phase.name === "transcript" && (
            <TranscriptCard
              transcript={phase.draft.transcript}
              segments={phase.draft.segments}
              blob={phase.draft.blob}
              durationMs={phase.draft.durationMs}
              levels={phase.draft.levels}
              onBack={() => setPhase({ name: "summary", draft: phase.draft })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
