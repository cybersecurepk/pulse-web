import { appApi } from "@/service/rtk-base-api-service";
import { BatchUserPayload, BatchUserResponse } from "./batch-user-type";

const batchUsersApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["BatchUsers"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getBatchUserById: build.query<BatchUserResponse, string>({
        query: (id) => ({
          url: `/batch-users/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "BatchUsers", id }],
      }),
      getBatchUsersByBatchId: build.query<BatchUserResponse[], string>({
        query: (batchId) => ({
          url: `/batch-users/list`,
          method: "GET",
          params: { batchId },
        }),
        providesTags: (result, error, batchId) => [
          { type: "BatchUsers", id: `batch-${batchId}` },
        ],
      }),
      // New endpoint to get batch users by user ID
      getBatchUsersByUserId: build.query<BatchUserResponse[], string>({
        query: (userId) => ({
          url: `/batch-users/list`,
          method: "GET",
          params: { userId },
        }),
        providesTags: (result, error, userId) => [
          { type: "BatchUsers", id: `user-${userId}` },
        ],
      }),
      saveBatchUser: build.mutation<BatchUserResponse, BatchUserPayload>({
        query: (payload) => ({
          url: `/batch-users/save`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: (result, error, { batchId }) => [
          { type: "BatchUsers", id: `batch-${batchId}` },
        ],
      }),
      updateBatchUser: build.mutation<
        BatchUserResponse,
        { id: string; payload: BatchUserPayload }
      >({
        query: ({ id, payload }) => ({
          url: `/batch-users/update/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { payload }) => [
          { type: "BatchUsers", id: `batch-${payload.batchId}` },
        ],
      }),
      deleteBatchUser: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/batch-users/delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: () => [{ type: "BatchUsers" }],
      }),
    }),
  });

export const {
  useGetBatchUserByIdQuery,
  useGetBatchUsersByBatchIdQuery,
  useGetBatchUsersByUserIdQuery, // New 
  useSaveBatchUserMutation,
  useUpdateBatchUserMutation,
  useDeleteBatchUserMutation,
} = batchUsersApi;