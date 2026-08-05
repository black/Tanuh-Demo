import React from "react";

// Stand-in for the clinical reference/capture photography used in the
// Figma file. Figma's image assets are served from a local desktop
// session (localhost:3845) and aren't reachable outside that session, so
// this renders a soft gradient tile instead. Swap the `src` prop in for a
// real photo/asset URL once available.

interface Props {
  seed: string;
  className?: string;
}

const PlaceholderPhoto = (props: Props) => {
  const { seed, className = "" } = props;

  const hue = Math.abs(hashString(seed)) % 360;

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(160deg, hsl(${hue} 55% 78%), hsl(${
          (hue + 30) % 360
        } 45% 60%))`,
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" opacity={0.55}>
        <path
          d="M4 15c2.5 3 13.5 3 16 0"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M6 12c3-4 9-4 12 0"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export default PlaceholderPhoto;
