"use client";

import { Field } from "@/components/core/hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PulseLogo } from "@/layouts/dashboard/pulse-logo";
import { useLoginMutation, useVerifyOtpMutation, useResendOtpMutation } from "@/service/rtk-query/auth/auth-api";
import { OtpVerification } from "./otp-verification";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// ✅ Zod schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address required" })
    .email({ message: "Invalid email format" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const [hasShownError, setHasShownError] = useState(false);

  useEffect(() => {
    // 🔥 Ensure we only show the error once
    if (hasShownError) return;

    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (!error) return;

    // ✅ Mark as shown to prevent duplicate toasts
    setHasShownError(true);

    // ✅ Show toast based on error type
    setTimeout(() => {
      switch (error) {
        case "not_approved":
          toast.error("Account Not Approved: Your account is not approved yet.", { duration: 5000 });
          break;
        case "auth_failed":
          toast.error("Authentication Failed: Failed to authenticate. Please try again.", { duration: 5000 });
          break;
        case "google_auth_failed":
          toast.error("Google Authentication Failed: Failed to sign in with Google. Please try again.", { duration: 5000 });
          break;
        case "invalid_data":
          toast.error("Invalid Data: Received invalid user data. Please try again.", { duration: 5000 });
          break;
        case "invalid_user":
          toast.error("Invalid User: Something went wrong with your account. Please contact support.", { duration: 5000 });
          break;
        case "network_error":
          toast.error("Network Error: Please check your connection and try again.", { duration: 5000 });
          break;
        default:
          toast.error("Error: An unexpected error occurred. Please try again.", { duration: 5000 });
      }

      // ✅ Remove the error param after the toast shows
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      window.history.replaceState({}, document.title, newUrl.toString());
    }, 100); // Small delay to ensure toast system is ready
  }, []); // Empty dependency array


  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const response = await login({ email: values.email }).unwrap();
      setUserEmail(values.email);
      localStorage.setItem("pendingLoginEmail", values.email);
      setShowOtpScreen(true);
      toast.success(response.message || "OTP sent to your email", { duration: 5000 });
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to send OTP. Please try again.", { duration: 5000 });
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const response = await verifyOtp({ email: userEmail, otp }).unwrap();
      
      // Clear any existing logout flag
      sessionStorage.removeItem("isLoggedOut");
      
      // Save tokens and user data
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.removeItem("pendingLoginEmail");

      toast.success("Login successful!", { duration: 5000 });

      // Check if user is an admin (handle multiple admin roles)
      const isAdmin = response.user.role === "super_admin" || response.user.role === "company_admin";
      
      if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Invalid OTP. Please try again.", { duration: 5000 });
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp({ email: userEmail }).unwrap();
      
      toast.success(response.message || "New OTP sent to your email", { duration: 5000 });
    } catch (error: any) {
      
      toast.error(error.data?.message || "Failed to resend OTP.", { duration: 5000 });
    }
  };

  const handleBackToLogin = () => {
    setShowOtpScreen(false);
    setUserEmail("");
    localStorage.removeItem("pendingLoginEmail");
  };

  const handleGoogleSignIn = () => {
    // Clear any existing logout flag before Google login
    sessionStorage.removeItem("isLoggedOut");
    window.location.href = "http://localhost:3000/auth/google/login";
  };

  if (showOtpScreen) {
    return (
      <OtpVerification
        email={userEmail}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onBack={handleBackToLogin}
        isVerifying={isVerifying}
        isResending={isResending}
        className={className}
      />
    );
  }

  return (
    <div className={cn("max-w-lg w-full space-y-8", className)} {...props}>
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        {/* Centered Logo */}
        <div className="flex justify-center mb-4">
          <PulseLogo />
        </div>

        {/* Title */}
        <div className="text-left">
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign In</h2>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-8"
          >
            {/* Input Fields */}
            <div className="space-y-6 text-[1rem]">
              <Field.Text
                name="email"
                label="Email"
                placeholder="your-email@domain.com"
                required
              />
            </div>

            {/* Primary button */}
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 text-lg font-medium bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-md transition duration-150 ease-in-out"
            >
              {isLoggingIn ? "Sending OTP..." : "Continue"}
            </Button>

            {/* Google Sign-In */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-3 text-lg font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
              onClick={handleGoogleSignIn}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
                className="w-6 h-6"
              />
              Sign in with Google
            </Button>

            {/* Footer link */}
            <div className="text-center text-base">
              <p className="text-gray-600">
                Create an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="text-blue-600 hover:text-blue-500 font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}