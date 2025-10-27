import { TestForm } from "../components/test-form";

interface EditTestViewProps {
  testId: string;
}

export function EditTestView({ testId }: EditTestViewProps) {
  return <TestForm testId={testId} />;
}