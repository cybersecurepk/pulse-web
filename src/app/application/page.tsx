import { ApplicationFormView } from "@/feature/application";

export default function ApplicationPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-8 px-8 lg:px-12">
      <ApplicationFormView />
    </main>
  );
}
