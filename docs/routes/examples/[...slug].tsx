/** @jsx h */
/** @jsxFrag Fragment */

import { apply, Fragment, h, Head, PageProps, tw } from "../../client_deps.ts";
import { gfm, Handlers } from "../../server_deps.ts";
import Sidebar from "../../components/Examplesbar.tsx";

import {
  SLUGS,
  TABLE_OF_CONTENTS,
  TableOfContentsEntry,
} from "../../data/examples.ts";


export default function DocsPage(props: PageProps) {
  return (
    <>
      <Head>
        <title>Caviar Examples</title>
        <link rel="stylesheet" href="/gfm.css" />
      </Head>
      <Header />
      <Main path={props.url.pathname} />
    </>
  );
}

function Header() {
  const header = tw`mx-auto max-w-screen-lg flex gap-3 justify-between`;
  const sidebarButton = tw
    `px-4 py-4 md:hidden border(l-2 gray-100) flex items-center hover:bg-gray-50`;
  return (
    <header class={header}>
      <div class={tw`p-4`}>
        <Title />
      </div>
      <label for="docs_sidebar" class={sidebarButton}>
        <svg
          class={tw`h-6 w-6`}
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7"
          >
          </path>
        </svg>
      </label>
    </header>
  );
}

function Title() {
  return (
    <>
      <p class={tw`flex items-center`}>
        <a href="/">
          <img class={tw`h-10 mx-4`} src="/caviar.svg" />
        </a>
      </p>
    </>
  );
}

function Main(props: { path: string; }) {
  const main = tw`mx-auto max-w-screen-lg px-4 flex gap-6`;
  return (
    <>
      <MobileSidebar path={props.path} />
      <div class={main}>
        <DesktopSidebar path={props.path} />
        <script type="module" src={`https://deno.land/x/caviar/examples/web/${props.path.replace("/examples/","")}/main.js`}></script>
      </div>
    </>
  );
}

function MobileSidebar(props: { path: string }) {
  const container = tw`fixed inset-0 flex z-40 hidden` + " toggled";
  const backdrop = tw`absolute inset-0 bg-gray-600 opacity-75`;
  const sidebar = tw`relative flex-1 flex flex-col w-[16rem] h-full bg-white border(r-2 gray-100)`;
  const heading = tw`p-4 border(b-2 gray-100)`;
  const items = tw`pt-2 pb-16 px-4 overflow-x-auto`;
  return (
    <>
      <input
        type="checkbox"
        class={tw`hidden` + " toggle"}
        id="docs_sidebar"
        autocomplete="off"
      >
      </input>
      <div class={container}>
        <label class={backdrop} for="docs_sidebar" />
        <div class={sidebar}>
          <div class={heading}>
            <Title />
          </div>
          <nav class={items}>
          </nav>
        </div>
      </div>
    </>
  );
}

function DesktopSidebar(props: { path: string }) {
  return (
    <nav
      class={tw
        `w-[16rem] flex-shrink-0 hidden md:block py-8 pr-4 border(r-2 gray-100)`}
    >
        <Sidebar path={props.path} />
    </nav>
  );
}


const button = apply`p-2 bg-gray-100 w-full border(1 gray-200) grid`;

function ForwardBackButtons(props: { slug: string }) {
  const currentIndex = SLUGS.findIndex((slug) => slug === props.slug);
  const previousSlug = SLUGS[currentIndex - 1];
  const nextSlug = SLUGS[currentIndex + 1];
  const previous = TABLE_OF_CONTENTS[previousSlug];
  const next = TABLE_OF_CONTENTS[nextSlug];

  const upper = tw`text(sm gray-600)`;
  const category = tw`font-normal`;
  const lower = tw`text-gray-900 font-medium`;

  return (
    <div class={tw`mt-8 flex flex(col md:row) gap-4`}>
      {previous && (
        <a href={previous.href} class={tw`${button} text-left`}>
          <span class={upper}>{"<-"} Previous</span>
          <span class={lower}>
            <span class={category}>
              {previous.category
                ? `${TABLE_OF_CONTENTS[previous.category].title}: `
                : ""}
            </span>
            {previous.title}
          </span>
        </a>
      )}
      {next && (
        <a href={next.href} class={tw`${button} text-right`}>
          <span class={upper}>Next {"->"}</span>
          <span class={lower}>
            <span class={category}>
              {next.category
                ? `${TABLE_OF_CONTENTS[next.category].title}: `
                : ""}
            </span>
            {next.title}
          </span>
        </a>
      )}
    </div>
  );
}
