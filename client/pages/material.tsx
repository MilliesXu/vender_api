import { AppShell,  useMantineTheme } from "@mantine/core";
import { NextPage } from "next";
import { useState } from "react";
import FooterComponent from "../components/Footer";
import HeaderComponent from "../components/Header";
import MaterialPageComponent from "../components/MaterialPage/MaterialPageComponent";
import NavbarComponent from "../components/Navbar";

const Material: NextPage = () => {
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
        <MaterialPageComponent />
    </AppShell>
  )
}

export default Material
