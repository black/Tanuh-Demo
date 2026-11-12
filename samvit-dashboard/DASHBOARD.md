# The dashboard page, dashboard.json and map.json

`dashboard.html` shows the composite scores DQS stores for one tenant: each worker's and
each taluk's gates and TrustIndex by week, the dimension scores under them, and each rule's
outcome for each worker-week. Its Map tab draws the tenant's taluks and villages. It is
three files and two data files, all in this folder:

| File | What it holds |
|---|---|
| `dashboard.html` | The page's markup |
| `dashboard.js` | Reads `dashboard.json` and `map.json` and draws the six views |
| `dashboard.json` | The scores and each village's weekly record counts, written by `dqs dashboard export` |
| `map.json` | The outlines of the tenant's villages and taluks, and of the state's districts for the inset, written by the same command |

The page computes no score. Every score it shows is a value in `dashboard.json`. Its other
figures are counts and shares of stored values: a rule's failures across workers, a rule's
share of the week's failures, the number of workers in a band. Two choices about what to
list are the page's own, set in `dashboard.js` (see "Display thresholds" below). When
`dashboard.json` is missing or is not valid JSON, the page says so and gives the command
that writes it. When `map.json` is missing or unreadable, or its `tenant` differs from
`dashboard.json`'s, the Map tab says so, draws no map and gives the command, and the other
tabs work as before.

## The Map tab

The Map tab draws the taluks and their villages, with a small map of the state's districts
beside them on which the district holding the villages is highlighted. It follows the week
selected at the top of the page.

- Each taluk is filled with the tint of its TrustIndex band for the week and outlined in the
  band colour. A taluk with an insufficient week gets the Insufficient fill. A taluk with
  no records that week, or whose TrustIndex was not measured that week, gets the "No
  score" fill; the Taluks list beside the map says which of the two it is.
- Each taluk's name is drawn at the label point `map.json` gives for it, which lies inside
  its outline.
- Each village is shaded by the number of records filed in it that week, of every record
  type, in four shades from few to many. The shades are fixed from the largest village-week
  count in the file, so a shade means the same counts in every week. A village with no
  records that week is left unshaded. Villages are never coloured by a score: the shading
  is a count, and the page says so in its caption and in How to read this.
- Pointing at a village, or selecting it, shows its name, its taluk, its record count for
  the week and the workers who filed those records in the panel beside the map. A worker in
  `dashboard.json`'s `workers` is a button that opens their profile; any other worker is
  shown by id. Selecting a village pins it in the panel until another is selected.
- Selecting a taluk's name, on the map or in the Taluks list, opens the Workers tab filtered
  to that taluk.
- Under the map, the page gives the week's records in villages on the map, and the records
  filed under a village id `map.json` has no outline for, when there are any. Records with
  no village are not counted on the map.

`dashboard.json`'s villages are matched to `map.json`'s by `village_id` or by one of a map
village's `aliases`, so records filed under an Avni village id that the location version
aliases to an LGD village are drawn in that village.

The two files can come from different location versions. The outlines, the aliases and each
map village's taluk in `map.json` come from the tenant's current location version in the
operational database. The village a record is counted in, and `dashboard.json`'s
`villages[].taluk_id`, come from `dim_location` in the analytics database: `dqs etl run`
resolves each record to a village there as it loads it, against the location master as it
was last loaded with `dqs etl load-masters`. The Map tab places a village in a taluk
by `map.json`'s `taluk_id` and does not read `dashboard.json`'s. After a new location
version is imported, the map follows it at the next export, while records keep the
villages and taluks of the last master load until the master is exported and loaded again
and `dqs etl run --all` has re-resolved them.

## Writing dashboard.json and map.json

```bash
dqs dashboard export --tenant samvit --out deploy/site/dashboard.json \
  --outline tenants/samvit/locations/karnataka_districts.geojson
```

The command reads `DQS_DATABASE_URL`, `DQS_ANALYTICS_DATABASE_URL`, `DQS_CATALOGUE_DIR` and
`DQS_TENANT_KEY`. It reads the scores from the analytics database, so run it after
`dqs etl run`, which computes them. It reads the tenant's published rulepacks from the
operational database for the rule titles and the scoring settings. It prints
`wrote N workers and M taluks over W weeks to PATH`. When the tenant has no stored score it
prints `no scores are stored for tenant '...'; run \`dqs etl run --tenant ...\` first`,
writes nothing and exits with status 1.

