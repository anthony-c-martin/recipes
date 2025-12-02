import * as React from "react"
import { graphql } from "gatsby"

import { Layout } from "../components/layout"
import { Seo } from "../components/seo"

type Props = {
  data: any
  location: Location
}

const NotFoundPage: React.FC<Props> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  )
}

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
