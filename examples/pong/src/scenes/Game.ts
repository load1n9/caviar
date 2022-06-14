import { PICO8, Scene, TextureSprite } from "../../../../mod.ts";

export class Game extends Scene {
  ball: TextureSprite | undefined;
  p1: TextureSprite | undefined;
  p2: TextureSprite | undefined;
  vx = 2;
  vy = 2;
  score: number[] = [0, 0];
  setup() {
    this.setKeys(["W", "S", "E", "D"]);
    this.p1 = new TextureSprite(this, 0, 336, {
      data: [
        ".9.",
        ".9.",
        ".9.",
      ],
      pixelWidth: 32,
      pixelHeight: 32,
      palette: PICO8,
    });
    this.p2 = new TextureSprite(this, 1168, 336, {
      data: [
        ".A.",
        ".A.",
        ".A.",
      ],
      pixelWidth: 32,
      pixelHeight: 32,
      palette: PICO8,
    });
    this.ball = new TextureSprite(this, 568, 336, {
      data: [
        "E",
      ],
      pixelWidth: 32,
      pixelHeight: 32,
      palette: PICO8,
    });
    this.addChild(this.p1);
    this.addChild(this.p2);
    this.addChild(this.ball);
  }
  update() {
    const ball = this.ball as TextureSprite;
    const p1 = this.p1 as TextureSprite;
    const p2 = this.p2 as TextureSprite;
    if (ball.y > 25 || ball.y < 10) {
      this.vy *= -1;
    }

    if (
      ball.x < p1.x + 32 + 10 &&
      ball.y > p1.y &&
      ball.y < p1.y + 96
    ) {
      this.vx *= -1.1;
      this.vy = Math.floor(Math.random() * 8) - 4;
    }

    if (
      ball.x > p2.x - 10 &&
      ball.y > p2.y &&
      ball.y < p2.y + p2.height
    ) {
      this.vx *= -1.1;
      this.vy = Math.floor(Math.random() * 8) - 4;
    }
    if (ball.y < 25 || ball.y > 800) {
      this.vy *= -1;
    }
    if (ball.x < 25) {
      //p1 side
      ball.setX(568);
      ball.setY(336);
      this.score[1] += 1;
      this.vx = 4;
      this.vy = 4;
    }
    if (ball.x > 1168) {
      //p2 side
      ball.setX(568);
      ball.setY(336);
      this.score[0] += 1;
      this.vx = -4;
      this.vy = 4;
    }
    ball.setX(ball.x + this.vx);
    ball.setY(ball.y + this.vy);
  }
  // deno-lint-ignore no-explicit-any
  keyDown(key: any) {
    const p1 = this.p1 as TextureSprite;
    const p2 = this.p2 as TextureSprite;
    switch (key) {
      case "W":
        if (p1.y > 25) p1.setY(p1.y - 4);
        break;
      case "S":
        if (p1.y < 700) p1.setY(p1.y + 4);
        break;
      case "E":
        if (p2.y > 25) p2.setY(p2.y - 4);
        break;
      case "D":
        if (p2.y < 700) p2.setY(p2.y + 4);
        break;
    }
  }
}
