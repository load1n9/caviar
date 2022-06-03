/** @jsx h */
import { h, PageProps } from "$fresh/runtime.ts";

export default function Greet(props: PageProps) {
  return <div>Hello {props.params.name}</div>;
}
