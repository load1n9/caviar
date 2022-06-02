import {
  Rectangle,
  Scene,
  World,
} from "https://deno.land/x/caviar@2.4.6/web/dist/mod.js";

export class Game extends Scene {
  ball = new Rectangle(568, 336, 32, 32, "#00ff00");
  p1 = new Rectangle(0, 336, 32, 96, "#00ff00");
  p2 = new Rectangle(1168, 336, 32, 96, "#00ff00");
  vx = 2;
  vy = 2;
  score = [0, 0];
  setup() {
    this.setBackground("#000000");
    this.setKeys(["w", "s", "e", "e"]);
    this.addChild([this.p1, this.p2, this.ball]);
  }
  update() {
    if (
      this.ball.x < this.p1.x + 42 &&
      this.ball.y > this.p1.y &&
      this.ball.y < this.p1.y + 96
    ) {
      this.vx *= -1.1;
      this.vy = Math.floor(Math.random() * 8) - 4;
    }

    if (
      this.ball.x > this.p2.x - 42 &&
      this.ball.y > this.p2.y &&
      this.ball.y < this.p2.y + this.p2.height
    ) {
      this.vx *= -1.1;
      this.vy = Math.floor(Math.random() * 8) - 4;
    }
    if (this.ball.y < 25 || this.ball.y > 800) {
      this.vy *= -1;
    }
    if (this.ball.x < 0) {
      //p1 side
      this.ball.x = 568;
      this.ball.y = 336;
      this.score[1] += 1;
      this.vx = 4;
      this.vy = 4;
    }
    if (this.ball.x > 1300) {
      //p2 side
      this.ball.x = 568;
      this.ball.y = 336;
      this.score[0] += 1;
      this.vx = -4;
      this.vy = 4;
    }
    this.ball.x += this.vx;
    this.ball.y += this.vy;
    if (this.keyDown("w") && this.p1.y > 25) this.p1.y -= 4;
    if (this.keyDown("s") && this.p1.y < 700) this.p1.y += 4;
    if (this.keyDown("e") && this.p2.y > 25) this.p2.y -= 4;
    if (this.keyDown("d") && this.p2.y < 700) this.p2.y += 4;
  }
}

const world = new World({ width: 1300, height: 800 }, [Game]);
await world.start();