"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  User, 
  CheckCircle, 
  BarChart3,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { useGetAllTestAttemptsQuery } from "@/service/rtk-query/tests/tests-apis";
import { useGetAllTestsQuery } from "@/service/rtk-query/tests/tests-apis";
// Import hook-form components and form provider
import { Field } from "@/components/core/hook-form/fields";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  test: {
    title: string;
  };
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number | string;
  passed: boolean;
  timeSpent: number;
  createdAt: string;
}

export function TestResultsView() {
  const { 
    data: allAttempts = [], 
    isLoading, 
    isError, 
    error,
    refetch
  } = useGetAllTestAttemptsQuery();
  
  const { data: allTests = [] } = useGetAllTestsQuery();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTest, setSelectedTest] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "score" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Initialize form for hook-form components
  const form = useForm({
    defaultValues: {
      searchTerm: "",
      selectedTest: "all",
      sortBy: "date"
    }
  });

  // Update form values when state changes
  useEffect(() => {
    form.setValue("searchTerm", searchTerm);
    form.setValue("selectedTest", selectedTest);
    form.setValue("sortBy", sortBy);
  }, [searchTerm, selectedTest, sortBy, form]);

  // Filter and sort attempts using useMemo to prevent infinite re-renders
  const filteredAttempts = useMemo(() => {
    let result = [...allAttempts] as TestAttempt[];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(attempt => 
        attempt.user?.name?.toLowerCase().includes(term) ||
        attempt.user?.email?.toLowerCase().includes(term) ||
        attempt.test?.title?.toLowerCase().includes(term)
      );
    }
    
    // Apply test filter
    if (selectedTest !== "all") {
      result = result.filter(attempt => attempt.testId === selectedTest);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "score":
          comparison = Number(a.score) - Number(b.score);
          break;
        case "name":
          comparison = a.user?.name?.localeCompare(b.user?.name || "") || 0;
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    return result;
  }, [allAttempts, searchTerm, selectedTest, sortBy, sortOrder]);

  // Calculate statistics using useMemo
  const stats = useMemo(() => {
    const total = allAttempts.length;
    const passed = allAttempts.filter((attempt: any) => attempt.passed).length;
    const average = total > 0 
      ? (allAttempts.reduce((sum: number, attempt: any) => {
          // Handle different data types for score
          let scoreValue = 0;
          if (typeof attempt.score === 'number') {
            scoreValue = attempt.score;
          } else if (typeof attempt.score === 'string') {
            scoreValue = parseFloat(attempt.score) || 0;
          }
          return sum + scoreValue;
        }, 0) / total)
      : 0;
    
    return {
      totalAttempts: total,
      passedAttempts: passed,
      averageScore: average.toFixed(1)
    };
  }, [allAttempts]);

  // Format time spent in seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get error message from error object
  const getErrorMessage = (error: any): string => {
    if (!error) return "Unknown error";
    
    if (typeof error === 'string') return error;
    
    if (error.status === 404) {
      return "Test results endpoint not found. Please check if the backend is running and the API is properly configured.";
    }
    
    if (error.status === 401) {
      return "Unauthorized access. Please log in with admin credentials.";
    }
    
    if (error.status === 500) {
      return "Server error. Please try again later.";
    }
    
    if (error.data?.message) {
      return error.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return "Failed to load test results. Please try again.";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading test results...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-500 mb-2">Error Loading Test Results</h3>
          <p className="text-muted-foreground mb-4">{getErrorMessage(error)}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Results</h1>
          <p className="text-muted-foreground">
            View and analyze results from all test attempts
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttempts}</div>
            <p className="text-xs text-muted-foreground">
              All test attempts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalAttempts > 0 ? `${Math.round((stats.passedAttempts / stats.totalAttempts) * 100)}%` : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.passedAttempts} passed out of {stats.totalAttempts}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Across all attempts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Results</CardTitle>
          <CardDescription>
            Search and filter test attempts by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                {/* Using hook-form Input component */}
                <Field.Text
                  name="searchTerm"
                  placeholder="Search by user name, email, or test title..."
                  className="pl-8"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-64">
                {/* Using hook-form Select component */}
                <Field.Select 
                  name="selectedTest"
                  placeholder="Filter by test"
                  onValueChange={(value: string | string[]) => setSelectedTest(Array.isArray(value) ? value[0] : value)}
                  options={[
                    { value: "all", label: "All Tests" },
                    ...allTests.map((test: any) => ({
                      value: test.id,
                      label: test.title
                    }))
                  ]}
                />
              </div>
              
              <div className="flex gap-2">
                {/* Using hook-form Select component */}
                <Field.Select 
                  name="sortBy"
                  placeholder="Sort by"
                  onValueChange={(value: string | string[]) => setSortBy(Array.isArray(value) ? value[0] as "date" | "score" | "name" : value as "date" | "score" | "name")}
                  options={[
                    { value: "date", label: "Date" },
                    { value: "score", label: "Score" },
                    { value: "name", label: "Name" }
                  ]}
                />
                
                <Button 
                  variant="outline" 
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Test Attempts ({filteredAttempts.length} results)</CardTitle>
          <CardDescription>
            Detailed results for all test attempts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAttempts.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No test attempts found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Correct/Total</TableHead>
                  <TableHead>Time Spent</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttempts.map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell>
                      <div className="font-medium">{attempt.user?.name || "Unknown User"}</div>
                      <div className="text-sm text-muted-foreground">{attempt.user?.email || "No email"}</div>
                    </TableCell>
                    <TableCell className="font-medium">{attempt.test?.title || "Unknown Test"}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {typeof attempt.score === 'number' 
                          ? attempt.score.toFixed(1) 
                          : typeof attempt.score === 'string' 
                            ? parseFloat(attempt.score).toFixed(1) 
                            : '0.0'}%
                      </div>
                    </TableCell>
                    <TableCell>
                      {attempt.correctAnswers || 0}/{attempt.totalQuestions || 0}
                    </TableCell>
                    <TableCell>{formatTime(attempt.timeSpent || 0)}</TableCell>
                    <TableCell>
                      {attempt.createdAt ? format(new Date(attempt.createdAt), "MMM d, yyyy h:mm a") : "Unknown date"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={attempt.passed ? "default" : "destructive"}>
                        {attempt.passed ? "Passed" : "Failed"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}