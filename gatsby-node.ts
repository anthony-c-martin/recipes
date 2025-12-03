import type { GatsbyNode } from "gatsby"
import path from "path"
import { createFilePath } from "gatsby-source-filesystem"

// Define the template for recipe
const recipe = path.resolve(`./src/templates/recipe.tsx`)

const node: GatsbyNode = {
  createPages: async ({ graphql, actions, reporter }) => {
    const { createPage } = actions

    // Get all markdown recipes sorted by date
    const result = await graphql(`
      {
        allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `)

    if (result.errors) {
      reporter.panicOnBuild(
        `There was an error loading your recipes`,
        result.errors,
      )
      return
    }

    const data: any = result.data
    const posts = data.allMarkdownRemark.nodes

    // Create recipe pages
    // But only if there's at least one markdown file found at "content" (defined in gatsby-config.js)
    // `context` is available in the template as a prop and as a variable in GraphQL

    if (posts.length > 0) {
      posts.forEach((post: any, index: any) => {
        const previousPostId = index === 0 ? null : posts[index - 1].id
        const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

        createPage({
          path: post.fields.slug,
          component: recipe,
          context: {
            id: post.id,
            previousPostId,
            nextPostId,
          },
        })
      })
    }
  },
  onCreateNode: ({ node, actions, getNode }) => {
    const { createNodeField } = actions

    if (node.internal.type === `MarkdownRemark`) {
      const value = createFilePath({ node, getNode })

      createNodeField({
        name: `slug`,
        node,
        value,
      })
    }
  },
  createSchemaCustomization: ({ actions }) => {
    const { createTypes } = actions

    // Explicitly define the siteMetadata {} object
    // This way those will always be defined even if removed from gatsby-config.js

    // Also explicitly define the Markdown frontmatter
    // This way the "MarkdownRemark" queries will return `null` even when no
    // recipes are stored inside "content" instead of returning an error
    createTypes(`
  type SiteMetadata {
    siteUrl: String
    social: Social
  }

  type Social {
    twitter: String
  }

  type MarkdownRemark implements Node {
    frontmatter: Frontmatter
    fields: Fields
  }

  type Frontmatter {
    title: String
    description: String
    date: Date @dateformat
    tags: [String]
  }

  type Fields {
    slug: String
  }
`)
    },
}

export const createPages = node.createPages
export const onCreateNode = node.onCreateNode
export const createSchemaCustomization = node.createSchemaCustomization