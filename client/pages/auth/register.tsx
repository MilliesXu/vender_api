import { useMantineTheme, AppShell } from "@mantine/core";
import { NextPage } from "next"
import { useState } from "react";
import FooterComponent from "../../components/Footer";
import HeaderComponent from "../../components/Header";
import NavbarComponent from "../../components/Navbar";
import RegisterPageComponent from "../../components/RegisterPage/RegisterPageComponent";

const Register: NextPage = () => {
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
        <RegisterPageComponent/>
    </AppShell>  
  )
}

export default Register