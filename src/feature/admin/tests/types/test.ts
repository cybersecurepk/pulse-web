// Use API response type from service layer
export type { TestResponse as Test } from "@/service/rtk-query/tests/tests-type";

// Local UI payload interfaces (for form handling)
export interface TestFormPayload {
  testCode: string;
  title: string;
  description: string;
  isActive: boolean;
  duration: number;
  passingCriteria: number;
  startDate: string;
  endDate: string;
  questions: QuestionFormPayload[];
}

export interface QuestionFormPayload {
  text: string;
  points: number;
  questionNo: number;
  options: OptionFormPayload[];
}

export interface OptionFormPayload {
  text: string;
  isCorrect: boolean;
}
