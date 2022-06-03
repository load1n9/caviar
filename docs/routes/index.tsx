/** @jsx h */

import { h, tw } from "../client_deps.ts";
import Header from "../components/Header.tsx";
import Nav from "../components/Nav.tsx";

export default function Home() {
  return (
    <div>
      <div class={tw`flex items-center justify-center pt-10`}>
      <img class={tw`h-12 mx-4 text(4xl gray-900 center)`} src="/caviar.svg" />
      </div>
      <Header />
      <Nav/>
    </div>
  );
}
