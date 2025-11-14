"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProfileViewComponent } from "./profile-view";
import { ProfileFormComponent, ProfileFormData } from "./profile-form";

interface ProfileWrapperProps {
  // Data to display
  profileData: ProfileFormData;
  // Edit mode props
  userId?: string;
  fetchUserData?: (id: string) => Promise<ProfileFormData>;
  onSave?: (data: ProfileFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  // UI props
  title?: string;
  description?: string;
  backUrl?: string;
  // Always show in view mode (no toggle)
  viewOnly?: boolean;
  // Start in edit mode
  startInEditMode?: boolean;
}

function ProfileWrapper({
  profileData,
  userId,
  fetchUserData,
  onSave,
  onDelete,
  title,
  description,
  backUrl,
  viewOnly = false,
  startInEditMode = false,
}: ProfileWrapperProps) {
  const router = useRouter();

  const handleEdit = () => {
    // Navigate to the edit page when userId is provided
    if (userId) {
      // Check if we're in admin or user context based on the current path
      const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      if (isAdminRoute) {
        router.push(`/admin/account/profile/edit/${userId}`);
      } else {
        router.push(`/user/profile/edit/${userId}`);
      }
    }
  };

  // If we're supposed to start in edit mode and have a userId, navigate to edit page
  React.useEffect(() => {
    if (startInEditMode && userId) {
      // Check if we're in admin or user context based on the current path
      const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      if (isAdminRoute) {
        router.push(`/admin/account/profile/edit/${userId}`);
      } else {
        router.push(`/user/profile/edit/${userId}`);
      }
    }
  }, [startInEditMode, userId, router]);

  // Always show the view component (we'll handle edit mode through navigation)
  return (
    <ProfileViewComponent
      data={profileData}
      title={title || "Profile"}
      description={description}
      onEdit={!viewOnly && userId ? handleEdit : undefined}
      showEditButton={!viewOnly && !!userId}
      backUrl={backUrl}
    />
  );
}

// Export all components
export { ProfileWrapper };
export { ProfileViewComponent } from "./profile-view";
export { ProfileFormComponent } from "./profile-form";
export type { ProfileFormData } from "./profile-form";