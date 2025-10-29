import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3000/";
export const appApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { endpoint }) => {
      const token = '';
      if (token && endpoint !== "/auth/login") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "Tests",
    "Options",
    "Questions",
    "Users",
    "Batches",
    "Instructors",
    "BatchTests",
    "BatchUsers",
    "BatchInstructors"
  ],
  endpoints: () => ({}),
});
