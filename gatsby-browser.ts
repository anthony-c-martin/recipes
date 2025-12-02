import { getColorMode } from "./src/helpers/colorModes"

import "./src/style.css"
import "bootstrap/dist/css/bootstrap.min.css"

const updateTheme = () =>
  document.documentElement.setAttribute("data-bs-theme", getColorMode())

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", updateTheme)
window.addEventListener("DOMContentLoaded", updateTheme)

export const onServiceWorkerUpdateReady = () => window.location.reload()
