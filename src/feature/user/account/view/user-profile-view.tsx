"use client";

import React from "react";
import { useSafeSession } from "@/hooks/use-session";
import {
  ProfileWrapper,
  ProfileFormData,
} from "@/components/core/profile-section";
import { useGetUserByIdQuery } from "@/service/rtk-query/users/users-apis";
import { notFound } from "next/navigation";

export function UserProfileView() {
  const { data: session, status } = useSafeSession();
  
  // Fetch user data using the user ID from session
  const { data: userData, isLoading, isError } = useGetUserByIdQuery(session?.user?.id || '', {
    skip: !session?.user?.id || status !== 'authenticated'
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user?.id || isError || !userData) {
    return notFound();
  }

  // Convert user data to profile form data
  const profileData: ProfileFormData = {
    name: userData.name || "",
    gender: userData.gender || "other",
    primaryPhone: userData.primaryPhone || "",
    secondaryPhone: userData.secondaryPhone || "",
    currentCity: userData.currentCity || "",
    permanentCity: userData.permanentCity || "",
    email: userData.email || "",
    yearsOfEducation: userData.yearsOfEducation || "12",
    highestDegree: userData.highestDegree || "HSSC",
    majors: userData.majors || "",
    university: userData.university || "",
    yearOfCompletion: userData.yearOfCompletion || "",
    totalExperience: userData.totalExperience || "",
    experienceUnit: userData.experienceUnit || "years",
    experiences: userData.experiences?.map(exp => ({
      organization: exp.organization,
      designation: exp.designation,
      from: exp.from ? new Date(exp.from) : undefined,
      to: exp.to ? new Date(exp.to) : undefined,
    })) || [],
    workingDays: userData.workingDays || "no",
    weekends: userData.weekends || "no",
    onsiteSessions: userData.onsiteSessions || "no",
    remoteSessions: userData.remoteSessions || "no",
    blueTeam: userData.blueTeam || false,
    redTeam: userData.redTeam || false,
    grc: userData.grc || false,
  };

  return (
    <ProfileWrapper
      profileData={profileData}
      userId={userData.id}
      title="My Profile"
      description="Manage your personal details and avatar."
    />
  );
}
