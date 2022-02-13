import { cstr, gl, glfw, initGL } from "../core/mod.ts";
import { WebGL2RenderingContext, WebGLContextAttributes } from "./context.ts";
import { HTMLElement } from "./element.ts";

let init = false;

export interface CanvasOptions {
  title: string;
  width: number;
  height: number;
  visible?: boolean;
  resizable?: boolean;
}

export class Canvas extends HTMLElement {
  handle: Deno.UnsafePointer;
  #title: string;

  constructor(options: CanvasOptions) {
    super();

    if (!init) {
      if (!glfw.init()) {
        throw new Error("Failed to initialize GLFW");
      }

      if (Deno.build.os === "darwin") {
        // For using ANGLE
        glfw.windowHint(glfw.CONTEXT_CREATION_API, glfw.EGL_CONTEXT_API);
      }

      glfw.windowHint(glfw.SAMPLES, 4);
      glfw.windowHint(glfw.CLIENT_API, glfw.OPENGL_ES_API);
      glfw.windowHint(glfw.CONTEXT_VERSION_MAJOR, 3);
      glfw.windowHint(glfw.CONTEXT_VERSION_MINOR, 0);
      glfw.windowHint(glfw.OPENGL_FORWARD_COMPAT, glfw.OPENGL_CORE_PROFILE);

      init = true;
    }

    this.#title = options.title;

    glfw.windowHint(
      glfw.VISIBLE,
      options.visible === false ? glfw.FALSE : glfw.TRUE,
    );
    glfw.windowHint(
      glfw.RESIZABLE,
      options.resizable === true ? glfw.TRUE : glfw.FALSE,
    );

    this.handle = glfw.createWindow(
      options.width,
      options.height,
      cstr(options.title),
      null,
      null,
    );

    if (this.handle.value === 0n) {
      const errptr = new BigUint64Array(1);
      throw new Error(
        `Failed to create window ${glfw.getError(errptr)} ${
          new Deno.UnsafePointerView(new Deno.UnsafePointer(errptr[0]))
            .getCString()
        }`,
      );
    }

    glfw.setInputMode(this.handle, glfw.STICKY_KEYS, gl.TRUE);
    glfw.setInputMode(this.handle, glfw.CURSOR, glfw.CURSOR_NORMAL);

    glfw.makeContextCurrent(this.handle);
    initGL();

    gl.enable(gl.DEBUG_OUTPUT);
    // TODO: once FFI supports callbacks
    // gl.debugMessageCallback(cb);
  }

  get title() {
    return this.#title;
  }

  set title(value: string) {
    glfw.setWindowTitle(this.handle, cstr(value));
    this.#title = value;
  }

  get width() {
    const width = new Int32Array(1);
    const height = new Int32Array(1);
    glfw.getWindowSize(this.handle, width, height);
    return width[0];
  }

  set width(value: number) {
    if (isNaN(value)) {
      throw new Error("width must be a number");
    }
    glfw.setWindowSize(this.handle, value, this.height);
  }

  get height() {
    const width = new Int32Array(1);
    const height = new Int32Array(1);
    glfw.getWindowSize(this.handle, width, height);
    return height[0];
  }

  set height(value: number) {
    if (isNaN(value)) {
      throw new Error("height must be a number");
    }
    glfw.setWindowSize(this.handle, this.width, value);
  }

  get offsetWidth() {
    return this.width;
  }

  get offsetHeight() {
    return this.height;
  }

  get clientWidth() {
    return this.width;
  }

  get clientHeight() {
    return this.height;
  }

