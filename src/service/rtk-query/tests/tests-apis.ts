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
    }),
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
} = testsApi;

//to get tests for users
// // 1. Get user's batch assignments
// const { data: batchUsers } = useGetBatchUsersByUserIdQuery(userId);

// // 2. Extract batch IDs
// const batchIds = batchUsers?.map(bu => bu.batch.id) || [];

// // 3. For each batch, get the assigned tests
// // This would require calling useGetBatchTestsByBatchIdQuery for each batchId