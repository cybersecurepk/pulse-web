"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

export default function ProctoringTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const testContainerRef = useRef<HTMLDivElement>(null);

  // Sample questions for demonstration
  const questions = [
    {
      id: 1,
      text: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"]
    },
    {
      id: 2,
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"]
    },
    {
      id: 3,
      text: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"]
    },
    {
      id: 4,
      text: "What is the largest planet in our solar system?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"]
    },
    {
      id: 5,
      text: "What year did World War II end?",
      options: ["1943", "1945", "1950", "1939"]
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setIsCapturing(true);
      
      // Capture screenshot of the entire screen
      try {
        const canvas = await html2canvas(document.body);
        const screenshot = canvas.toDataURL("image/png");
        setScreenshots(prev => [...prev, screenshot]);
        
        // Move to next question
        setCurrentQuestion(prev => prev + 1);
      } catch (error) {
        console.error("Screenshot capture failed:", error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleSubmitTest = async () => {
    setIsCapturing(true);
    
    // Capture final screenshot
    try {
      const canvas = await html2canvas(document.body);
      const screenshot = canvas.toDataURL("image/png");
      setScreenshots(prev => [...prev, screenshot]);
      
      // In a real implementation, you would send the screenshots to your server here
      alert(`Test submitted! ${screenshots.length + 1} screenshots captured for proctoring.`);
    } catch (error) {
      console.error("Final screenshot capture failed:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleStartTest = () => {
    setCurrentQuestion(0);
    setScreenshots([]);
    setSelectedAnswers({});
    setTimeRemaining(300);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Proctoring Test Demo</h1>
              <p className="text-muted-foreground">Screenshots are taken when moving between questions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                ⏰ {formatTime(timeRemaining)}
              </div>
              <button
                onClick={handleStartTest}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
              >
                Restart
              </button>
            </div>
          </div>

          <div className="mb-6 pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div 
              ref={testContainerRef}
              className="bg-gray-50 rounded-lg p-6 mb-6"
            >
              <p className="text-lg mb-6">{questions[currentQuestion].text}</p>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-3 p-3 border rounded cursor-pointer transition-colors ${
                      selectedAnswers[currentQuestion] === option
                        ? "border-blue-500 bg-blue-50"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleAnswerSelect(currentQuestion, option)}
                  >
                    <div className={`flex items-center justify-center h-5 w-5 rounded-full border ${
                      selectedAnswers[currentQuestion] === option
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}>
                      {selectedAnswers[currentQuestion] === option && (
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-base">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Screenshots captured: {screenshots.length}
            </div>
            <div className="flex gap-3">
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  disabled={isCapturing || !selectedAnswers[currentQuestion]}
                  className={`px-6 py-2 rounded text-white ${
                    isCapturing || !selectedAnswers[currentQuestion]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isCapturing ? "Capturing..." : "Next Question"}
                </button>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  disabled={isCapturing || !selectedAnswers[currentQuestion]}
                  className={`px-6 py-2 rounded text-white ${
                    isCapturing || !selectedAnswers[currentQuestion]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isCapturing ? "Submitting..." : "Submit Test"}
                </button>
              )}
            </div>
          </div>
        </div>

        {screenshots.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Proctoring Screenshots</h3>
            <p className="text-muted-foreground mb-4">
              These screenshots would be sent to the proctoring server in a real implementation
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-3 py-2 text-sm font-medium">
                    Question {index + 1}
                  </div>
                  <img 
                    src={screenshot} 
                    alt={`Screenshot ${index + 1}`} 
                    className="w-full h-auto max-h-40 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}