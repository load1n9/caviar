import RAW_TOC from "../examples/toc.json" assert { type: "json" };

type RawTableOfContents = Record<string, RawTableOfContentsEntry>;

interface RawTableOfContentsEntry {
  title: string;
}

interface RawTableOfContentsPage {
  title: string;
}

export interface TableOfContentsEntry {
  slug: string;
  title: string;
  category?: string;
  href: string;
  file: string;
}

export interface TableOfContentsCategory {
  title: string;
  href: string;
  entries: TableOfContentsCategoryEntry[];
}

export interface TableOfContentsCategoryEntry {
  title: string;
  href: string;
}

export const TABLE_OF_CONTENTS: Record<string, TableOfContentsEntry> = {};
export const CATEGORIES: TableOfContentsCategory[] = [];

for (const parent in (RAW_TOC as unknown as RawTableOfContents)) {
  const rawEntry = (RAW_TOC as unknown as RawTableOfContents)[parent];
  const href = `/examples/${parent}`;
  const file = `examples/${parent}/main.js`;
  const entry = {
    slug: parent,
    title: rawEntry.title,
    href,
    file,
  };
  TABLE_OF_CONTENTS[parent] = entry;
  const category: TableOfContentsCategory = {
    title: rawEntry.title,
    href,
    entries: [],
  };
  CATEGORIES.push(category);
}

export const SLUGS = Object.keys(TABLE_OF_CONTENTS);
