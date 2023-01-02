import React from "react";
import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import Router from "./router/Router";
import theme from "./constants/theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router />
    </ChakraProvider>
  );
}

export default App;
