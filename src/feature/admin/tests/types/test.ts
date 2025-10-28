export interface Test {
  id: string;
  testName: string;
  testCode: string;
  // testType: string;
  description: string;
  totalQuestions: number;
  duration: number;
  passCriteria: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestPayload {
  title: string;
  type: string;
  description: string;
  isActive: boolean;
  duration: number;
  questions: QuestionPayload[];
}

export interface QuestionPayload {
  text: string;
  points?: number;
  questionNo: number;
  options: OptionPayload[];
}

export interface OptionPayload {
  text: string;
  isCorrect: boolean;
}

