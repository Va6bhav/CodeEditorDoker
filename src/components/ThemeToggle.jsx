// ThemeToggle.jsx
import { useColorMode, Switch, Flex, Box } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex alignItems="center" mr={4}>
      <SunIcon boxSize={4} mr={1} color="yellow.500" />
      <Switch
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
        colorScheme="blue"
        size="md"
      />
      <MoonIcon boxSize={4} ml={1} color="blue.300" />
    </Flex>
  );
};

export default ThemeToggle;