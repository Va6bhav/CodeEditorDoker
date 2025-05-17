// Output.jsx
import { forwardRef, useState, useImperativeHandle, useEffect, useCallback } from "react";
import {
  Box, Button, Text, useToast, useColorMode,
  Flex, Code, Spacer, Badge, Input,
  Stack, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure, keyframes, Progress, Tooltip,
  HStack, VStack, Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon,
  Kbd, Alert, AlertIcon, CloseButton
} from "@chakra-ui/react";
import { FaPlay, FaRedo, FaFire, FaTrophy, FaMedal, FaLightbulb, FaChevronRight } from "react-icons/fa";
import { executeCode } from "../api";

// Lesson data
const lessons = {
  beginner: [
    {
      id: 1,
      title: "Your First Program",
      steps: [
        {
          instruction: "Type: <Kbd>print('Hello')</Kbd>",
          expectedOutput: "Hello",
          hint: "Just type exactly what you see above!",
          codeSuggestion: "print('Hello')"
        },
       
        {
          instruction: "Print two messages on separate lines",
          expectedOutput: "First line\nSecond line",
          hint: "Use two print statements one after another",
          codeSuggestion: "print('First line')\nprint('Second line')"
        }
      ],
      completed: false
    },
    {
      id: 2,
      title: "Variables",
      steps: [
        {
          instruction: "Create a variable: <Kbd>name = 'Alice'</Kbd>",
          expectedOutput: "", // No output expected
          hint: "Variables store information for later use",
          codeSuggestion: "name = 'Alice'"
        },
        {
          instruction: "Print your variable",
          expectedOutput: "Alice",
          hint: "Use print() with your variable name inside",
          codeSuggestion: "print(name)"
        }
      ],
      completed: false
    }
  ],
  intermediate: [
    {
      id: 3,
      title: "Conditionals",
      steps: [
        {
          instruction: "Create an if statement checking if age > 18",
          expectedOutput: "Adult",
          hint: "Remember to set age variable first",
          codeSuggestion: "age = 20\nif age > 18:\n    print('Adult')"
        }
      ],
      completed: false
    }
  ]
};

