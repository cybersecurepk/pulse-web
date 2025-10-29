import React from "react";
import {
  ProfileFormData,
  ProfileWrapper,
} from "@/components/core/profile-section";
import { fetchUserProfile } from "../data/dummy-admin";

interface MyProfileViewProps {
  userId: string;
}

export async function MyProfileView({ userId }: MyProfileViewProps) {
  const profileData = await fetchUserProfile(userId);

  return (
    <ProfileWrapper
      profileData={profileData}
      userId={userId}
      title="Personal Info"
      description="Manage your personal details and avatar."
    />
  );
}

export default MyProfileView;
