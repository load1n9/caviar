import { Canvas } from "./canvas.ts";
import { HTMLElement } from "./element.ts";
import { Image } from "./image.ts";

export class DocumentBody extends HTMLElement {}

export class DocumentElement extends HTMLElement {}

export class FakeDocument extends EventTarget {
  documentElement = new DocumentElement();
  body = new DocumentBody();

  createElement(tagName: string) {
    if (tagName === "img") {
      return new Image();
    } else if (tagName === "canvas") {
      return new Canvas({
        title: "GLFW Canvas",
        width: (globalThis as any)._width ?? 800,
        height: (globalThis as any)._height ?? 600,
        visible: !(globalThis as any).HEADLESS,
      });
    } else {
      return new HTMLElement();
    }
  }

  createElementNS(_namespace: string, tagName: string) {
    return this.createElement(tagName);
  }

  getElementById(_id: string) {
    return new HTMLElement();
  }

  getElementsByTagName(_tagName: string) {
    return [];
  }

  createTextNode(_text: string) {
    return new HTMLElement();
  }
}

export const document = new FakeDocument();

declare global {
  interface globalThis {
    document: typeof document;
  }
}

Object.defineProperty(globalThis, "document", {
  value: document,
  writable: false,
});
