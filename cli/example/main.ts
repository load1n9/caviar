import { World } from "https://deno.land/x/caviar@2.6.4/mod.ts";
import { Boot } from "./src/scenes/Boot.ts";

const example = new World({
  title: "example",
  width: 800,
  height: 600,
  resizable: true,
}, [Boot]);

await example.start();