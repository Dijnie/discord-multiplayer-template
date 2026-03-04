"use client";

import dynamic from "next/dynamic";

const AppWithoutSSR = dynamic(() => import("@/game/App"), { ssr: false });

export default function Home() {
  return <AppWithoutSSR />;
}
