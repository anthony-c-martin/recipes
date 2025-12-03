import type { GatsbySSR } from "gatsby"
import * as React from "react"

const ssr: GatsbySSR = {
  onRenderBody: ({ setHtmlAttributes, setPreBodyComponents }) => {
    setHtmlAttributes({ lang: `en` })
    setPreBodyComponents([
      React.createElement('script', {
        key: 'dark-mode-script',
        dangerouslySetInnerHTML: {
          __html: `
void function() {
  function updateTheme() {
    const bsTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", bsTheme);
  }
  
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateTheme)
  window.addEventListener("DOMContentLoaded", updateTheme);
}()
`
        }
      })
    ])
  }
}

export const onRenderBody = ssr.onRenderBody