import { ScaleFlow } from "./utils/ScaleFlow";
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { MainMenu } from "./scenes/MainMenu";
import { Game } from "./scenes/Game";
import { Background } from "./scenes/Background";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: "#000000",
  roundPixels: false,
  pixelArt: false,
  scene: [Boot, Preloader, MainMenu, Game, Background],
};

export function StartGame(parent: string): Phaser.Game {
  const scaleFlow = new ScaleFlow({ ...config, parent });
  return scaleFlow.game;
}
