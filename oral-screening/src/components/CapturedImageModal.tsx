import React from "react";
import Icon from "./Icon";
import Button from "./Button";

type Suspicious = "yes" | "no";

interface Props {
  imageUrl: string;
  suspicious: Suspicious;
  onSuspiciousChange: (value: Suspicious) => void;
  onRetake: () => void;
  onSave: () => void;
}

const CapturedImageModal = (props: Props) => {
  const { imageUrl, suspicious, onSuspiciousChange, onRetake, onSave } = props;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="flex w-full max-w-[328px] flex-col items-start gap-[17px] rounded-lg p-md shadow-[0px_0px_2px_rgba(0,0,0,0.25)]"
        style={{ backgroundColor: "#ffffff" }}
      >
        <p className="w-full text-body-lg text-text-primary">Captured Image</p>

        <div className="flex w-full flex-col items-end gap-lg">
          <div className="flex w-full flex-col items-start gap-md">
            <div className="h-32 w-full overflow-hidden rounded-lg">
              <img
                src={imageUrl}
                alt="Captured oral cavity"
                className="size-full object-cover"
              />
            </div>

            <div className="flex w-full flex-col items-start gap-sm">
              <p className="text-body-md text-text-secondary">Suspicious Lesion?</p>

              <div className="flex w-full flex-col items-start gap-sm">
                <button
                  type="button"
                  onClick={() => onSuspiciousChange("yes")}
                  className={`flex min-h-14 w-full items-center gap-sm rounded-lg p-md ${
                    suspicious === "yes"
                      ? "bg-brand-primary-dark text-brand-neutral"
                      : "bg-brand-primary-light text-brand-primary-dark"
                  }`}
                >
                  <span className="flex-1 text-left text-body-md">Yes</span>
                  {suspicious === "yes" && (
                    <Icon name="check_circle" className="text-[24px]" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onSuspiciousChange("no")}
                  className={`flex min-h-14 w-full items-center gap-sm rounded-lg p-md ${
                    suspicious === "no"
                      ? "bg-brand-primary-dark text-brand-neutral"
                      : "bg-brand-primary-light text-brand-primary-dark"
                  }`}
                >
                  <span className="flex-1 text-left text-body-md">No</span>
                  {suspicious === "no" && (
                    <Icon name="check_circle" className="text-[24px]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-full items-start justify-between">
            <Button label="Retake" variant="secondary" onClick={onRetake} />
            <Button label="Save" variant="primary" onClick={onSave} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapturedImageModal;
