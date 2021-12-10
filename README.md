
<p align="center">
 <img src="assets/caviar.svg" width="80rem" /> 
</p>
<br/>
<p align="center">
  <a href="https://github.com/load1n9/caviar/stargazers">
    <img alt="caviar stars" src="https://img.shields.io/github/stars/load1n9/caviar?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAEFCu8CAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAHKADAAQAAAABAAAAHAAAAABHddaYAAABxElEQVRIDe2Wv04CQRDGAQuoTKQ2ITyADZWVJZWV+gJYWBNqKh/C16CRBlprWxsTE2NJfABNOH9z7Gzm2Nv7A8TCOMnHzs1838ze3e4ejUbMkiRZS64lP1x8MjTFr2DQE6Gl2nI+7POARXAmdbas44ku8eLGhU9UckRliX6qxM9sQvz0vrcVaaKJKdsSNO7LOtK1kvcbaXVRu4LMz9kgKoYwBq/KLBi/yC2DQgSnBaLMQ88Tx7Q3AVkDKHpgBdoak5HrCSjuaAW/6zOz+u/Q3ZfcVrhliuaPYCAqsSJekIO/TlWbn2BveAH5JZBVUWayusZW2ClTuPzMi6xTIp5abuBHxHLcZSyzkxHF1uNJRrV9gXBhOl7h6wFW/FqcaGILEmsDWfg9G//3858Az0lWaHhm5dP3i9JoDtTm+1UrUdMl72OZv10itfx3zOYpLAv/FPQNLvFj35Bnco/gzeCD72H6b4JYaDTpgidwaJOa3bCji5BsgYcDdJUamSMi2lQTCEbgu0Zz4Y5UX3tE3K/RTKny3qNWdst3UWU8sYtmU40py2Go9o5zC460l/guJjm1leZrjaiH4B4cVxUK12mGVTV/j/cDqcFClUX01ZEAAAAASUVORK5CYII=" />
  </a>
  <a href="https://github.com/load1n9/caviar/releases/latest/">
    <img alt="caviar releases" src="https://img.shields.io/github/v/release/load1n9/caviar?logo=github" />
  </a>
  <a href="https://github.com/load1n9/caviar/blob/master/LICENSE">
    <img alt="caviar License" src="https://img.shields.io/github/license/load1n9/caviar?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAEFCu8CAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAHKADAAQAAAABAAAAHAAAAABHddaYAAAC5UlEQVRIDd2WPWtVQRCGby5pVASLiGghQSxyG8Ui2KWwCfkH9olY2JneQkiR0oCIxH/gB+qVFDYBIWBAbAIRSbCRpLXwIxLiPT7vnNm9e87ZxJtUwYH3zO47Mzv7Mbv3tlo5KYriGtgAJ81OY1ENdG/YI4boFEOI911BXgY/pdtwGuAtXpvmB1tAXHDnUolE5urkPOQo6MqA3pXWmJJL4Bb4rQ7yEYfxsjnIF29NJIoNC6e5fxOL/qN+9KCz7AaLpN8zI415N2i2EptpGrkRIjGeAuvR6IY1hSFLFUOug9Ms2M7ZxIUNytm1mnME186sdI2BOCwAyQMg54ugzSmKmwbPwSbolKH+hbAtQdsOoF+BsF3anUVwBdiOWRidFZDKTTrKEAJTm3GVrGkHzw/uPZbyx7DNNLfB7KGmRsCcr+/gjaiPSpAOTyX9qG4L/XBDdWXDDf1M+wtQ5fwCOtcb4Dto6VpLmzByB6gqdHbTItGSJdAGqibJQhmRfCF7IN4beSF2G9CqnGXQrxofXU+EykllNeoczRgYytDKMubDIRK0g5MF8rE69cGu0u9nlUcqaUZ41W0qK2nGcSzr4D2wV9U9wxp1rnpxn8agXAOHMQ9cy9kbHM7ngY4gFb03TxrO/yfBUifTtXt78jCrjY/jgEFnMn45LuNWUtknuu7NSm7D3QEn3HbatV1Q2jvgIRf1sfODKQaeymxZoMLlTqsq1LF+HvaTqQOzEzUCfni0/eNIA+DfuE3KEtbsegckGmMktTXacnBHPVe687ugkpT+axCkkhBSyRSjWI2xf1KMMVmYiQdWksK9BEFiQoiYLIlvJA3/zeTzCejP0RbB6YPbhZuB+0pR3KcdX0LaJtju0ZgBL8Bd+sbz2QIaU2OfBX3BaQLsgZysQtrk0M8Sh1A0w3DyyYnGnAiZ4gqZ/TvI2A8OGd1YIbF7+F3P+B6dYpYdsJNZgrjO0UdOIhmom0nwL0pnfnzkL1803jAoKhvyAAAAAElFTkSuQmCC" />
  </a>
 </p>
<hr/>

## game engine built on top of  [deno_sdl2](https://github.com/littledivy/deno_sdl2)

### Usage

#### image
```typescript
import { World, Image, Scene } from 'https://deno.land/x/caviar/mod.ts';


class Game extends Scene {
    public test = new Image(this, "assets/caviar.png", 200, 100, 414, 197);
    
    public setup() {
        this.addChild(this.test);
    }
    public draw() {
        
    }
}

const test = new World({
    title: "test",
    width: 800,
    height: 600,
    centered: true,
    fullscreen: false,
    hidden: false,
    resizable: true,
    minimized: false,
    maximized: false,
    flags: null,
}, [Game]);

await test.start();
```
#### pixel texture
```typescript
import { Keys, PICO8, TextureSprite, Scene, World } from 'https://deno.land/x/caviar/mod.ts';
import type { KeyEvent, MouseDownEvent } from 'https://deno.land/x/caviar/mod.ts';

class Game extends Scene {
  public test = new TextureSprite(this, 10, 10, {
    data: [
      "..9..9..",
      "..9999..",
      ".AAAAAA.",
      ".A1F1FA.",
      ".AFFFFA.",
      ".FEEEEAA",
      ".EEEEEEA",
      "..E..E..",
    ],
    pixelWidth: 32,
    pixelHeight: 32,
    palette: PICO8,
  });

  public setup() {
    this.addChild(this.test);
  }
  public draw() {
    
  }
  public keyDown(key: KeyEvent) {
    switch (key.keycode) {
      case Keys.ARROWUP: {
        this.test.setY(this.test.y - 10);
        break;
      }
      case Keys.ARROWDOWN: {
        this.test.setY(this.test.y + 10);
        break;
      }
      case Keys.ARROWLEFT: {
        this.test.setX(this.test.x - 10);
        break;
      }
      case Keys.ARROWRIGHT: {
        this.test.setX(this.test.x + 10);
        break;
      }
    }
  }
}

const test = new World({
  title: "test",
  width: 800,
  height: 600,
  centered: true,
  fullscreen: false,
  hidden: false,
  resizable: true,
  minimized: false,
  maximized: false,
  flags: null,
}, [Game]);

await test.start();

await test.start();
```
### License
MIT
