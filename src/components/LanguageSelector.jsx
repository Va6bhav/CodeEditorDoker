import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useTheme,
  Badge,
  Flex,
  Icon
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../constants";
import { FaChevronDown, FaCode } from "react-icons/fa";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const ACTIVE_COLOR = colorMode === 'light' ? "blue.500" : "blue.300";
  const HOVER_BG = colorMode === 'light' ? "blue.50" : "gray.700";

  return (
    <Box>
      <Menu isLazy>
        <MenuButton 
          as={Button}
          colorScheme="blue"
          variant="outline"
          borderColor={colorMode === 'light' ? "blue.200" : "blue.600"}
          _hover={{
            bg: HOVER_BG,
            borderColor: colorMode === 'light' ? "blue.300" : "blue.500",
          }}
          _active={{
            bg: HOVER_BG,
            borderColor: ACTIVE_COLOR,
          }}
          px={4}
          py={2}
          textAlign="left"
          fontWeight="semibold"
          leftIcon={<FaCode />}
          rightIcon={<FaChevronDown />}
        >
          <Flex align="center">
            <Text>{language}</Text>
            <Badge 
              ml={2} 
              colorScheme="blue" 
              variant="subtle"
              fontSize="0.7em"
            >
              {LANGUAGE_VERSIONS[language]}
            </Badge>
          </Flex>
        </MenuButton>
        <MenuList 
          bg={colorMode === 'light' ? "white" : "gray.800"}
          borderColor={colorMode === 'light' ? "blue.100" : "gray.700"}
          boxShadow="lg"
          py={1}
          minW="200px"
        >
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              color={lang === language ? ACTIVE_COLOR : (colorMode === 'light' ? "gray.800" : "gray.200")}
              bg={lang === language ? (colorMode === 'light' ? "blue.50" : "gray.700") : "transparent"}
              _hover={{
                color: ACTIVE_COLOR,
                bg: HOVER_BG,
              }}
              _focus={{
                bg: HOVER_BG,
              }}
              onClick={() => onSelect(lang)}
              px={4}
              py={2}
            >
              <Flex align="center" justify="space-between" width="100%">
                <Text fontWeight={lang === language ? "semibold" : "normal"}>
                  {lang}
                </Text>
                <Badge 
                  colorScheme="blue" 
                  variant="subtle"
                  fontSize="0.7em"
                >
                  {version}
                </Badge>
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;