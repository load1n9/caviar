// Auto-generated with deno_bindgen
import { CachePolicy, prepare } from "https://deno.land/x/plug@0.4.1/plug.ts";
function encode(v: string | Uint8Array): Uint8Array {
  if (typeof v !== "string") return v;
  return new TextEncoder().encode(v);
}
const opts = {
  name: "deno_sdl2",
  url: (new URL("../target/debug", import.meta.url)).toString(),
  policy: CachePolicy.NONE,
};
const _lib = await prepare(opts, {
  fill_events: {
    parameters: ["pointer", "usize"],
    result: "void",
    nonblocking: false,
  },
  query_texture_width: {
    parameters: ["u32"],
    result: "i32",
    nonblocking: false,
  },
  do_task: {
    parameters: ["pointer", "usize"],
    result: "void",
    nonblocking: false,
  },
  poll_events: { parameters: [], result: "usize", nonblocking: false },
  query_window_width: { parameters: [], result: "u32", nonblocking: false },
  update_texture: {
    parameters: ["pointer", "usize", "usize", "u32"],
    result: "void",
    nonblocking: false,
  },
  query_texture_height: {
    parameters: ["u32"],
    result: "i32",
    nonblocking: false,
  },
  query_window_height: { parameters: [], result: "u32", nonblocking: false },
  init: {
    parameters: ["pointer", "usize", "pointer", "usize"],
    result: "void",
    nonblocking: false,
  },
  query_texture_format: {
    parameters: ["u32"],
    result: "i32",
    nonblocking: false,
  },
  query_texture_access: {
    parameters: ["u32"],
    result: "i32",
    nonblocking: false,
  },
});
export type CanvasEvent =
  | "quit"
  | "app_terminating"
  | "app_low_memory"
  | "app_will_enter_background"
  | "app_did_enter_background"
  | "app_will_enter_foreground"
  | {
    resized: {
      width: number;
      height: number;
    };
  }
  | {
    key_up: {
      keycode: number | undefined | null;
      scancode: number | undefined | null;
      r_mod: number;
      repeat: boolean;
    };
  }
  | {
    key_down: {
      keycode: number | undefined | null;
      scancode: number | undefined | null;
      r_mod: number;
      repeat: boolean;
    };
  }
  | {
    mouse_motion: {
      which: number;
      x: number;
      y: number;
      xrel: number;
      yrel: number;
      state: number;
    };
  }
  | {
    mouse_button_up: {
      x: number;
      y: number;
      clicks: number;
      which: number;
      button: number;
    };
  }
  | {
    mouse_button_down: {
      x: number;
      y: number;
      clicks: number;
      which: number;
      button: number;
    };
  }
  | {
    mouse_wheel: {
      x: number;
      y: number;
      which: number;
      direction: number;
    };
  }
  | "unknown";
export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type CanvasPoint = {
  x: number;
  y: number;
};
export type CanvasColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};
export type CanvasFontPartial =
  | {
    solid: {
      color: CanvasColor;
    };
  }
  | {
    shaded: {
      color: CanvasColor;
      background: CanvasColor;
    };
  }
  | {
    blended: {
      color: CanvasColor;
    };
  };
/**
 * https://docs.rs/sdl2/0.34.5/sdl2/video/struct.WindowBuilder.htm
 * Window Builder configuration
 */
export type WindowOptions = {
  title: string;
  height: number;
  width: number;
  flags: number | undefined | null;
  centered: boolean;
  fullscreen: boolean;
  hidden: boolean;
  resizable: boolean;
  minimized: boolean;
  maximized: boolean;
};
export type OptionRectangle = {
  x: number;
  y: number;
  width: number | undefined | null;
  height: number | undefined | null;
};
/**
 * https://rust-sdl2.github.io/rust-sdl2/sdl2/render/struct.CanvasBuilder.html
 * Canvas Builder configuration
 */
