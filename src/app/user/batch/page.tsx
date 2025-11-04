import { UserBatchView } from "@/feature/user/batch/view";

export const metadata = { title: `My Batches` };

export default function Page() {
  // For demo purposes, we're using a default user ID
  // In a real application, this would come from authentication
  return <UserBatchView userId="945df9d7-0ae9-46b8-b599-17bdbac0c8dc" />;
}