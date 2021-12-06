import { Keys, PICO8, TextureSprite, World } from "../../mod.ts";
import { Creature } from "./creature.ts";

class Game extends World {
  public num = 10;
  public fps = 100;
  public world: any;
  public setup() {
    this.world = {
      width: this.params.width,
      height: this.params.height,
      creatures: [],
      context: this,
    };
    for (let i = 0; i < this.num; i++) {
      const x = Math.random() * this.world.width;
      const y = Math.random() * this.world.height;
      this.world.creatures[i] = new Creature(this.world, x, y);
      this.world.creatures[i].velocity.random();
    }
  }
  public targetX(creature: Creature): number {
    const cohesion = creature.cohesion(this.world.creatures);
    return cohesion.x / this.world.width;
  }

  public targetY(creature: Creature): number {
    const cohesion = creature.cohesion(this.world.creatures);
    return cohesion.y / this.world.height;
  }

  public targetAngle(creature: Creature): number {
    const alignment = creature.align(this.world.creatures);
    return (alignment.angle + Math.PI) / (Math.PI * 2);
  }
  public draw() {
    this.world.creatures.forEach((creature: Creature) => {
      const input = [];
      for (const i in this.world.creatures) {
        input.push(this.world.creatures[i].location.x);
        input.push(this.world.creatures[i].location.y);
        input.push(this.world.creatures[i].velocity.x);
        input.push(this.world.creatures[i].velocity.y);
      }
      const output = creature.network.activate(input);
      creature.moveTo(output);
      const learningRate = 0.3;
      const target = [
        this.targetX(creature),
        this.targetY(creature),
        this.targetAngle(creature),
      ];
      creature.network.propagate(learningRate, target);
      creature.draw();
    });
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
