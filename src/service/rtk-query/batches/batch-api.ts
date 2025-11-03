import { appApi } from "@/service/rtk-base-api-service";
import { BatchPayload, BatchResponse } from "./batch-type";

const batchesApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Batches"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getBatchById: build.query<BatchResponse, string>({
        query: (id) => ({
          url: `/batches/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Batches", id }],
      }),
      getAllBatches: build.query<BatchResponse[], void>({
        query: () => ({
          url: `/batches/list`,
          method: "GET",
        }),
        providesTags: [{ type: "Batches", id: "batches-list" }],
      }),
      // New endpoint to get batches by user ID
      getBatchesByUserId: build.query<BatchResponse[], string>({
        query: (userId) => ({
          url: `/batches/list`,
          method: "GET",
          params: { userId },
        }),
        providesTags: (result, error, userId) => [
          { type: "Batches", id: `user-${userId}` },
        ],
      }),
      saveBatch: build.mutation<BatchResponse, BatchPayload>({
        query: (payload) => ({
          url: `/batches/save`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Batches", id: "batches-list" }],
      }),
      updateBatch: build.mutation<
        BatchResponse,
        { id: string; payload: BatchPayload }
      >({
        query: ({ id, payload }) => ({
          url: `/batches/update/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Batches", id },
          { type: "Batches", id: "batches-list" },
        ],
      }),
      deleteBatch: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/batches/delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "Batches", id: "batches-list" }],
      }),
    }),
  });

export const {
  useGetBatchByIdQuery,
  useGetAllBatchesQuery,
  useGetBatchesByUserIdQuery, // New hook export
  useSaveBatchMutation,
  useUpdateBatchMutation,
  useDeleteBatchMutation,
} = batchesApi;