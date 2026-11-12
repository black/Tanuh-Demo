/*
 * Display thresholds: page choices, not scoring settings. Changing them changes no score,
 * only what the page lists and what the Quality Dimensions note under the failures table says.
 */

/** Rows per page in the Workers table and the failures table. */
export const PAGE_SIZE = 10;

/** Workers in each of the Health Check's List View lists. */
export const RANK_LIST_SIZE = 5;

/** A worker failed a rule heavily when it failed on at least this share of their records
 *  that week (and applied to at least rule_n_min of them). */
export const HEAVY_FAILURE_RATE = 0.15;

/** "The top workers" of a rule are this share of the workers with any failure of it,
 *  taking those with the most failures first (at least one worker). */
export const TOP_WORKERS_SHARE = 0.2;

/** The failures are called concentrated when the top workers account for at least this
 *  share of them, and spread otherwise. */
export const CONCENTRATED_SHARE = 0.5;
