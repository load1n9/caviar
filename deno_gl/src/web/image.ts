import * as JPEG from "https://deno.land/x/jpegts@1.1/mod.ts";
import * as PNG from "https://deno.land/x/pngs@0.1.1/mod.ts";
import { HTMLElement } from "./element.ts";

function pngDecode(data: Uint8Array) {
  const result = PNG.decode(data);
  if (result.colorType === PNG.ColorType.RGB) {
    // convert to RGBA.
    const rgba = new Uint8Array(result.width * result.height * 4);
    for (let i = 0; i < result.width * result.height; i++) {
      const rgbi = i * 3;
      const rgbai = i * 4;
      rgba.set([
        result.image[rgbi],
        result.image[rgbi + 1],
        result.image[rgbi + 2],
        255,
      ], rgbai);
    }
    return { data: rgba, width: result.width, height: result.height };
  } else if (result.colorType === PNG.ColorType.RGBA) {
    return { data: result.image, width: result.width, height: result.height };
  } else {
    throw new Error("Unsupported color type: " + result.colorType);
  }
}

export class Image extends HTMLElement {
  #src = "";
  #width = 0;
  #height = 0;
  #data = new Uint8Array(0);

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  get src() {
    return this.#src;
  }

  set src(src) {
    this.#src = src;
    console.log(`[loader] Loading image ${src}`);
    fetch(src)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const u8 = new Uint8Array(buffer);
        // hack
        const img = src.endsWith(".png") ? pngDecode(u8) : JPEG.decode(u8);
        this.#width = img.width;
        this.#height = img.height;
        this.#data = img.data;
        console.log(
          `[loader] Loaded image ${src}: ${this.#width}x${this.#height}`,
        );
        this.dispatchEvent(new Event("load", { cancelable: false }));
      })
      .catch((e) => {
        console.error(`[loader] Failed to load image ${src}: ${e}`);
        this.dispatchEvent(new Event("error", { cancelable: false }));
      });
  }

  // Non-standard.
  get rawData() {
    return this.#data;
  }

  set onload(callback: EventListenerOrEventListenerObject) {
    this.addEventListener("load", callback);
  }

  set onerror(callback: EventListenerOrEventListenerObject) {
    this.addEventListener("error", callback);
  }

  [Symbol.for("Deno.customInspect")]() {
    return `Image ${
      this.#data ? `<${this.width}x${this.height}>` : "<unresolved>"
    } { ${this.src} }`;
  }
}

Object.defineProperty(window, "Image", {
  value: Image,
});
