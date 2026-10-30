"use client";

import React, { useEffect } from "react";
import Icon from "./Icon";

export type ToastMessage = {
  id: number;
  title: string;
  detail?: string;
};

interface Props {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

const DISMISS_AFTER_MS = 3000;

const Toast = (props: Props) => {
  const { toast, onDismiss } = props;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onDismiss, DISMISS_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      role="status"
      className="animate-toast-in absolute bottom-[96px] left-1/2 z-40 flex w-[calc(100%-32px)] -translate-x-1/2 items-center gap-mobile-sm rounded-mobile-sm bg-inverse px-mobile-md py-mobile-sm text-base-inverse shadow-lg"
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-default">
        <Icon name="check" className="text-[16px] font-bold" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-mobile-title-small">{toast.title}</p>
        {toast.detail && <p className="truncate text-mobile-body-small text-base-inverse/75">{toast.detail}</p>}
      </div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss" className="flex size-6 shrink-0 items-center justify-center text-base-inverse/70">
        <Icon name="close" className="text-[18px]" />
      </button>
    </div>
  );
};

export default Toast;
