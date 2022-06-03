import { World } from "../../../web/dist/mod.js";
import { Game } from "./src/scenes/Game.js";

const pong = new World({
  title: "test",
  width: 1300,
  height: 800,
  resizable: true,
}, [Game]);
await pong.start();
