"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Field } from "@/components/core/hook-form";
import { useGetTestForAttemptQuery, useSubmitTestAttemptMutation } from "@/service/rtk-query/tests/tests-apis";
import { useSafeSession } from "@/hooks/use-session";
import { Clock, AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { ResultDialog } from "@/components/core/result-dialog";
import Webcam from "react-webcam"; 

interface TestAttemptViewProps {
  testId: string;
}

interface AnswerData {
  [questionId: string]: string; // questionId -> selectedOptionId
}

export function TestAttemptView({ testId }: TestAttemptViewProps) {
  const router = useRouter();
  const { data: session } = useSafeSession();
  const { data: test, isLoading } = useGetTestForAttemptQuery(testId);
  const [submitTestAttempt] = useSubmitTestAttemptMutation();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerData>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStartTime] = useState<number>(Date.now());
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<{
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    totalQuestions: number;
    passed: boolean;
    passingCriteria: number;
  } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const methods = useForm<AnswerData>({
    defaultValues: {},
    mode: "all", // Validate and track all fields
  });

  // Subscribe to form changes and sync with answers state
  useEffect(() => {
    const subscription = methods.watch((value) => {
      console.log("Form values changed:", value);
      setAnswers(value as AnswerData);
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  // Sort questions by sortOrder - MUST be defined FIRST before any usage
  const sortedQuestions = useMemo(() => {
    if (!test?.questions) return [];
    return [...test.questions].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [test?.questions]);
  
  const currentQuestion = sortedQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === sortedQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / sortedQuestions.length) * 100;

  // Calculate time per question (in seconds)
  const timePerQuestion = useMemo(() => {
    if (!test?.duration || sortedQuestions.length === 0) return 60;
    return Math.floor((test.duration * 60) / sortedQuestions.length);
  }, [test?.duration, sortedQuestions.length]);

  // Initialize timer when question changes
  useEffect(() => {
    setTimeLeft(timePerQuestion);
  }, [currentQuestionIndex, timePerQuestion]);

  const handleNext = useCallback(() => {
    console.log("handleNext called", { 
      isLastQuestion, 
      currentQuestionIndex, 
      totalQuestions: sortedQuestions.length,
      allAnswers: methods.getValues(),
    });
    
    if (isLastQuestion) {
      handleSubmit();
    } else if (currentQuestionIndex < sortedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      console.log("Already at or past last question, submitting");
      handleSubmit();
    }
  }, [isLastQuestion, currentQuestionIndex, sortedQuestions.length, methods]);

  // Timer countdown
  useEffect(() => {
    // Don't run timer if no current question
    if (!currentQuestion) {
      console.log("No current question, stopping timer");
      return;
    }

    if (timeLeft <= 0) {
      console.log("Time expired, calling handleNext");
      handleNext();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, currentQuestionIndex, currentQuestion]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Get current form values directly instead of using state
      const currentAnswers = methods.getValues();
      
      // console.log("=== FORM DEBUG ===");
      // console.log("All form fields:", Object.keys(currentAnswers));
      // console.log("All form values:", currentAnswers);
      // console.log("Total questions:", sortedQuestions.length);
      // console.log("Question IDs:", sortedQuestions.map(q => q.id));
      // console.log("==================\n");
      
      // Calculate time spent in seconds
      const timeSpent = Math.floor((Date.now() - testStartTime) / 1000);
      
      // console.log("=== SUBMITTING TEST ===");
      // console.log("Test ID:", testId);
      // console.log("User ID:", session?.user?.id);
      // console.log("Answers from form:", currentAnswers);
      // console.log("Time Spent (seconds):", timeSpent);

      const result = await submitTestAttempt({
        testId,
        userId: session?.user?.id!,
        answers: currentAnswers,
        timeSpent,
      }).unwrap();

      // console.log("\n=== RESULTS FROM BACKEND ===");
      // console.log("Score:", result.score);
      // console.log("Correct Answers:", result.correctAnswers);
      // console.log("Wrong Answers:", result.wrongAnswers);
      // console.log("Total Questions:", result.totalQuestions);
      // console.log("Passed:", result.passed);
      // console.log("Passing Criteria:", result.passingCriteria);
      // console.log("============================\n");

      // Store results and show dialog
      setTestResults(result);
      setShowResults(true);
      setIsSubmitting(false);
    } catch (error: any) {
      console.error("Error submitting test:", error);
      toast.error(
        error?.data?.message || "Failed to submit test. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <p>Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test || sortedQuestions.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Test Not Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              The test you're looking for doesn't exist or has no questions.
            </p>
            <Button onClick={() => router.push("/user/tests")}>
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Safety check: if current index is out of bounds, reset to 0 or last question
  if (currentQuestionIndex >= sortedQuestions.length) {
    console.error("Current question index out of bounds!", { currentQuestionIndex, totalQuestions: sortedQuestions.length });
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Question</h3>
            <p className="text-muted-foreground text-center mb-4">
              Question index is out of bounds. Please try again.
            </p>
            <Button onClick={() => router.push("/user/tests")}>
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{test.title}</h1>
            <p className="text-muted-foreground mt-1">{test.description}</p>
          </div>
          <Badge 
            variant={timeLeft <= 10 ? "destructive" : "secondary"}
            className="text-lg px-4 py-2"
          >
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(timeLeft)}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {sortedQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Card */}
      <FormProvider {...methods}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {currentQuestionIndex + 1}
                  </div>
                  <CardTitle className="text-xl">Question {currentQuestionIndex + 1}</CardTitle>
                </div>
                <CardDescription className="text-base text-foreground mt-3">
                  {currentQuestion?.text}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Render ALL questions but only show current one - this keeps form values */}
            {sortedQuestions.map((question, qIndex) => (
              <div
                key={question.id}
                style={{ display: qIndex === currentQuestionIndex ? 'block' : 'none' }}
              >
                <Field.RadioGroup
                  name={question.id}
                  options={
                    question.options?.map((option) => ({
                      value: option.id,
                      label: option.text,
                    })) || []
                  }
                  direction="vertical"
                  className="space-y-3"
                />
              </div>
            ))}

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {methods.getValues(currentQuestion?.id || "")
                  ? "Answer selected"
                  : "Select an answer to continue"}
              </div>
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : isLastQuestion ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Test
                  </>
                ) : (
                  "Next Question →"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </FormProvider>

      {/* Instructions */}
      <Card className="mt-6 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-blue-900">Test Instructions:</p>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Each question has a timer that automatically moves to the next question</li>
                <li>You can manually proceed to the next question before time runs out</li>
                <li>You cannot go back to previous questions</li>
                <li>The test will auto-submit after the last question</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Dialog */}
      <ResultDialog
        open={showResults}
        onOpenChange={setShowResults}
        type={testResults?.passed ? "success" : "error"}
        title={testResults?.passed ? "Test Passed!" : "Test Failed"}
        description="Here are your test results"
        confirmText="OK"
        onConfirm={() => {
          setShowResults(false);
          router.push("/user/tests");
        }}
      >
        {/* Score Display */}
        <div className="text-center">
          <div className="text-5xl font-bold mb-2" style={{
            color: testResults?.passed ? '#16a34a' : '#dc2626'
          }}>
            {testResults?.score}%
          </div>
          <p className="text-muted-foreground">
            Passing criteria: {testResults?.passingCriteria}%
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">
              {testResults?.correctAnswers}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Correct
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-600">
              {testResults?.wrongAnswers}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Wrong
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold">
              {testResults?.totalQuestions}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Total
            </div>
          </div>
        </div>
      </ResultDialog>
    </div>
  );
}
