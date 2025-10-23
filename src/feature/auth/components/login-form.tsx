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

// ✅ Zod schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(1, { message: "Password required" })
    .min(8, { message: "Must be at least 8 characters" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log("Form submitted:", values);
    alert("Form submitted successfully!");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

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
              <Field.Text
                name="password"
                label="Password"
                type={passwordVisibility ? "text" : "password"}
                placeholder="Enter your password"
                trailingIcon={
                  passwordVisibility ? (
                    <EyeOff
                      className="h-5 w-5 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <Eye
                      className="h-5 w-5 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  )
                }
                required
              />
            </div>

            {/* Forgot password */}
            <div className="mt-6 text-right">
              <a
                href="#"
                className="text-base font-medium text-black hover:text-gray-800"
              >
                Forgot password?
              </a>
            </div>

            {/* Primary button */}
            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-md transition duration-150 ease-in-out"
            >
              Sign In
            </Button>

            {/* Google Sign-In */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-3 text-lg font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
              onClick={() => alert("Google Sign-In clicked!")}
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
