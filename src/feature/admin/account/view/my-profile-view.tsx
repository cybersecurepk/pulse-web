"use client";

import React from "react";
import {
  ProfileFormData,
  ProfileWrapper,
} from "@/components/core/profile-section";
import { useGetUserByIdQuery } from "@/service/rtk-query/users/users-apis";
import { notFound } from "next/navigation";
import { User } from "@/service/rtk-query/users/users-type";

interface MyProfileViewProps {
  userId: string;
}

export function MyProfileView({ userId }: MyProfileViewProps) {
  const { data, isLoading, isError } = useGetUserByIdQuery(userId);

  if (isError) {
    console.error("Error fetching user profile");
    return notFound();
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!data) {
    return notFound();
  }

  // Convert user data to profile form data (including all fields)
  const profileData = {
    name: data.name || "",
    gender: data.gender || "other",
    primaryPhone: data.primaryPhone || "",
    secondaryPhone: data.secondaryPhone || "",
    currentCity: data.currentCity || "",
    permanentCity: data.permanentCity || "",
    email: data.email || "",
    yearsOfEducation: data.yearsOfEducation || "12",
    highestDegree: data.highestDegree || "HSSC",
    majors: data.majors || "",
    university: data.university || "",
    yearOfCompletion: data.yearOfCompletion || "",
    totalExperience: data.totalExperience || "",
    experienceUnit: data.experienceUnit || "years",
    experiences: data.experiences?.map(exp => {
      // Handle date conversion safely
      let from: Date | undefined;
      let to: Date | undefined;
      
      if (exp.from) {
        try {
          from = new Date(exp.from);
        } catch (e) {
          console.warn("Invalid from date:", exp.from);
        }
      }
      
      if (exp.to) {
        try {
          to = new Date(exp.to);
        } catch (e) {
          console.warn("Invalid to date:", exp.to);
        }
      }
      
      return {
        organization: exp.organization,
        designation: exp.designation,
        from,
        to,
      };
    }) || [],
    // Additional profile information
    workingDays: data.workingDays || "no",
    weekends: data.weekends || "no",
    onsiteSessions: data.onsiteSessions || "no",
    remoteSessions: data.remoteSessions || "no",
    blueTeam: data.blueTeam || false,
    redTeam: data.redTeam || false,
    grc: data.grc || false,
  } as ProfileFormData;

  return (
    <ProfileWrapper
      profileData={profileData}
      userId={userId}
      title="My Profile"
      description="Manage your personal details and avatar."
      backUrl="/admin/dashboard"
      viewOnly={false}
    />
  );
}

export default MyProfileView;