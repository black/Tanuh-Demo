import React from "react";
import CaptureFlow from "@/components/CaptureFlow";

interface Props {}

const Home = (props: Props) => {
  const {} = props;

  return (
    <main className="bg-surface-disabled">
      <div className="mx-auto w-full max-w-[420px]">
        <CaptureFlow />
      </div>
    </main>
  );
};

export default Home;
