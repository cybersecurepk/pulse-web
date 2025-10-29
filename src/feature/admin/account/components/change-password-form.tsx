"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field } from "@/components/core/hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(12, "Password must be at least 12 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      const password = data.newPassword;
      return (
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
      );
    },
    {
      message: "Password does not meet complexity requirements",
      path: ["newPassword"],
    }
  );

export function ChangePasswordFormView() {
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { handleSubmit, watch } = form;

  const [visibility, setVisibility] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const newPassword = watch("newPassword", "");

  const rules = {
    length: newPassword.length >= 12,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const isValid =
    rules.length && rules.upper && rules.lower && rules.number && rules.special;

  const onSubmit = (data: z.infer<typeof changePasswordSchema>) => {
    console.log("Password changed:", data);
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Change Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Old Password */}
              <Field.Text
                name="oldPassword"
                label="Old Password"
                type={visibility.old ? "text" : "password"}
                placeholder="Enter your old password"
                trailingIcon={
                  visibility.old ? (
                    <EyeOff
                      className="h-5 w-5 cursor-pointer"
                      onClick={() =>
                        setVisibility((s) => ({ ...s, old: !s.old }))
                      }
                    />
                  ) : (
                    <Eye
                      className="h-5 w-5 cursor-pointer"
                      onClick={() =>
                        setVisibility((s) => ({ ...s, old: !s.old }))
                      }
                    />
                  )
                }
                required
              />

              {/* New Password */}
              <div>
                <Field.Text
                  name="newPassword"
                  label="New Password"
                  type={visibility.new ? "text" : "password"}
                  placeholder="Enter your new password"
                  trailingIcon={
                    visibility.new ? (
                      <EyeOff
                        className="h-5 w-5 cursor-pointer"
                        onClick={() =>
                          setVisibility((s) => ({ ...s, new: !s.new }))
                        }
                      />
                    ) : (
                      <Eye
                        className="h-5 w-5 cursor-pointer"
                        onClick={() =>
                          setVisibility((s) => ({ ...s, new: !s.new }))
                        }
                      />
                    )
                  }
                  required
                />

                {/* Password Rules */}
                <div className="mt-3 text-sm">
                  <p
                    className={`${
                      isValid ? "text-green-600" : "text-red-600"
                    } font-medium`}
                  >
                    {isValid
                      ? "Password strength: Strong"
                      : "Please add all necessary characters to create a safe password."}
                  </p>
                  <ul className="mt-1 space-y-1">
                    <RuleItem
                      valid={rules.length}
                      text="Minimum 12 characters"
                    />
                    <RuleItem
                      valid={rules.upper}
                      text="One uppercase character"
                    />
                    <RuleItem
                      valid={rules.lower}
                      text="One lowercase character"
                    />
                    <RuleItem valid={rules.number} text="One number" />
                    <RuleItem
                      valid={rules.special}
                      text="One special character"
                    />
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <Field.Text
                name="confirmPassword"
                label="Confirm New Password"
                type={visibility.confirm ? "text" : "password"}
                placeholder="Re-enter your new password"
                trailingIcon={
                  visibility.confirm ? (
                    <EyeOff
                      className="h-5 w-5 cursor-pointer"
                      onClick={() =>
                        setVisibility((s) => ({ ...s, confirm: !s.confirm }))
                      }
                    />
                  ) : (
                    <Eye
                      className="h-5 w-5 cursor-pointer"
                      onClick={() =>
                        setVisibility((s) => ({ ...s, confirm: !s.confirm }))
                      }
                    />
                  )
                }
                required
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium"
              >
                Change Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function RuleItem({ valid, text }: { valid: boolean; text: string }) {
  return (
    <li
      className={`flex items-center gap-2 ${
        valid ? "text-green-600" : "text-red-500"
      }`}
    >
      {valid ? (
        <CheckCircle2 size={16} />
      ) : (
        <XCircle size={16} className="text-red-400" />
      )}
      <span>{text}</span>
    </li>
  );
}
