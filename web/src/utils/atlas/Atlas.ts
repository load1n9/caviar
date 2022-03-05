import { GodotAtlas, PhaserAtlas, PixiAtlas } from "./mod.ts";

export function atlas(
  url: string,
  type = "phaser",
): PhaserAtlas | PixiAtlas | GodotAtlas {
  let atlas;
  fetch(url).then(res => res.json()).then(data => {
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
  });
  return atlas;
  
}