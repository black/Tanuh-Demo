export type TranscriptSegment = { text: string; endMs: number };

export type AudioNote = {
  id: string;
  kind: "audio";
  createdAt: number;
  durationMs: number;
  /** Normalised 0..1 loudness samples taken every ~100ms while recording. */
  levels: number[];
  transcript: string;
  /** Recognised phrases with the recording time (ms) at which each was finalised. */
  segments?: TranscriptSegment[];
  summary: string;
  tags: string[];
  blob: Blob;
};

export type TextNote = {
  id: string;
  kind: "text";
  createdAt: number;
  text: string;
};

export type Note = AudioNote | TextNote;

export type RecordingResult = Pick<AudioNote, "blob" | "durationMs" | "levels" | "transcript"> & {
  segments: TranscriptSegment[];
};
