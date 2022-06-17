// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class PhaserAtlas {
    frames = {};
    width;
    height;
    imgUrl;
    constructor(data){
        this.width = data.textures[0].size.w;
        this.height = data.textures[0].size.h;
        this.imgUrl = data.textures[0].image;
        for (const frame of data.textures[0].frames){
            this.frames[frame.filename] = {
                x: frame.frame.x,
                y: frame.frame.y,
                width: frame.frame.w,
                height: frame.frame.h
            };
        }
    }
}
class PixiAtlas {
    frames = {};
    width;
    height;
    imgUrl;
    constructor(data){
        this.width = data.meta.size.w;
        this.height = data.meta.size.h;
        this.imgUrl = data.meta.image;
        for(const i in data.frames){
            const frame = data.frames[i];
            this.frames[i] = {
                x: frame.frame.x,
                y: frame.frame.y,
                width: frame.frame.w,
                height: frame.frame.h
            };
        }
    }
}
class GodotAtlas {
    frames = {};
    width;
    height;
    imgUrl;
    constructor(data){
        this.width = data.textures[0].size.w;
        this.height = data.textures[0].size.h;
        this.imgUrl = data.textures[0].image;
        for (const frame of data.textures[0].sprites){
            this.frames[frame.filename] = {
                x: frame.region.x,
                y: frame.region.y,
                width: frame.region.w,
                height: frame.region.h
            };
        }
    }
}
function atlas(data, type = "phaser") {
    let atlas1;
    switch(type){
        case "phaser":
            {
                atlas1 = new PhaserAtlas(data);
                break;
            }
        case "pixi":
            {
                atlas1 = new PixiAtlas(data);
                break;
            }
        case "godot":
            {
                atlas1 = new GodotAtlas(data);
                break;
            }
        default:
            {
                throw new Error(`Unknown atlas type: ${type}`);
            }
    }
    return atlas1;
}
const shader2d = `
struct Uniforms {
    position: vec2<f32>,
    usage: f32,
    color: vec4<f32>,
};

struct Output {
    @builtin(position) position: vec4<f32>,
    @location(1) coords: vec2<f32>,
};

@group(0) @binding(0)
var uTexture: texture_2d<f32>;
@group(0) @binding(1)
var uSampler: sampler;

@group(1) @binding(0)
var<uniform> uniforms: Uniforms;

@stage(vertex)
fn vs_main(
    @location(0) position: vec2<f32>,
    @location(1) coords: vec2<f32>,
) -> Output {
    var out: Output;
    out.position = vec4(position + uniforms.position, 0.0, 1.0);
    out.coords = coords;
    return out;
}

@stage(fragment)
fn fs_main(out: Output) -> @location(0) vec4<f32> {
    if (uniforms.usage == 0.0) {
        return uniforms.color;
    } else {
        return textureSample(uTexture, uSampler, out.coords);
    }
}
`;
const bindGroupUniform2d = {
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: {
                type: "uniform",
                minBindingSize: 32
            }
        }, 
    ]
};
const bindGroupTexture2d = {
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {}
        },
        {
            binding: 1,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            sampler: {}
        }, 
    ]
};
function createBindGroupLayout(device) {
    return {
        uniform: device.createBindGroupLayout(bindGroupUniform2d),
        texture: device.createBindGroupLayout(bindGroupTexture2d)
    };
}
function createRenderPipeline(device, module, layout, presentationFormat) {
    const vertexBuffers = [
        {
            arrayStride: 2 * 4,
            attributes: [
                {
                    format: "float32x2",
                    offset: 0,
                    shaderLocation: 0
                }, 
            ]
        },
        {
            arrayStride: 2 * 4,
            attributes: [
                {
                    format: "float32x2",
                    offset: 0,
                    shaderLocation: 1
                }, 
            ]
        }, 
    ];
    const pipeline = device.createRenderPipeline({
        layout,
        vertex: {
            module,
            entryPoint: "vs_main",
            buffers: vertexBuffers
        },
        fragment: {
            module,
            entryPoint: "fs_main",
            targets: [
                {
                    format: presentationFormat
                }, 
            ]
        },
        primitive: {
            topology: "triangle-strip"
        }
    });
    return pipeline;
}
class Uniforms2D {
    buffer;
    bindGroup;
    constructor(device, layout){
        this.buffer = device.createBuffer({
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        this.bindGroup = device.createBindGroup({
            layout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.buffer
                    }
                }
            ]
        });
    }
    setUsage(device, usage) {
        const buffer = new Float32Array([
            usage
        ]);
        device.queue.writeBuffer(this.buffer, 8, buffer);
    }
    setPosition(device, x, y) {
        const buffer = new Float32Array([
            x,
            y
        ]);
        device.queue.writeBuffer(this.buffer, 0, buffer);
    }
    setColor(device, color) {
        const buffer = new Float32Array(color);
        device.queue.writeBuffer(this.buffer, 16, buffer);
    }
    colorNorm(rgba) {
        return rgba.map((c)=>c / 255);
    }
}
class Textures2D {
    sampler;
    texture;
    bindGroup;
    constructor(device, layout, texture, sampler){
        this.texture = texture;
        this.sampler = sampler;
        this.bindGroup = device.createBindGroup({
            layout,
            entries: [
                {
                    binding: 0,
                    resource: this.texture.createView()
                },
                {
                    binding: 1,
                    resource: this.sampler
                }, 
            ]
        });
    }
    static empty(device, layout, sampler) {
        const size = {
            width: 1,
            height: 1
        };
        const texture = device.createTexture({
            size,
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });
        device.queue.writeTexture({
            texture
        }, new Uint8Array(4), {}, size);
        return new Textures2D(device, layout, texture, sampler);
    }
}
class EventManager {
    listeners = new Map();
    keys = [];
    on(event, listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(listener);
    }
    off(event, listener) {
        if (this.listeners.has(event)) {
            this.listeners.get(event)?.delete(listener);
        }
    }
    emit(event, data) {
        if (this.listeners.has(event)) {
            for (const listener of this.listeners.get(event)){
                listener(data);
            }
        }
    }
    clear() {
        this.listeners.clear();
    }
}
const hexToRGBA = (hex)=>[
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
        256, 
    ];
