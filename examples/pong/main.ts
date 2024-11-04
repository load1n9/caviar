import { Rectangle, Scene, World } from "../../mod.ts";

class Game extends Scene {
  vx = 4;
  vy = 4;
  p1 = new Rectangle(0, 336, 32, 96, "#6298bf");
  p2 = new Rectangle(1168, 336, 32, 96, "#cc694b");
  ball = new Rectangle(568, 336, 32, 32, "#ffffff");
  score = {
    p1: 0,
    p2: 0,
  };

  override setup() {
    this.setKeys(["W", "S", "E", "D"]);
    this.addChild([this.p1, this.p2, this.ball]);
    this.setBackground([0, 0, 0, 1]);
  }

  override update() {
    if (
      this.ball.x < this.p1.x + 42 &&
      this.ball.y > this.p1.y &&
      this.ball.y < this.p1.y + this.p1.height
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

    if (this.ball.y < 0 || this.ball.y > 750) {
      this.vy *= -1;
    }

    if (this.ball.x < 0) {
      //p1 side
      this.ball.x = 568;
      this.ball.y = 336;
      this.score.p2 += 1;
      this.vx = 4;
      this.vy = 4;
    }

    if (this.ball.x > 1300) {
      //p2 side
      this.ball.x = 568;
      this.ball.y = 336;
      this.score.p1 += 1;
      this.vx = -4;
      this.vy = 4;
    }

    this.ball.x += this.vx;
    this.ball.y += this.vy;

    if (this.keyDown("W") && this.p1.y > 25) this.p1.y -= 4;
    if (this.keyDown("S") && this.p1.y < 700) this.p1.y += 4;
    if (this.keyDown("E") && this.p2.y > 25) this.p2.y -= 4;
    if (this.keyDown("D") && this.p2.y < 700) this.p2.y += 4;

    if (this.score.p1 === 10 || this.score.p2 === 10) {
      this.score.p1 = 0;
      this.score.p2 = 0;
    }
  }
}

const pong = new World({
  title: "Pong Example",
  width: 1300,
  height: 800,
  resizable: true,
}, [Game]);
await pong.start();
