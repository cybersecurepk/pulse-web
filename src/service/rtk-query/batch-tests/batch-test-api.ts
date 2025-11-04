import { appApi } from "@/service/rtk-base-api-service";
import { BatchTestPayload, BatchTestResponse } from "./batch-test-type";

const batchTestsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["BatchTests"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getBatchTestById: build.query<BatchTestResponse, string>({
        query: (id) => ({
          url: `/batch-tests/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "BatchTests", id }],
      }),
      getBatchTestsByBatchId: build.query<BatchTestResponse[], string>({
        query: (batchId) => ({
          url: `/batch-tests/list`,
          method: "GET",
          params: { batchId },
        }),
        providesTags: (result, error, batchId) => [
          { type: "BatchTests", id: `batch-${batchId}` },
        ],
      }),
      // New endpoint to get batch tests by user ID
      getBatchTestsByUserId: build.query<BatchTestResponse[], string>({
        query: (userId) => ({
          url: `/batch-tests/list`,
          method: "GET",
          params: { userId },
        }),
        providesTags: (result, error, userId) => [
          { type: "BatchTests", id: `user-${userId}` },
        ],
      }),
      saveBatchTest: build.mutation<BatchTestResponse, BatchTestPayload>({
        query: (payload) => ({
          url: `/batch-tests/save`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: (result, error, { batchId }) => [
          { type: "BatchTests", id: `batch-${batchId}` },
        ],
      }),
      updateBatchTest: build.mutation<
        BatchTestResponse,
        { id: string; payload: BatchTestPayload }
      >({
        query: ({ id, payload }) => ({
          url: `/batch-tests/update/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { payload }) => [
          { type: "BatchTests", id: `batch-${payload.batchId}` },
        ],
      }),
      deleteBatchTest: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/batch-tests/delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: () => [{ type: "BatchTests" }],
      }),
    }),
  });

export const {
  useGetBatchTestByIdQuery,
  useGetBatchTestsByBatchIdQuery,
  useGetBatchTestsByUserIdQuery, // New hook export
  useSaveBatchTestMutation,
  useUpdateBatchTestMutation,
  useDeleteBatchTestMutation,
} = batchTestsApi;