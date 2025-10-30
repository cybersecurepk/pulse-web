"use client";

import { useGetUserByIdQuery } from "@/service/rtk-query/users/users-apis";
import { notFound } from "next/navigation";
import { ProfileWrapper } from "@/components/core/profile-section";
import { ProfileFormData } from "@/components/core/profile-section";

interface ApplicationDetailsViewProps {
  params: { id: string };
}

export function ApplicationDetailsView({ params }: ApplicationDetailsViewProps) {
  const { data, isLoading, isError } = useGetUserByIdQuery(params.id);

  if (isError) return notFound();
  
  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  // Convert user data to profile form data
  const profileData: ProfileFormData = {
    name: data?.name || "",
    gender: data?.gender || "other", // Provide default value
    primaryPhone: data?.primaryPhone || "",
    secondaryPhone: data?.secondaryPhone || "",
    currentCity: data?.currentCity || "",
    permanentCity: data?.permanentCity || "",
    email: data?.email || "",
    yearsOfEducation: data?.yearsOfEducation || "12", // Provide default value
    highestDegree: data?.highestDegree || "HSSC", // Provide default value
    majors: data?.majors || "",
    university: data?.university || "",
    yearOfCompletion: data?.yearOfCompletion || "",
    totalExperience: data?.totalExperience || "",
    experienceUnit: data?.experienceUnit || "years",
    experiences: data?.experiences?.map(exp => ({
      organization: exp.organization,
      designation: exp.designation,
      from: exp.from ? new Date(exp.from) : undefined,
      to: exp.to ? new Date(exp.to) : undefined,
    })) || [],
  };

  return (
    <div className="p-4">
      <ProfileWrapper 
        profileData={profileData} 
        title="Applicant Details"
        description="View the applicant's profile information"
        backUrl="/admin/applications"
        viewOnly={true}
      />
    </div>
  );
}