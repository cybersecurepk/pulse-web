"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/core/hook-form";
import { Form } from "@/components/ui/form";
import { PulseLogo } from "@/layouts/dashboard/pulse-logo";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = React.ComponentProps<"div">;

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    phone: z.string().optional(),
    address: z.string().optional(),
    adminPassword: z.string().min(6, "Password must be 6+ chars"),
    confirmPassword: z.string().min(1, "Confirm password"),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignUpForm({ className, ...props }: Props) {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      adminPassword: "",
      confirmPassword: "",
    },
  });
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    // replace with real API call
    console.log("Sign up values:", values);
    alert("Sign up submitted (replace with API)");
    form.reset();
  };

  return (
    <div className={cn("max-w-lg w-full space-y-8", className)} {...props}>
      <Card className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-center mb-4">
          <PulseLogo />
        </div>
        <CardHeader className="text-center">
          <CardTitle className="mt-2 text-2xl font-bold text-gray-900">
            Sign Up
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-1">
            Create your account to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4 text-[1rem]">
                <Field.Text
                  name="name"
                  label="Name"
                  placeholder="Your full name"
                  required
                />

                <Field.Text
                  name="email"
                  label="Email"
                  placeholder="your-email@domain.com"
                  required
                />

                <Field.Text
                  name="phone"
                  label="Phone Number"
                  placeholder="+1 234 567 8900"
                  required
                />

                <Field.Text
                  name="address"
                  label="Location"
                  placeholder="City, Country"
                />

                <Field.Text
                  name="adminPassword"
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

                <Field.Text
                  name="confirmPassword"
                  label="Confirm Password"
                  type={passwordVisibility ? "text" : "password"}
                  placeholder="Re-enter your password"
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

              {/* form-level errors (if any) */}
              {form.formState.errors && form.formState.errors.root && (
                <div className="text-sm text-red-600 font-medium">
                  {String(form.formState.errors.root.message)}
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-3 text-lg font-medium bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-md transition duration-150 ease-in-out"
              >
                {form.formState.isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>

              <div className="text-center text-base">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/auth/sign-in"
                    className="text-blue-600 hover:text-blue-500 font-semibold"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
