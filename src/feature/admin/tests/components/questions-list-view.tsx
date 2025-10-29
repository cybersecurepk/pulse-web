"use client";

import { Button } from "@/components/ui/button";
import { Check, Edit, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Question {
  text: string;
  points?: number;
  questionNo: number;
  options: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

interface QuestionsListViewProps {
  questions: Question[];
  onEditQuestion: (questionNumber: number) => void;
  onDeleteQuestion: (questionNumber: number) => void;
}

export function QuestionsListView({
  questions,
  onEditQuestion,
  onDeleteQuestion,
}: QuestionsListViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("65vh");

  // Calculate available height based on viewport
  useEffect(() => {
    const updateMaxHeight = () => {
      const vh = window.innerHeight * 0.01;
      const calculatedHeight = `calc(${65 * vh}px)`;
      setMaxHeight(calculatedHeight);
    };

    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);

    return () => {
      window.removeEventListener("resize", updateMaxHeight);
    };
  }, []);

  // Scroll to bottom whenever questions array length changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [questions.length]);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center p-6">
        <div className="p-3 bg-gray-100 rounded-full mb-3">
          <Check className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium mb-1">No questions yet</p>
        <p className="text-gray-400 text-sm">
          Questions you add will appear here for easy management
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="space-y-1.5 overflow-y-auto scroll-smooth"
      style={{ maxHeight }}
    >
      {questions.map((question, index) => (
        <div
          key={index}
          className="border-b border-gray-150 py-3 bg-white hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
        >
          {/* Header with question number and actions */}
          <div className="flex justify-between items-start mb-2 px-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 rounded font-medium text-xs">
                {question.questionNo}
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">
                Q{question.questionNo}
              </h4>
            </div>
            <div className="flex items-center gap-1">
              {question.points && (
                <div className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                  {question.points} {question.points === 1 ? "pt" : "pts"}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditQuestion(question.questionNo)}
                className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                title="Edit question"
                type="button"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteQuestion(question.questionNo)}
                className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete question"
                type="button"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Question text */}
          <p className="text-gray-700 mb-2 leading-relaxed text-sm px-3 line-clamp-2">
            {question.text}
          </p>

          {/* Options list */}
          <div className="space-y-1 px-3">
            {question.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`flex items-start gap-1.5 p-1.5 rounded border transition-colors ${
                  option.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-3.5 h-3.5 rounded-full border mt-0.5 ${
                    option.isCorrect
                      ? "bg-green-500 border-green-600"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {option.isCorrect && (
                    <Check className="h-2 w-2 text-white" />
                  )}
                </div>
                <span
                  className={`text-xs flex-1 leading-tight ${
                    option.isCorrect
                      ? "font-medium text-green-800"
                      : "text-gray-700"
                  }`}
                >
                  {option.text}
                </span>
              </div>
            ))}
          </div>

          {/* Footer with correct answer indicator */}
          <div className="mt-2 pt-1.5 border-t border-gray-100 px-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {question.options.filter((opt) => opt.isCorrect).length === 1
                  ? "1 correct"
                  : "0 correct"}
              </span>
              <span>{question.options.length} opts</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
