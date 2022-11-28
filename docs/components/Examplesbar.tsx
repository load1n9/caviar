/** @jsx h */

import { apply, h, tw } from "../client_deps.ts";
import {
  CATEGORIES,
  TableOfContentsCategory,
  TableOfContentsCategoryEntry,
} from "../data/examples.ts";

export default function Sidebar(props: { path: string }) {
  return (
    <ol class={tw`list-decimal list-inside font-semibold` + " nested"}>
      {CATEGORIES.map((category) => (
        <SidebarCategory path={props.path} category={category} />
      ))}
    </ol>
  );
}

const link = apply`text(gray-200 hover:gray-100)`;
const linkActive = apply`text(blue-200 hover:blue-100)`;

export function SidebarCategory(props: {
  path: string;
  category: TableOfContentsCategory;
}) {
  const outerItem = tw`my-2 block`;
  const innerList = tw`pl-4 list-decimal` + " nested";

  const { title, href, entries } = props.category;
  const outerLink = tw`${href == props.path ? linkActive : link} font-bold`;

  return (
    <li class={outerItem}>
      <a href={href} class={outerLink}>{title}</a>
      {entries.length > 0 && (
        <ol class={innerList}>
          {entries.map((entry) => (
            <SidebarEntry path={props.path} entry={entry} />
          ))}
        </ol>
      )}
    </li>
  );
}

export function SidebarEntry(props: {
  path: string;
  entry: TableOfContentsCategoryEntry;
}) {
  const innerItem = tw`my-0.5`;

  const { title, href } = props.entry;
  const innerLink = tw`${href == props.path ? linkActive : link} font-normal`;
  return (
    <li class={innerItem}>
      <a href={href} class={innerLink}>{title}</a>
    </li>
  );
}
