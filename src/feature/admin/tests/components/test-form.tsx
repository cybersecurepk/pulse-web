"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  FileText,
  List,
  Loader2,
  PlusCircle,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TestBasicInfoForm } from "./test-basic-info-form";
import { QuestionCreationForm } from "./question-creation-form";
import { QuestionsListView } from "./questions-list-view";
import { 
  useGetTestByIdQuery, 
  useSaveTestMutation, 
  useUpdateTestMutation 
} from "@/service/rtk-query/tests/tests-apis";
import { TestPayload } from "@/service/rtk-query/tests/tests-type";

const testSchema = z.object({
  title: z
    .string()
    .min(1, "Test name is required")
    .min(3, "Name must be at least 3 characters"),
  testCode: z
    .string()
    .min(1, "Test code is required")
    .min(3, "Code must be at least 3 characters"),
  description: z.string().optional(),
  isActive: z.boolean(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  passCriteria: z.number().min(1, "Pass criteria must be at least 1%").max(100, "Pass criteria cannot exceed 100%"),
  startDate: z.date({
    message: "Start date is required",
  }),
  endDate: z.date({
    message: "End date is required",
  }),
  
  questions: z
    .array(
      z.object({
        text: z.string().min(1, "Question text is required"),
        points: z.number().min(1, "Points must be at least 1").optional(),
        questionNo: z.number(),
        options: z
          .array(
            z.object({
              text: z.string().min(1, "Option text is required"),
              isCorrect: z.boolean(),
            })
          )
          .min(2, "At least 2 options are required"),
      })
    )
    .min(1, "At least one question is required"),

  currentQuestion: z.object({
    text: z.string(),
    points: z.number().optional(),
    options: z.array(
      z.object({
        text: z.string(),
        isCorrect: z.boolean(),
      })
    ),
  }),
});

type TestFormData = z.infer<typeof testSchema>;

interface TestFormProps {
  testId?: string; // For edit mode
}

export function TestForm({ testId }: TestFormProps) {
  const router = useRouter();
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const isEditMode = !!testId;
  
  const { data: testData, isLoading: isLoadingTest } = useGetTestByIdQuery(testId!, { skip: !testId });
  const [saveTest, { isLoading: isSaving }] = useSaveTestMutation();
  const [updateTest, { isLoading: isUpdating }] = useUpdateTestMutation();
  
  const loading = testId ? isLoadingTest : false;

  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: "",
      testCode: "",
      description: "",
      isActive: true,
      duration: 60,
      passCriteria: 70,
      startDate: new Date(),
      endDate: new Date(),
      questions: [],
      currentQuestion: {
        text: "",
        points: 5,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    },
  });

  // Load test data if in edit mode
  useEffect(() => {
    if (!testId || !testData) return;

    try {
      form.reset({
        title: testData.title,
        testCode: testData.testCode || "",
        description: testData.description,
        isActive: testData.isActive,
        duration: testData.duration,
        passCriteria: testData.passingCriteria,
        startDate: new Date(testData.startDate),
        endDate: new Date(testData.endDate),
        questions: testData.questions.map((q) => ({
          text: q.text,
          points: q.points,
          questionNo: q.sortOrder + 1,
          options: q.options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        })),
        currentQuestion: {
          text: "",
          points: 5,
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      });
    } catch (err) {
      console.error("Failed to load test:", err);
    }
  }, [testId, testData, form]);

  // Show loading state when in edit mode
  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <p>Loading test details...</p>
        </div>
      </div>
    );
  }

  const questions = form.watch("questions");

  const handleAddQuestion = () => {
    const questions = form.getValues("questions");
    const currentQuestionData = form.getValues("currentQuestion");

    // Validate current question
    if (!currentQuestionData.text.trim()) {
      form.setError("currentQuestion.text", {
        message: "Question text is required",
      });
      return;
    }

    const options = currentQuestionData.options;

    // Check each option
    let hasEmpty = false;
    options.forEach((opt, index) => {
      if (!opt.text.trim()) {
        hasEmpty = true;
        form.setError(`currentQuestion.options.${index}.text`, {
          type: "manual",
          message: "Option text is required",
        });
      }
    });

    if (hasEmpty) return;

    // Check if at least one option is marked as correct
    const hasCorrectAnswer = options.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) {
      form.setError("currentQuestion.options", {
        type: "manual",
        message: "At least one option must be marked as correct",
      });
      return;
    }

    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = {
        ...currentQuestionData,
        questionNo: editingQuestionIndex + 1,
      };
      form.setValue("questions", updatedQuestions);
      setEditingQuestionIndex(null);
    } else {
      // Add new question
      const newQuestion = {
        ...currentQuestionData,
        questionNo: questions.length + 1,
      };
      form.setValue("questions", [...questions, newQuestion]);
    }

    // Reset current question
    form.setValue("currentQuestion", {
      text: "",
      points: 5,
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
  };

  const handleEditQuestion = (questionNumber: number) => {
    // Find the index of the question in the array
    const questionIndex = questions.findIndex(
      (q) => q.questionNo === questionNumber
    );
    if (questionIndex !== -1) {
      const questionToEdit = questions[questionIndex];
      form.setValue("currentQuestion", questionToEdit);
      setEditingQuestionIndex(questionIndex);
    }
  };

  const handleDeleteQuestion = (questionNumber: number) => {
    // Find the index of the question to delete
    const questionIndex = questions.findIndex(
      (q) => q.questionNo === questionNumber
    );
    
    const updatedQuestions = questions
      .filter((q) => q.questionNo !== questionNumber)
      .map((q, index) => ({
        ...q,
        questionNo: index + 1,
      }));

    form.setValue("questions", updatedQuestions);

    // If we're editing the deleted question, cancel edit mode
    if (editingQuestionIndex === questionIndex) {
      setEditingQuestionIndex(null);
      form.setValue("currentQuestion", {
        text: "",
        points: 5,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestionIndex(null);
    form.setValue("currentQuestion", {
      text: "",
      points: 5,
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
  };

  const onSubmit = async (data: TestFormData) => {
    try {
      const payload: TestPayload = {
        testCode: data.testCode,
        title: data.title,
        description: data.description || "",
        isActive: data.isActive,
        duration: data.duration,
        passingCriteria: data.passCriteria,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        questions: data.questions.map((q, index) => ({
          sortOrder: index,
          text: q.text,
          type: "single", // Assuming single choice for now
          points: q.points || 1,
          options: q.options.map(opt => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        })),
      };

      console.log(`${isEditMode ? "Updating" : "Creating"} test:`, payload);
      
      if (isEditMode) {
        await updateTest({ id: testId!, payload }).unwrap();
      } else {
        await saveTest(payload).unwrap();
      }
      
      router.push("/admin/tests");
    } catch (err: unknown) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} test:`, err);
      form.setError("root", {
        type: "manual",
        message: `Failed to ${isEditMode ? "update" : "create"} test. Please try again.`,
      });
    }
  };

  const isLoading = form.formState.isSubmitting || isSaving || isUpdating;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/tests">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? "Edit Test" : "Create New Test"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update test details and questions below"
            : "Create a new test by filling in the details below and adding questions"}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0"
        >
          {/* Left Column: Test Info + Question Creation */}
          <div className="lg:col-span-2 mb-6">
            <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow duration-200">
              <CardContent className="px-6 space-y-8">
                {/* Test Basic Information */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        Test Information
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Basic details about the test
                      </CardDescription>
                    </div>
                  </div>
                  <TestBasicInfoForm />
                </div>

                {/* Question Creation */}
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <PlusCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        {editingQuestionIndex !== null
                          ? `Edit Question ${editingQuestionIndex + 1}`
                          : `Add Question ${questions.length + 1}`}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Create multiple choice questions
                      </CardDescription>
                    </div>
                  </div>
                  <QuestionCreationForm
                    onAddQuestion={handleAddQuestion}
                    isEditing={editingQuestionIndex !== null}
                    onCancelEdit={handleCancelEdit}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || questions.length === 0}
                    className="flex-1 disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isEditMode ? "Updating..." : "Creating..."}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Save className="h-4 w-4 mr-2" />
                        {isEditMode ? "Update Test" : "Save Test"}
                      </div>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => router.push("/admin/tests")}
                  >
                    Cancel
                  </Button>
                </div>

                {form.formState.errors.root && (
                  <div className="text-sm text-red-600 font-medium">
                    {form.formState.errors.root.message}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Questions List */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Card className="shadow-sm border-gray-200 h-full flex flex-col">
                <CardHeader className="pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <List className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">
                        Questions ({questions.length})
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {questions.length === 0
                          ? "No questions added yet"
                          : "Review and manage added questions"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                  <QuestionsListView
                    questions={questions}
                    onEditQuestion={handleEditQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}