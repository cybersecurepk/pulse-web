import { CompletedTestsView } from "@/feature/user/tests/view";

export const metadata = { title: `Completed Tests` };

export default function Page() {
  // For demo purposes, we're using a default user ID
  // In a real application, this would come from authentication
  return <CompletedTestsView userId="945df9d7-0ae9-46b8-b599-17bdbac0c8dc" />;
}