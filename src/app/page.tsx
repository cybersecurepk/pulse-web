import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to Pulse</h1>
      <p className="mt-4 text-gray-700">
        A training and testing platform. 
      </p>
      <Link href="/application" className="mt-8">
        <Button size="lg">
          Apply Now
        </Button>
      </Link>
    </main>
  );
}
