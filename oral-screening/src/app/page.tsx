import React from "react";
import ScreeningFlow from "@/components/ScreeningFlow";

interface Props {}

const Home = (props: Props) => {
  const {} = props;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 p-8">
      <ScreeningFlow />
    </main>
  );
};

export default Home;