function createBuffer(device, data) {
    const buffer = device.createBuffer({
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        size: data.byteLength
    });
    device.queue.writeBuffer(buffer, 0, data);
    return buffer;
}
function loadTexture(device, source) {
    console.log(source);
    const size = {
        width: source.width,
        height: source.height
    };
    const texture = device.createTexture({
        size: size,
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
    });
    device.queue.copyExternalImageToTexture({
        source
    }, {
        texture
    }, size);
    return texture;
}
class KeyManager {
    listeners;
    keysDown;
    constructor(world){
        this.world = world;
        this.listeners = [];
        this.keysDown = {};
    }
    setKeys(keys) {
        this.listeners = keys;
        window.addEventListener("keydown", (e)=>{
            if (this.listeners.includes(e.key)) {
                this.keysDown[e.key] = true;
            }
        });
        window.addEventListener("keyup", (e)=>{
            if (this.listeners.includes(e.key)) {
                this.keysDown[e.key] = false;
            }
        });
    }
    isDown(key) {
        return this.keysDown[key];
    }
    world;
}
const printBanner = (version)=>{
    console.log.apply(globalThis.console, [
        "\n %c %c %c Caviar " + "v." + version + " - 🚀" + "WebGPU" + "  %c  %c  https://github.com/load1n9/caviar",
        "background: #d48e1e; padding:5px 0;",
        "background: #e67615; padding:5px 0;",
        "color: #e67615; background: #030307; padding:5px 0;",
        "background: #e67615; padding:5px 0;",
        "background: #d48e1e; padding:5px 0;", 
    ]);
};
const VERSION = "2.5.3";
class Entity {
    id;
    #x;
    #y;
    #z;
    width = 0;
    height = 0;
    constructor(x, y){
        this.id = crypto.randomUUID();
        this.#x = x;
        this.#y = y;
        this.#z = 1;
    }
    set x(x) {
        this.#x = x;
    }
    get x() {
        return this.#x;
    }
    set z(z) {
        this.#z = z;
    }
    get z() {
        return this.#z;
    }
    set y(y) {
        this.#y = y;
    }
    get y() {
        return this.#y;
    }
    setPosition(x, y, z) {
        this.#x = x;
        this.#y = y;
        if (z) this.#z = z;
    }
}
const Arne16 = [
    "#000",
    "#9D9D9D",
    "#FFF",
    "#BE2633",
    "#E06F8B",
    "#493C2B",
    "#A46422",
    "#EB8931",
    "#F7E26B",
    "#2F484E",
    "#44891A",
    "#A3CE27",
    "#1B2632",
    "#005784",
    "#31A2F2",
    "#B2DCEF", 
];
const C64 = [
    "#000",
    "#fff",
    "#8b4131",
    "#7bbdc5",
    "#8b41ac",
    "#6aac41",
    "#3931a4",
    "#d5de73",
    "#945a20",
    "#5a4100",
    "#bd736a",
    "#525252",
    "#838383",
    "#acee8b",
    "#7b73de",
    "#acacac", 
];
const CGA = [
    "#000",
    "#2234d1",
    "#0c7e45",
    "#44aacc",
    "#8a3622",
    "#5c2e78",
    "#aa5c3d",
    "#b5b5b5",
    "#5e606e",
    "#4c81fb",
    "#6cd947",
    "#7be2f9",
    "#eb8a60",
    "#e23d69",
    "#ffd93f",
    "#fff", 
];
const JMP = [
    "#000",
    "#191028",
    "#46af45",
    "#a1d685",
    "#453e78",
    "#7664fe",
    "#833129",
    "#9ec2e8",
    "#dc534b",
    "#e18d79",
    "#d6b97b",
    "#e9d8a1",
    "#216c4b",
    "#d365c8",
    "#afaab9",
    "#f5f4eb", 
];
const MSX = [
    "#000",
    "#191028",
    "#46af45",
    "#a1d685",
    "#453e78",
    "#7664fe",
    "#833129",
    "#9ec2e8",
    "#dc534b",
    "#e18d79",
    "#d6b97b",
    "#e9d8a1",
    "#216c4b",
    "#d365c8",
    "#afaab9",
    "#fff", 
];
const PICO8 = [
    "#000",
    "#1D2B53",
    "#7E2553",
    "#008751",
    "#AB5236",
    "#5F574F",
    "#C2C3C7",
    "#FFF1E8",
    "#FF004D",
    "#FFA300",
    "#FFEC27",
    "#00E436",
    "#29ADFF",
    "#83769C",
    "#FF77A8",
    "#FFCCAA", 
];
export { Arne16 as Arne16 };
export { C64 as C64 };
export { CGA as CGA };
export { JMP as JMP };
export { MSX as MSX };
export { PICO8 as PICO8 };
class Rectangle extends Entity {
    right;
    left;
    up;
    down;
    bottom;
    fill;
    constructor(x, y, width, height, fill){
        super(x, y);
        this.width = width;
        this.height = height;
        this.right = x + width;
        this.left = x;
        this.up = y;
        this.down = y + height;
        this.bottom = y + height;
        this.fill = typeof fill === "string" ? this.colorNorm(hexToRGBA(fill)) : this.colorNorm(fill);
    }
    setFill(c) {
        this.fill = typeof c === "string" ? hexToRGBA(c) : c;
    }
    colorNorm(rgba) {
        return rgba.map((c)=>c / 255);
    }
    setAlpha(a) {
        this.fill[3] = a;
    }
}
class Image extends Entity {
    bitmap;
    image;
    url;
    constructor(url, x, y){
        super(x, y);
        this.width = 0;
        this.height = 0;
        this.image = document.createElement("img");
        this.url = url;
    }
    load() {
        return new Promise((res, rej)=>{
            this.image.src = this.url;
            this.image.onload = ()=>{
                this.width = this.image.width;
                this.height = this.image.height;
                createImageBitmap(this.image).then((img)=>{
                    this.bitmap = img;
                    res(this);
                });
            };
            this.image.onerror = rej;
        });
    }
}
class Plugin {
    name = "";
    description = "";
    version = "";
    author = "";
    constructor(_world){}
    onStart() {}
    onUpdate() {}
}
export { Entity as Entity };
class TextureSprite extends Entity {
    data;
    texture;
    palette;
    pixelWidth;
    pixelHeight;
    constructor(_scene, x, y, texture){
        super(x, y);
        this.texture = texture;
        this.data = [];
        this.palette = texture.palette || Arne16, this.pixelWidth = texture.pixelWidth || 1;
        this.pixelHeight = texture.pixelHeight || this.pixelWidth;
        this.width = Math.floor(Math.abs(this.texture.data[0].length * this.pixelWidth));
        this.height = Math.floor(Math.abs(this.texture.data.length * this.pixelHeight));
        this.setup();
    }
    setup() {
        this.data = [];
        for(let y = 0; y < this.texture.data.length; y++){
            const row = this.texture.data[y];
            for(let x = 0; x < row.length; x++){
                const d = row[x];
                if (d !== "." && d !== " ") {
                    this.data.push(new Rectangle(x * this.pixelWidth + this.x, y * this.pixelHeight + this.y, this.pixelWidth, this.pixelHeight, hexToRGBA(this.palette[parseInt("0x" + d.toUpperCase())])));
                }
            }
        }
    }
    setX(x) {
        this.x = x;
        let k = 0;
        for(let j = 0; j < this.texture.data.length; j++){
            const row = this.texture.data[j];
            for(let i = 0; i < row.length; i++){
                if (row[i] !== "." && row[i] !== " ") {
                    const pixel = this.data[k];
                    pixel.x = i * this.pixelWidth + this.x;
                    k += 1;
                }
            }
        }
    }
    setY(y) {
        this.y = y;
        let k = 0;
        for(let j = 0; j < this.texture.data.length; j++){
            const row = this.texture.data[j];
            for(let i = 0; i < row.length; i++){
                if (row[i] !== "." && row[i] !== " ") {
                    const pixel = this.data[k];
                    pixel.y = j * this.pixelWidth + this.y;
                    k += 1;
                }
            }
        }
    }
}
class AtlasSprite extends Entity {
    atlas;
    frame;
    bitmap;
    image;
    #frame;
    constructor(atlas2, x, y, frame){
        super(x, y);
        this.atlas = atlas2;
        this.#frame = frame;
        this.image = document.createElement("img");
        this.frame = this.atlas.getFrame(this.#frame);
    }
    load() {
        return new Promise((res, rej)=>{
            this.image.src = this.atlas.imgUrl;
            this.image.onload = ()=>{
                this.width = this.image.width;
                this.height = this.image.height;
                this.atlas.preloaded = true;
                createImageBitmap(this.image).then((img)=>{
                    this.bitmap = img;
                    res(this);
                });
            };
            this.image.onerror = rej;
        });
    }
}
class Group extends Entity {
    children = [];
    scene;
    constructor(scene, x, y){
        super(x, y);
        this.scene = scene;
    }
    addChild(child) {
        this.children.push(child);
    }
    killChild(child) {
        this.children.splice(this.children.indexOf(child), 1);
    }
    killAllChildren() {
        this.children = [];
    }
}
class GPURenderer {
    #device;
    #pipeline;
    #canvas;
    #context;
    #layouts;
    #sampler;
    #emptyBuffer;
    #emptyTexture;
    #buffers;
    #backgroundColor;
    eventManager;
    constructor(world){
        this.world = world;
        this.#buffers = new Map();
        this.#backgroundColor = [
            1.0,
            1.0,
            1.0,
            1.0
        ];
        this.eventManager = new EventManager();
        this.#canvas = this.world.canvas;
    }
    async init() {
        const adapter = await navigator.gpu.requestAdapter();
        const device = await adapter.requestDevice();
        this.#context = this.#canvas.getContext("webgpu");
        const devicePixelRatio = window.devicePixelRatio || 1;
        [
            this.#canvas.clientWidth * devicePixelRatio,
            this.#canvas.clientHeight * devicePixelRatio, 
        ];
        if (!device) throw new Error(`Could not request device!`);
        this.#device = device;
        const format = navigator.gpu.getPreferredCanvasFormat(adapter);
        this.#context.configure({
            device: this.#device,
            format: format,
            alphaMode: "premultiplied"
        });
        this.#layouts = createBindGroupLayout(device);
        const layout = this.#device.createPipelineLayout({
            bindGroupLayouts: [
                this.#layouts.texture,
                this.#layouts.uniform
            ]
        });
        const module = this.#device.createShaderModule({
            code: shader2d
        });
        this.#pipeline = createRenderPipeline(this.#device, module, layout, format);
        this.#sampler = device.createSampler({});
        this.#emptyBuffer = device.createBuffer({
            size: 32,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
        this.#emptyTexture = Textures2D.empty(device, this.#layouts.texture, this.#sampler);
    }
    start(entities) {
        for (const entity of entities){
            if (entity instanceof Rectangle) {
                this.#setupRectangle(entity);
            } else if (entity instanceof Image || entity instanceof AtlasSprite) {
                this.#setupImage(entity);
            } else if (entity instanceof TextureSprite) {
                for (const rect of entity.data){
                    this.#setupRectangle(rect);
                }
            } else if (entity instanceof Group) {
                this.start(entity.children);
            }
        }
    }
    render(entities) {
        const encoder = this.#device.createCommandEncoder();
        const textureView = this.#context.getCurrentTexture().createView();
        const renderPass = encoder.beginRenderPass({
            colorAttachments: [
                {
                    view: textureView,
                    storeOp: "store",
                    loadOp: "clear",
                    clearValue: this.#backgroundColor
                }, 
            ]
        });
        renderPass.setPipeline(this.#pipeline);
        this.#render(entities, renderPass);
        renderPass.end();
        this.#device.queue.submit([
            encoder.finish()
        ]);
    }
     #render(entities, renderPass) {
        try {
            for (const entity of entities){
                if (entity instanceof Rectangle) {
                    this.#renderRectangle(entity, renderPass);
                } else if (entity instanceof Image || entity instanceof AtlasSprite) {
                    this.#renderImage(entity, renderPass);
                } else if (entity instanceof TextureSprite) {
                    for (const rect of entity.data){
                        this.#renderRectangle(rect, renderPass);
                    }
                } else if (entity instanceof Group) {
                    this.#render(entity.children, renderPass);
                }
            }
        } catch (_e) {
            this.start(this.world.currentScene.entities);
        }
    }
     #setupRectangle(entity) {
        const data = [
            0,
            0,
            entity.width,
            0,
            0,
            entity.height,
            entity.width,
            entity.height
        ];
        for(let i = 0; i < data.length; i += 2){
            data[i] = data[i] / this.#canvas.width * 2 - 1;
            data[i + 1] = data[i + 1] / this.#canvas.height * -2 + 1;
        }
        const position = createBuffer(this.#device, new Float32Array(data));
        const uniforms = new Uniforms2D(this.#device, this.#layouts.uniform);
        this.#buffers.set(entity.id, {
            position,
            uniforms
        });
    }
     #renderRectangle(entity1, renderPass1) {
        const buffers = this.#buffers.get(entity1.id);
        renderPass1.setVertexBuffer(0, buffers.position);
        renderPass1.setVertexBuffer(1, this.#emptyBuffer);
        const x = entity1.x / this.#canvas.width * 2;
        const y = entity1.y / this.#canvas.height * -2;
        buffers.uniforms.setPosition(this.#device, x, y);
        buffers.uniforms.setColor(this.#device, entity1.fill);
        renderPass1.setBindGroup(0, this.#emptyTexture.bindGroup);
        renderPass1.setBindGroup(1, buffers.uniforms.bindGroup);
        renderPass1.draw(4, 1);
    }
     #setupImage(entity2) {
        const x = entity2 instanceof Image ? 0 : entity2.frame.x;
        const y = entity2 instanceof Image ? 0 : entity2.frame.y;
        const { width , height  } = entity2 instanceof Image ? entity2 : entity2.frame;
        const data = [
            x,
            y,
            x + width,
            y,
            x,
            y + height,
            x + width,
            y + height, 
        ];
        for(let i = 0; i < data.length; i += 2){
            data[i] = data[i] / entity2.width;
            data[i + 1] = data[i + 1] / entity2.height;
        }
        const coords = createBuffer(this.#device, new Float32Array(data));
        for(let i1 = 0; i1 < data.length; i1 += 2){
            data[i1] = data[i1] * entity2.width / this.#canvas.width * 2 - 1;
            data[i1 + 1] = data[i1 + 1] * entity2.height / this.#canvas.height * -2 + 1;
        }
        const position = createBuffer(this.#device, new Float32Array(data));
        const tex2d = loadTexture(this.#device, entity2.bitmap);
        const uniforms = new Uniforms2D(this.#device, this.#layouts.uniform);
        const texture = new Textures2D(this.#device, this.#layouts.texture, tex2d, this.#sampler);
        this.#buffers.set(entity2.id, {
            position,
            texture,
            coords,
            uniforms
        });
    }
     #renderImage(entity3, renderPass2) {
        const buffers = this.#buffers.get(entity3.id);
        renderPass2.setVertexBuffer(0, buffers.position);
        renderPass2.setVertexBuffer(1, buffers.coords);
        const x = entity3.x / this.#canvas.width * 2;
        const y = entity3.y / this.#canvas.height * -2;
        buffers.uniforms.setUsage(this.#device, 1);
        buffers.uniforms.setColor(this.#device, [
            1,
            0,
            0,
            1
        ]);
        buffers.uniforms.setPosition(this.#device, x, y);
        renderPass2.setBindGroup(0, buffers.texture.bindGroup);
        renderPass2.setBindGroup(1, buffers.uniforms.bindGroup);
        renderPass2.draw(4, 1);
    }
    setBackground(color) {
        this.#backgroundColor = typeof color === "string" ? hexToRGBA(color) : color;
    }
    world;
}
class World {
    FPS = 500;
    params;
    scenes;
    currentScene;
    renderer;
    canvas;
    keyManager;
    eventManager;
    plugins = {};
    loadedPlugins = [];
    constructor(params, scenes){
        this.params = params;
        this.scenes = scenes;
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.params.width;
        this.canvas.height = this.params.height;
        if (this.params.id) this.canvas.id = this.params.id;
        (params.parent || document.body).appendChild(this.canvas);
        (params.parent || document.body).style.margin = "0";
        this.currentScene = new this.scenes[0](this);
        this.renderer = new GPURenderer(this);
        this.keyManager = new KeyManager(this);
        this.eventManager = new EventManager();
    }
    async start() {
        printBanner(VERSION);
        await this.renderer.init();
        this.setup();
        await this.currentScene.loadResources();
        this.renderer.start(this.currentScene.entities);
        requestAnimationFrame(this._draw.bind(this));
    }
    _draw() {
        this.updateProgramLifeCycle();
        this.renderer.render(this.currentScene.entities);
        if (this.loadedPlugins.length > 0) {
            for (const plug of this.loadedPlugins){
                if (plug.onUpdate) plug.onUpdate();
            }
        }
        requestAnimationFrame(this._draw.bind(this));
    }
    setFPS(fps) {
        this.FPS = fps;
    }
    keyDown = (e)=>this.currentScene.keyDown(e);
    setScene(scene) {
        if (typeof scene === "string") {
            for (const s of this.scenes){
                if (s.name === scene) {
                    this.currentScene = new s(this);
                    break;
                }
            }
        } else {
            this.currentScene = new this.scenes[scene](this);
        }
        this.setup();
    }
    loadPlugin(name, plugin) {
        this.plugins[name] = plugin;
    }
    usePlugin(name) {
        const plug = new this.plugins[name](this);
        plug.onStart();
        this.loadedPlugins.push(plug);
        return plug;
    }
    _mouseDown(e) {
        this.currentScene._mouseDown(e);
    }
    _mouseMotion(e) {
        this.currentScene._mouseMotion(e);
    }
    setup() {
        this.currentScene.setup();
    }
    updateProgramLifeCycle() {
        this.currentScene.tick();
        this.currentScene.update();
    }
}
class Scene {
    entities;
    #resources;
    resources;
    constructor(world){
        this.world = world;
        this.entities = [];
        this.#resources = [];
        this.resources = [];
    }
    async loadResources() {
        await Promise.all(this.#resources);
    }
    setKeys(_keys) {
        this.world.keyManager.setKeys(_keys);
    }
    addChild(e) {
        if (e instanceof Array) {
            this.entities.push(...e);
            for (const entity4 of e){
                if (entity4 instanceof Image || entity4 instanceof AtlasSprite) {
                    this.#resources.push(entity4.load());
                }
            }
        } else {
            this.entities.push(e);
            if (e instanceof Image || e instanceof AtlasSprite) {
                this.#resources.push(e.load());
            }
        }
    }
    killChild(e) {
        const index = this.entities.indexOf(e);
        if (index < -1) return;
        this.entities.splice(index, 1);
    }
    loadPlugin(name, plugin) {
        this.world.loadPlugin(name, plugin);
    }
    usePlugin(name) {
        return this.world.usePlugin(name);
    }
    _mouseDown(e) {
        for (const entity of this.entities){}
        this.mouseDown(e);
    }
    _mouseMotion(e) {
        this.mouseMotion(e);
    }
    setBackground(color) {
        this.world.renderer.setBackground(color);
    }
    tick() {}
    mouseDown(_e) {}
    mouseMotion(_e) {}
    setup() {}
    update() {}
    keyDown(e) {
        return this.world.keyManager.isDown(e);
    }
    world;
}
class Atlas extends Entity {
    atlas;
    bitmap;
    image;
    preloaded = false;
    constructor(_atlas, type = "phaser"){
        super(0, 0);
        this.image = document.createElement("img");
        this.atlas = atlas(_atlas, type);
    }
    getFrame(key) {
        return this.atlas.frames[key];
    }
    get imgUrl() {
        return this.atlas.imgUrl;
    }
    load() {
        return new Promise((res, rej)=>{
            this.image.src = this.atlas.imgUrl;
            this.image.onload = ()=>{
                this.width = this.image.width;
                this.height = this.image.height;
                this.preloaded = true;
                createImageBitmap(this.image).then((img)=>{
                    this.bitmap = img;
                    res(this);
                });
            };
            this.image.onerror = rej;
        });
    }
}
export { World as World };
export { Scene as Scene };
export { Plugin as Plugin };
export { Rectangle as Rectangle };
export { Image as Image };
export { TextureSprite as TextureSprite };
export { Atlas as Atlas };
export { AtlasSprite as AtlasSprite };
export { Group as Group };
