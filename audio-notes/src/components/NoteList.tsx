"use client";

import { useEffect, useRef, useState } from "react";
import type { AudioNote, Note } from "@/lib/types";
import { TranscriptView } from "./cards";
import { DeleteIcon, SparkleIcon } from "./icons";

const card = "flex flex-col gap-4 rounded-lg border border-divider bg-white p-4";

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Delete note"
      className="rounded-full p-3 text-content transition hover:bg-surface-muted active:scale-95"
    >
      <DeleteIcon size={16} />
    </button>
  );
}

/**
 * Saved audio note: the "Summary" card (Figma node 3911:6310). "Transcript" swaps
 * the same card to the transcription view (node 3911:6894) instead of opening a sheet.
 */
function SavedAudioNote({ note, onDelete }: { note: AudioNote; onDelete: () => void }) {
  const [showTranscript, setShowTranscript] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const switchedRef = useRef(false);

  // The card changes height when it switches view; keep it in view (not on first mount).
  useEffect(() => {
    if (switchedRef.current) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    switchedRef.current = true;
  }, [showTranscript]);

  if (showTranscript) {
    return (
      <li ref={ref} className={card} aria-label="Transcription">
        <TranscriptView
          transcript={note.transcript}
          segments={note.segments}
          blob={note.blob}
          durationMs={note.durationMs}
          levels={note.levels}
          onBack={() => setShowTranscript(false)}
        />
      </li>
    );
  }
  return (
    <li ref={ref} className={card}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ai">
            <SparkleIcon />
            <h2 className="text-base leading-6 tracking-body">Summary</h2>
          </div>
        </div>
        {note.tags.length > 0 && (
          <ul className="no-scrollbar -mr-4 flex gap-2 overflow-x-auto pr-4">
            {note.tags.map((t) => (
              <li
                key={t}
                className="shrink-0 rounded-full bg-surface-muted px-2 py-1 text-xs leading-4 tracking-wide whitespace-nowrap text-content-tertiary"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs leading-4 tracking-wide text-content-tertiary">{note.summary}</p>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowTranscript(true)}
          className="rounded-lg p-2 text-xs leading-4 font-medium tracking-wide text-content transition hover:bg-surface-muted"
        >
          Transcript
        </button>
        <DeleteButton onClick={onDelete} />
      </div>
    </li>
  );
}

export default function NoteList({
  notes,
  onDelete,
}: {
  notes: Note[];
  onDelete: (id: string) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes.length]);

  if (!notes.length) {
    return (
      <div className="flex h-full items-center justify-center px-10 text-center text-xs leading-4 tracking-wide text-content-disabled">
        Tap the mic to record an audio note, or type one below.
      </div>
    );
  }
  // Newest note sits just above the input, like a conversation.
  return (
    <ul className="flex min-h-full flex-col justify-end gap-2 p-2">
      {notes.map((n) =>
        n.kind === "audio" ? (
          <SavedAudioNote key={n.id} note={n} onDelete={() => onDelete(n.id)} />
        ) : (
          <li key={n.id} className={card}>
            <p className="text-sm leading-5 tracking-body-md whitespace-pre-wrap">{n.text}</p>
            <div className="flex items-center justify-end">
              <DeleteButton onClick={() => onDelete(n.id)} />
            </div>
          </li>
        ),
      )}
      <div ref={endRef} />
    </ul>
  );
}
