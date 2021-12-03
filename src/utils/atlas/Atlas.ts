import { PhaserAtlas } from './mod.ts';

export function atlas(url: string) {
    const data = JSON.parse(new TextDecoder('utf-8').decode(Deno.readFileSync(url)));
    return new PhaserAtlas(data)
}
