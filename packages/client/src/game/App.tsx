"use client";

import { useEffect, useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import { useDiscordAuth } from "@/hooks/use-discord-auth";

export default function App() {
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const { status, init } = useDiscordAuth();

  useEffect(() => {
    init();
  }, [init]);

  if (status !== "ready") {
    return <div id="gameParent">{status}</div>;
  }

  return (
    <div id="gameParent">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img id="guide" src="/assets/1280x720-trans.png" alt="" />
      <PhaserGame ref={phaserRef} />
    </div>
  );
}
