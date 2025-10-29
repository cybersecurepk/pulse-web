import { appApi } from "@/service/rtk-base-api-service";
import { BatchInstructorPayload, BatchInstructorResponse } from "./batch-instructor-type";

const batchInstructorsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["BatchInstructors"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getBatchInstructorById: build.query<BatchInstructorResponse, string>({
        query: (id) => ({
          url: `/batch-instructors/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "BatchInstructors", id }],
      }),
      getBatchInstructorsByBatchId: build.query<BatchInstructorResponse[], string>({
        query: (batchId) => ({
          url: `/batch-instructors/list`,
          method: "GET",
          params: { batchId },
        }),
        providesTags: (result, error, batchId) => [
          { type: "BatchInstructors", id: `batch-${batchId}` },
        ],
      }),
      saveBatchInstructor: build.mutation<
        BatchInstructorResponse,
        BatchInstructorPayload
      >({
        query: (payload) => ({
          url: `/batch-instructors/save`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: (result, error, { batchId }) => [
          { type: "BatchInstructors", id: `batch-${batchId}` },
        ],
      }),
      updateBatchInstructor: build.mutation<
        BatchInstructorResponse,
        { id: string; payload: BatchInstructorPayload }
      >({
        query: ({ id, payload }) => ({
          url: `/batch-instructors/update/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { payload }) => [
          { type: "BatchInstructors", id: `batch-${payload.batchId}` },
        ],
      }),
      deleteBatchInstructor: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/batch-instructors/delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: () => [{ type: "BatchInstructors" }],
      }),
    }),
  });

export const {
  useGetBatchInstructorByIdQuery,
  useGetBatchInstructorsByBatchIdQuery,
  useSaveBatchInstructorMutation,
  useUpdateBatchInstructorMutation,
  useDeleteBatchInstructorMutation,
} = batchInstructorsApi;

