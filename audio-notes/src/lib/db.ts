import type { Note } from "./types";

// Notes (including audio blobs) live in IndexedDB so they survive reloads.
const DB_NAME = "audio-notes";
const STORE = "notes";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadNotes(): Promise<Note[]> {
  const notes = await run<Note[]>("readonly", (s) => s.getAll());
  return notes.sort((a, b) => a.createdAt - b.createdAt);
}

export function saveNote(note: Note) {
  return run("readwrite", (s) => s.put(note));
}

export function deleteNote(id: string) {
  return run("readwrite", (s) => s.delete(id));
}
