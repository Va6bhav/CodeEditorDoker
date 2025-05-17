import { useRef, useState, useEffect } from "react";
import { 
  Box, 
  VStack, 
  useColorMode, 
  IconButton, 
  Tooltip,
  Flex,
  Spacer,
  useToast,
  keyframes,
  Text,
  Badge
} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { FaShare, FaSave, FaPlay, FaRobot, FaMagic, FaStar } from "react-icons/fa";
import { GiSpellBook, GiTeacher } from "react-icons/gi";
import { MdColorLens } from "react-icons/md";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const confetti = keyframes`
  0% { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
`;

const rainbow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("python");
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const outputRef = useRef();
  const [celebrate, setCelebrate] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const runCode = () => {
    if (outputRef.current) {
      outputRef.current.runCode(value);
    }
  };

  const shareCode = () => {
    const code = editorRef.current?.getValue() || '';
    const shareableLink = `${window.location.origin}?code=${encodeURIComponent(code)}&lang=${language}`;
    
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast({
        title: "✨ Link copied! Share with friends!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    });
  };

  const saveCode = () => {
    const code = editorRef.current?.getValue() || '';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-awesome-code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "💾 Code saved successfully!",
      description: "You can find it in your downloads folder",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
  };

  const handleSuccess = () => {
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 3000);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F8' || (e.ctrlKey && e.key === 'Enter')) {
        e.preventDefault();
        runCode();
      }
      else if (e.key === 'F9' || (e.ctrlKey && e.key === 'h')) {
        e.preventDefault();
        shareCode();
      }
      else if (e.key === 'F10' || (e.ctrlKey && e.key === 's')) {
        e.preventDefault();
        saveCode();
      }
      else if (e.key === 'F1') {
        e.preventDefault();
        toggleHint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Box 
      p={4} 
      borderRadius="xl" 
      bgGradient={colorMode === 'light' ? 
        "linear(to-br, blue.50, purple.50)" : 
        "linear(to-br, gray.800, gray.900)"}
      boxShadow="lg"
      position="relative"
      overflow="hidden"
      border="2px solid"
      borderColor={colorMode === 'light' ? "blue.200" : "purple.800"}
    >
      {/* Celebration confetti */}
      {celebrate && (
        <>
          {[...Array(30)].map((_, i) => (
            <Box
              key={i}
              position="absolute"
              top="50%"
              left={`${Math.random() * 100}%`}
              fontSize="xl"
              animation={`${confetti} 1s ease-out forwards`}
              style={{
                animationDelay: `${i * 0.05}s`,
                transformOrigin: 'center',
              }}
            >
              {['🎉', '✨', '🎊', '🌟', '💻', '👏', '🌈', '🚀', '👩‍💻', '👨‍💻'][Math.floor(Math.random() * 10)]}
            </Box>
          ))}
        </>
      )}
      
      <VStack spacing={4} align="stretch">
        <Box>
          <Box 
            bg={colorMode === 'light' ? 'white' : 'gray.700'} 
            borderRadius="lg" 
            p={4}
            boxShadow="md"
            border="2px solid"
            borderColor={colorMode === 'light' ? "blue.100" : "purple.700"}
          >
            <Flex alignItems="center" mb={2}>
              <Box>
                <Text fontSize="xl" fontWeight="bold" color={colorMode === 'light' ? "blue.600" : "purple.300"}>
                  <GiSpellBook style={{ display: 'inline', marginRight: '8px' }} />
                  Kids Code Editor
                </Text>
              </Box>
              <Spacer />
              <Flex gap={2}>
                <Tooltip label="Run Code (F8 or Ctrl+Enter)" hasArrow>
                  <IconButton
                    aria-label="Run code"
                    icon={<FaPlay />}
                    onClick={runCode}
                    colorScheme="green"
                    size="sm"
                    animation={outputRef.current?.isRunning ? `${pulse} 1s infinite` : 'none'}
                  />
                </Tooltip>
                <Tooltip label="Share Code (F9 or Ctrl+H)" hasArrow>
                  <IconButton
                    aria-label="Share code"
                    icon={<FaShare />}
                    onClick={shareCode}
                    colorScheme="blue"
                    size="sm"
                  />
                </Tooltip>
                <Tooltip label="Save Code (F10 or Ctrl+S)" hasArrow>
                  <IconButton
                    aria-label="Save code"
                    icon={<FaSave />}
                    onClick={saveCode}
                    colorScheme="purple"
                    size="sm"
                  />
                </Tooltip>
                <Tooltip label="Show Hint (F1)" hasArrow>
                  <IconButton
                    aria-label="Show hint"
                    icon={<GiTeacher />}
                    onClick={toggleHint}
                    colorScheme="yellow"
                    size="sm"
                  />
                </Tooltip>
                <Tooltip label="Toggle Theme" hasArrow>
                  <IconButton
                    aria-label="Toggle color mode"
                    icon={<MdColorLens />}
                    onClick={toggleColorMode}
                    colorScheme="pink"
                    size="sm"
                  />
                </Tooltip>
              </Flex>
            </Flex>

            {showHint && (
              <Box 
                mb={4} 
                p={3} 
                bg={colorMode === 'light' ? "yellow.50" : "yellow.900"} 
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="yellow.400"
              >
                <Flex alignItems="center">
                  <FaRobot style={{ marginRight: '8px', color: '#ECC94B' }} />
                  <Text fontSize="sm">
                    <strong>Hint:</strong> Try changing the name inside the quotes to your name and click Run!
                  </Text>
                </Flex>
              </Box>
            )}

            <Box mb={4}>
              <LanguageSelector 
                language={language} 
                onSelect={onSelect} 
              />
            </Box>

            <Box
              mt={2}
              border="2px solid"
              borderColor={colorMode === 'light' ? "blue.100" : "purple.600"}
              borderRadius="md"
              overflow="hidden"
              boxShadow="inner"
            >
              <Editor
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: 'on',
                  glyphMargin: true,
                  folding: true,
                  renderLineHighlight: 'all',
                  cursorBlinking: 'smooth',
                }}
                height="60vh"
                theme={colorMode === 'light' ? "light" : "vs-dark"}
                language={language}
                defaultValue={CODE_SNIPPETS[language]}
                onMount={onMount}
                value={value}
                onChange={(value) => setValue(value)}
              />
            </Box>
          </Box>
        </Box>
        
        <Output 
          ref={outputRef}
          editorRef={editorRef} 
          language={language}
          code={value}
          onSuccess={handleSuccess}
        />

        <Box textAlign="center" mt={2}>
          <Text fontSize="sm" color={colorMode === 'light' ? "gray.600" : "gray.400"}>
            Created by Vaibhav Raturi
            Made for young coders | Press F1 for help
           
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default CodeEditor;