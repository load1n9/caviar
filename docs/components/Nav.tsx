/** @jsx h */

import { h, tw } from "../client_deps.ts";

export default function NavigationBar(props: { active: string }) {
  const items = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Docs",
      href: "/docs",
    },
    {
      name: "Examples",
      href: "/examples",
    },
    // {
    //   name: "Playground",
    //   href: "/playground",
    // },
  ];

  return (
    <nav class={tw`bg(gray-700) py-2`}>
      <ul class={tw`flex justify-center gap-8 mx-4`}>
        {items.map((item) => (
          <li>
            <a
              href={item.href}
              class={tw`text-gray-200 hover:underline ${
                props.active == item.href ? "font-bold" : ""
              }`}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
