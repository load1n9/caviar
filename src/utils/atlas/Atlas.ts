import { PhaserAtlas, PixiAtlas } from './mod.ts';

export function atlas(url: string) {
    const data = JSON.parse(new TextDecoder('utf-8').decode(Deno.readFileSync(url)));
    if (data.textures) {
        return new PhaserAtlas(data)
    }
    return new PixiAtlas(data)
}
