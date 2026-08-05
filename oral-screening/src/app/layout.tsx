import React from "react";
import type { Metadata } from "next";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "Tanuh AI - Capture Images",
  description: "Oral screening image capture flow (Tanuh AI mobile app)",
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-sans antialiased"> 
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
