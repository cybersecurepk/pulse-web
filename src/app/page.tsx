import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <section className="relative h-full overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
        </div>

        <div className="mx-auto h-full max-w-7xl">
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Badge 
              variant="secondary" 
              className="mb-6 px-4 py-1.5 text-sm font-semibold bg-blue-100 text-blue-700 hover:bg-blue-100"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Transform Your Learning Journey
            </Badge>

            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-8xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Pulse
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
              A comprehensive training and testing platform designed to elevate your skills, 
              track your progress, and achieve excellence in your professional journey.
            </p>

            <div className="mt-10">
              <Link href="/application">
                <Button 
                  size="lg" 
                  className="group h-12 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
