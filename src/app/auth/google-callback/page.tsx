"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const userParam = searchParams.get("user");

    if (token && refreshToken && userParam) {
      try {
        // Decode user data from base64
        const userData = JSON.parse(atob(decodeURIComponent(userParam)));
        
        // Store tokens and user data in localStorage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect based on user role
        if (userData.role === "admin" || userData.role === "super_admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      } catch (error) {
        console.error("Error processing user data:", error);
        router.push("/auth/sign-in?error=invalid_data");
      }
    } else {
      // If no token, redirect to sign in page
      router.push("/auth/sign-in");
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Processing login...</h2>
        <p className="mt-2 text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Processing login...</h2>
          <p className="mt-2 text-gray-600">Please wait while we redirect you.</p>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}