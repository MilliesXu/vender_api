import { AppShell, useMantineTheme, Container} from '@mantine/core'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import FooterComponent from '../components/Footer'
import HeaderComponent from '../components/Header'
import NavbarComponent from '../components/Navbar'

const Home: NextPage = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
    navbarOffsetBreakpoint={9999}
    navbar={
      <NavbarComponent opened={opened} />
    }
    footer={
      <FooterComponent />
    }
    header={
      <HeaderComponent
      opened={opened}
      setOpened={setOpened}
      theme={theme} />
    }
    >
      <Container>
        This is main app
      </Container>
    </AppShell>
  )
}

// Home.getLayout = (page: React.ReactElement) => {
//   return (
//     <HomePageLayout>{page}</HomePageLayout>
//   )
// }

export default Home
