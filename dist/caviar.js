// deno-lint-ignore-file
(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/Plugin.ts
  var Plugin = class {
    constructor(world) {
      this.name = "";
      this.description = "";
      this.version = "";
      this.author = "";
    }
  };

  // web/polyfill.js
  var HTMLCanvasElement = globalThis.HTMLCanvasElement;
  var Image = globalThis.Image;
  var requestAnimationFrame = globalThis.requestAnimationFrame;

  // src/renderers/webgl/shader.ts
  var vertex2d = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform float uShaderUsage;
uniform vec4 uVertexColor;
uniform vec2 uTransformMatrix;

varying lowp float vShaderUsage;
varying lowp vec4 vColor;
varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = vec4(aVertexPosition + uTransformMatrix, 1, 1);
  if (uShaderUsage == 0.0) {
    vColor = uVertexColor;
  } else {
    vTextureCoord = aTextureCoord;
  }
  vShaderUsage = uShaderUsage;
}
`;
  var fragment2d = `
varying vec4 vColor;
varying highp vec2 vTextureCoord;

varying lowp float vShaderUsage;
uniform sampler2D uSampler;

void main(void) {
  if (vShaderUsage == 0.0) {
    gl_FragColor = vColor;
  } else {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
  };
}
`;
  function programInfo2d(gl, program) {
    return {
      position: gl.getAttribLocation(program, "aVertexPosition"),
      texture: gl.getAttribLocation(program, "aTextureCoord"),
      color: gl.getUniformLocation(program, "uVertexColor"),
      transform: gl.getUniformLocation(program, "uTransformMatrix"),
      sampler: gl.getUniformLocation(program, "uSampler"),
      usage: gl.getUniformLocation(program, "uShaderUsage")
    };
  }

  // src/renderers/webgl/util.ts
  function initShaderProgram(gl, vertex, fragment) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragment);
    const shaderProgram = gl.createProgram();
    if (vertexShader && fragmentShader && shaderProgram) {
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const msg = gl.getProgramInfoLog(shaderProgram);
        throw new Error(`Unable to initialize the shader program: ${msg}`);
      }
      return shaderProgram;
    }
    throw new Error(`Unable to initialize the shader program!`);
  }
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (shader) {
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const msg = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`An error occurred compiling the shaders: ${msg}`);
      }
      return shader;
    }
    throw new Error(`An error occurred compiling the shaders!`);
  }
  function createBuffer(gl, data, target = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW) {
    const buffer = gl.createBuffer();
    if (!buffer)
      throw new Error(`Could not create buffer!`);
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, new Float32Array(data), usage);
    return buffer;
  }
  function setBuffer(gl, buffer, location, numComponents, type = gl.FLOAT, target = gl.ARRAY_BUFFER, normalize = false, stride = 0, offset = 0) {
    if (!buffer)
      throw new Error(`Could not set buffer!`);
    gl.bindBuffer(target, buffer);
    gl.vertexAttribPointer(location, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(location);
  }
  function loadTexture(gl, image, level = 0, internalFormat = gl.RGBA, border = 0, srcFormat = gl.RGBA, srcType = gl.UNSIGNED_BYTE) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, image.width, image.height, border, srcFormat, srcType, image.rawData);
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    return texture;
  }
  function isPowerOf2(value) {
    return (value & value - 1) == 0;
  }

  // src/renderers/webgl/2d.ts
  var WebGLRenderer2D = class {
    constructor(canvas) {
      this.canvas = canvas;
      this.eventManager = new EventManager();
      this.backgroundColor = [0, 0, 0, 1];
      const gl = canvas.getContext("webgl");
      if (!gl)
        throw new Error(`Could not request device!`);
      this.gl = gl;
      this.buffers = /* @__PURE__ */ new Map();
      this.program = initShaderProgram(gl, vertex2d, fragment2d);
      this.location = programInfo2d(gl, this.program);
    }
    start(entities) {
      this.gl.useProgram(this.program);
      for (const entity of entities) {
        this._start(entity);
      }
    }
    _start(entity) {
      if (entity instanceof Rectangle) {
        this.setupRectangle(entity);
      } else if (entity instanceof TextureSprite) {
        for (const rect of entity.data) {
          this.setupRectangle(rect);
        }
      } else if (entity instanceof Group) {
        for (const child of entity.children) {
          this._start(child);
        }
      } else if (entity instanceof Image2 || entity instanceof AtlasSprite || entity instanceof Sprite) {
        this.setupImage(entity);
      } else if (entity instanceof FrameBuffer) {
        this.setupFrameBuffer(entity);
      }
    }
    render(entities) {
      this.gl.clearColor.apply(null, this.backgroundColor);
      if (this.canvas.getCurrentState().mouseButtonLeft) {
        this.eventManager.emit("mouseDown", { x: this.canvas.getCurrentState().cursorX, y: this.canvas.getCurrentState().cursorY });
      }
      this.eventManager.keys.forEach((key) => {
        if (this.canvas.getCurrentState()[`key${key.toUpperCase()}`]) {
          this.eventManager.emit("keyDown", key);
        }
      });
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      for (const entity of entities) {
        this._render(entity);
      }
    }
    _render(entity) {
      if (entity instanceof Rectangle) {
        this.renderRectangle(entity);
      } else if (entity instanceof TextureSprite) {
        for (const rect of entity.data) {
          this.renderRectangle(rect);
        }
      } else if (entity instanceof Group) {
        for (const child of entity.children) {
          this._render(child);
        }
      } else if (entity instanceof Image2 || entity instanceof AtlasSprite || entity instanceof Sprite) {
        this.renderImage(entity);
      } else if (entity instanceof FrameBuffer) {
        if (entity.requestStart) {
          this.setupFrameBuffer(entity);
        }
        this.renderImage(entity);
      }
    }
    setupRectangle(entity) {
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
      for (let i = 0; i < data.length; i += 2) {
        data[i] = data[i] / this.canvas.width * 2 - 1;
        data[i + 1] = data[i + 1] / this.canvas.height * -2 + 1;
      }
      const position = createBuffer(this.gl, data);
      this.buffers.set(entity.id, { position });
    }
    renderRectangle(entity) {
      const buffers = this.buffers.get(entity.id);
      setBuffer(this.gl, buffers.position, this.location.position, 2);
      const x = entity.x / this.canvas.width * 2;
      const y = entity.y / this.canvas.height * -2;
      const color = this.colorNorm(entity.fill);
      this.gl.uniform1f(this.location.usage, 0);
      this.gl.uniform4fv(this.location.color, new Float32Array(color));
      this.gl.uniform2fv(this.location.transform, new Float32Array([x, y]));
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
    setupFrameBuffer(entity) {
      entity.requestStart = false;
      const { x, y, width, height } = { x: 0, y: 0, width: entity.width, height: entity.height };
      const data = [
        x,
        y,
        x + width,
        y,
        x,
        y + height,
        x + width,
        y + height
      ];
      for (let i = 0; i < data.length; i += 2) {
        data[i] = data[i] / entity.width;
        data[i + 1] = data[i + 1] / entity.height;
      }
      const coords = createBuffer(this.gl, data);
      for (let i = 0; i < data.length; i += 2) {
        data[i] = data[i] * entity.width / this.canvas.width * 2 - 1;
        data[i + 1] = data[i + 1] * entity.height / this.canvas.height * -2 + 1;
      }
      const position = createBuffer(this.gl, data);
      const texture = loadTexture(this.gl, entity);
      this.buffers.set(entity.id, { position, texture, coords });
    }
    setupImage(entity) {
      const { x, y, width, height } = entity instanceof Image2 ? { x: 0, y: 0, width: entity.width, height: entity.height } : entity.frame;
      const data = [
        x,
        y,
        x + width,
        y,
        x,
        y + height,
        x + width,
        y + height
      ];
      for (let i = 0; i < data.length; i += 2) {
        data[i] = data[i] / entity.width;
        data[i + 1] = data[i + 1] / entity.height;
      }
      const coords = createBuffer(this.gl, data);
      for (let i = 0; i < data.length; i += 2) {
        data[i] = data[i] * entity.width / this.canvas.width * 2 - 1;
        data[i + 1] = data[i + 1] * entity.height / this.canvas.height * -2 + 1;
      }
      const position = createBuffer(this.gl, data);
      const texture = loadTexture(this.gl, entity.image);
      this.buffers.set(entity.id, { position, texture, coords });
    }
    renderImage(entity) {
      const buffers = this.buffers.get(entity.id);
      setBuffer(this.gl, buffers.position, this.location.position, 2);
      setBuffer(this.gl, buffers.coords, this.location.texture, 2);
      const x = entity.x / this.canvas.width * 2;
      const y = entity.y / this.canvas.height * -2;
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, buffers.texture);
      this.gl.uniform1i(this.location.sampler, 0);
      this.gl.uniform2fv(this.location.transform, new Float32Array([x, y]));
      this.gl.uniform1f(this.location.usage, 1);
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
    setBackground(color) {
      this.backgroundColor = this.colorNorm(color);
    }
    colorNorm(rgba) {
      return rgba.map((c) => c / 255);
    }
  };

  // src/World.ts
  var World = class extends HTMLCanvasElement {
    constructor(params, scenes) {
      super(params);
      this.FPS = 500;
      this.plugins = {};
      this.params = params;
      this.scenes = scenes;
      this.currentScene = new this.scenes[0](this);
      this.renderer = new WebGLRenderer2D(this);
    }
    async start() {
      this.setup();
      await this.currentScene.loadResources();
      this.renderer.start(this.currentScene.entities);
      requestAnimationFrame(this._draw.bind(this));
      this.renderer.eventManager.on("keyDown", (event) => this.keyDown(event));
      this.renderer.eventManager.on("mouseDown", (event) => this._mouseDown(event));
    }
    _draw() {
      this._fps()();
      if (this.shouldClose())
        return;
      this.updateEvents();
      this.swapBuffers();
      this.updateProgramLifeCycle();
      this.renderer.render(this.currentScene.entities);
      requestAnimationFrame(this._draw.bind(this));
    }
    setFPS(fps) {
      this.FPS = fps;
    }
    _fps() {
      let start = performance.now();
      let frames = 0;
      return () => {
        frames++;
        if (performance.now() - start >= 1e3) {
          start = performance.now();
          frames = 0;
        }
        Deno.sleepSync(1 / this.FPS * 1e3);
      };
    }
    keyDown(e) {
      this.currentScene.keyDown(e);
    }
    setScene(scene) {
      if (typeof scene === "string") {
        for (const s of this.scenes) {
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
      return new this.plugins[name](this);
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
    get mouseX() {
      return this.renderer.canvas.getCurrentState().cursorX;
    }
    get mouseY() {
      return this.renderer.canvas.getCurrentState().cursorY;
    }
  };

  // src/scenes/Scene.ts
  var Scene = class {
    constructor(world) {
      this.world = world;
      this.entities = [];
      this._resources = [];
      this.resources = [];
    }
    async loadResources() {
      await Promise.all(this._resources);
    }
    addChild(e) {
      this.entities.push(e);
      if (e instanceof Image2 || e instanceof AtlasSprite || e instanceof Sprite) {
        this._resources.push(e.load());
      }
    }
    killChild(e) {
      const index = this.entities.indexOf(e);
      if (index < -1)
        return;
      this.entities.splice(index, 1);
    }
    _mouseDown(e) {
      for (const entity of this.entities) {
        if (entity instanceof Button) {
          if (e.x >= entity.x && e.x <= entity.child.x + entity.child.width && e.y >= entity.child.y && e.y <= entity.child.y + entity.child.height) {
            entity.onClick();
          }
        }
      }
      this.mouseDown(e);
    }
    _mouseMotion(e) {
      this.mouseMotion(e);
    }
    setKeys(_keys) {
      this.world.renderer.eventManager.keys = _keys;
    }
    get mouseX() {
      return this.world.mouseX;
    }
    get mouseY() {
      return this.world.mouseY;
    }
    tick() {
    }
    mouseDown(_e) {
    }
    mouseMotion(_e) {
    }
    setup() {
    }
    update() {
    }
    keyDown(_e) {
    }
  };

  // src/events/EventManager.ts
  var EventManager = class {
    constructor() {
      this.listeners = /* @__PURE__ */ new Map();
      this.keys = [];
    }
    on(event, listener) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, /* @__PURE__ */ new Set());
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
        for (const listener of this.listeners.get(event)) {
          listener(data);
        }
      }
    }
    clear() {
      this.listeners.clear();
    }
  };

  // src/entities/Entity.ts
  var Entity3 = class {
    constructor(x, y) {
      this.width = 0;
      this.height = 0;
      this.id = crypto.randomUUID();
      this.#x = x;
      this.#y = y;
      this.#z = 1;
    }
    #x;
    #y;
    #z;
    set x(x) {
      this.#x = x;
    }
    get x() {
      return this.#x;
    }
    set y(y) {
      this.#y = y;
    }
    get y() {
      return this.#y;
    }
    set z(z) {
      this.#z = z;
    }
    get z() {
      return this.#z;
    }
    setPosition(x, y, z) {
      this.#x = x;
      this.#y = y;
      if (z)
        this.#z = z;
    }
  };

  // src/utils/Keycodes.ts
  var Keys = /* @__PURE__ */ ((Keys2) => {
    Keys2[Keys2["BACKSPACE"] = 8] = "BACKSPACE";
    Keys2[Keys2["SPACE"] = 32] = "SPACE";
    Keys2[Keys2["QUOTE"] = 39] = "QUOTE";
    Keys2[Keys2["COMMA"] = 44] = "COMMA";
    Keys2[Keys2["PLUS"] = 45] = "PLUS";
    Keys2[Keys2["PERIOD"] = 46] = "PERIOD";
    Keys2[Keys2["FORWARDSLASH"] = 47] = "FORWARDSLASH";
    Keys2[Keys2["N0"] = 48] = "N0";
    Keys2[Keys2["N1"] = 49] = "N1";
    Keys2[Keys2["N2"] = 50] = "N2";
    Keys2[Keys2["N3"] = 51] = "N3";
    Keys2[Keys2["N4"] = 52] = "N4";
    Keys2[Keys2["N5"] = 53] = "N5";
    Keys2[Keys2["N6"] = 54] = "N6";
    Keys2[Keys2["N7"] = 55] = "N7";
    Keys2[Keys2["N8"] = 56] = "N8";
    Keys2[Keys2["N9"] = 57] = "N9";
    Keys2[Keys2["SEMICOLON"] = 59] = "SEMICOLON";
    Keys2[Keys2["EQUAL"] = 61] = "EQUAL";
    Keys2[Keys2["OPENBRACKET"] = 91] = "OPENBRACKET";
    Keys2[Keys2["BACKSLASH"] = 92] = "BACKSLASH";
    Keys2[Keys2["CLOSEBRACKET"] = 93] = "CLOSEBRACKET";
    Keys2[Keys2["BACKTICK"] = 96] = "BACKTICK";
    Keys2[Keys2["A"] = 97] = "A";
    Keys2[Keys2["B"] = 98] = "B";
    Keys2[Keys2["C"] = 99] = "C";
    Keys2[Keys2["D"] = 100] = "D";
    Keys2[Keys2["E"] = 101] = "E";
    Keys2[Keys2["F"] = 102] = "F";
    Keys2[Keys2["G"] = 103] = "G";
    Keys2[Keys2["H"] = 104] = "H";
    Keys2[Keys2["I"] = 105] = "I";
    Keys2[Keys2["J"] = 106] = "J";
    Keys2[Keys2["K"] = 107] = "K";
    Keys2[Keys2["L"] = 108] = "L";
    Keys2[Keys2["M"] = 109] = "M";
    Keys2[Keys2["N"] = 110] = "N";
    Keys2[Keys2["O"] = 111] = "O";
    Keys2[Keys2["P"] = 112] = "P";
    Keys2[Keys2["Q"] = 113] = "Q";
    Keys2[Keys2["R"] = 114] = "R";
    Keys2[Keys2["S"] = 115] = "S";
    Keys2[Keys2["T"] = 116] = "T";
    Keys2[Keys2["U"] = 117] = "U";
    Keys2[Keys2["V"] = 118] = "V";
    Keys2[Keys2["W"] = 119] = "W";
    Keys2[Keys2["X"] = 120] = "X";
    Keys2[Keys2["Y"] = 121] = "Y";
    Keys2[Keys2["Z"] = 122] = "Z";
    Keys2[Keys2["CTRL"] = 1073742048] = "CTRL";
    Keys2[Keys2["SHIFT"] = 1073742049] = "SHIFT";
    Keys2[Keys2["ALT"] = 1073742050] = "ALT";
    Keys2[Keys2["ARROWRIGHT"] = 1073741903] = "ARROWRIGHT";
    Keys2[Keys2["ARROWLEFT"] = 1073741904] = "ARROWLEFT";
    Keys2[Keys2["ARROWDOWN"] = 1073741905] = "ARROWDOWN";
    Keys2[Keys2["ARROWUP"] = 1073741906] = "ARROWUP";
    return Keys2;
  })(Keys || {});

  // src/utils/atlas/PhaserAtlas.ts
  var PhaserAtlas = class {
    constructor(data) {
      this.frames = {};
      this.width = data.textures[0].size.w;
      this.height = data.textures[0].size.h;
      this.imgUrl = `file:///${Deno.cwd()}/${data.textures[0].image}`;
      for (const frame of data.textures[0].frames) {
        this.frames[frame.filename] = {
          x: frame.frame.x,
          y: frame.frame.y,
          width: frame.frame.w,
          height: frame.frame.h
        };
      }
    }
  };

  // src/utils/atlas/PixiAtlas.ts
  var PixiAtlas = class {
    constructor(data) {
      this.frames = {};
      this.width = data.meta.size.w;
      this.height = data.meta.size.h;
      this.imgUrl = `file:///${Deno.cwd()}/${data.meta.image}`;
      for (const i in data.frames) {
        const frame = data.frames[i];
        this.frames[i] = {
          x: frame.frame.x,
          y: frame.frame.y,
          width: frame.frame.w,
          height: frame.frame.h
        };
      }
    }
  };

  // src/utils/atlas/GodotAtlas.ts
  var GodotAtlas = class {
    constructor(data) {
      this.frames = {};
      this.width = data.textures[0].size.w;
      this.height = data.textures[0].size.h;
      this.imgUrl = `file:///${Deno.cwd()}/${data.textures[0].image}`;
      for (const frame of data.textures[0].sprites) {
        this.frames[frame.filename] = {
          x: frame.region.x,
          y: frame.region.y,
          width: frame.region.w,
          height: frame.region.h
        };
      }
    }
  };

  // src/utils/atlas/Atlas.ts
  var import_mod4 = __require("https://deno.land/std@0.125.0/path/mod.ts");
  function atlas(url, type = "phaser") {
    const data = JSON.parse(Deno.readTextFileSync((0, import_mod4.fromFileUrl)(url)));
    switch (type) {
      case "phaser": {
        return new PhaserAtlas(data);
      }
      case "pixi": {
        return new PixiAtlas(data);
      }
      case "godot": {
        return new GodotAtlas(data);
      }
      default: {
        throw new Error(`Unknown atlas type: ${type}`);
      }
    }
  }

  // src/utils/HexToRGBA.ts
  var hexToRGBA = (hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
    1
  ];

  // src/utils/Frames.ts
  var generateFrames = (width, height, rows, cols) => {
    const frames = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        frames.push({
          x: i * (width / cols),
          y: j * (height / rows),
          width: width / cols,
          height: height / rows
        });
      }
    }
    return frames;
  };

  // src/utils/Perlin.ts
  var Grad = class {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    dot2(x, y) {
      return this.x * x + this.y * y;
    }
    dot3(x, y, z) {
      return this.x * x + this.y * y + this.z * z;
    }
  };
  var grad3 = [
    new Grad(1, 1, 0),
    new Grad(-1, 1, 0),
    new Grad(1, -1, 0),
    new Grad(-1, -1, 0),
    new Grad(1, 0, 1),
    new Grad(-1, 0, 1),
    new Grad(1, 0, -1),
    new Grad(-1, 0, -1),
    new Grad(0, 1, 1),
    new Grad(0, -1, 1),
    new Grad(0, 1, -1),
    new Grad(0, -1, -1)
  ];
  var F2 = 0.5 * (Math.sqrt(3) - 1);
  var G2 = (3 - Math.sqrt(3)) / 6;
  var F3 = 1 / 3;
  var G3 = 1 / 6;

  // src/entities/geometry/Rectangle.ts
  var Rectangle = class extends Entity3 {
    constructor(x, y, width, height, fill) {
      super(x, y);
      this.width = width;
      this.height = height;
      this.right = x + width;
      this.left = x;
      this.up = y;
      this.down = y + height;
      this.bottom = y + height;
      this.fill = typeof fill === "string" ? hexToRGBA(fill) : fill;
    }
    setFill(c) {
      this.fill = typeof c === "string" ? hexToRGBA(c) : c;
    }
    setAlpha(a) {
      this.fill[3] = a;
    }
  };

  // src/entities/sprites/Image.ts
  var Image2 = class extends Entity3 {
    constructor(url, x, y) {
      super(x, y);
      this.width = 0;
      this.height = 0;
      this.image = new Image();
      this.url = `file:///${Deno.cwd()}/${url}`;
    }
    load() {
      return new Promise((res, rej) => {
        this.image.src = this.url;
        this.image.onload = () => {
          this.width = this.image.width;
          this.height = this.image.height;
          res(this);
        };
        this.image.onerror = rej;
      });
    }
  };

  // src/entities/sprites/Sprite.ts
  var Sprite = class extends Entity3 {
    constructor(url, x, y, { rows, cols }, _frame = 0) {
      super(x, y);
      this.frames = [];
      this.frame = { x: 0, y: 0, width: 0, height: 0 };
      this.image = new Image();
      this.url = `file:///${Deno.cwd()}/${url}`;
      this.width = 0;
      this.height = 0;
      this.rows = rows;
      this.cols = cols;
      this._frame = _frame;
    }
    load() {
      return new Promise((res, rej) => {
        this.image.src = this.url;
        this.image.onload = () => {
          this.width = this.image.width;
          this.height = this.image.height;
          this.frames = generateFrames(this.width, this.height, this.rows, this.cols);
          this.frame = this.frames[this._frame];
          res(this);
        };
        this.image.onerror = rej;
      });
    }
    nextFrame() {
      this.frame = this.frames[(this.frames.indexOf(this.frame) + 1) % this.frames.length];
    }
    previousFrame() {
      this.frame = this.frames[(this.frames.indexOf(this.frame) - 1 + this.frames.length) % this.frames.length];
    }
    setFrame(frame) {
      this.frame = this.frames[frame];
    }
  };

  // src/entities/sprites/Atlas.ts
  var Atlas = class extends Entity3 {
    constructor(atlasUrl, type = "phaser") {
      super(0, 0);
      this.preloaded = false;
      this.image = new Image();
      this.atlas = atlas(`file:///${Deno.cwd()}/${atlasUrl}`, type);
    }
    getFrame(key) {
      console.log(this.atlas.frames);
      return this.atlas.frames[key];
    }
    get imgUrl() {
      return this.atlas.imgUrl;
    }
    load() {
      return new Promise((res, rej) => {
        this.image.src = this.atlas.imgUrl;
        this.image.onload = () => {
          this.width = this.image.width;
          this.height = this.image.height;
          this.preloaded = true;
          res(this);
        };
        this.image.onerror = rej;
      });
    }
  };

  // src/entities/sprites/AtlasSprite.ts
  var AtlasSprite = class extends Entity3 {
    constructor(atlas2, x, y, frame) {
      super(x, y);
      this.atlas = atlas2;
      this._frame = frame;
      this.frame = atlas2.getFrame(frame);
      this.image = new Image();
    }
    load() {
      return new Promise((res, rej) => {
        this.image.src = this.atlas.imgUrl;
        this.image.onload = () => {
          this.width = this.image.width;
          this.height = this.image.height;
          this.atlas.preloaded = true;
          res(this);
        };
        this.image.onerror = rej;
      });
    }
  };

  // src/entities/sprites/FrameBuffer.ts
  var FrameBuffer = class extends Entity3 {
    constructor(world, buffer, width, height) {
      super(0, 0);
      this.rawData = new Uint8Array(0);
      this.requestStart = true;
      this.width = width || world.width;
      this.height = height || world.height;
      this.rawData = buffer;
    }
    load() {
      return new Promise((res, _rej) => {
        res(this);
      });
    }
    setBuffer(buffer) {
      this.rawData = buffer;
      this.requestStart = true;
    }
  };

  // src/entities/containers/Group.ts
  var Group = class extends Entity3 {
    constructor(scene, x, y) {
      super(x, y);
      this.children = [];
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
  };

  // src/entities/containers/Button.ts
  var Button = class extends Entity3 {
    constructor(child) {
      super(child.x, child.y);
      this.child = child;
    }
    set x(x) {
      this.child.x = x;
    }
    set y(y) {
      this.child.y = y;
    }
    onClick() {
    }
  };

  // src/entities/textures/palettes/mod.ts
  var Arne16 = [
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
    "#B2DCEF"
  ];
  var C64 = [
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
    "#acacac"
  ];
  var CGA = [
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
    "#fff"
  ];
  var JMP = [
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
    "#f5f4eb"
  ];
  var MSX = [
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
    "#fff"
  ];
  var PICO8 = [
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
    "#FFCCAA"
  ];

  // src/entities/textures/TextureSprite.ts
  var TextureSprite = class extends Entity3 {
    constructor(_scene, x, y, texture) {
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
      for (let y = 0; y < this.texture.data.length; y++) {
        const row = this.texture.data[y];
        for (let x = 0; x < row.length; x++) {
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
      for (let j = 0; j < this.texture.data.length; j++) {
        const row = this.texture.data[j];
        for (let i = 0; i < row.length; i++) {
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
      for (let j = 0; j < this.texture.data.length; j++) {
        const row = this.texture.data[j];
        for (let i = 0; i < row.length; i++) {
          if (row[i] !== "." && row[i] !== " ") {
            const pixel = this.data[k];
            pixel.y = j * this.pixelWidth + this.y;
            k += 1;
          }
        }
      }
    }
  };

  // src/math/FuzzyEqual.ts
  var FuzzyEqual = (a, b, epsilon = 1e-4) => Math.abs(a - b) < epsilon;

  // src/math/const.ts
  var MATH_CONST = {
    PI2: Math.PI * 2,
    TAU: Math.PI * 0.5,
    EPSILON: 1e-6,
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,
    RND: null,
    MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER || -9007199254740991,
    MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 9007199254740991
  };

  // src/math/vector/Vector.ts
  var Vector = class {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    clone() {
      return new Vector(this.x, this.y);
    }
    copy(src) {
      this.x = src.x || 0;
      this.y = src.y || 0;
      return this;
    }
    set(x, y) {
      this.x = x;
      this.y = y || x;
      return this;
    }
    setToPolar(azimuth, radius = 1) {
      this.x = Math.cos(azimuth) * radius;
      this.y = Math.sin(azimuth) * radius;
      return this;
    }
    equals(v) {
      return this.x === v.x && this.y === v.y;
    }
    fuzzyEquals(v, epsilon = 1e-4) {
      return FuzzyEqual(this.x, v.x, epsilon) && FuzzyEqual(this.y, v.y, epsilon);
    }
    angle() {
      let angle = Math.atan2(this.y, this.x);
      if (angle < 0)
        angle += 2 * Math.PI;
      return angle;
    }
    setAngle(angle) {
      return this.setToPolar(angle, this.length());
    }
    add(src) {
      this.x += src.x;
      this.y += src.y;
      return this;
    }
    subtract(src) {
      this.x -= src.x;
      this.y -= src.y;
      return this;
    }
    multiply(src) {
      this.x *= src.x;
      this.y *= src.y;
      return this;
    }
    scale(value) {
      if (isFinite(value)) {
        this.x *= value;
        this.y *= value;
      } else {
        this.x = 0;
        this.y = 0;
      }
      return this;
    }
    divide(src) {
      this.x /= src.x;
      this.y /= src.y;
      return this;
    }
    negate() {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }
    distance(src) {
      const dx = src.x - this.x;
      const dy = src.y - this.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    distanceSq(src) {
      const dx = src.x - this.x;
      const dy = src.y - this.y;
      return dx * dx + dy * dy;
    }
    length() {
      const x = this.x;
      const y = this.y;
      return Math.sqrt(x * x + y * y);
    }
    setLength(length) {
      return this.normalize().scale(length);
    }
    lengthSq() {
      const x = this.x;
      const y = this.y;
      return x * x + y * y;
    }
    normalize() {
      let x = this.x;
      let y = this.y;
      let len = x * x + y * y;
      if (len > 0) {
        len = 1 / Math.sqrt(len);
        this.x = x * len;
        this.y = y * len;
      }
      return this;
    }
    normalizeRightHand() {
      const x = this.x;
      this.x = this.y * -1;
      this.y = x;
      return this;
    }
    normalizeLeftHand() {
      const x = this.x;
      this.x = this.y;
      this.y = x * -1;
      return this;
    }
    dot(src) {
      return this.x * src.x + this.y * src.y;
    }
    cross(src) {
      return this.x * src.y - this.y * src.x;
    }
    lerp(src, t = 0) {
      const ax = this.x;
      const ay = this.y;
      this.x = ax + t * (src.x - ax);
      this.y = ay + t * (src.y - ay);
      return this;
    }
    reset() {
      this.x = 0;
      this.y = 0;
      return this;
    }
    limit(max) {
      const len = this.length();
      if (len && len > max) {
        this.scale(max / len);
      }
      return this;
    }
    reflect(normal) {
      normal = normal.clone().normalize();
      return this.subtract(normal.scale(2 * this.dot(normal)));
    }
    mirror(axis) {
      return this.reflect(axis).negate();
    }
    rotate(delta) {
      const cos = Math.cos(delta);
      const sin = Math.sin(delta);
      return this.set(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
    }
  };

  // src/math/matrices/TransformMatrix.ts
  var TransformMatrix = class {
    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
      this.matrix = new Float32Array([a, b, c, d, tx, ty, 0, 0, 1]);
      this.decomposedMatrix = {
        translateX: 0,
        translateY: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0
      };
    }
    get a() {
      return this.matrix[0];
    }
    set a(value) {
      this.matrix[0] = value;
    }
    get b() {
      return this.matrix[1];
    }
    set b(value) {
      this.matrix[1] = value;
    }
    get c() {
      return this.matrix[2];
    }
    set c(value) {
      this.matrix[2] = value;
    }
    get d() {
      return this.matrix[3];
    }
    set d(value) {
      this.matrix[3] = value;
    }
    get e() {
      return this.matrix[4];
    }
    set e(value) {
      this.matrix[4] = value;
    }
    get f() {
      return this.matrix[5];
    }
    set f(value) {
      this.matrix[5] = value;
    }
    get tx() {
      return this.matrix[4];
    }
    set tx(value) {
      this.matrix[4] = value;
    }
    get ty() {
      return this.matrix[5];
    }
    set ty(value) {
      this.matrix[5] = value;
    }
    get rotation() {
      return Math.acos(this.a / this.scaleX) * (Math.atan(-this.c / this.a) < 0 ? -1 : 1);
    }
    get rotationNormalized() {
      const matrix = this.matrix;
      const a = matrix[0];
      const b = matrix[1];
      const c = matrix[2];
      const d = matrix[3];
      if (a || b) {
        return b > c ? Math.acos(a / this.scaleX) : -Math.acos(a / this.scaleX);
      } else if (c || d) {
        return MATH_CONST.TAU - (d > 0 ? Math.acos(-c / this.scaleY) : -Math.acos(c / this.scaleY));
      }
      return 0;
    }
    get scaleX() {
      return Math.sqrt(this.a * this.a + this.b * this.b);
    }
    get scaleY() {
      return Math.sqrt(this.c * this.c + this.d * this.d);
    }
    loadIdentity() {
      this.matrix[0] = 1;
      this.matrix[1] = 0;
      this.matrix[2] = 0;
      this.matrix[3] = 1;
      this.matrix[4] = 0;
      this.matrix[5] = 0;
      return this;
    }
    translate(x, y) {
      this.matrix[4] = this.matrix[0] * x + this.matrix[2] * y + this.matrix[4];
      this.matrix[5] = this.matrix[1] * x + this.matrix[3] * y + this.matrix[5];
      return this;
    }
    scale(x, y) {
      this.matrix[0] *= x;
      this.matrix[1] *= x;
      this.matrix[2] *= y;
      this.matrix[3] *= y;
      return this;
    }
    rotate(angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const a = this.matrix[0];
      const b = this.matrix[1];
      const c = this.matrix[2];
      const d = this.matrix[3];
      this.matrix[0] = a * cos + c * sin;
      this.matrix[1] = b * cos + d * sin;
      this.matrix[2] = a * -sin + c * cos;
      this.matrix[3] = b * -sin + d * cos;
      return this;
    }
    multiply(rhs, out) {
      const matrix = this.matrix;
      const source = rhs.matrix;
      const localA = matrix[0];
      const localB = matrix[1];
      const localC = matrix[2];
      const localD = matrix[3];
      const localE = matrix[4];
      const localF = matrix[5];
      const sourceA = source[0];
      const sourceB = source[1];
      const sourceC = source[2];
      const sourceD = source[3];
      const sourceE = source[4];
      const sourceF = source[5];
      const destinationMatrix = out ? out : this;
      destinationMatrix.a = sourceA * localA + sourceB * localC;
      destinationMatrix.b = sourceA * localB + sourceB * localD;
      destinationMatrix.c = sourceC * localA + sourceD * localC;
      destinationMatrix.d = sourceC * localB + sourceD * localD;
      destinationMatrix.e = sourceE * localA + sourceF * localC + localE;
      destinationMatrix.f = sourceE * localB + sourceF * localD + localF;
      return destinationMatrix;
    }
    multiplyWithOffset(src, offsetX, offsetY) {
      const matrix = this.matrix;
      const otherMatrix = src.matrix;
      const a0 = matrix[0];
      const b0 = matrix[1];
      const c0 = matrix[2];
      const d0 = matrix[3];
      const tx0 = matrix[4];
      const ty0 = matrix[5];
      const pse = offsetX * a0 + offsetY * c0 + tx0;
      const psf = offsetX * b0 + offsetY * d0 + ty0;
      const a1 = otherMatrix[0];
      const b1 = otherMatrix[1];
      const c1 = otherMatrix[2];
      const d1 = otherMatrix[3];
      const tx1 = otherMatrix[4];
      const ty1 = otherMatrix[5];
      matrix[0] = a1 * a0 + b1 * c0;
      matrix[1] = a1 * b0 + b1 * d0;
      matrix[2] = c1 * a0 + d1 * c0;
      matrix[3] = c1 * b0 + d1 * d0;
      matrix[4] = tx1 * a0 + ty1 * c0 + pse;
      matrix[5] = tx1 * b0 + ty1 * d0 + psf;
      return this;
    }
    transform(a, b, c, d, tx, ty) {
      const matrix = this.matrix;
      const a0 = matrix[0];
      const b0 = matrix[1];
      const c0 = matrix[2];
      const d0 = matrix[3];
      const tx0 = matrix[4];
      const ty0 = matrix[5];
      matrix[0] = a * a0 + b * c0;
      matrix[1] = a * b0 + b * d0;
      matrix[2] = c * a0 + d * c0;
      matrix[3] = c * b0 + d * d0;
      matrix[4] = tx * a0 + ty * c0 + tx0;
      matrix[5] = tx * b0 + ty * d0 + ty0;
      return this;
    }
    transformPoint(x, y, point = { x: 0, y: 0 }) {
      const matrix = this.matrix;
      const a = matrix[0];
      const b = matrix[1];
      const c = matrix[2];
      const d = matrix[3];
      const tx = matrix[4];
      const ty = matrix[5];
      point.x = x * a + y * c + tx;
      point.y = x * b + y * d + ty;
      return point;
    }
    invert() {
      const matrix = this.matrix;
      const a = matrix[0];
      const b = matrix[1];
      const c = matrix[2];
      const d = matrix[3];
      const tx = matrix[4];
      const ty = matrix[5];
      const determinant = a * d - b * c;
      matrix[0] = d / determinant;
      matrix[1] = -b / determinant;
      matrix[2] = -c / determinant;
      matrix[3] = a / determinant;
      matrix[4] = (c * ty - d * tx) / determinant;
      matrix[5] = -(a * ty - b * tx) / determinant;
      return this;
    }
    copyFrom(src) {
      const matrix = this.matrix;
      matrix[0] = src.a;
      matrix[1] = src.b;
      matrix[2] = src.c;
      matrix[3] = src.d;
      matrix[4] = src.e;
      matrix[5] = src.f;
      return this;
    }
    copyFromArray(src) {
      const matrix = this.matrix;
      matrix[0] = src[0];
      matrix[1] = src[1];
      matrix[2] = src[2];
      matrix[3] = src[3];
      matrix[4] = src[4];
      matrix[5] = src[5];
      return this;
    }
    copyToArray(dest) {
      const matrix = this.matrix;
      dest[0] = matrix[0];
      dest[1] = matrix[1];
      dest[2] = matrix[2];
      dest[3] = matrix[3];
      dest[4] = matrix[4];
      dest[5] = matrix[5];
      return dest;
    }
    setTransform(a, b, c, d, tx, ty) {
      const matrix = this.matrix;
      matrix[0] = a;
      matrix[1] = b;
      matrix[2] = c;
      matrix[3] = d;
      matrix[4] = tx;
      matrix[5] = ty;
      return this;
    }
    decomposeMatrix() {
      const decomposedMatrix = this.decomposedMatrix;
      const matrix = this.matrix;
      const a = matrix[0];
      const b = matrix[1];
      const c = matrix[2];
      const d = matrix[3];
      const determinant = a * d - b * c;
      decomposedMatrix.translateX = matrix[4];
      decomposedMatrix.translateY = matrix[5];
      if (a || b) {
        const r = Math.sqrt(a * a + b * b);
        decomposedMatrix.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
        decomposedMatrix.scaleX = r;
        decomposedMatrix.scaleY = determinant / r;
      } else if (c || d) {
        const s = Math.sqrt(c * c + d * d);
        decomposedMatrix.rotation = Math.PI * 0.5 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
        decomposedMatrix.scaleX = determinant / s;
        decomposedMatrix.scaleY = s;
      } else {
        decomposedMatrix.rotation = 0;
        decomposedMatrix.scaleX = 0;
        decomposedMatrix.scaleY = 0;
      }
      return decomposedMatrix;
    }
    applyITRS(x, y, rotation, scaleX, scaleY) {
      const matrix = this.matrix;
      const radianSin = Math.sin(rotation);
      const radianCos = Math.cos(rotation);
      matrix[4] = x;
      matrix[5] = y;
      matrix[0] = radianCos * scaleX;
      matrix[1] = radianSin * scaleX;
      matrix[2] = -radianSin * scaleY;
      matrix[3] = radianCos * scaleY;
      return this;
    }
    applyInverse(x, y, output = new Vector()) {
      const matrix = this.matrix;
      const a = matrix[0];
      const b = matrix[1];
      const c = matrix[2];
      const d = matrix[3];
      const tx = matrix[4];
      const ty = matrix[5];
      const id = 1 / (a * d + -b * c);
      output.x = d * id * x + -c * id * y + (ty * c - tx * d) * id;
      output.y = a * id * y + -b * id * x + (-ty * a + tx * b) * id;
      return output;
    }
    getX(x, y) {
      return x * this.a + y * this.c + this.e;
    }
    getY(x, y) {
      return x * this.b + y * this.d + this.f;
    }
    getXRound(x, y, round = false) {
      const v = this.getX(x, y);
      return round ? Math.round(v) : v;
    }
    getYRound(x, y, round = false) {
      const v = this.getY(x, y);
      return round ? Math.round(v) : v;
    }
    getCSSMatrix() {
      return `matrix(${this.matrix[0]}, ${this.matrix[1]}, ${this.matrix[2]}, ${this.matrix[3]}, ${this.matrix[4]}, ${this.matrix[5]})`;
    }
  };
})();
