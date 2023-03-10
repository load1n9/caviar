import { GodotAtlas, PhaserAtlas, PixiAtlas } from "./mod.ts";
import { fromFileUrl } from "../../../deps.ts";

export function atlas(
  url: string,
  type = "phaser",
): PhaserAtlas | PixiAtlas | GodotAtlas {
  const data = JSON.parse(Deno.readTextFileSync(fromFileUrl(url)));
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
