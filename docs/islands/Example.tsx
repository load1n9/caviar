/** @jsx h */
import { h, IS_BROWSER, useState } from "https://raw.githubusercontent.com/lucacasonato/fresh/main/runtime.ts";
import Header from "../components/Header.tsx";


export default function Example(props: { name: string }) {
  return (
    <div>
      <h1><Header /></h1>
    </div>
  );
}
