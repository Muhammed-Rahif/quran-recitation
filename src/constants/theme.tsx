import {
  extendTheme,
  type ThemeConfig,
  theme as baseTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme(
  {
    config,
  },
  withDefaultColorScheme({ colorScheme: "red" })
);
export default theme;
