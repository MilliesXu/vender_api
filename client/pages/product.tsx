import { AppShell, useMantineTheme } from "@mantine/core";
import { NextPage } from "next";
import { useState } from "react";
import FooterComponent from "../components/Footer";
import HeaderComponent from "../components/Header";
import NavbarComponent from "../components/Navbar";
import ProductPageComponent from "../components/ProductPage/ProductPagesComponent";

const Product: NextPage = () => {
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
      <ProductPageComponent />
    </AppShell>
  )
}

export default Product
