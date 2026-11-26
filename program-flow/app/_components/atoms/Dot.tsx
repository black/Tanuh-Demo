import Image from "next/image";

/** 4px dot used between inline meta values. */
export function Dot({ variant = "default" }: { variant?: "default" | "divider" }) {
  return (
    <Image
      src={variant === "divider" ? "/figma/dot-divider.svg" : "/figma/dot-default.svg"}
      alt=""
      width={4}
      height={4}
      className="shrink-0"
    />
  );
}
