export interface WorldOptions {
    title: string,
    width: number,
    height: number,
    centered: boolean,
    fullscreen: boolean,
    hidden: boolean,
    resizable: boolean,
    minimized: boolean,
    maximized: boolean,
    flags: null
}

export type RGBA = [number, number, number, number];

export interface KeyEvent {
    type: string,
    keycode: number,
    scancode: number,
    mod: number,
    repeat: boolean
}