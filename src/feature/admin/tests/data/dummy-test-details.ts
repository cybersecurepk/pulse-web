import { TestPayload } from "../types/test";

export interface DummyTestDetail extends TestPayload {
  id: string;
  testCode: string; // Add testCode field
}

export const dummyTestDetails: DummyTestDetail[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals Assessment",
    testCode: "JS-2024-001",
    type: "MCQ",
    description: "Comprehensive test covering JavaScript basics, ES6 features, and DOM manipulation.",
    isActive: true,
    duration: 60,
    questions: [
      {
        text: "Which of the following is NOT a JavaScript data type?",
        points: 5,
        questionNo: 1,
        options: [
          { text: "Number", isCorrect: false },
          { text: "String", isCorrect: false },
          { text: "Boolean", isCorrect: false },
          { text: "Float", isCorrect: true },
        ],
      },
      {
        text: "What is the correct way to declare a constant variable in ES6?",
        points: 5,
        questionNo: 2,
        options: [
          { text: "var myVar = 10;", isCorrect: false },
          { text: "let myVar = 10;", isCorrect: false },
          { text: "const myVar = 10;", isCorrect: true },
          { text: "constant myVar = 10;", isCorrect: false },
        ],
      },
      {
        text: "Which method is used to add an element to the end of an array?",
        points: 5,
        questionNo: 3,
        options: [
          { text: "append()", isCorrect: false },
          { text: "push()", isCorrect: true },
          { text: "addToEnd()", isCorrect: false },
          { text: "insert()", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "React Development Test",
    testCode: "REACT-2024-002",
    type: "MCQ",
    description: "Test covering React concepts, hooks, state management, and component lifecycle.",
    isActive: true,
    duration: 90,
    questions: [
      {
        text: "What is the correct way to update state in a functional component using hooks?",
        points: 5,
        questionNo: 1,
        options: [
          { text: "this.setState({ count: 5 });", isCorrect: false },
          { text: "setState({ count: 5 });", isCorrect: false },
          { text: "useState({ count: 5 });", isCorrect: false },
          { text: "setCount(5);", isCorrect: true },
        ],
      },
      {
        text: "Which hook is used to perform side effects in functional components?",
        points: 5,
        questionNo: 2,
        options: [
          { text: "useEffect", isCorrect: true },
          { text: "useSideEffect", isCorrect: false },
          { text: "useAction", isCorrect: false },
          { text: "useLifecycle", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of React keys in lists?",
        points: 5,
        questionNo: 3,
        options: [
          { text: "To style list items", isCorrect: false },
          { text: "To identify elements uniquely for React's reconciliation", isCorrect: true },
          { text: "To add animations to list items", isCorrect: false },
          { text: "To bind event handlers to list items", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Node.js Backend Assessment",
    testCode: "NODE-2024-003",
    type: "MCQ",
    description: "Assessment for Node.js, Express.js, and backend development concepts.",
    isActive: true,
    duration: 45,
    questions: [
      {
        text: "Which of the following is used to create a web server in Node.js?",
        points: 5,
        questionNo: 1,
        options: [
          { text: "http.createServer()", isCorrect: true },
          { text: "net.createServer()", isCorrect: false },
          { text: "fs.createServer()", isCorrect: false },
          { text: "express.createServer()", isCorrect: false },
        ],
      },
      {
        text: "What is the purpose of package.json file?",
        points: 5,
        questionNo: 2,
        options: [
          { text: "To store application data", isCorrect: false },
          { text: "To manage project dependencies and metadata", isCorrect: true },
          { text: "To configure database connections", isCorrect: false },
          { text: "To define CSS styles", isCorrect: false },
        ],
      },
      {
        text: "Which middleware is used to parse JSON bodies in Express.js?",
        points: 5,
        questionNo: 3,
        options: [
          { text: "express.json()", isCorrect: true },
          { text: "express.urlencoded()", isCorrect: false },
          { text: "express.bodyParser()", isCorrect: false },
          { text: "express.parseJSON()", isCorrect: false },
        ],
      },
    ],
  },
];