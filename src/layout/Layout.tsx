import React from "react";
import { Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <Container maxW="auto">
      <Outlet />
    </Container>
  );
}

export default Layout;
