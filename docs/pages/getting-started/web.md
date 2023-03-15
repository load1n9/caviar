---
title: Getting Started Web
description: Web guide
index: 3
---

## Setup

since caviar doesn't require any build or tools, we can write this exampes using
only an html file.

```html
<html>
    <head>
        <title>Caviar Example</title>
    </head>
    <body>
        <script type="module">
            // our code will be written here
        </script>
    </body>
</html>
```

first we'll create a new class that extends Scene

```javascript
import { Scene } from "https://deno.land/x/caviar@2.4.10/web/dist/mod.js";
class Game extends Scene {
}
```

the scene takes in a world parameter which will be our overall game

Next we'll add a setup method, the setup method will be where most of the
initialization happens

```javascript
import { Scene } from "https://deno.land/x/caviar@2.4.10/web/dist/mod.js";
class Game extends Scene {
  setup() {
    //initialize entities
  }
}
```

## Adding Entities

first we'll make a rectangle with a width & height of 50 and set the x and y
coordinates to 20, we'll also set the color to #0000ff and add the rectangle to
the scene using the addChild method

```javascript
import {
  Rectangle,
  Scene,
} from "https://deno.land/x/caviar@2.4.10/web/dist/mod.js";
class Game extends Scene {
  rect = new Rectangle(20, 20, 50, 50, "#0000ff");
  setup() {
    this.addChild(this.rect);
  }
}
```

lets also add an update method which will re-render every frame

```javascript
import {
  Rectangle,
  Scene,
} from "https://deno.land/x/caviar@2.4.10/web/dist/mod.js";
class Game extends Scene {
  rect = new Rectangle(20, 20, 50, 50, "#0000ff");
  setup() {
    this.addChild(this.rect);
  }
  update() {
    this.rect.x += 5;
  }
}
```

Next we'll create the world and add the scene to the world. We'll also run
`await test.start()` to start the game.

```javascript
import {
  Rectangle,
  Scene,
  World,
} from "https://deno.land/x/caviar@2.4.10/web/dist/mod.js";
class Game extends Scene {
  rect = new Rectangle(20, 20, 50, 50, "#0000ff");
  setup() {
    this.addChild(this.rect);
  }
  update() {
    this.rect.x += 5;
  }
}
const test = new World({
  title: "test",
  width: 800,
  height: 600,
  resizable: true,
  id: "example-canvas",
}, [Game]);

await test.start();
```

#### run this in any browser with webgpu support

_WebGPU is available for now in Chrome Canary on desktop behind an experimental
flag. You can enable it at
[chrome://flags/#enable-unsafe-webgpu](chrome://flags/#enable-unsafe-webgpu).
The API is constantly changing and currently unsafe. As GPU sandboxing isn't
implemented yet for the WebGPU API, it is possible to read GPU data for other
processes! Don't browse the web with it enabled._

![](https://i.ibb.co/RY0wNPT/Screenshot-2022-06-06-062842.png)

## [jsfiddle](https://jsfiddle.net/u4L1dewc/1/)
