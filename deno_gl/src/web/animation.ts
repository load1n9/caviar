import glfw from "../core/glfw.ts";

let lastTime = 0;

export function requestAnimationFrame(callback: (delta: number) => void) {
  const currTime = performance.now();
  const timeToCall = Math.max(0, 1000 / 60 - (currTime - lastTime));
  const id = window.setTimeout(function () {
    callback(currTime + timeToCall);
    glfw.pollEvents();
  }, timeToCall);
  lastTime = currTime + timeToCall;
  return id;
}

export function cancelAnimationFrame(id: number) {
  clearTimeout(id);
}

declare global {
  interface Window {
    innerHeight: number;
    innerWidth: number;
    devicePixelRatio: number;
    pageXOffset: number;
    pageYOffset: number;

    requestAnimationFrame: typeof requestAnimationFrame;
    cancelAnimationFrame: typeof cancelAnimationFrame;
  }
}

Object.defineProperties(window, {
  requestAnimationFrame: {
    value: requestAnimationFrame,
    writable: false,
  },
  cancelAnimationFrame: {
    value: cancelAnimationFrame,
    writable: false,
  },
  devicePixelRatio: {
    get: () => {
      const window = glfw.getCurrentContext();
      const scaleX = new Float32Array(1);
      const scaleY = new Float32Array(1);
      glfw.getWindowContentScale(window, scaleX, scaleY);
      if (scaleX[0] !== 1 || scaleY[0] !== 1) {
        console.log("devicePixelRatio", scaleX[0], scaleY[0]);
      }
      return scaleX[0];
    },
  },
  pageXOffset: {
    value: 0,
  },
  pageYOffset: {
    value: 0,
  },
  innerHeight: {
    get: () => {
      const window = glfw.getCurrentContext();
      const height = new Int32Array(1);
      glfw.getWindowSize(window, null, height);
      return height[0];
    },
  },
  innerWidth: {
    get: () => {
      const window = glfw.getCurrentContext();
      const width = new Int32Array(1);
      glfw.getWindowSize(window, width, null);
      return width[0];
    },
  },
});
