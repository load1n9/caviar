import { watch } from "https://deno.land/x/drollup@2.58.0+0.20.0/mod.ts";
import { options } from "./rollup.config.ts";
import {
  bold,
  cyan,
  dim,
  red,
} from "https://deno.land/std@0.110.0/fmt/colors.ts";
import ms from "https://cdn.esm.sh/v43/ms@2.1.3/deno/ms.js";

const watcher = await watch(options);

watcher.on("event", (event) => {
  if (event.code === "ERROR") {
    console.error(bold(red(event.code)));
  } else {
    let info = bold(cyan(event.code));

    if ("duration" in event && event.duration) {
      info += `: ${bold(dim(`completed in ${ms(event.duration)}`))}`;
    }

    console.info(info);
  }

  if (event.code === "BUNDLE_END") {
    event.result.close();
  }
});
