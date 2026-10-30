import type { GatsbyBrowser } from "gatsby"

import "./src/style.css"

const browser: GatsbyBrowser = {
  onServiceWorkerUpdateReady: () => window.location.reload(),
}

export const onServiceWorkerUpdateReady = browser.onServiceWorkerUpdateReady