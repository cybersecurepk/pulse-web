"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { dummyTestDetails } from "../data/dummy-test-details";
import { DummyTestDetail } from "../data/dummy-test-details";

export function TestDetails({ params }: { params: { id: string } }) {
  const [test, setTest] = useState<DummyTestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Find the test in dummy data (replace with actual API call)
        const testDetail = dummyTestDetails.find(t => t.id === params.id);
        if (!testDetail) throw new Error("Test not found");
        
        setTest(testDetail);
      } catch (err) {
        console.error("Failed to load test:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <p>Loading test details...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <p>Test not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/tests">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">View Test</h1>
        </div>
        <p className="text-muted-foreground">
          Review test details and questions
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{test.title}</CardTitle>
              <CardDescription className="mt-1">
                {test.description}
              </CardDescription>
            </div>
            <Badge 
              variant={test.isActive ? "default" : "secondary"}
              className={test.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
            >
              {test.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Test Code</p>
              <p className="font-medium">{test.testCode}</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{test.duration} minutes</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Questions</p>
              <p className="font-medium">{test.questions.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>
            All questions in this test with their options and correct answers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {test.questions.map((question) => (
              <div 
                key={question.questionNo} 
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded font-medium text-sm">
                      {question.questionNo}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Q{question.questionNo}
                    </h3>
                  </div>
                  {question.points && (
                    <div className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                      {question.points} {question.points === 1 ? "pt" : "pts"}
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {question.text}
                </p>
                
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`flex items-start gap-3 p-3 rounded border transition-colors ${
                        option.isCorrect
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-5 h-5 rounded-full border mt-0.5 flex-shrink-0 ${
                          option.isCorrect
                            ? "bg-green-500 border-green-600"
                            : "bg-white border-gray-400"
                        }`}
                      >
                        {option.isCorrect && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span
                        className={`flex-1 leading-tight ${
                          option.isCorrect
                            ? "font-medium text-green-800"
                            : "text-gray-700"
                        }`}
                      >
                        {option.text}
                      </span>
                      {option.isCorrect && (
                        <Badge 
                          variant="secondary" 
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Correct
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}