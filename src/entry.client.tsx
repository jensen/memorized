import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";

import { inspect } from "@xstate/inspect";

if (process.env.NODE_ENV === "development") {
  inspect({
    iframe: false,
  });
}

hydrate(<RemixBrowser />, document);
