import { Link } from "gatsby"
import * as React from "react"
import { Container, Navbar } from "react-bootstrap"

type Props = {
  children: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Container fluid>
      <header>
        <Navbar>
          <Navbar.Brand as={Link} to="/">Ant's Recipes</Navbar.Brand>
        </Navbar>
      </header>
      <main>
        <Container>
          {children}
        </Container>
      </main>
      <footer></footer>
    </Container>
  )
}