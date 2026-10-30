"use client";

import { useCallback, useEffect, useState } from "react";

// Stored per device (localStorage) until the PRD decides between device and
// account scope; swap the read/write here for a user-profile call if needed.
const STORAGE_KEY = "tanuh.oralScreening.hideReferenceImages";

export function useReferencePreference() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      setHidden(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // Storage blocked — fall back to showing references.
    }
  }, []);

  const update = useCallback((value: boolean) => {
    setHidden(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    } catch {
      // Preference just won't persist this session.
    }
  }, []);

  return [hidden, update] as const;
}
