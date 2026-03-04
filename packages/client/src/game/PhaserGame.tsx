import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import { EventBus } from "./EventBus";
import { StartGame } from "./main";

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {
  currentActiveScene?: (scene: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
  function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef<Phaser.Game | null>(null);

    useLayoutEffect(() => {
      if (game.current === null) {
        game.current = StartGame("game-container");

        if (typeof ref === "function") {
          ref({ game: game.current, scene: null });
        } else if (ref) {
          ref.current = { game: game.current, scene: null };
        }
      }

      return () => {
        if (game.current) {
          game.current.destroy(true);
          game.current = null;
        }
      };
    }, [ref]);

    useEffect(() => {
      const onSceneReady = (scene: Phaser.Scene) => {
        if (currentActiveScene) {
          currentActiveScene(scene);
        }

        if (typeof ref === "function") {
          ref({ game: game.current, scene });
        } else if (ref) {
          ref.current = { game: game.current, scene };
        }
      };

      EventBus.on("current-scene-ready", onSceneReady);

      return () => {
        EventBus.removeListener("current-scene-ready", onSceneReady);
      };
    }, [currentActiveScene, ref]);

    return <div id="game-container" />;
  }
);
