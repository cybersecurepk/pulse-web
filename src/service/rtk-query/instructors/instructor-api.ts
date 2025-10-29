import { appApi } from "@/service/rtk-base-api-service";
import { InstructorPayload, InstructorResponse } from "./instructor-type";

const instructorsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Instructors"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getInstructorById: build.query<InstructorResponse, string>({
        query: (id) => ({
          url: `/instructors/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: "Instructors", id }],
      }),
      getAllInstructors: build.query<InstructorResponse[], void>({
        query: () => ({
          url: `/instructors/list`,
          method: "GET",
        }),
        providesTags: [{ type: "Instructors", id: "instructors-list" }],
      }),
      saveInstructor: build.mutation<InstructorResponse, InstructorPayload>({
        query: (payload) => ({
          url: `/instructors/save`,
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: "Instructors", id: "instructors-list" }],
      }),
      updateInstructor: build.mutation<
        InstructorResponse,
        { id: string; payload: InstructorPayload }
      >({
        query: ({ id, payload }) => ({
          url: `/instructors/update/${id}`,
          method: "PUT",
          body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Instructors", id },
          { type: "Instructors", id: "instructors-list" },
        ],
      }),
      deleteInstructor: build.mutation<{ id: string }, string>({
        query: (id) => ({
          url: `/instructors/delete/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "Instructors", id: "instructors-list" }],
      }),
    }),
  });

export const {
  useGetInstructorByIdQuery,
  useGetAllInstructorsQuery,
  useSaveInstructorMutation,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
} = instructorsApi;

