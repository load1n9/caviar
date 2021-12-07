import { PhaserAtlas, PixiAtlas, GodotAtlas } from './mod.ts';

export function atlas(url: string) {
    const data = JSON.parse(new TextDecoder('utf-8').decode(Deno.readFileSync(url)));
    if (data.textures[0].frames) {
        return new PhaserAtlas(data);
    } else if (data.textures[0].sprites) {
        return new GodotAtlas(data);
    }
    return new PixiAtlas(data);
    
}
