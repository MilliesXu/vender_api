import { Header, Grid, MediaQuery, Burger, MantineTheme, Center, Text, Anchor, Group } from "@mantine/core"
import Link from "next/link"
import { Dispatch, SetStateAction } from "react"
import { useMe } from "../context/me"

const HeaderComponent = ({opened, setOpened, theme}: {opened: boolean, setOpened: Dispatch<SetStateAction<boolean>>, theme: MantineTheme}) => {
  const {user, refetch} = useMe()
  
  return (
    <Header height={70} p="md">
      <Grid>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Grid.Col span={4}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </Grid.Col>
        </MediaQuery>
        <Grid.Col span={4}>
          <Center>
            <Text>Vender</Text>
          </Center>
        </Grid.Col>
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Grid.Col span={3} offset={5}>
            { user ? (
            <Group>
              <Link href="/product" passHref>
                <Anchor>Products</Anchor>
              </Link>
              <Link href="/material" passHref>
                <Anchor>Materials</Anchor>
              </Link>
              <Link href="" passHref>
                <Anchor>Logout</Anchor>
              </Link>
            </Group>) : (
            <Group>
              <Link href="/auth/login" passHref>
                <Anchor>Login</Anchor>
              </Link>
              <Link href="/auth/register" passHref>
                <Anchor>Register</Anchor>
              </Link>
            </Group>)}
          </Grid.Col>
        </MediaQuery>
      </Grid>
    </Header>
  )
}

export default HeaderComponent
