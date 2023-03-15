---
title: Getting Started Deno
description: Deno guide
index: 2
---
### Setup

first we'll create a new class that extends Scene

```typescript
import { Scene } from "https://deno.land/x/caviar/mod.ts";
class Game extends Scene {
}
```

the scene takes in a world parameter which will be our overall game

Next we'll add a setup method, the setup method will be where most of the
initialization happens

```typescript
import { Scene } from "https://deno.land/x/caviar/mod.ts";
class Game extends Scene {
  setup() {
    //initialize entities
  }
}
```

### Adding Entities

first we'll make a rectangle with a width & height of 50 and set the x and y
coordinates to 20, we'll also set the color to #0000ff and add the rectangle to
the scene using the addChild method

```typescript
import { Rectangle, Scene } from "https://deno.land/x/caviar/mod.ts";
class Game extends Scene {
  setup() {
    const rect = new Rectangle(20, 20, 50, 50, "#0000ff");
    this.addChild(rect);
  }
}
```

Next we'll create the world and add the scene to the world. We'll also run
`await test.start()` to start the game.

```typescript
import { Rectangle, Scene, World } from "https://deno.land/x/caviar/mod.ts";
class Game extends Scene {
  setup() {
    const rect = new Rectangle(20, 20, 50, 50, "#0000ff");
    this.addChild(rect);
  }
}
const test = new World({
  title: "test",
  width: 800,
  height: 600,
  resizable: true,
}, [Game]);

await test.start();
```

run this with the unstable flag

```sh
deno run -A --unstable main.ts
```

![preview](https://i.ibb.co/RzSZfBH/Screenshot-2021-12-10-112659.png)
