import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { figmaColors } from "../../figma-tokens";

export const metadata: Metadata = {
  title: "Tanuh AI - Guided Capture",
  description: "Guided oral screening image capture (Tanuh AI mobile app)",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: figmaColors["bg/brand/default"],
};

interface Props {
  children: React.ReactNode;
}

const RootLayout = (props: Props) => {
  const { children } = props;

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
};

export default RootLayout;
