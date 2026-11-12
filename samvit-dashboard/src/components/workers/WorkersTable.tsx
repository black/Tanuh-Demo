import { f2 } from "@/lib/format";
import { STATUS_LABEL, STATUS_VARIANT } from "@/lib/labels";
import { placeOf, previousTrust, statusOf, type Model, type WorkerView } from "@/lib/model";
import type { Score, WorkerWeek } from "@/lib/types";
import { selectableRow } from "@/lib/utils";
import { Badge } from "@/components/shadcn/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { ScoreChange } from "@/components/ui/ScoreChange";
import { WorkerName } from "./WorkerName";

const Muted = ({ children }: { children: React.ReactNode }) => <span className="text-base-disabled">{children}</span>;

function Gate({ wk, score }: { wk: WorkerWeek | null; score: Score | null }) {
  if (!wk) return <>—</>;
  if (wk.insufficient) return <Muted>—</Muted>;
  return score ? <>{f2(score.scale)}</> : <Muted>Not measured</Muted>;
}

function Dq({ w, k }: { w: WorkerView; k: number }) {
  const wk = w.w[k];
  if (!wk) return <Muted>No records</Muted>;
  if (wk.insufficient) return <Muted>Insufficient</Muted>;
  if (!wk.scores.trust) return <Muted>Not measured</Muted>;
  return <ScoreChange score={wk.scores.trust} previous={previousTrust(w, k)} />;
}

function Status({ wk }: { wk: WorkerWeek | null }) {
  const s = wk ? statusOf(wk) : null;
  if (!s) return <span className="whitespace-nowrap text-mobile-label-lg text-base-disabled">{wk ? "No status" : "No records"}</span>;
  return <Badge variant={STATUS_VARIANT[s]}>{STATUS_LABEL[s]}</Badge>;
}

/* Every worker for the period: Name, Location, DQ Score, the three gates and Status.
 * Genuineness is provenance confidence. */
export function WorkersTable({ m, k, workers, selected, onSelect }: { m: Model; k: number; workers: WorkerView[]; selected: string | null; onSelect: (key: string) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead><TableHead>Location</TableHead><TableHead>DQ Score</TableHead><TableHead>Sufficiency</TableHead><TableHead title="Provenance confidence">Genuineness</TableHead><TableHead>Fidelity</TableHead><TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workers.length ? workers.map((w) => {
          const wk = w.w[k];
          return (
            <TableRow key={w.key} {...selectableRow(() => onSelect(w.key), w.key === selected)}>
              <TableCell><WorkerName w={w} /></TableCell>
              <TableCell>{placeOf(m, w, k)}</TableCell>
              <TableCell><Dq w={w} k={k} /></TableCell>
              <TableCell><Gate wk={wk} score={wk?.scores.sufficiency ?? null} /></TableCell>
              <TableCell><Gate wk={wk} score={wk?.scores.provenance_confidence ?? null} /></TableCell>
              <TableCell><Gate wk={wk} score={wk?.scores.quality ?? null} /></TableCell>
              <TableCell><Status wk={wk} /></TableCell>
            </TableRow>
          );
        }) : (
          <TableRow><TableCell colSpan={7} className="py-3 text-base-subtle">No workers match these filters.</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
