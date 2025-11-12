"use client";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/core/hook-form";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PulseLogo } from "@/layouts/dashboard/pulse-logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { ArrowLeft, RefreshCw } from "lucide-react";

const otpSchema = z.object({
  digit1: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  digit2: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  digit3: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  digit4: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  digit5: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
  digit6: z.string().length(1, "Required").regex(/^\d$/, "Must be a digit"),
});

interface OtpVerificationProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
  isVerifying: boolean;
  isResending: boolean;
  className?: string;
}

export function OtpVerification({
  email,
  onVerify,
  onResend,
  onBack,
  isVerifying,
  isResending,
  className,
}: OtpVerificationProps) {
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
      digit5: "",
      digit6: "",
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const fieldName = `digit${index + 1}` as keyof z.infer<typeof otpSchema>;
      form.setValue(fieldName, value);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Auto-submit when all fields are filled
      const values = form.getValues();
      const allFilled = Object.values(values).every((v) => v !== "");
      if (allFilled && index === 5) {
        const otpValue = Object.values(values).join("");
        onVerify(otpValue);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const fieldName = `digit${index + 1}` as keyof z.infer<typeof otpSchema>;
    if (e.key === "Backspace" && !form.getValues(fieldName) && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("");
      digits.forEach((digit, idx) => {
        if (idx < 6) {
          const fieldName = `digit${idx + 1}` as keyof z.infer<typeof otpSchema>;
          form.setValue(fieldName, digit);
        }
      });
      
      if (pastedData.length === 6) {
        onVerify(pastedData);
      }
    }
  };

  const handleResend = () => {
    onResend();
    setCountdown(60);
    setCanResend(false);
    form.reset();
  };

  const handleSubmit = () => {
    const values = form.getValues();
    const otpValue = Object.values(values).join("");
    if (otpValue.length === 6) {
      onVerify(otpValue);
    }
  };

  return (
    <div className={cn("max-w-lg w-full space-y-8", className)}>
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        {/* Centered Logo */}
        <div className="flex justify-center mb-4">
          <PulseLogo />
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit code to <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <Form {...form}>
          <div className="mt-8">
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <Field.Text
                  key={num}
                  name={`digit${num}` as keyof z.infer<typeof otpSchema>}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold"
                  disabled={isVerifying}
                  hideError
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              disabled={!form.formState.isValid || isVerifying}
              className="w-full py-3 text-lg font-medium bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-md transition duration-150 ease-in-out"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </Form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          {canResend ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={isResending}
              className="text-base font-medium text-blue-600 hover:text-blue-500 hover:bg-blue-50"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isResending && "animate-spin")} />
              {isResending ? "Resending..." : "Resend OTP"}
            </Button>
          ) : (
            <p className="text-sm text-gray-600">
              Resend OTP in <span className="font-medium">{countdown}s</span>
            </p>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="text-base font-medium text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
}
