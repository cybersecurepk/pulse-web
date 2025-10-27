import React from "react";
import { ProfileFormComponent } from "@/components/core/profile-section/profile-form";
import { fetchUserProfile } from "../data/dummy-admin";

interface EditProfileViewProps {
  userId: string;
}

export async function EditProfileView({ userId }: EditProfileViewProps) {
  // Fetch the user data on the server side
  const profileData = await fetchUserProfile(userId);

  return (
    <ProfileFormComponent
      userId={userId}
      initialData={profileData}
      title="Edit Profile"
      description="Update your profile information"
      backUrl={`/admin/account/profile?id=${userId}`}
    />
  );
}

export default EditProfileView;
