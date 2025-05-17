import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light", // Changed to light as default for kids
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'blue.50',
        fontFamily: "'Comic Neue', cursive, sans-serif",
      },
      "h1, h2, h3": {
        fontFamily: "'Fredoka One', cursive",
      },
      button: {
        transition: "all 0.2s ease-in-out",
      }
    }),
  },
  colors: {
    brand: {
      50: "#e0f7ff",
      100: "#b8e9ff",
      200: "#8adaff",
      300: "#5ccbff",
      400: "#33bdff",
      500: "#1aa4e6",
      600: "#0080b4",
      700: "#005c82",
      800: "#003851",
      900: "#001521",
    }
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "md",
      },
      sizes: {
        xl: {
          h: "56px",
          fontSize: "lg",
          px: "32px",
        },
      },
      variants: {
        "with-shadow": {
          bg: "red.400",
          boxShadow: "0 0 2px 2px #efdfde",
        },
      },
    },
  },
});

export default theme;