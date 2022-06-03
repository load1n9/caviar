import {
  Rectangle,
  Scene,
  World,
} from "https://deno.land/x/caviar@2.4.8/web/dist/mod.js";

class Game extends Scene {
  vx = 4;
  vy = 4;
  p1 = new Rectangle(0, 336, 32, 96, "#6298bf");
  p2 = new Rectangle(1168, 336, 32, 96, "#cc694b");
  ball = new Rectangle(568, 336, 32, 32, "#ffffff");
  scoreElement = document.createElement("h1");
  score = {
    p1: 0,
    p2: 0,
  };
  setup() {
    this.setKeys(["w", "s", "e", "d"]);
    this.addChild([this.p1, this.p2, this.ball]);
    this.setBackground([0, 0, 0, 1]);
    this.scoreElement.innerText = `${this.score.p1} - ${this.score.p2}`;
    this.scoreElement.style.color = "#000000";
    this.scoreElement.style.fontSize = "48px";
    this.scoreElement.style.fontFamily = "monospace";
    this.scoreElement.style.width = "100%";
    this.scoreElement.style.height = "100%";
    document.body.appendChild(this.scoreElement);
  }
  update() {
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
    if (this.keyDown("w") && this.p1.y > 25) this.p1.y -= 4;
    if (this.keyDown("s") && this.p1.y < 700) this.p1.y += 4;
    if (this.keyDown("e") && this.p2.y > 25) this.p2.y -= 4;
    if (this.keyDown("d") && this.p2.y < 700) this.p2.y += 4;
    if (this.score.p1 === 10 || this.score.p2 === 10) {
      this.score.p1 = 0;
      this.score.p2 = 0;
    }
    this.scoreElement.innerText = `${this.score.p1} - ${this.score.p2}`;
  }
}

const pong = new World({
  title: "test",
  width: 1300,
  height: 800,
  resizable: true,
}, [Game]);
await pong.start();
