import * as React from "react"
import { Badge, Card, Container, Form } from "react-bootstrap"
import { Link, graphql } from "gatsby"

import { Layout } from "../components/layout"
import { Seo } from "../components/seo"

type Props = {
  data: any
  location: Location
}

const BlogIndex: React.FC<Props> = ({ data, location }) => {
  const posts = data.allMarkdownRemark.nodes
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredPosts = posts.filter((post: any) => {
    const title = post.frontmatter.title || post.fields.slug
    const description = post.frontmatter.description || ""
    const tags: string[] = post.frontmatter.tags || []

    const searchLower = searchTerm.toLowerCase()
    return (
      title.toLowerCase().includes(searchLower) ||
      description.toLowerCase().includes(searchLower) ||
      tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  })

  return (
    <Layout>
      <Container>
        <Form.Control
          type="text"
          placeholder="Search recipes by title, description, or tag..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="d-flex flex-wrap gap-3">
          {filteredPosts.map((post: any) => {
            const title = post.frontmatter.title || post.fields.slug
            const description = post.frontmatter.description
            const tags: string[] = post.frontmatter.tags || []

            return (
              <Card
                key={post.fields.slug}
                as={Link}
                to={post.fields.slug}
                className="recipe-card"
              >
                <Card.Body>
                  <Card.Title>{title}</Card.Title>
                  <Card.Text>{description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  {tags.map((tag, index) => (
                    <Badge
                      style={{ marginRight: "0.25rem" }}
                      key={index}
                      bg="primary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </Card.Footer>
              </Card>
            )
          })}
        </div>
      </Container>
    </Layout>
  )
}

export default BlogIndex

export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { title: ASC } }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
  }
`
