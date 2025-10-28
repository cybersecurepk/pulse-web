import { TestDetails } from "../components/test-details";

interface Question {
  text: string;
  points?: number;
  questionNo: number;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

export function ViewTestPage({ params }: { params: { id: string } }) {
  return <TestDetails params={{ id: params.id }} />;
}
