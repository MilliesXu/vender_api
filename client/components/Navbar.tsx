import { MediaQuery, Navbar, Anchor } from "@mantine/core"
import Link from "next/link"

const NavbarComponent = ({opened}: {opened: boolean}) => {
  return (
    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
      <Navbar p="md" hidden={!opened} width={{ sm: 200 }}>
        <Link href="/product" passHref>
          <Anchor>Products</Anchor>
        </Link>
        <Link href="/material" passHref>
          <Anchor>Materials</Anchor>
        </Link>
        <Link href="/auth/login" passHref>
          <Anchor>Login</Anchor>
        </Link>
        <Link href="/auth/register" passHref>
          <Anchor>Register</Anchor>
        </Link>
        <Link href="" passHref>
          <Anchor>Logout</Anchor>
        </Link>
      </Navbar>
    </MediaQuery>
  )
}

export default NavbarComponent
