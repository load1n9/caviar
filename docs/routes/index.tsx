/** @jsx h */

import { h, tw, Head } from "../client_deps.ts";
import Header from "../components/Header.tsx";
import Nav from "../components/Nav.tsx";

export default function Home() {
  return (
    <div>
    <Head>
        <title>Caviar | Blazing fast, modern, Game Engine powered by WebGPU for Deno and the browser</title>
        <meta
          name="description"
          content="⚡ Blazing fast, modern, Game Engine powered by WebGPU for Deno and the browser"
        />
        <link rel="stylesheet" href="/gfm.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.2/font/bootstrap-icons.css"/>
      </Head>
    <div class={tw`bg-gray-900`}>
      <div class={tw`flex items-center justify-center pt-10`}>
      <img class={tw`h-12 mx-4 text(4xl gray-900 center)`} src="/caviar.svg" />
      </div>
      <Header />
      <Nav/>
    </div>
    </div>
  );
}
