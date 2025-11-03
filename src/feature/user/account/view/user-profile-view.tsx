"use client";

import React from "react";
// import { useSafeSession } from "@/hooks/use-session";
// import {
//   ProfileFormComponent,
//   ProfileFormData,
// } from "@/components/core/profile-section/profile-form";
// import { useGetUserByIdQuery, useUpdateUserMutation } from "@/service/rtk-query/users/users-apis";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

export function UserProfileView() {
   return <div>User profile View</div>;
  // const { data: session } = useSafeSession();
  // const router = useRouter();
  // const [updateUser] = useUpdateUserMutation();
  
  // // For now, we'll fetch the user data without a specific ID and handle it in the component
  // // In a real app, you'd get the user ID from the session or JWT token
  // const { data: userData, isLoading, isError } = useGetUserByIdQuery('current', {
  //   skip: !session // Skip if no session
  // });

  // const handleSave = async (data: ProfileFormData) => {
  //   try {
  //     if (!userData?.id) {
  //       toast.error("User ID not available");
  //       return;
  //     }
      
  //     // Prepare data for update (only include fields that should be updated)
  //     const updateData = {
  //       name: data.name,
  //       gender: data.gender,
  //       primaryPhone: data.primaryPhone,
  //       secondaryPhone: data.secondaryPhone,
  //       currentCity: data.currentCity,
  //       permanentCity: data.permanentCity,
  //       email: data.email,
  //       yearsOfEducation: data.yearsOfEducation,
  //       highestDegree: data.highestDegree,
  //       majors: data.majors,
  //       university: data.university,
  //       yearOfCompletion: data.yearOfCompletion,
  //       totalExperience: data.totalExperience,
  //       experienceUnit: data.experienceUnit,
  //       experiences: data.experiences?.map(exp => ({
  //         organization: exp.organization,
  //         designation: exp.designation,
  //         from: exp.from ? exp.from.toISOString() : undefined,
  //         to: exp.to ? exp.to.toISOString() : undefined,
  //       })),
  //       // Add required fields with default values
  //       workingDays: "yes",
  //       weekends: "yes",
  //       onsiteSessions: "yes",
  //       remoteSessions: "yes",
  //       blueTeam: false,
  //       redTeam: false,
  //       grc: false,
  //       consent: true,
  //       applicationStatus: "pending" as const,
  //     };
      
  //     await updateUser({ 
  //       id: userData.id, 
  //       payload: updateData 
  //     }).unwrap();
      
  //     toast.success("Profile updated successfully");
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     toast.error("Failed to update profile");
  //   }
  // };

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <p>Loading profile...</p>
  //     </div>
  //   );
  // }

  // if (isError || !userData) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <p>Error loading profile data</p>
  //     </div>
  //   );
  // }

  // // Convert user data to profile form data
  // const profileData: Partial<ProfileFormData> = {
  //   name: userData.name || "",
  //   gender: userData.gender,
  //   primaryPhone: userData.primaryPhone || "",
  //   secondaryPhone: userData.secondaryPhone || "",
  //   currentCity: userData.currentCity || "",
  //   permanentCity: userData.permanentCity || "",
  //   email: userData.email || "",
  //   yearsOfEducation: userData.yearsOfEducation,
  //   highestDegree: userData.highestDegree,
  //   majors: userData.majors || "",
  //   university: userData.university || "",
  //   yearOfCompletion: userData.yearOfCompletion || "",
  //   totalExperience: userData.totalExperience || "",
  //   experienceUnit: userData.experienceUnit || "years",
  //   experiences: userData.experiences?.map(exp => ({
  //     organization: exp.organization,
  //     designation: exp.designation,
  //     from: exp.from ? new Date(exp.from) : undefined,
  //     to: exp.to ? new Date(exp.to) : undefined,
  //   })) || [],
  // };

  // return (
  //   <ProfileFormComponent
  //     initialData={profileData}
  //     onSave={handleSave}
  //     title="My Profile"
  //     description="Manage your personal details and avatar."
  //     backUrl="/user/dashboard"
  //   />
  // );
}