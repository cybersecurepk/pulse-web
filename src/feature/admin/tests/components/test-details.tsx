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
import {
  useGetTestByIdQuery,
  useAddTestScreenshotMutation,
} from "@/service/rtk-query/tests/tests-apis";
import { toPng } from "html-to-image";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export function TestDetails({ params }: { params: { id: string } }) {
  const { data: test, isLoading } = useGetTestByIdQuery(params.id);
  const [addScreenshot] = useAddTestScreenshotMutation();

  const [hasCaptured, setHasCaptured] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const captureAttempted = useRef(false);

  console.log("TestDetails render:", { test: !!test, isLoading, hasCaptured, isCapturing, captureAttempted: captureAttempted.current });

  // ✅ Ensure all images are loaded before taking screenshot
  const waitForImages = async () => {
    const images = Array.from(document.querySelectorAll("img"));
    await Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.onload = img.onerror = res;
            })
      )
    );
  };

  // ✅ Screenshot capture function
  const captureScreenshot = useCallback(async () => {
    if (isCapturing || !test) return;

    setIsCapturing(true);
    console.log("Starting screenshot capture for test:", test.id);

    try {
      await waitForImages();

      const contentElement = document.getElementById("test-container");
      if (!contentElement) throw new Error("Screenshot element not found");

      console.log("Capturing screenshot...");
      
      // Capture with very low quality and resolution to reduce size significantly
      const imageDataUrl = await toPng(contentElement, {
        quality: 0.3, // Very low quality
        pixelRatio: 0.5, // Half resolution
        backgroundColor: "#ffffff",
      });

      // Convert to blob to check size
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const sizeMB = blob.size / (1024 * 1024);
      console.log(`Screenshot size: ${sizeMB.toFixed(2)} MB`);

      // Further compress if needed
      let finalImageUrl = imageDataUrl;
      
      // Always compress to JPEG with aggressive settings
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = imageDataUrl;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      // Reduce to max 800px width
      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / img.width);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      finalImageUrl = canvas.toDataURL("image/jpeg", 0.3);
      
      const finalBlob = await (await fetch(finalImageUrl)).blob();
      const finalSizeMB = finalBlob.size / (1024 * 1024);
      console.log(`Compressed screenshot size: ${finalSizeMB.toFixed(2)} MB`);

      console.log("Screenshot captured, sending to backend...");
      const result = await addScreenshot({
        testId: params.id,
        imageUrl: finalImageUrl,
        description: `Screenshot taken on ${new Date().toLocaleString()}`,
      }).unwrap();

      console.log("Screenshot saved successfully:", result);
      toast.success("Screenshot captured successfully!");
    } catch (err: any) {
      console.error("Screenshot capture failed:", err);
      toast.error(err?.data?.message || "Failed to capture screenshot");
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, test, addScreenshot, params.id]);

  // ✅ Run screenshot once on load when test data is ready
  useEffect(() => {
    console.log("useEffect triggered:", { test: !!test, hasCaptured, isCapturing, captureAttempted: captureAttempted.current });
    
    if (!test) {
      console.log("No test data yet, skipping screenshot");
      return;
    }
    
    if (captureAttempted.current) {
      console.log("Screenshot already attempted, skipping");
      return;
    }

    console.log("Marking capture as attempted and scheduling...");
    captureAttempted.current = true;
    setHasCaptured(true);

    const timer = setTimeout(() => {
      console.log("✅ Timer fired! Calling captureScreenshot now");
      captureScreenshot();
    }, 2000);

    return () => {
      console.log("useEffect cleanup - but timer should have already fired");
      // Don't clear timer - let it complete
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, captureScreenshot]); // Only depend on test and captureScreenshot

  // ✅ Loading and error states
  if (isLoading) {
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
    <div id="test-container" className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/tests">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">View Test</h1>
          {isCapturing && (
            <Badge variant="secondary" className="ml-auto">
              Capturing screenshot...
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">Review test details and questions</p>
        {test.screenshots && test.screenshots.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {test.screenshots.length} screenshot(s) captured
          </p>
        )}
      </div>

      {/* ✅ Test Info */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{test.title}</CardTitle>
              <CardDescription className="mt-1">{test.description}</CardDescription>
            </div>
            <Badge
              variant={test.isActive ? "default" : "secondary"}
              className={test.isActive ? "bg-green-100 text-green-800" : ""}
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

      {/* ✅ Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>All questions in this test</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {test.questions?.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded text-sm font-medium">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-gray-900">Q{index + 1}</h3>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{question.text}</p>

                <div className="space-y-2">
                  {question.options?.map((option, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded border ${
                        option.isCorrect
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span
                        className={`flex-1 ${
                          option.isCorrect ? "font-medium text-green-800" : "text-gray-700"
                        }`}
                      >
                        {option.text}
                      </span>

                      {option.isCorrect && (
                        <Badge className="bg-green-100 text-green-800">Correct</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ✅ Screenshots */}
      {test.screenshots && test.screenshots.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Screenshots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {test.screenshots?.map((screenshot) => (
                <div key={screenshot.id} className="border rounded-lg overflow-hidden">
                  <img
                    src={screenshot.imageUrl}
                    alt="Screenshot"
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
