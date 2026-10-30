import { Link } from "gatsby"
import * as React from "react"

type Props = {
  children: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-10">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:inline-block focus:py-3">Skip to content</a>
      <header className="flex min-h-24 items-center justify-between gap-4 border-b border-line">
        <Link className="font-display text-2xl font-bold no-underline" to="/">
          Ant's Recipes<span className="text-accent">.</span>
        </Link>
      </header>
      <main id="main-content">{children}</main>
    </div>
  )
}