  getContext(type: string, attrs?: WebGLContextAttributes) {
    switch (type) {
      case "webgl":
      case "experimental-webgl":
      case "webgl2": {
        const ctx = new WebGL2RenderingContext(
          this,
          Object.assign({
            alpha: false,
            depth: false,
            stencil: false,
            antialias: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: "default",
          }, attrs),
        );
        if (Deno.env.get("DEBUG_DENO_GL") === "1") {
          return new Proxy(ctx, {
            get: (t, p) => {
              const v = (t as any)[p];
              if (typeof v === "function") {
                return (...args: any[]) => {
                  const result = v.apply(t, args);
                  // if (p.toString().match(/tex/i)) console.log(p, args, "->", result);
                  return result;
                };
              } else {
                if (v === undefined) {
                  throw new Error(`${String(p)} is undefined`);
                }
                return v;
              }
            },
          });
        }
        return ctx;
      }

      default:
        return null;
    }
  }

  shouldClose() {
    return Boolean(glfw.windowShouldClose(this.handle));
  }

  swapBuffers() {
    glfw.swapBuffers(this.handle);
  }

  show() {
    glfw.showWindow(this.handle);
  }

  hide() {
    glfw.hideWindow(this.handle);
  }

  focus() {
    glfw.focusWindow(this.handle);
  }

  restore() {
    glfw.restoreWindow(this.handle);
  }

  maximize() {
    glfw.maximizeWindow(this.handle);
  }

  requestAttention() {
    glfw.requestWindowAttention(this.handle);
  }

