import { appApi } from "@/service/rtk-base-api-service";
import { TestPayload, TestResponse, TestScreenshot } from "./tests-type";

const testsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Tests"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getTestById: build.query<TestResponse, string>({
        query: (id) => ({
          url: `/tests/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Tests", id }],
      }),
      getAllTests: build.query<TestResponse[], void>({
        query: () => ({
          url: `/tests/list`,
          method: "GET",
        }),
        providesTags: [{ type: "Tests", id: "tests-list" }],
      }),
      getAllCompanyTests: build.query<TestResponse[], string | undefined>({
        query: (companyId) => ({
          url: `/tests/company/${companyId}`,
          method: "GET",
        }),
        providesTags: [{ type: "Tests", id: "tests-list" }],
      }),
      getAllUserTests: build.query<TestResponse[], string | undefined>({
        query: (userId) => ({
          url: `/tests/user/${userId}`,
          method: "GET",
        }),
        providesTags: [{ type: "Tests", id: "tests-list" }],
      }),
      saveTest: build.mutation<TestResponse, TestPayload>({
        query: (payload) => ({
          url: `/tests/save`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Tests", id: "tests-list" }],
      }),
      updateTest: build.mutation<
        TestResponse,
        { id: string; payload: TestPayload }
      >({
        query: ({ id, payload }) => ({
          url: `/tests/update/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Tests", id },
          { type: "Tests", id: "tests-list" },
        ],
      }),
      deleteTest: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/tests/delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "Tests", id: "tests-list" }],
      }),
      addTestScreenshot: build.mutation<TestScreenshot, { testId: string; imageUrl: string; description?: string }>({
        query: ({ testId, ...payload }) => ({
          url: `/tests/${testId}/screenshots`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: (result, error, { testId }) => [{ type: "Tests", id: testId }],
      }),
      getTestScreenshots: build.query<TestScreenshot[], string>({
        query: (testId) => ({
          url: `/tests/${testId}/screenshots`,
          method: "GET",
        }),
        providesTags: (result, error, testId) => [{ type: "Tests", testId }],
      }),
      getTestForAttempt: build.query<TestResponse, string>({
        query: (testId) => ({
          url: `/tests/${testId}/attempt`,
          method: "GET",
        }),
        providesTags: (result, error, testId) => [{ type: "Tests", id: `attempt-${testId}` }],
      }),
      hasUserAttemptedTest: build.query<boolean, { testId: string; userId: string }>({
        query: ({ testId, userId }) => ({
          url: `/tests/${testId}/user/${userId}/attempted`,
          method: "GET",
        }),
      }),
      getUserTestAttempts: build.query<any[], string>({
        query: (userId) => ({
          url: `/tests/user/${userId}/attempts`,
          method: "GET",
        }),
      }),
      // Admin test results endpoints
      getAllTestAttempts: build.query<any[], void>({
        query: () => {
          console.log('Calling getAllTestAttempts endpoint');
          return {
            url: `/tests/attempts`,
            method: "GET",
          };
        },
      }),
      getTestAttemptsByTestId: build.query<any[], string>({
        query: (testId) => ({
          url: `/tests/${testId}/attempts`,
          method: "GET",
        }),
      }),
      getUnattemptedTestsForUser: build.query<TestResponse[], string>({
        query: (userId) => ({
          url: `/tests/user/${userId}/unattempted`,
          method: "GET",
        }),
      }),
      submitTestAttempt: build.mutation<
        { totalQuestions: number; correctAnswers: number; wrongAnswers: number; score: number; passed: boolean; passingCriteria: number },
        { testId: string; userId: string; answers: Record<string, string>; timeSpent?: number }
      >({
        query: ({ testId, ...payload }) => ({
          url: `/tests/${testId}/submit`,
          method: "POST",
          body: payload,
        }),
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetTestByIdQuery,
  useGetAllTestsQuery,
  useGetAllCompanyTestsQuery,
  useGetAllUserTestsQuery,
  useSaveTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
  useAddTestScreenshotMutation,
  useGetTestScreenshotsQuery,
  useGetTestForAttemptQuery,
  useHasUserAttemptedTestQuery,
  useGetUserTestAttemptsQuery,
  useGetAllTestAttemptsQuery,
  useGetTestAttemptsByTestIdQuery,
  useGetUnattemptedTestsForUserQuery,
  useSubmitTestAttemptMutation,
} = testsApi;
