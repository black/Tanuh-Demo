"use client";
/*
 * Loads dashboard.json, map.json and india-states.json from the site's root and shares them,
 * with the selected period, with every page. The map files are optional: only the Health
 * Check map needs them.
 *
 * The selection is a week. In the Month view the page shows that week's month, and choosing
 * a month selects its latest week, so switching between Week and Month keeps the place.
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buildModel, type Model, type Period } from "@/lib/model";
import { monthlyModel } from "@/lib/months";
import { buildMapShapes, type MapShapes } from "@/lib/map";
import type { DashboardDoc, MapDoc, StatesDoc } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Load<T> = { status: "loading" } | { status: "ready"; value: T } | { status: "missing"; reason: string };

interface DashboardData {
  /** The weekly model, as stored. */
  data: Load<Model>;
  map: Load<MapShapes>;
  period: Period;
  setPeriod: (p: Period) => void;
  /** The model for the selected period and the index of the selected week or month in it. */
  view: { m: Model; k: number } | null;
  /** Selects the k-th week or month of `view.m`. */
  setK: (k: number) => void;
}

const Ctx = createContext<DashboardData | null>(null);

async function readJson<T>(name: string): Promise<T> {
  let r: Response;
  try {
    r = await fetch(`${BASE}/${name}`, { cache: "no-store" });
  } catch {
    throw new Error("it could not be read");
  }
  if (!r.ok) throw new Error(r.status === 404 ? "there is no such file" : `the server answered ${r.status}`);
  try {
    return (await r.json()) as T;
  } catch {
    throw new Error("the file is not valid JSON");
  }
}

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Load<Model>>({ status: "loading" });
  const [map, setMap] = useState<Load<MapShapes>>({ status: "loading" });
  const [week, setWeek] = useState(0);
  const [period, setPeriod] = useState<Period>("week");

  useEffect(() => {
    let live = true;
    readJson<DashboardDoc>("dashboard.json")
      .then((doc) => {
        if (!doc || !Array.isArray(doc.weeks) || !doc.weeks.length || !Array.isArray(doc.workers)) throw new Error("the file holds no weeks");
        if (doc.schema_version !== 1) console.warn("dashboard.json schema_version", doc.schema_version, "— this page was written for 1");
        const model = buildModel(doc);
        if (!live) return;
        setData({ status: "ready", value: model });
        setWeek(model.weeks.length - 1);
        // india-states.json is optional: without it the map starts at the state.
        const states = readJson<StatesDoc>("india-states.json").then((s) => (s && Array.isArray(s.states) ? s : null)).catch(() => null);
        return readJson<MapDoc>("map.json")
          .then(async (m) => {
            if (!m || !Array.isArray(m.taluks)) throw new Error("the file holds no taluks");
            if (m.tenant !== doc.tenant) throw new Error(`it is the map of tenant "${m.tenant}" while this page shows tenant "${doc.tenant}", so it is not drawn`);
            const shapes = buildMapShapes(m, await states);
            if (live) setMap({ status: "ready", value: shapes });
          })
          .catch((e: Error) => live && setMap({ status: "missing", reason: e.message }));
      })
      .catch((e: Error) => {
        if (!live) return;
        setData({ status: "missing", reason: e.message });
        setMap({ status: "missing", reason: "dashboard.json could not be read" });
      });
    return () => {
      live = false;
    };
  }, []);

  const months = useMemo(() => (data.status === "ready" ? monthlyModel(data.value) : null), [data]);

  const value = useMemo<DashboardData>(() => {
    const view =
      data.status !== "ready" ? null : period === "month" && months ? { m: months.model, k: months.monthOfWeek[week] } : { m: data.value, k: week };
    const setK = (k: number) => setWeek(period === "month" && months ? months.lastWeekOfMonth[k] : k);
    return { data, map, period, setPeriod, view, setK };
  }, [data, map, period, months, week]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDashboardData() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDashboardData must be used inside DashboardDataProvider");
  return v;
}

/** The model for the selected period and the selected week or month; only for components
 *  rendered once the data is ready. */
export function useModel() {
  const { view, setK } = useDashboardData();
  if (!view) throw new Error("useModel needs dashboard.json to be loaded");
  return { m: view.m, k: view.k, setK };
}
