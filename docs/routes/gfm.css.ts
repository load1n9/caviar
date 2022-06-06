import { gfm, Handlers } from "../server_deps.ts";

const CSS = `${gfm.CSS}
ol.nested {
	counter-reset: item;
}
ol.nested li {
	display: block;
}
ol.nested li:before {
	font-feature-settings: "kern" 1, "tnum" 1;
	-webkit-font-feature-settings: "kern" 1, "tnum" 1;
	-ms-font-feature-settings: "kern" 1, "tnum" 1;
	-moz-font-feature-settings: "kern" 1, "tnum" 1;
	content: counters(item, ".") ". ";
	counter-increment: item;
}
.markdown-body ul {
  list-style: disc;
}
.markdown-body ol {
  list-style: numeric;
}
.toggle:checked + .toggled {
	display: block;
}
canvas {
  position: relative;
  top: 0;
  left: 0;
  width: 50%;
  height: 50%;
}
body {
  background: #080f1f;
}
`;

export const handler: Handlers = {
  GET: () => {
    return new Response(CSS, {
      headers: {
        "content-type": "text/css",
      },
    });
  },
};