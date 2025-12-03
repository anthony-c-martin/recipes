import type { GatsbyBrowser } from "gatsby"

import "./src/style.css"
import "bootstrap/dist/css/bootstrap.min.css"

const browser: GatsbyBrowser = {
  onServiceWorkerUpdateReady: () => window.location.reload(),
}

export const onServiceWorkerUpdateReady = browser.onServiceWorkerUpdateReady