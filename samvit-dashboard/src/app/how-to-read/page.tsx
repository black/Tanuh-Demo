import type { Metadata } from "next";
import { DataGate } from "@/components/data/DataGate";
import { HowToRead } from "@/components/guide/HowToRead";

export const metadata: Metadata = { title: "How to read this" };

export default function HowToReadPage() {
  return (
    <DataGate>
      <HowToRead />
    </DataGate>
  );
}
