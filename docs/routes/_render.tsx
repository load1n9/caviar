import { setup } from "../client_deps.ts";
import { gfm, RenderContext, RenderFn, virtualSheet } from "../server_deps.ts";
import * as config from "../tw_config.ts";

const sheet = virtualSheet();
sheet.reset();
setup({
  sheet,
  ...config,
});

export function render(ctx: RenderContext, render: RenderFn) {
  const snapshot = ctx.state.get("twindSnapshot") as unknown[] | null;
  sheet.reset(snapshot || undefined);
  render();
  ctx.styles.splice(0, ctx.styles.length, ...sheet.target);
  const newSnapshot = sheet.reset();
  ctx.state.set("twindSnapshot", newSnapshot);
}
