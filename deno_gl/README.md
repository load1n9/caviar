# deno_gl

WebGL API implementation for Deno, built on GLFW using FFI.

Currently does not support macOS because of the lack of native
OpenGL ES support. Feel free to contribute the support if you
can. Using something like [angle](https://github.com/google/angle)
is preferred.

## TODO

There are couple of bugs to fix yet. Most of them are unknown, which simply
cause libraries like Tensorflow.js WebGL backend to return values zeroed out.

## Usage

1. Make `dist` directory if it doesn't exist.
2. Download GLFW from [its website](https://www.glfw.org/) and place
   `[lib]glfw3.[so|dll|dylib]` in `dist`.

## License

Apache-2.0. Check [LICENSE](LICENSE) for more info.

Copyright 2022 © DjDeveloperr
