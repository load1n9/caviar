import { GodotAtlas, PhaserAtlas, PixiAtlas } from "./mod.ts";

export function atlas(
  // deno-lint-ignore no-explicit-any
  data: any,
  type = "phaser",
): PhaserAtlas | PixiAtlas | GodotAtlas {
  let atlas: PhaserAtlas | PixiAtlas | GodotAtlas;
  switch (type) {
    case "phaser": {
      atlas = new PhaserAtlas(data);
      break;
    }
    case "pixi": {
      atlas = new PixiAtlas(data);
      break;
    }
    case "godot": {
      atlas = new GodotAtlas(data);
      break;
    }
    default: {
      throw new Error(`Unknown atlas type: ${type}`);
    }
  }
  return atlas!;
}
