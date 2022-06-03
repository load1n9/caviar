/** @jsx h */
import { h, IS_BROWSER, useState } from "https://raw.githubusercontent.com/lucacasonato/fresh/main/runtime.ts";
// import Sidebar from "../components/SideBar.tsx";


export default function Counter(props: { name: string }) {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  );
}