const Output = forwardRef(({ editorRef, language, code, onSuccess }, ref) => {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [output, setOutput] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  
  // Lesson state
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showLessonPanel, setShowLessonPanel] = useState(true);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      toast({
        title: "No code to execute",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      setOutput([]);
      setExecutionTime(null);

      const { run: result } = await executeCode(language, sourceCode);

      if (result.stderr) {
        throw new Error(result.stderr);
      }

      const outputLines = result.output.split("\n").filter(line => line.trim());
      setOutput(outputLines);
      setExecutionTime(((performance.now() - performance.now()) / 1000).toFixed(2) + "s");

      // Check lesson completion
      checkLessonCompletion(outputLines.join("\n"));

      if (outputLines.length > 0 && !result.stderr) {
        onSuccess();
        showFunMessage(outputLines);
      }
    } catch (error) {
      handleExecutionError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkLessonCompletion = (output) => {
    const lesson = lessons[currentLevel][currentLesson];
    const step = lesson.steps[currentStep];
    
    if (step.expectedOutput && output.includes(step.expectedOutput)) {
      // Move to next step
      if (currentStep < lesson.steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setShowHint(false);
        toast({
          title: "Step completed!",
          description: "Great job! Moving to next step.",
          status: "success",
          duration: 2000,
        });
      } else {
        // Lesson completed
        const updatedLessons = { ...lessons };
        updatedLessons[currentLevel][currentLesson].completed = true;
        setCompletedLessons([...completedLessons, lesson.id]);
        
        toast({
          title: "Lesson completed! 🎉",
          description: `You finished "${lesson.title}"`,
          status: "success",
          duration: 3000,
        });
        
        // Move to next lesson
        if (currentLesson < lessons[currentLevel].length - 1) {
          setCurrentLesson(currentLesson + 1);
          setCurrentStep(0);
        } else if (currentLevel === 'beginner') {
          // Move to intermediate level
          setCurrentLevel('intermediate');
          setCurrentLesson(0);
          setCurrentStep(0);
        }
      }
      
      // Update progress
      updateLessonProgress();
    }
  };

  const updateLessonProgress = () => {
    const lesson = lessons[currentLevel][currentLesson];
    const progress = ((currentStep + 1) / lesson.steps.length) * 100;
    setLessonProgress(progress);
  };

  const applyCodeSuggestion = () => {
    const suggestion = lessons[currentLevel][currentLesson].steps[currentStep].codeSuggestion;
    editorRef.current.setValue(suggestion);
  };

  const showFunMessage = (outputLines) => {
    const messages = [
      "Great job! Your code works perfectly! 🎉",
      "Success! You're a coding wizard! 🧙‍♂️",
      "Awesome! Your code is running smoothly! 🚀",
    ];
    
    toast({
      title: messages[Math.floor(Math.random() * messages.length)],
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleExecutionError = (error) => {
    setIsError(true);
    setOutput([error.message]);
    
    toast({
      title: "Something went wrong",
      description: "Check the error message below",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  useImperativeHandle(ref, () => ({
    runCode,
    currentLesson: lessons[currentLevel][currentLesson],
    currentStep: currentStep
  }));

  return (
    <Box bg={colorMode === 'light' ? 'white' : 'gray.700'} borderRadius="lg" p={4} boxShadow="md">
      {/* Lesson Panel */}
      {showLessonPanel && (
        <Box mb={4} p={4} bg={colorMode === 'light' ? 'blue.50' : 'blue.900'} borderRadius="md">
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="bold" fontSize="lg">
              {lessons[currentLevel][currentLesson].title}
            </Text>
            <CloseButton size="sm" onClick={() => setShowLessonPanel(false)} />
          </Flex>
          
          <Progress value={lessonProgress} size="xs" colorScheme="green" mb={3} />
          
          <Box 
            dangerouslySetInnerHTML={{ 
              __html: lessons[currentLevel][currentLesson].steps[currentStep].instruction 
            }} 
            mb={3}
          />
          
          <Flex justify="space-between">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </Button>
            
            <Button 
              size="sm" 
              colorScheme="blue" 
              onClick={applyCodeSuggestion}
              rightIcon={<FaChevronRight size={12} />}
            >
              Apply Suggestion
            </Button>
          </Flex>
          
          {showHint && (
            <Alert status="info" mt={3} borderRadius="md">
              <AlertIcon />
              {lessons[currentLevel][currentLesson].steps[currentStep].hint}
            </Alert>
          )}
        </Box>
      )}
      
      {/* Lesson Navigation */}
      <Accordion allowToggle mb={4}>
        <AccordionItem border="none">
          <AccordionButton px={0}>
            <Box flex="1" textAlign="left">
              <Text fontSize="sm" fontWeight="semibold">Lessons</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px={0} pb={0}>
            <VStack align="stretch" spacing={1}>
              {Object.entries(lessons).map(([level, levelLessons]) => (
                <Box key={level}>
                  <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={1}>
                    {level}
                  </Text>
                  {levelLessons.map((lesson, index) => (
                    <Button
                      key={lesson.id}
                      size="sm"
                      variant="ghost"
                      justifyContent="flex-start"
                      isActive={currentLevel === level && currentLesson === index}
                      onClick={() => {
                        setCurrentLevel(level);
                        setCurrentLesson(index);
                        setCurrentStep(0);
                        setShowLessonPanel(true);
                      }}
                      leftIcon={
                        completedLessons.includes(lesson.id) ? (
                          <FaMedal color="gold" />
                        ) : (
                          <Box w="14px" />
                        )
                      }
                    >
                      {lesson.title}
                    </Button>
                  ))}
                </Box>
              ))}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {/* Output Section */}
      <Flex alignItems="center" mb={4}>
        <Text fontSize="xl" fontWeight="semibold">Output</Text>
        <Spacer />
        {executionTime && <Badge colorScheme="purple" mr={2}>{executionTime}</Badge>}
        <Button
          size="sm"
          colorScheme={isError ? "red" : "green"}
          isLoading={isLoading}
          loadingText="Running..."
          onClick={runCode}
          variant="solid"
          leftIcon={isError ? <FaRedo size={12} /> : <FaPlay size={12} />}
        >
          {isError ? "Try Again" : "Run Code"}
        </Button>
      </Flex>

      <Box
        minHeight="200px"
        maxHeight="40vh"
        p={4}
        bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
        borderRadius="md"
        border="1px solid"
        borderColor={isError ? "red.500" : (colorMode === 'light' ? 'gray.200' : 'gray.600')}
        overflowY="auto"
        fontFamily="mono"
        fontSize="sm"
      >
        {output.length > 0 ? (
          output.map((line, i) => (
            <Code 
              key={i} 
              display="block" 
              whiteSpace="pre-wrap"
              color={isError ? "red.500" : "inherit"} 
              bg="transparent" 
              p={0}
            >
              {line}
            </Code>
          ))
        ) : (
          <Text color="gray.500" fontStyle="italic">
            {['python', 'javascript'].includes(language) 
              ? "Run your code to see the output here" 
              : "Click 'Run Code' to see output"}
          </Text>
        )}
      </Box>
    </Box>
  );
});

export default Output;