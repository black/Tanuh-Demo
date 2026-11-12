/* The selected week's or month's worker scores as CSV, for the download button in the top bar. */
import { groupOf, statusOf, talukName, type Model } from "./model";
import { STATUS_LABEL } from "./labels";
import type { WorkerWeek } from "./types";

const cell = (v: string | number | null | undefined) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const scale = (wk: WorkerWeek, key: keyof WorkerWeek["scores"]) =>
  !wk.insufficient && wk.scores[key] ? wk.scores[key]!.scale.toFixed(2) : "";

export function workersCsv(m: Model, k: number) {
  const head = ["worker_id", "name", "village", "taluk", "records", "dq_score", "sufficiency", "provenance_confidence", "fabrication_suspicion", "fidelity", "status"];
  const rows = m.workers.flatMap((w) => {
    const wk = w.w[k];
    if (!wk) return [];
    const s = statusOf(wk);
    const fab = !wk.insufficient && wk.scores.fabrication_suspicion ? wk.scores.fabrication_suspicion.value.toFixed(0) : "";
    return [[w.worker_id, w.name, w.village_name, talukName(m, groupOf(m, w, k)), wk.n_records, scale(wk, "trust"), scale(wk, "sufficiency"), scale(wk, "provenance_confidence"), fab, scale(wk, "quality"), s ? STATUS_LABEL[s] : ""]];
  });
  return [head, ...rows].map((r) => r.map(cell).join(",")).join("\n") + "\n";
}

export function downloadText(name: string, text: string, type = "text/csv") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