  destroy() {
    glfw.destroyWindow(this.handle);
  }

  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: this.width,
      height: this.height,
      right: this.width,
      bottom: this.height,
    };
  }

  // TODO: switch to callback-based events once FFI supports them.
  // they're likely more efficient.

  state: any = {};

  getCurrentState() {
    const cursorPosX = new Float64Array(1);
    const cursorPosY = new Float64Array(1);
    glfw.getCursorPos(this.handle, cursorPosX, cursorPosY);
    return {
      keyA: glfw.getKey(this.handle, glfw.KEY_A) === glfw.TRUE,
      keyB: glfw.getKey(this.handle, glfw.KEY_B) === glfw.TRUE,
      keyC: glfw.getKey(this.handle, glfw.KEY_C) === glfw.TRUE,
      keyD: glfw.getKey(this.handle, glfw.KEY_D) === glfw.TRUE,
      keyE: glfw.getKey(this.handle, glfw.KEY_E) === glfw.TRUE,
      keyF: glfw.getKey(this.handle, glfw.KEY_F) === glfw.TRUE,
      keyG: glfw.getKey(this.handle, glfw.KEY_G) === glfw.TRUE,
      keyH: glfw.getKey(this.handle, glfw.KEY_H) === glfw.TRUE,
      keyI: glfw.getKey(this.handle, glfw.KEY_I) === glfw.TRUE,
      keyJ: glfw.getKey(this.handle, glfw.KEY_J) === glfw.TRUE,
      keyK: glfw.getKey(this.handle, glfw.KEY_K) === glfw.TRUE,
      keyL: glfw.getKey(this.handle, glfw.KEY_L) === glfw.TRUE,
      keyM: glfw.getKey(this.handle, glfw.KEY_M) === glfw.TRUE,
      keyN: glfw.getKey(this.handle, glfw.KEY_N) === glfw.TRUE,
      keyO: glfw.getKey(this.handle, glfw.KEY_O) === glfw.TRUE,
      keyP: glfw.getKey(this.handle, glfw.KEY_P) === glfw.TRUE,
      keyQ: glfw.getKey(this.handle, glfw.KEY_Q) === glfw.TRUE,
      keyR: glfw.getKey(this.handle, glfw.KEY_R) === glfw.TRUE,
      keyS: glfw.getKey(this.handle, glfw.KEY_S) === glfw.TRUE,
      keyT: glfw.getKey(this.handle, glfw.KEY_T) === glfw.TRUE,
      keyU: glfw.getKey(this.handle, glfw.KEY_U) === glfw.TRUE,
      keyV: glfw.getKey(this.handle, glfw.KEY_V) === glfw.TRUE,
      keyW: glfw.getKey(this.handle, glfw.KEY_W) === glfw.TRUE,
      keyX: glfw.getKey(this.handle, glfw.KEY_X) === glfw.TRUE,
      keyY: glfw.getKey(this.handle, glfw.KEY_Y) === glfw.TRUE,
      keyZ: glfw.getKey(this.handle, glfw.KEY_Z) === glfw.TRUE,
      keyLEFT: glfw.getKey(this.handle, glfw.KEY_LEFT) === glfw.TRUE,
      keyUP: glfw.getKey(this.handle, glfw.KEY_UP) === glfw.TRUE,
      keyRIGHT: glfw.getKey(this.handle, glfw.KEY_RIGHT) === glfw.TRUE,
      keyDOWN: glfw.getKey(this.handle, glfw.KEY_DOWN) === glfw.TRUE,
      mouseButtonLeft: Boolean(
        glfw.getMouseButton(this.handle, glfw.MOUSE_BUTTON_LEFT),
      ),
      mouseButtonRight: Boolean(glfw.getMouseButton(
        this.handle,
        glfw.MOUSE_BUTTON_RIGHT,
      )),
      mouseButtonMiddle: Boolean(glfw.getMouseButton(
        this.handle,
        glfw.MOUSE_BUTTON_MIDDLE,
      )),
      cursorX: cursorPosX[0],
      cursorY: cursorPosY[0],
    };
  }

  dispatchEvent(event: Event) {
    return super.dispatchEvent(event) && window.dispatchEvent(event);
  }

  updateEvents() {
    const oldState = this.state;
    this.state = this.getCurrentState();
    const changed: string[] = [];
    for (const prop in oldState) {
      if (oldState[prop] !== this.state[prop]) {
        changed.push(prop);
      }
    }

    const oldPointerDown = oldState.mouseButtonLeft ||
      oldState.mouseButtonRight ||
      oldState.mouseButtonMiddle;
    const newPointerDown = this.state.mouseButtonLeft ||
      this.state.mouseButtonRight ||
      this.state.mouseButtonMiddle;

    if (changed.includes("cursorX") || changed.includes("cursorY")) {
      const data = {
        clientX: this.state.cursorX,
        clientY: this.state.cursorY,
        pageX: this.state.cursorX,
        pageY: this.state.cursorY,
      };
      this.dispatchEvent(Object.assign(new Event("pointermove"), data));
      this.dispatchEvent(Object.assign(new Event("mousemove"), data));
    }

    if (!oldPointerDown && newPointerDown) {
      const data = {
        clientX: this.state.cursorX,
        clientY: this.state.cursorY,
        pageX: this.state.cursorX,
        pageY: this.state.cursorY,
        button: this.state.mouseButtonLeft
          ? 0
          : this.state.mouseButtonMiddle
          ? 1
          : 2,
      };
      this.dispatchEvent(Object.assign(new Event("pointerdown"), data));
      this.dispatchEvent(Object.assign(new Event("mousedown"), data));
    }

    if (oldPointerDown && !newPointerDown) {
      const data = {
        clientX: this.state.cursorX,
        clientY: this.state.cursorY,
        pageX: this.state.cursorX,
        pageY: this.state.cursorY,
        button: !this.state.mouseButtonLeft
          ? 0
          : !this.state.mouseButtonMiddle
          ? 1
          : 2,
      };
      this.dispatchEvent(Object.assign(new Event("pointerup"), data));
      this.dispatchEvent(Object.assign(new Event("mouseup"), data));
    }

    ["keyW", "keyA", "keyS", "keyD"].forEach((key) => {
      if (!changed.includes(key)) return;
      if (this.state[key]) {
        const data = {
          code: key[0].toUpperCase() + key.slice(1),
        };
        this.dispatchEvent(Object.assign(new Event("keydown"), data));
      } else {
        const data = {
          code: key[0].toUpperCase() + key.slice(1),
        };
        this.dispatchEvent(Object.assign(new Event("keyup"), data));
      }
    });
  }

  [Symbol.for("Deno.customInspect")]() {
    return `Canvas {}`;
  }
}
