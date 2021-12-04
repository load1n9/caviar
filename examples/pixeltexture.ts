import { Keys, PICO8, TextureSprite, World } from "../mod.ts";
import type { KeyEvent } from "../mod.ts";

class Game extends World {
  public test = new TextureSprite(this, 10, 10, {
    data: [
      "..9..9..",
      "..9999..",
      ".AAAAAA.",
      ".A1F1FA.",
      ".AFFFFA.",
      ".FEEEEAA",
      ".EEEEEEA",
      "..E..E..",
    ],
    pixelWidth: 32,
    pixelHeight: 32,
    palette: PICO8,
  });

  public setup() {
    this.addChild(this.test);
  }
  public draw() {
  }
  public keyDown(key: KeyEvent) {
    switch (key.keycode) {
      case Keys.ARROWUP: {
        this.test.setY(this.test.y - 10);
        break;
      }
      case Keys.ARROWDOWN: {
        this.test.setY(this.test.y + 10);
        break;
      }
      case Keys.ARROWLEFT: {
        this.test.setX(this.test.x - 10);
        break;
      }
      case Keys.ARROWRIGHT: {
        this.test.setX(this.test.x + 10);
        break;
      }
    }
  }
}

const test = new Game({
  title: "test",
  width: 800,
  height: 600,
  centered: true,
  fullscreen: false,
  hidden: false,
  resizable: true,
  minimized: false,
  maximized: false,
  flags: null,
});

await test.start();