export type CanvasOptions = {
  software: boolean;
};
export type CanvasFontSize =
  | "normal"
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough";
export type CanvasTask =
  | "present"
  | {
    setDrawColor: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  }
  | {
    setScale: {
      x: number;
      y: number;
    };
  }
  | {
    drawPoint: {
      x: number;
      y: number;
    };
  }
  | {
    drawPoints: {
      points: Array<CanvasPoint>;
    };
  }
  | {
    drawLine: {
      p1: CanvasPoint;
      p2: CanvasPoint;
    };
  }
  | {
    drawLines: {
      points: Array<CanvasPoint>;
    };
  }
  | {
    drawRect: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }
  | {
    drawRects: {
      rects: Array<Rectangle>;
    };
  }
  | {
    fillRect: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }
  | {
    fillRects: {
      rects: Array<Rectangle>;
    };
  }
  | "clear"
  | "quit"
  | "none"
  | {
    renderFont: {
      text: string;
      options: CanvasFontPartial;
      path: string;
      size: number;
      style: CanvasFontSize | undefined | null;
      index: number;
    };
  }
  | {
    setCursor: {
      index: number;
      path: string;
    };
  }
  | {
    playMusic: {
      path: string;
    };
  }
  | {
    createSurface: {
      width: number;
      height: number;
      format: number;
      index: number;
    };
  }
  | {
    createSurfaceBitmap: {
      path: string;
      index: number;
    };
  }
  | {
    loadSurface: {
      path: string;
      index: number;
    };
  }
  | {
    createTexture: {
      format: number | undefined | null;
      access: number;
      width: number;
      height: number;
      index: number;
    };
  }
  | {
    createTextureSurface: {
      surface: number;
      index: number;
    };
  }
  | {
    loadTexture: {
      path: string;
      index: number;
    };
  }
  | {
    copyRect: {
      texture: number;
      rect1: Rectangle;
      rect2: Rectangle;
    };
  }
  | {
    setDisplayMode: {
      width: number;
      height: number;
      rate: number;
      format: number;
    };
  }
  | {
    setTitle: {
      title: string;
    };
  }
  | {
    setIcon: {
      icon: string;
    };
  }
  | {
    setPosition: {
      x: number;
      y: number;
    };
  }
  | {
    setSize: {
      width: number;
      height: number;
    };
  }
  | {
    setMinimumSize: {
      width: number;
      height: number;
    };
  }
  | "show"
  | "hide"
  | "raise"
  | "maximize"
  | "minimize"
  | "restore"
  | {
    setBrightness: {
      brightness: number;
    };
  }
  | {
    setOpacity: {
      opacity: number;
    };
  };
export function fill_events(a0: Uint8Array) {
  const a0_buf = encode(a0);
  return _lib.symbols.fill_events(a0_buf, a0_buf.byteLength) as null;
}
export function query_texture_width(a0: number) {
  return _lib.symbols.query_texture_width(a0) as number;
}
export function do_task(a0: CanvasTask) {
  const a0_buf = encode(JSON.stringify(a0));
  return _lib.symbols.do_task(a0_buf, a0_buf.byteLength) as null;
}
export function poll_events() {
  return _lib.symbols.poll_events() as number;
}
export function query_window_width() {
  return _lib.symbols.query_window_width() as number;
}
export function update_texture(a0: Uint8Array, a1: number, a2: number) {
  const a0_buf = encode(a0);
  return _lib.symbols.update_texture(a0_buf, a0_buf.byteLength, a1, a2) as null;
}
export function query_texture_height(a0: number) {
  return _lib.symbols.query_texture_height(a0) as number;
}
export function query_window_height() {
  return _lib.symbols.query_window_height() as number;
}
export function init(a0: WindowOptions, a1: CanvasOptions) {
  const a0_buf = encode(JSON.stringify(a0));
  const a1_buf = encode(JSON.stringify(a1));
  return _lib.symbols.init(
    a0_buf,
    a0_buf.byteLength,
    a1_buf,
    a1_buf.byteLength,
  ) as null;
}
export function query_texture_format(a0: number) {
  return _lib.symbols.query_texture_format(a0) as number;
}
export function query_texture_access(a0: number) {
  return _lib.symbols.query_texture_access(a0) as number;
}
