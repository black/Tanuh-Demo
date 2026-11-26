import { ActionText } from "../atoms/ActionText";
import { Separator } from "../atoms/Separator";

/** Confirmation popup — built from the design's card, separator and action tokens. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="flex w-full max-w-[328px] flex-col gap-4 rounded-mobile-sm border border-border-subtle bg-surface-default p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <p id="confirm-title" className="type-title-md text-fg-default">
            {title}
          </p>
          <p className="type-body-sm text-content-secondary">{message}</p>
        </div>
        <Separator />
        <div className="flex items-center justify-end gap-4 py-1">
          <ActionText onClick={onCancel}>Cancel</ActionText>
          <ActionText primary onClick={onConfirm}>
            {confirmLabel}
          </ActionText>
        </div>
      </div>
    </div>
  );
}
