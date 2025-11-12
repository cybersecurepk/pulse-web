import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://localhost:3000/";

export const appApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { endpoint }) => {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      console.log('Auth Token:', token ? 'Present' : 'Missing');
      console.log('Endpoint:', endpoint);
      
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