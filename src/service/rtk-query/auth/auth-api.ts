import { appApi } from "@/service/rtk-base-api-service";
import { 
  LoginRequest, 
  LoginResponse, 
  VerifyOtpRequest, 
  ResendOtpRequest, 
  AuthResponse 
} from "./auth-type";

const authApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Auth"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      login: build.mutation<LoginResponse, LoginRequest>({
        query: (payload) => ({
          url: "/auth/login",
          body: payload,
          method: "POST",
        }),
      }),
      verifyOtp: build.mutation<AuthResponse, VerifyOtpRequest>({
        query: (payload) => ({
          url: "/auth/verify-otp",
          body: payload,
          method: "POST",
        }),
      }),
      resendOtp: build.mutation<LoginResponse, ResendOtpRequest>({
        query: (payload) => ({
          url: "/auth/resend-otp",
          body: payload,
          method: "POST",
        }),
      }),
    }),
  });

export const { useLoginMutation, useVerifyOtpMutation, useResendOtpMutation } = authApi;
