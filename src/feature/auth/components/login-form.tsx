"use client";

import { Field } from "@/components/core/hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PulseLogo } from "@/layouts/dashboard/pulse-logo";
import { useLoginMutation, useVerifyOtpMutation, useResendOtpMutation } from "@/service/rtk-query/auth/auth-api";
import { OtpVerification } from "./otp-verification";
import { useRouter } from "next/navigation";
import { useToast } from "../../../hooks/use-toast";

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
  const { toast } = useToast();

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const response = await login({ email: values.email }).unwrap();
      setUserEmail(values.email);
      localStorage.setItem("pendingLoginEmail", values.email);
      setShowOtpScreen(true);
      toast({
        title: "Success",
        description: response.message || "OTP sent to your email",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const response = await verifyOtp({ email: userEmail, otp }).unwrap();
      
      // Save tokens and user data
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.removeItem("pendingLoginEmail");

      toast({
        title: "Success",
        description: "Login successful!",
      });

      // Redirect based on role
      if (response.user.role === "admin" || response.user.role === "super_admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp({ email: userEmail }).unwrap();
      toast({
        title: "Success",
        description: response.message || "New OTP sent to your email",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to resend OTP.",
        variant: "destructive",
      });
    }
  };

  const handleBackToLogin = () => {
    setShowOtpScreen(false);
    setUserEmail("");
    localStorage.removeItem("pendingLoginEmail");
  };

  const handleGoogleSignIn = () => {
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