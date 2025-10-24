"use client";

import React from "react";
import { ProfileForm, ProfileFormData } from "@/components/core/profile-form";

export function MyProfileView() {
  const defaultProfileData: ProfileFormData = {
    firstName: "Luke",
    lastName: "Skywalker",
    userName: "LukeSkywalker212",
    dateOfBirth: new Date("2000-05-04"),
    country: "United States",
    state: "Pennsylvania",
    city: "Essington",
    street: "500 Powhattan Ave",
    zip: "19029",
    phoneNumber: "(+880)1795448106",
    addressVisibility: "followers",
    primaryEmail: "luke.skywalker@email.com",
    secondaryEmail: "luke.alternate@email.com",
  };

  const handleSave = async (data: ProfileFormData) => {
    // Custom save logic for admin profile
    console.log("Saving admin profile:", data);
    // Add your API call here
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDelete = async () => {
    // Custom delete logic for admin profile
    console.log("Deleting admin profile");
    // Add your API call here
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <ProfileForm
      title="Personal Info"
      description="Manage your personal details and avatar."
      storageKey="admin-profile-data"
      defaultData={defaultProfileData}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}

export default MyProfileView;
