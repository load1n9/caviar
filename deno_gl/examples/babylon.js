import { Canvas } from "../mod.ts";
import "https://cdn.babylonjs.com/babylon.max.js";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const canvas = new Canvas({
  title: "Babylon.js",
  width: 800,
  height: 600,
});

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

function createScene() {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    15,
    new BABYLON.Vector3(0, 0, 0),
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0),
  );

  BABYLON.SceneLoader.ImportMeshAsync(
    ["ground", "semi_house"],
    "https://assets.babylonjs.com/meshes/",
    "both_houses_scene.babylon",
  );

  return scene;
}

const scene = createScene();

engine.runRenderLoop(function () {
  if (canvas.shouldClose()) {
    engine.stopRenderLoop();
    return;
  }

  canvas.updateEvents();
  scene.render();
  canvas.swapBuffers();
});
