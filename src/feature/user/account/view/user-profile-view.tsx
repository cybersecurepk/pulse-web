"use client";

import React from "react";
import { ProfileForm, ProfileFormData } from "@/components/core/profile-form";

export function UserProfileView() {
  const defaultProfileData: ProfileFormData = {
    firstName: "John",
    lastName: "Doe",
    userName: "johndoe123",
    dateOfBirth: new Date("1995-03-15"),
    country: "United States",
    state: "California",
    city: "San Francisco",
    street: "123 Main St",
    zip: "94105",
    phoneNumber: "(+1) 555-0123",
    addressVisibility: "private",
    primaryEmail: "john.doe@email.com",
    secondaryEmail: "john.alternate@email.com",
  };

  const handleSave = async (data: ProfileFormData) => {
    // Custom save logic for user profile
    console.log("Saving user profile:", data);
    // Add your API call here
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDelete = async () => {
    // Custom delete logic for user profile
    console.log("Deleting user profile");
    // Add your API call here
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <ProfileForm
      title="My Profile"
      description="Manage your personal details and avatar."
      storageKey="user-profile-data"
      defaultData={defaultProfileData}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
