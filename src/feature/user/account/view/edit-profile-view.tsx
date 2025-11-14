"use client";

import React from "react";
import { ProfileFormComponent } from "@/components/core/profile-section/profile-form";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/service/rtk-query/users/users-apis";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "@/service/rtk-query/users/users-type";

interface EditProfileViewProps {
  userId: string;
}

export function EditProfileView({ userId }: EditProfileViewProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetUserByIdQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

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

  // Convert user data to profile form data
  const profileData: any = {
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
    experiences: data.experiences?.map((exp: any) => {
      // Handle date conversion safely
      let from;
      let to;
      
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
  };

  const handleSave = async (formData: any) => {
    try {
      // Convert form data to API payload format
      const payload: any = {
        name: formData.name,
        gender: formData.gender,
        primaryPhone: formData.primaryPhone,
        secondaryPhone: formData.secondaryPhone,
        currentCity: formData.currentCity,
        permanentCity: formData.permanentCity,
        email: formData.email,
        yearsOfEducation: formData.yearsOfEducation,
        highestDegree: formData.highestDegree,
        majors: formData.majors,
        university: formData.university,
        yearOfCompletion: formData.yearOfCompletion,
        totalExperience: formData.totalExperience,
        experienceUnit: formData.experienceUnit,
        experiences: formData.experiences?.map((exp: any) => ({
          organization: exp.organization,
          designation: exp.designation,
          from: exp.from instanceof Date ? exp.from.toISOString() : exp.from,
          to: exp.to instanceof Date ? exp.to.toISOString() : exp.to,
        })) || [],
        workingDays: formData.workingDays,
        weekends: formData.weekends,
        onsiteSessions: formData.onsiteSessions,
        remoteSessions: formData.remoteSessions,
        blueTeam: formData.blueTeam,
        redTeam: formData.redTeam,
        grc: formData.grc,
        // Explicitly preserve role and application status to prevent unintended changes
        role: (data as User).role,
        applicationStatus: (data as User).applicationStatus,
      };

      await updateUser({ id: userId, payload }).unwrap();
      toast.success("Profile updated successfully");
      // Navigate back to the profile page - the cache will be invalidated and data refreshed
      router.push(`/user/profile/${userId}`);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <ProfileFormComponent
      userId={userId}
      initialData={profileData}
      onSave={handleSave}
      title="Edit Profile"
      description="Update your profile information"
      backUrl={`/user/profile/${userId}`}
    />
  );
}

export default EditProfileView;