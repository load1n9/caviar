export interface WorldOptions {
  title: string;
  width: number;
  height: number;
  visible?: boolean;
  resizable?: boolean;
}

export interface WorldPhysicsOptions {
  gravity: number;
}

export type RGBA = [number, number, number, number];

export interface KeyEvent {
  type: string;
  keycode: number;
  scancode: number;
  mod: number;
  repeat: boolean;
}
export interface MouseDownEvent {
  x: number;
  y: number;
  clicks: number;
  which: number;
  button: number;
}

export interface MouseMotionEvent {
  which: number;
  x: number;
  y: number;
  xrel: number;
  yrel: number;
  state: number;
}

export interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface spriteConfig {
  cols: number;
  rows: number;
}

export interface PixelTexture {
  data: string[];
  palette?: string[];
  pixelWidth?: number;
  pixelHeight?: number;
}
