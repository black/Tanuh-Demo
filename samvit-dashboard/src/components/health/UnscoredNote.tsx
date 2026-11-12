"use client";
import { useRouter } from "next/navigation";
import type { Period } from "@/lib/model";
import { Button } from "@/components/shadcn/button";
import { ROUTES } from "@/components/layout/routes";

/* The line under the KPIs, in the design's place for "records awaiting quality check":
 * how many workers sent too few records to be scored, with a link to them. */
export function UnscoredNote({ count, minimum, period }: { count: number; minimum?: number; period: Period }) {
  const router = useRouter();
  const min = minimum ?? "the minimum";
  if (!count) return <p className="text-web-label-sm text-link-default">Every worker with records this {period} had enough to be scored.</p>;
  return (
    <p className="flex flex-wrap items-center gap-1 text-web-label-sm text-link-default">
      {count} worker{count === 1 ? "" : "s"}{" "}
      {period === "month" ? `had no week with ${min} or more records this month` : `submitted fewer than ${min} records this week`} and could not be scored.
      <Button variant="link" size="link" onClick={() => router.push(`${ROUTES.workers}?status=ins`)}>See who →</Button>
    </p>
  );
}
