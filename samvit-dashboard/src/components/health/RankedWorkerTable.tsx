"use client";
import { useRouter } from "next/navigation";
import { int } from "@/lib/format";
import { placeOf, previousTrust, type Model, type WorkerView } from "@/lib/model";
import { selectableRow } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { ScoreChange } from "@/components/ui/ScoreChange";
import { WorkerName } from "@/components/workers/WorkerName";
import { ROUTES } from "@/components/layout/routes";

/* One of the two Health Check lists: Name, Location, Screening (records) and DQ Score. */
export function RankedWorkerTable({ m, k, workers, empty }: { m: Model; k: number; workers: WorkerView[]; empty: string }) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow><TableHead>Name</TableHead><TableHead>Location</TableHead><TableHead>Screening</TableHead><TableHead>DQ Score</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {workers.length ? workers.map((w) => (
          <TableRow key={w.key} {...selectableRow(() => router.push(`${ROUTES.workers}?worker=${encodeURIComponent(w.key)}`))}>
            <TableCell className="py-3 align-top"><WorkerName w={w} /></TableCell>
            <TableCell className="py-3 align-top">{placeOf(m, w, k)}</TableCell>
            <TableCell className="py-3 align-top">{int(w.w[k]!.n_records)}</TableCell>
            <TableCell className="py-3"><ScoreChange score={w.w[k]!.scores.trust!} previous={previousTrust(w, k)} /></TableCell>
          </TableRow>
        )) : (
          <TableRow><TableCell colSpan={4} className="py-3 text-base-subtle">{empty}</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
