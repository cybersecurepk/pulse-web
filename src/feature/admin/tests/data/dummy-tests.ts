import { Test } from "../types/test";

export const dummyTests: Test[] = [
  {
    id: "1",
    testName: "JavaScript Fundamentals Assessment",
    testCode: "JS-2024-001",
    // testType: "MCQ",
    description:
      "Comprehensive test covering JavaScript basics, ES6 features, and DOM manipulation.",
    totalQuestions: 25,
    duration: 60,
    passCriteria: 70,
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    testName: "React Development Test",
    testCode: "REACT-2024-002",
    // testType: "MCQ",
    description:
      "Test covering React concepts, hooks, state management, and component lifecycle.",
    totalQuestions: 30,
    duration: 90,
    passCriteria: 75,
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "3",
    testName: "Node.js Backend Assessment",
    testCode: "NODE-2024-003",
    // testType: "MCQ",
    description:
      "Assessment for Node.js, Express.js, and backend development concepts.",
    totalQuestions: 20,
    duration: 45,
    passCriteria: 65,
    isActive: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "4",
    testName: "Database Design Test",
    testCode: "DB-2024-004",
    // testType: "MCQ",
    description:
      "Test covering SQL, database design principles, and data modeling concepts.",
    totalQuestions: 35,
    duration: 75,
    passCriteria: 80,
    isActive: false,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "5",
    testName: "Full Stack Development Quiz",
    testCode: "FS-2024-005",
    // testType: "MCQ",
    description:
      "Comprehensive quiz covering frontend, backend, and database technologies.",
    totalQuestions: 50,
    duration: 120,
    passCriteria: 70,
    isActive: true,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-25"),
  },
];
