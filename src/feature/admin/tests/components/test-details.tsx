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
import { ArrowLeft, Check, Camera } from "lucide-react";
import Link from "next/link";
import {
  useGetTestByIdQuery,
  useAddTestScreenshotMutation,
} from "@/service/rtk-query/tests/tests-apis";
import { TestResponse } from "@/service/rtk-query/tests/tests-type";
import html2canvas from "html2canvas";
import { toPng } from "html-to-image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function TestDetails({ params }: { params: { id: string } }) {
  const { data: test, isLoading: loading } = useGetTestByIdQuery(params.id);
  const [addScreenshot] = useAddTestScreenshotMutation();
  const [hasCaptured, setHasCaptured] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // Capture screenshot when the test data is loaded
  useEffect(() => {
    if (test && !hasCaptured) {
      console.log("Test data loaded, scheduling screenshot capture...");
      setHasCaptured(true);
      // Add a longer delay to ensure all content is rendered
      const timer = setTimeout(() => {
        captureScreenshot();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [test, hasCaptured]);

  const captureScreenshot = async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const contentElement = document.querySelector(
        ".container.mx-auto.p-6.max-w-4xl"
      ) as HTMLElement;
      if (!contentElement) throw new Error("Screenshot element not found");

      // Capture with lower quality and resolution to reduce size
      const imageDataUrl = await toPng(contentElement, {
        quality: 0.6,
        pixelRatio: 1,
        backgroundColor: "#ffffff",
        cacheBust: true,
        filter: (node) => {
          return true;
        },
      });

      // Convert to blob and compress further if needed
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();

      // Check size (in MB)
      const sizeMB = blob.size / (1024 * 1024);
      console.log(`Screenshot size: ${sizeMB.toFixed(2)} MB`);

      // If still too large, compress more
      let finalImageUrl = imageDataUrl;
      if (sizeMB > 2) {
        // Create a canvas to compress the image further
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = imageDataUrl;
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        // Reduce dimensions if too large
        const maxWidth = 1200;
        const scale = Math.min(1, maxWidth / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        finalImageUrl = canvas.toDataURL("image/jpeg", 0.5);
      }

      await addScreenshot({
        testId: params.id,
        imageUrl: finalImageUrl,
        description: `Screenshot of test ${
          test!.title
        } taken on ${new Date().toLocaleString()}`,
      }).unwrap();

      toast.success("Screenshot captured successfully!");
    } catch (err) {
      console.error("Screenshot capture failed:", err);
      toast.error("Failed to capture screenshot");
    } finally {
      setIsCapturing(false);
    }
  };

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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">View Test</h1>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Review test details and questions
          </p>
          <Button
            onClick={captureScreenshot}
            disabled={isCapturing}
            variant="outline"
            size="sm"
          >
            <Camera className="h-4 w-4 mr-2" />
            {isCapturing ? "Capturing..." : "Capture Screenshot"}
          </Button>
        </div>
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
              className={
                test.isActive
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : ""
              }
            >
              {test.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Test Code</p>
              <p className="font-medium">{test.testCode || "-"}</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{test.duration} minutes</p>
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Questions</p>
              <p className="font-medium">{test.questions?.length || 0}</p>
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
            {test.questions?.map((question, index) => (
              <div
                key={question.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded font-medium text-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Q{index + 1}
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
                  {question.options?.map((option, optIndex) => (
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

      {test.screenshots && test.screenshots.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Screenshots</CardTitle>
            <CardDescription>
              Screenshots captured for this test
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {test.screenshots.map((screenshot) => (
                <div
                  key={screenshot.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <img
                    src={screenshot.imageUrl}
                    alt={screenshot.description || "Test screenshot"}
                    className="w-full h-auto max-h-40 object-cover"
                  />
                  <div className="p-2 bg-muted text-xs text-muted-foreground">
                    {new Date(screenshot.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
