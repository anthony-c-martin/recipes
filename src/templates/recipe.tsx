import * as React from "react"
import { graphql } from "gatsby"

import { Layout } from "../components/layout"
import { Seo } from "../components/seo"

type Props = {
  data: any
}

const RecipeTemplate: React.FC<Props> = ({ data }) => {
  const { markdownRemark: post } = data
  return (
    <Layout>
      <article>
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <footer></footer>
      </article>
    </Layout>
  )
}

export const Head: React.FC<Props> = ({ data }) => {
  const { markdownRemark: post } = data
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default RecipeTemplate

export const pageQuery = graphql`
  query RecipeBySlug($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
