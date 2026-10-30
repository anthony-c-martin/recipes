import * as React from "react"
import { Link, graphql } from "gatsby"

import { Layout } from "../components/layout"
import { Seo } from "../components/seo"

type Recipe = {
  fields: { slug: string }
  frontmatter: {
    title: string | null
    tags: string[] | null
  }
}

type Props = {
  data: { allMarkdownRemark: { nodes: Recipe[] } }
}

const BlogIndex: React.FC<Props> = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedTag, setSelectedTag] = React.useState("")
  const tags = Array.from(new Set(posts.flatMap(post => post.frontmatter.tags || [])))
    .sort((first, second) => first.localeCompare(second))
  const search = searchTerm.trim().toLowerCase()
  const filteredPosts = posts.filter(post => {
    const title = post.frontmatter.title || post.fields.slug
    const recipeTags = post.frontmatter.tags || []
    return (!selectedTag || recipeTags.includes(selectedTag)) &&
      [title, ...recipeTags].some(value => value.toLowerCase().includes(search))
  })
  const hasFilters = Boolean(searchTerm || selectedTag)

  return (
    <Layout>
      <section aria-label="Recipe collection">
        <div className="grid gap-4 border-y border-line py-6 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-5">
          <div>
            <label htmlFor="recipe-search" className="mb-2 block text-xs font-semibold text-muted">Find a recipe</label>
            <input id="recipe-search" type="search" placeholder="Search recipes..."
              value={searchTerm} onChange={event => setSearchTerm(event.target.value)}
              className="h-12 w-full rounded-md border border-line bg-surface px-4 text-base placeholder:text-muted focus:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent" />
          </div>
          <div>
            <label htmlFor="recipe-tag" className="mb-2 block text-xs font-semibold text-muted">Category</label>
            <select id="recipe-tag" value={selectedTag} onChange={event => setSelectedTag(event.target.value)}
              className="h-12 w-full rounded-md border border-line bg-surface px-3 text-base focus:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent">
              <option value="">All recipes</option>
              {tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
          </div>
        </div>
        <div className="flex min-h-18 items-center justify-between gap-4 text-xs text-muted">
          <p role="status" aria-live="polite" aria-atomic="true">
            {hasFilters ? `${filteredPosts.length} ${filteredPosts.length === 1 ? "recipe" : "recipes"} found` : "All recipes"}
          </p>
          {hasFilters && <button type="button" className="cursor-pointer py-3 text-accent underline underline-offset-4 hover:text-accent-hover"
            onClick={() => { setSearchTerm(""); setSelectedTag("") }}>Clear filters</button>}
        </div>
        <ul className="grid gap-x-12 sm:grid-cols-2">
          {filteredPosts.map(post => (
            <li key={post.fields.slug} className="min-w-0 border-t border-line">
              <Link to={post.fields.slug} className="group block h-full py-6 pr-2 wrap-anywhere no-underline">
                <h2 className="font-display text-2xl leading-snug group-hover:text-accent">{post.frontmatter.title || post.fields.slug}</h2>
                {Boolean(post.frontmatter.tags?.length) && <p className="mt-2 text-xs text-muted">{post.frontmatter.tags?.join(" / ")}</p>}
              </Link>
            </li>
          ))}
        </ul>
        {filteredPosts.length === 0 && <div className="py-16 text-center">
          <h2 className="font-display text-2xl">No recipes found</h2>
          <p className="mt-3 text-sm text-muted">No matches for the current search and category.</p>
        </div>}
      </section>
    </Layout>
  )
}

export default BlogIndex

export const Head = () => <Seo title="Recipe book" />

export const pageQuery = graphql`
  {
    allMarkdownRemark(sort: { frontmatter: { title: ASC } }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          tags
        }
      }
    }
  }
`
