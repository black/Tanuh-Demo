import type { WorkerView } from "@/lib/model";

/* A worker's name, with their worker ID under it in fg/base/disabled when the name differs. */
export function WorkerName({ w }: { w: WorkerView }) {
  const name = w.name || w.worker_id;
  return (
    <>
      {name}
      {name !== w.worker_id && <span className="block text-base-disabled">{w.worker_id}</span>}
    </>
  );
}
