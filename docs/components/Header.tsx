/** @jsx h */
/** @jsxFrag Fragment */

import { h, tw } from "../client_deps.ts";

export default function Header() {
  const container =
    tw`w-full h-64 flex justify-center items-center flex-col  bg-gray-900`;
  const title = tw`max-w-screen-sm mt-4 font-bold text(4xl gray-100 center)`;
  const subtitle = tw`max-w-screen-sm mt-4 text(xl gray-200 center)`;
  const icon = tw`bi bi-github`;
  return (
    <section class={container}>
      <p class={title}>
        Caviar{" "}
        <a
          class={icon}
          href="https://github.com/load1n9/caviar"
          style="font-size: 1.5rem;"
        >
        </a>
      </p>
      <p class={subtitle}>
        ⚡ Blazing fast, modern, Game Engine powered by WebGPU for Deno and the
        browser
      </p>
    </section>
  );
}