After `dashboard.json`, the command writes `map.json` beside it, or at the path
`--map-out` names. It builds the file from the tenant's current location version in the
operational database, the one the last `dqs locations import` stored, and prints
`wrote the map of N villages in M taluks to PATH`. When no locations have been imported
for the tenant it prints `no locations have been imported for tenant '...'; PATH not
written` on stderr, writes no map file and still exits with status 0. If a file is already
at that path, from an earlier export, it removes it and prints `removed the earlier PATH`
on stderr, so the page does not draw an old map beside the new scores. `--outline` names a
GeoJSON file of district outlines for the inset; without it, `inset` in `map.json` is null
and the page draws no inset. A malformed outline file is refused before either file is
written.

`tenants/samvit/locations/karnataka_districts.geojson` holds Karnataka's 30 districts from
geoBoundaries (district layer under the Open Data Commons Open Database License 1.0, from
Pathways Data Pvt. Ltd. and lgdirectory.gov.in), simplified to about a kilometre.
`tenants/samvit/locations/fetch_districts.py`, next to it, downloads and rebuilds it and
says what was done to the outlines. The file's `licence` and `licence_url`
(https://opendatacommons.org/licenses/odbl/1-0/) travel into `map.json`, and the page prints
the licence under the inset as a link to that address. It is the only outline file in the
repository; another state needs a file of the same shape, and `read_outline` in
`src/dqs/analytics/dashboard_map.py` says what the export checks in it.

Each file is replaced whole, by writing a temporary file beside it and renaming it, so a
page loading it during an export reads the old file or the new one. It is written readable
by all users (mode 644), so a web server running as another user can serve it.

In the Docker demo, `demo-seed` writes both into the `dashboard-data` volume and the `site`
container serves them at `/dashboard.json` and `/map.json`; `deploy/README.md` says how to
refresh them.

## Previewing the page without Docker

Browsers do not let a page opened from a `file://` address fetch a file, so serve the
folder over HTTP. With a `dashboard.json` and `map.json` written beside the page:

```bash
cd deploy/site
python3 -m http.server 8090
```

and open http://localhost:8090/dashboard.html.

To preview with the committed sample instead, copy the page into a scratch folder beside
the sample, so that the sample is never mistaken for an export in `deploy/site`:

```bash
mkdir -p /tmp/dashboard-preview
cp deploy/site/dashboard.html deploy/site/dashboard.js \
   deploy/site/sample/dashboard.json deploy/site/sample/map.json /tmp/dashboard-preview/
cd /tmp/dashboard-preview && python3 -m http.server 8090
```

## The sample

`sample/dashboard.json` is synthetic. It was exported from the scores of the Samvit
synthetic run with seed 1 (`tenants/samvit/run_synthetic.sh 1`), then cut down to keep the
file small:

- only five workers are kept: `clin-1` and `clin-2` (the two clinicians, one in each
  taluk), `flw-01` and `flw-04` (Devanahalli, both with insufficient weeks) and `flw-14`
  (Hosakote);
- every number with a fractional part is rounded to four decimal places.

All 12 weeks, both taluks and every rule are kept. The taluk entries are left as exported,
so their worker summaries (`workers.scored`, `workers.median` and the rest) count all 26
workers of the run, not the five in the file. The `villages` entries are left as exported
too, so their counts and worker lists include the workers not kept; the Map tab shows those
workers by id.

`sample/map.json` is exported whole from the same database, with the Karnataka outline:
Samvit's current location version of 527 LGD villages in Devanahalli and Hosakote and 30
districts for the inset, about 290 KB. The village boundaries are public LGD data and the
aliases are the Avni village ids of the committed provisional crosswalk.

`sample/map-preview.png` is a screenshot of the Map tab drawn from the two sample files. The run's pack was published from an earlier
configuration, with `n_min` and `rule_n_min` of 5. Samvit's configuration now sets `n_min`
to 20, so a fresh run marks more weeks insufficient than the sample shows.

## Customising the look

The page is styled with Tailwind CSS utility classes only; there is no stylesheet of its own.
Tailwind is loaded from its CDN (`cdn.tailwindcss.com`, pinned to 3.4.16) together with the
Poppins and Material Symbols fonts from Google Fonts, so the page needs internet access.

- **Logo.** Put a `logo.png` in the same folder as `dashboard.html`. It appears at the left
  of the header, 32px high. Without the file, the page hides the image.
- **Header text.** The header reads "SAMVIT | Data Quality": the tenant key from
  `dashboard.json` in capitals, then the product name (`#product`) from `dashboard.html`.
  The avatar's tooltip (`#audience`, "District Programme Manager") is fixed text there too.
- **Colours and fonts.** Every colour is one Figma design variable, set in the
  `tailwind.config` block in the head of `dashboard.html` and named by its path after the
  first segment:

  | Class | Figma variable |
  |---|---|
  | `bg-surface-default`, `-subtle`, `-muted`, `-disabled`, `-inverse` | bg/surface/… |
  | `bg-brand-default`, `-subtle`, `-subtle-hover` | bg/brand/… |
  | `bg-danger-default`, `-subtle`; `bg-success-default`; `bg-warning-subtle` | bg/danger/…, bg/success/default, bg/warning/subtle |
  | `text-base-default`, `-muted`, `-subtle`, `-disabled` | fg/base/… |
  | `text-brand-default`, `-pressed`; `text-on-brand` | fg/brand/…, fg/on/brand |
  | `text-danger-default`, `text-success-default`, `text-warning-default`, `text-link-default` | fg/danger/default, fg/success/default, fg/warning/default, fg/link/default |
  | `border-base-muted`, `-default`, `-strong`; `border-brand-default`; `border-danger-default` | border/… |
  | `fill-…`, `stroke-…` (map and chart) | the bg/ variable of the same name; `fill-fg-…` is an fg/ variable |

  Change a value there and every class using it follows.
- **Band colours.** On the map, a High taluk marker is bg/brand/default and a Low one
  bg/danger/default. In legends and the failures table, High is bg/success/default. Mid is
  a hollow ring and Insufficient a dashed ring, both border/base/strong. The class lists
  are `DOT_CLS` and `MARKER` in `dashboard.js`.
- **Layout.** The views are built in `dashboard.js` as HTML strings with Tailwind classes.
  Shared class strings (`T_CHIP`, `T_LINK`, `TBL`, `ROW`, `PILL`) are defined once near the
  top.

## The views

- **Health Check**: four KPI cards for the selected week with the change against the week
  before, a line on workers who could not be scored, "Workers by Taluk" as a map (one marker
  per taluk coloured by its TrustIndex band, with a tooltip listing its workers) or as a
  list (the five lowest scores in the Low band and the five highest in the High band), and
  the top three rule failures across all workers.
- **Workers**: every worker, filterable by taluk and status, ten to a page, with the selected
  worker's scores, top failures and DQ score by week beside the table.
- **Quality Dimensions**: one taluk's Sufficiency, Genuineness and Fidelity, the rules of
  one dimension by failures, and the workers failing the selected rule, most failures first.
- **How to read this** (sidebar and header): the scoring method.

The design's "DQ score" is the TrustIndex. "Genuineness" shows provenance confidence, with
fabrication suspicion printed beside it; the two are never combined. Daily and Month are
shown but disabled, because scores are stored by week.

## Display thresholds

The note under the Quality Dimensions failures table counts the workers who fail one rule
often and says whether the rule's failures are concentrated in a few workers. The limits
it uses are display thresholds: they choose what the page lists and how it words it, and
change no score. They are set in the page, in the block of named constants at the top of
`dashboard.js`, and not in the rulepack.

| Constant | Value | What it chooses |
|---|---|---|
| `HEAVY_FAILURE_RATE` | 0.15 | A worker is counted as failing the rule on 15% or more of their records when the rule failed on at least this share of the worker's records that week, and applied to at least `rule_n_min` of them |
| `TOP_WORKERS_SHARE` | 0.2 | "The top workers" are this share of the workers with any failure of the rule, those with the most failures first, and at least one |
| `CONCENTRATED_SHARE` | 0.5 | The failures are called concentrated in a few workers when the top workers account for at least this share of them, and spread across many workers otherwise |

The note quotes `HEAVY_FAILURE_RATE`, so it follows a change to it.

## dashboard.json

A JSON object. Scores appear in two scales: `value`, `low` and `high` are 0 to 100, and
`scale`, `low_scale` and `high_scale` are the same numbers on the 1 to 5 scale the page
shows (`1 + 4 × value ÷ 100`). A date is an ISO `YYYY-MM-DD` string. A week runs Monday to
Sunday by visit date.

### Top level

| Field | Type | Null when |
|---|---|---|
| `schema_version` | integer | Never. Currently `1`. It is raised when a field is renamed, removed or changes meaning |
| `tenant` | string | Never. The tenant key |
| `generated_at` | string | Never. When the export ran, as an ISO timestamp with time zone |
| `scored_under` | array of stamp objects | Never. May be empty only in an empty document, which the command does not write |
| `settings` | settings object | None of the tenant's published packs is the pack a stored score names |
| `weeks` | array of `{start, end}` | Never. Every week that has a worker or taluk score, oldest first |
| `rules` | array of rule objects | Never |
| `taluks` | array of taluk objects | Never. Empty when no taluk was scored, which happens when the location and worker masters were not loaded before `dqs etl run` |
| `workers` | array of worker objects | Never |
| `villages` | array of village objects | Never. Empty when no loaded record names a village, which happens when the location master was not loaded before `dqs etl run` |

### Stamp (`scored_under[]`)

One entry for each pack and scoring version that stored scores were produced under, oldest
pack version first and packs the operational database no longer holds last.

| Field | Type | Null when |
|---|---|---|
| `rulepack_id` | string | Never |
| `rulepack_version` | integer | The pack is not among the tenant's published packs |
| `scoring_version` | string | Never. A hash of the scoring settings and rule curves |
| `worker_weeks` | integer | Never. The number of worker-week rows stamped with it |
| `taluk_weeks` | integer | Never. The number of taluk-week rows stamped with it |

When stored scores were produced under more than one pack, each week keeps the pack it was
scored under (its `rulepack_id`), but the document's `rules`, its `settings` and the band
thresholds in them come from the newest of those packs. The page shows each week's stored
scores and rule outcomes as they are, and draws band zones, the record minimum and rule
titles from the newest pack. A rule outcome whose rule is not in the newest pack is still
shown, titled by its rule id. The footer lists every pack version in `scored_under`.

### Settings (`settings`)

The scoring settings of the newest published pack that stamped a stored score.

| Field | Type | Meaning |
|---|---|---|
| `n_min` | integer | Records a week needs to be scored; fewer makes it insufficient |
| `rule_n_min` | integer | Records a rule needs in a week to count towards the score |
| `min_peers` | integer | Taluks a district needs before a taluk gets a percentile |
| `trend_window` | integer | Scored weeks a trend looks back over |
| `band_high`, `band_low` | number | Band thresholds on 0 to 100: High at or above `band_high`, Low below `band_low` |
| `band_high_scale`, `band_low_scale` | number | The same thresholds on 1 to 5 |
| `sufficiency_full` | number | The Sufficiency score at and above which Sufficiency no longer lowers the TrustIndex |
| `power_p` | number | The exponent of the power mean that combines sub-scores (`-1` is the harmonic mean) |
| `prior_weight` | number | How strongly a small worker-week's rate is pulled toward its peer group |
| `anchor_green`, `anchor_amber`, `anchor_red` | number | The default failure rates that score 100, 70 and 0 |

None of the fields is null when `settings` is present.

### Rule (`rules[]`)

Every rule of the pack the scores were stamped with, ordered by `rule_id`.

| Field | Type | Null when |
|---|---|---|
| `rule_id` | string | Never |
| `title` | string | The pack was not at hand (then `settings` is null too), or the rule has no title |
| `dimension` | string | Never. For example `quality.conformance` |
| `feeds` | string | Never. The gate the dimension feeds: `sufficiency`, `provenance`, `suspicion` or `quality` |
| `grain` | string | Never. `record` for a rule each record passes or fails; `worker` or another grain for a rule measured over many records |
| `engine` | string | Never. The engine that measures the rule |
| `plugin` | string | The rule is not measured by a plugin |
| `record_types` | array of strings | Never. The record types the rule runs on |
| `scored` | boolean | The pack was not at hand. `false` means the rule is reported but counts towards no score |
| `blocking` | boolean | The pack was not at hand |

When the pack is not at hand, the list is read from the analytics database's rule table,
which is filled by `dqs etl run` and may lag a pack published since.

### Week fields shared by workers and taluks

Each entry of a worker's or taluk's `weeks` array has these fields, and more listed below.

| Field | Type | Null when |
|---|---|---|
| `start`, `end` | string | Never. Monday and Sunday of the week |
| `rulepack_id` | string | Never. The pack it was scored under |
| `scoring_version` | string | Never |
| `n_records` | integer | Never. For a worker, the largest record count across its record types that week |
| `insufficient` | boolean | Never. True when `n_records` is below `n_min`; then every score is null |
| `scores` | object | Never. Keys `quality` (shown as Fidelity), `fabrication_suspicion`, `provenance_confidence`, `sufficiency` and `trust` (the TrustIndex), each a score object or null |
| `not_measured` | object | Never. Keys `genuineness`, `sufficiency`, `provenance`, each a boolean, or null on an insufficient week |
| `trend` | string | The week is insufficient, fewer than `trend_window` scored weeks lead up to it, or none of the patterns holds. Otherwise `consistently_low`, `recent_slip` or `consistently_high` |

A score in `scores` is null on an insufficient week and when the gate was not measured,
which the matching `not_measured` flag says: `genuineness` covers fabrication suspicion.

### Score object

| Field | Type | Null when |
|---|---|---|
| `value` | number | Never. 0 to 100 |
| `low`, `high` | number | Never. The ends of the 95% interval, 0 to 100 |
| `scale` | number | Never. `value` on 1 to 5 |
| `low_scale`, `high_scale` | number | Never. `low` and `high` on 1 to 5 |
| `band` | string | Never. `high`, `mid` or `low`, from `value`. For fabrication suspicion `high` means high suspicion |

### Taluk (`taluks[]`)

| Field | Type | Null when |
|---|---|---|
| `unit_id` | string | Never. The location id, such as `block:5603` |
| `name` | string | The location master has no row for it, or the row has no name. The page shows `unit_id` in its place |
| `level` | string | Never. `taluk` |
| `weeks` | array | Never. The shared week fields and the fields below |

Each taluk week adds:

| Field | Type | Null when |
|---|---|---|
| `workers.median`, `workers.q1`, `workers.q3` | number | No worker in the taluk had a TrustIndex that week. The TrustIndex of its scored workers, 0 to 100 |
| `workers.median_scale`, `workers.q1_scale`, `workers.q3_scale` | number | As above. The same on 1 to 5 |
| `workers.low_share` | number | As above. The share of scored workers in the Low band, 0 to 1 |
| `workers.scored` | integer | Never. Workers with a TrustIndex that week |
| `workers.insufficient` | integer | Never. Workers whose week was insufficient |
| `percentile` | number | The district has fewer than `min_peers` taluks, or this taluk has no TrustIndex that week |
| `unit_rules_measured` | integer | Never. Rules measured at taluk level; no rule is yet |
| `dimensions` | array of dimension objects | Never. Empty on an insufficient week |

A taluk's scores pool all its records for the week. They are not an average of its
workers' scores.

### Worker (`workers[]`)

One entry for each worker and peer group. A worker who screened in two peer groups has two
entries, told apart by `key`.

| Field | Type | Null when |
|---|---|---|
| `key` | string | Never. `worker_id`, or `worker_id@peer_group_key` when the peer group is known |
| `worker_id` | string | Never |
| `name` | string | The worker master has no row for the worker |
| `peer_group_key` | integer | The worker's records had no village with an ancestor at the peer-group level. The analytics database's key for the peer group |
| `village_id` | string | The worker master has no row for the worker, or the row has no village |
| `village_name` | string | `village_id` is null or not in the location master |
| `taluk_id` | string | No week of the worker is filed under a taluk. Otherwise the taluk of its latest week that has one. The page uses it only to place the worker in the profile's worker picker in a week the worker has no score |
| `weeks` | array | Never. Only the weeks the worker has a score row for; the shared week fields and the fields below |

Each worker week adds:

| Field | Type | Null when |
|---|---|---|
| `taluk_id` | string | The worker was not filed under a taluk that week; the page lists the week under "No taluk on file" |
| `dimensions` | array of dimension objects | Never. Empty on an insufficient week |
| `rules` | array of rule outcome objects | Never. One per rule with a stored outcome that week |

### Dimension object

| Field | Type | Null when |
|---|---|---|
| `dimension` | string | Never |
| `feeds` | string | Never |
| `measured` | boolean | Never. False when none of the dimension's rules was scored: each had fewer than `rule_n_min` records or is marked not scored |
| `score` | score object | `measured` is false |

### Rule outcome object

| Field | Type | Null when |
|---|---|---|
| `rule_id`, `dimension`, `feeds` | string | Never |
| `status` | string | Never. `scored`; `too_few` (fewer than `rule_n_min` records); `unscored` (the rule is marked not scored); `insufficient` (the week is insufficient) |
| `n_evaluated` | integer | Never. Records the rule applied to |
| `n_violations` | integer | Never. Records that failed it |
| `rate` | number | The rule applied to no record. `n_violations ÷ n_evaluated` |
| `statistic` | number | The rule is a record rule. Set by a rule measured over many records that scores a statistic |
| `shrunk_rate`, `shrunk_low`, `shrunk_high` | number | `status` is not `scored`. The rate pulled toward the peer group, with its 95% interval |
| `sub_score`, `sub_score_low`, `sub_score_high` | number | `status` is not `scored`. 0 to 100 |
| `anchors` | `{green, amber, red}` | The rule has no scoring curve (it is marked not scored). The rates that score 100, 70 and 0 |
| `direction` | string | As `anchors`. `higher_is_worse` or `lower_is_worse` |
| `prior` | `{alpha, beta, fitted}` | `status` is not `scored`. The peer group's Beta prior; `fitted` is false when it fell back to the pooled rate |

A rule of the pack with no outcome in a worker's week was not measured for that worker that
week; the page shows it as Not measured.

### Village (`villages[]`)

One entry for each village that loaded records name, ordered by `village_id`. The Map tab
reads these; no other tab does.

| Field | Type | Null when |
|---|---|---|
| `village_id` | string | Never. The location id of the village, such as `625248`, or an Avni village id the location master lists as a village |
| `name` | string | The location master has no row for it, or the row has no name |
| `taluk_id` | string | The location master has no row for it, or the row has no parent. The taluk's `unit_id`, such as `block:5603`, from `dim_location`. The Map tab uses `map.json`'s `taluk_id` instead |
| `weeks` | array of `{start, n_records, workers}` | Never. Only the weeks with records in the village, oldest first |

`start` is the week's Monday. `n_records` counts every loaded record of every record type
whose location is the village that week, and can differ from the sum of the workers'
`n_records` for the week. `workers` is the sorted list of the
`key`s (as in `workers[].key`) of the workers who made them, and is empty when none of the
records names a worker. A week here may be one with no score row, and so missing from
`weeks` at the top level; the page ignores such weeks.

## map.json

A JSON object with the outlines the Map tab draws. It changes only when a new location
version is imported and the export is run again. Every outline is a `rings` array: a list
of rings, each a list of `[longitude, latitude]` pairs in degrees (WGS 84), rounded to five
decimal places, without the closing point that repeats the first. A shape with several
parts has one ring for each part.

| Field | Type | Null when |
|---|---|---|
| `schema_version` | integer | Never. Currently `1` |
| `tenant` | string | Never. The tenant key |
| `generated_at` | string | Never. When the export ran |
| `location_version` | string | Never. The location version the outlines come from, `sha256:` and a hex digest |
| `taluks` | array of `{unit_id, name, rings, label}` | Never. One per taluk of the villages. `unit_id` is `block:` and the taluk id, as in `dashboard.json`. The outline is the union of its villages with the slivers between them closed and holes dropped, simplified to about 50 m |
| `taluks[].label` | `[longitude, latitude]` | The taluk's outline has no polygon. The point the page draws the taluk's name at: a point inside the largest part of the outline, chosen by shapely's `representative_point` |
| `villages` | array of `{village_id, aliases, name, taluk_id, rings}` | Never. Every village of the location version with an outline left after simplifying and rounding, ordered by `village_id`; a village too small to keep one is left out, and its records are counted as filed under a village the map has no outline for. `aliases` is the list of other ids records may name it by, empty when it has none. `taluk_id` is the taluk's `unit_id` in the location version, which the page uses to place the village. The outline keeps holes and is simplified to about 20 m |
| `inset` | `{source, licence, licence_url, districts}` | The export ran without `--outline` |
| `inset.source`, `inset.licence`, `inset.licence_url` | string | The outline file has no `source`, `licence` or `licence_url` at its top level. `licence_url` is the address of the licence's text; the page links the licence to it only when it starts with `http://` or `https://` |
| `inset.districts` | array of `{name, holds_villages, rings}` | Never. The outline file's districts, in its order, with its coordinates. `holds_villages` is true for the district that contains a point inside the tenant's villages, and false for every district when none does |
