"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PulseLogo } from "@/layouts/dashboard/pulse-logo";

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
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

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
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Auto-submit when all fields are filled
      if (newOtp.every((digit) => digit !== "") && index === 5) {
        onVerify(newOtp.join(""));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
      setOtp(newOtp.slice(0, 6));
      
      if (pastedData.length === 6) {
        onVerify(pastedData);
      }
    }
  };

  const handleResend = () => {
    onResend();
    setCountdown(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
  };

  const handleSubmit = () => {
    const otpValue = otp.join("");
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
        <div className="mt-8">
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold"
                disabled={isVerifying}
              />
            ))}
          </div>
        </div>

        {/* Verify Button */}
        <div className="mt-6">
          <Button
            onClick={handleSubmit}
            disabled={otp.join("").length !== 6 || isVerifying}
            className="w-full py-3 text-lg font-medium bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-md transition duration-150 ease-in-out"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-base font-medium text-blue-600 hover:text-blue-500"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          ) : (
            <p className="text-sm text-gray-600">
              Resend OTP in <span className="font-medium">{countdown}s</span>
            </p>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-4 text-center">
          <button
            onClick={onBack}
            className="text-base font-medium text-gray-600 hover:text-gray-800"
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
