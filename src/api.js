// api.js - Updated with multiple execution options
import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

const API_BASE_URLS = {
  piston: "https://emkc.org/api/v2/piston",
  local: "http://localhost:3001/api/execute", // If you set up a local execution service
  rapidapi: "https://judge0-ce.p.rapidapi.com", // Alternative API
};

const API = axios.create({
  baseURL: API_BASE_URLS.piston,
  timeout: 10000, // Set timeout to prevent hanging
});

// Cache for previously executed code
const executionCache = new Map();

export const executeCode = async (language, sourceCode, stdin = "") => {
  const cacheKey = `${language}-${sourceCode}`;
  
  // Return cached result if available
  if (executionCache.has(cacheKey)) {
    return executionCache.get(cacheKey);
  }

  try {
    const response = await API.post("/execute", {
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [{ content: sourceCode }],
      stdin: stdin,
    });
    
    // Cache the successful response
    executionCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Execution error:", error);
    throw error;
  }
};