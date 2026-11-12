"use client";
import type { ReactNode } from "react";
import { useDashboardData } from "@/context/DashboardData";
import { dateTime, f2, int, pct } from "@/lib/format";
import { CONCENTRATED_SHARE, HEAVY_FAILURE_RATE, TOP_WORKERS_SHARE } from "@/lib/thresholds";
import { Card } from "@/components/shadcn/card";
import { BandDot } from "@/components/ui/BandDot";

/* How to read this: the scoring method, quoting the settings in dashboard.json. */

const SECTIONS: [string, string][] = [
  ["g-what", "What is scored"],
  ["g-gates", "The three gates"],
  ["g-ti", "The DQ score (TrustIndex)"],
  ["g-scale", "Scale and bands"],
  ["g-rule", "From a rule to a score"],
  ["g-ins", "Insufficient data"],
  ["g-status", "Statuses"],
  ["g-taluk", "Taluk scores"],
  ["g-nm", "Not measured"],
  ["g-map", "The map"],
  ["g-src", "Where the numbers come from"],
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-4 flex-col gap-2">
      <h3 className="text-balance text-mobile-title-md text-base-default">{title}</h3>
      {children}
    </section>
  );
}

function Defs({ items }: { items: [ReactNode, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-2">
      {items.map(([t, d], i) => (
        <div key={i} className="contents">
          <dt className="flex items-center gap-2 self-start text-mobile-title-sm">{t}</dt>
          <dd>{d}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HowToRead() {
  // The method is described for the stored weekly scores, whatever period is selected.
  const { data } = useDashboardData();
  if (data.status !== "ready") return null;
  const m = data.value;
  const P = m.settings;
  const v = (x: number | undefined, f?: (n: number) => string) => (x == null ? "—" : f ? f(x) : String(x));
  const mean = P.power_p === -1 ? "weighted harmonic mean" : P.power_p != null ? `weighted power mean with p = ${P.power_p}` : "weighted power mean";
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[theme(width.sidebar-open)_minmax(0,1fr)] xl:h-full xl:min-h-0">
      <nav aria-label="Sections" className="flex flex-col gap-2 self-start md:sticky md:top-0">
        <span className="text-mobile-label-lg text-base-subtle">HOW TO READ THIS</span>
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="text-mobile-body-md text-link-default hover:underline">{label}</a>
        ))}
      </nav>
      <Card asChild className="flex max-w-prose flex-col gap-6 p-6 text-mobile-body-md text-base-default xl:max-h-full xl:overflow-y-auto">
        <article>
          <Section id="g-what" title="What is scored">
            <p>Each score describes a stream of data: the records one worker submitted in one week, or all records from one taluk in one week. It says how far that data can be trusted to support a clinical or programme decision. Individual records are checked against rules and keep their rule outcomes; they do not get a score of their own.</p>
            <p>The Workers table lists workers by ID. The Health Check&apos;s List View shows the five lowest and five highest DQ scores of the week, so that supervisors can see who needs support first. A worker&apos;s scores are meant for that worker and their supervisor.</p>
            <p>Scores are stored by week. The Month view groups the weeks by calendar month (a week counts in the month its Thursday falls in): a month&apos;s score is the average of its weekly scores, its band is read from that average, its records and rule failures are summed, and its status is that of its latest week. A month with no scored week is Insufficient. There are no daily scores.</p>
          </Section>
          <Section id="g-gates" title="The three gates">
            <Defs items={[
              ["Sufficiency", "Is there enough data to judge? Protocol questions answered, referral details filled in, the expected oral images captured."],
              ["Genuineness", <>Two figures that are never combined. <b>Provenance confidence</b> is evidence that a record was captured live in the field: a location was captured, the visit time is plausible, the entry was made promptly. Low provenance is often a connectivity problem and is not treated as a sign of fabrication. <b>Fabrication suspicion</b> is evidence that data was manufactured, such as a GPS fix far outside the claimed village, or an entry completed before the visit it records. The dashboard shows provenance confidence as Genuineness, with fabrication suspicion beside it.</>],
              ["Fidelity", "Are the answers internally correct? The CBAC and PHQ-2 scores recomputed from their answers, referrals consistent with symptoms, dates in order. The engineering brief calls this gate Quality."],
            ]} />
          </Section>
          <Section id="g-ti" title="The DQ score (TrustIndex)">
            <p>The DQ score is the TrustIndex. It combines Fidelity, fabrication suspicion and Sufficiency:</p>
            <p className="overflow-x-auto whitespace-nowrap rounded border border-base-muted bg-surface-subtle px-4 py-2">TrustIndex = Fidelity × (1 − suspicion ÷ 100) × min(1, Sufficiency ÷ {v(P.sufficiency_full)})</p>
            <p>High suspicion pulls it down in proportion. Sufficiency below {v(P.sufficiency_full)} out of 100 pulls it down; above {v(P.sufficiency_full)} it has no further effect. When suspicion or Sufficiency is not measured, the TrustIndex is computed without it and the gate is shown as Not measured. Provenance confidence does not change the TrustIndex: it widens the 95% interval around it (the range under a score in the worker panel), and the lower the provenance, the wider the interval.</p>
          </Section>
          <Section id="g-scale" title="Scale and bands">
            <p>Scores are computed from 0 to 100 and shown from 1.00 to 5.00 (1 + 4 × score ÷ 100). Fabrication suspicion is shown from 0 to 100, where lower is better.</p>
            <Defs items={[
              [<><BandDot band="success" />High</>, `${v(P.band_high_scale, f2)} and above (${v(P.band_high)} or more out of 100)`],
              [<><BandDot band="mid" />Mid</>, `${v(P.band_low_scale, f2)} up to ${v(P.band_high_scale, f2)}`],
              [<><BandDot band="low" />Low</>, `below ${v(P.band_low_scale, f2)} (under ${v(P.band_low)})`],
              [<><BandDot band="ins" />Insufficient</>, `fewer than ${v(P.n_min)} records in the week`],
            ]} />
          </Section>
          <Section id="g-rule" title="From a rule to a score">
            <p>For each rule, the week&apos;s failure rate is the records that failed divided by the records the rule applied to. A worker with few records gets a rate pulled toward the rate of their peer group for the same week, so that two failures out of six is not read as a 33% failure rate with full confidence.</p>
            <p>The adjusted rate becomes a sub-score through an anchor curve: {v(P.anchor_green, (x) => pct(x, 0))} or less scores 100, {v(P.anchor_amber, (x) => pct(x, 0))} scores 70, {v(P.anchor_red, (x) => pct(x, 0))} or more scores 0, with straight lines between. A rule may set its own anchors.</p>
            <p>Sub-scores combine into a dimension score, and dimensions into a gate, by a {mean}. One rule failing badly pulls the dimension down and is not averaged away by several rules passing.</p>
            <p>The failure rates beside each reason on the Health Check and in the worker panel are counts: the failures of that rule divided by the records it checked, for the week.</p>
          </Section>
          <Section id="g-ins" title="Insufficient data">
            <p>A worker-week with fewer than {v(P.n_min)} records is marked Insufficient and gets no score; its rule outcomes are still kept. Within a scored week, a rule that applied to fewer than {v(P.rule_n_min)} records is left out of that week&apos;s score.</p>
          </Section>
          <Section id="g-status" title="Statuses">
            <p>Each status looks at the last {v(P.trend_window)} scored weeks, ending at the selected week. Weeks marked Insufficient are skipped.</p>
            <Defs items={[
              ["Consistently Low", "Low in at least three quarters of them."],
              ["Recent Slip", "Low this week, and not Low in either of the two scored weeks before it."],
              ["Consistently High", "High in all of them."],
              ["Insufficient", "No score this week."],
            ]} />
            <p>A worker or taluk with fewer than {v(P.trend_window)} scored weeks has no status.</p>
          </Section>
          <Section id="g-taluk" title="Taluk scores">
            <p>A taluk&apos;s score pools every record from the taluk for the week and scores them the same way as a worker&apos;s. It is not the average of its workers&apos; scores. Quality Dimensions shows one taluk at a time. A percentile against other taluks needs at least {v(P.min_peers)} taluks in the district.</p>
          </Section>
          <Section id="g-nm" title="Not measured">
            <p>A rule is Not measured in a week when no outcome is stored for it: none of the week&apos;s records were of a type it applies to, or the engine that measures it has not run on them. A rule marked Not scored is measured and reported but does not count towards any score. A dimension is Not measured when none of its rules had enough records to score, and a gate is Not measured when none of its dimensions was.</p>
          </Section>
          <Section id="g-map" title="The map">
            <p>The Health Check map draws the taluks with one marker each, coloured by the taluk&apos;s DQ score band for the selected week: filled teal for High, filled red for Low, hollow for Mid, and dashed for a taluk with too few records or no score. Point at a marker to see the taluk&apos;s score and one dot per worker with records that week, coloured by that worker&apos;s band; point at a worker&apos;s dot to see that worker. Select a marker to list the taluk&apos;s workers.</p>
          </Section>
          <Section id="g-src" title="Where the numbers come from">
            <p>Every score on this page is read from <code>dashboard.json</code>, which <code>dqs dashboard export</code> wrote on {dateTime(m.generatedAt, "long")} from the scores stored for tenant {m.tenant}. In the Week view the page shows what was stored and does not compute any score; the Month view averages the stored weekly scores. The cut-offs in the note under the Quality Dimensions failures table (a failure rate of {pct(HEAVY_FAILURE_RATE, 0)} or more, and failures called concentrated when the top {pct(TOP_WORKERS_SHARE, 0)} of affected workers account for at least {pct(CONCENTRATED_SHARE, 0)} of them) are set in the app and are not part of the rulepack. The scores were produced under:</p>
            <ul className="flex list-disc flex-col gap-1 pl-6">
              {m.stamps.length ? m.stamps.map((s) => (
                <li key={s.rulepack_id + s.scoring_version}>Rulepack version {s.rulepack_version ?? "—"}: {int(s.worker_weeks)} worker-weeks and {int(s.taluk_weeks)} taluk-weeks</li>
              )) : <li>—</li>}
            </ul>
          </Section>
        </article>
      </Card>
    </div>
  );
}
