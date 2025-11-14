"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const error = searchParams.get("error");
      const code = searchParams.get("code");
      const token = searchParams.get("token");
      const refreshToken = searchParams.get("refreshToken");
      const userParam = searchParams.get("user");

      // ✅ If there’s an error, just redirect — LoginForm will show toast
      if (error) {
       router.push(`/auth/sign-in?error=${error}`);
        return;
      }

      if (code) {
        window.location.href = `http://localhost:3000/auth/google/callback?code=${encodeURIComponent(code)}`;
        return;
      }

      if (token && refreshToken && userParam) {
        try {
          const userData = atob(userParam);
          const user = JSON.parse(userData);

          localStorage.setItem("accessToken", token);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("user", userData);

          // Approval & validation checks
          if (user.applicationStatus !== "approved") {
            localStorage.clear();
            router.replace("/auth/sign-in?error=not_approved");
            return;
          }

          if (!user.id || !user.role) {
            localStorage.clear();
            router.replace("/auth/sign-in?error=invalid_user");
            return;
          }

          if (user.role === "super_admin") {
            router.replace("/admin/dashboard");
          } else {
            router.replace("/user/dashboard");
          }
        } catch {
          router.replace("/auth/sign-in?error=invalid_data");
        } finally {
          setLoading(false);
        }
      } else {
        router.replace("/auth/sign-in?error=auth_failed");
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Processing login...</h2>
          <p className="mt-2 text-gray-600">Please wait while we set up your session.</p>
        </div>
      </div>
    );
  }

  return null;
}