import { GodotAtlas, PhaserAtlas, PixiAtlas } from "./mod.ts";

export function atlas(
  url: string,
  type = "phaser",
): PhaserAtlas | PixiAtlas | GodotAtlas {
  // deno-lint-ignore no-explicit-any
  let data: any;
  fetch(url).then(response => response.json()).then(d => (data = d))
  switch (type) {
    case "phaser": {
      return new PhaserAtlas(data);
    }
    case "pixi": {
      return new PixiAtlas(data);
    }
    case "godot": {
      return new GodotAtlas(data);
    }
    default: {
      throw new Error(`Unknown atlas type: ${type}`);
    }
  }
}