"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/core/hook-form/input-field";
import { DatePickerField } from "@/components/core/hook-form/date-picker-field";
import { RadioGroupField } from "@/components/core/hook-form/radio-field";
import { ConfirmationDialog } from "@/components/core/confirmation-dialog";
import {
  DisplayField,
  DisplayFieldGroup,
} from "@/components/core/display-field";
import { useBoolean } from "@/hooks/use-boolean";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  Camera,
  User,
  IdCard,
  Cake,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  Trash2,
  Info,
} from "lucide-react";

// Form data type
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  userName: string;
  dateOfBirth: Date;
  country: string;
  state: string;
  city: string;
  street: string;
  zip: string;
  phoneNumber: string;
  addressVisibility: string;
  primaryEmail: string;
  secondaryEmail: string;
  profileImage?: string;
}

interface ProfileFormProps {
  title: string;
  description: string;
  storageKey: string;
  defaultData: ProfileFormData;
  onSave?: (data: ProfileFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function ProfileForm({
  title,
  description,
  storageKey,
  defaultData,
  onSave,
  onDelete,
}: ProfileFormProps) {
  // State management hooks
  const {
    value: isEditing,
    onToggle: toggleEdit,
    onFalse: exitEdit,
  } = useBoolean(false);
  const {
    value: showDeleteDialog,
    onTrue: showDelete,
    onFalse: hideDelete,
  } = useBoolean(false);
  const {
    value: isSaving,
    onTrue: startSaving,
    onFalse: stopSaving,
  } = useBoolean(false);

  // Local storage for form data persistence
  const { state: profileData, setState: setProfileData } =
    useLocalStorage<ProfileFormData>(storageKey, defaultData);

  // Form setup
  const form = useForm<ProfileFormData>({
    defaultValues: profileData,
  });

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    startSaving();
    try {
      if (onSave) {
        await onSave(data);
      } else {
        // Default behavior - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setProfileData(data);
      exitEdit();
      // You could add toast notification here
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      stopSaving();
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    try {
      if (onDelete) {
        await onDelete();
      } else {
        // Default behavior - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Reset to default values
        setProfileData({
          firstName: "",
          lastName: "",
          userName: "",
          dateOfBirth: new Date(),
          country: "",
          state: "",
          city: "",
          street: "",
          zip: "",
          phoneNumber: "",
          addressVisibility: "private",
        });
      }
      hideDelete();
      exitEdit();
    } catch (error) {
      console.error("Failed to delete profile:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Personal Info Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
                  <IdCard className="h-6 w-6 text-muted-foreground" />
                  {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exitEdit}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={isSaving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={toggleEdit}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Avatar Upload */}
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer">
                    <AvatarImage src={profileData.profileImage} alt="Profile" />
                    <AvatarFallback className="flex flex-col items-center justify-center text-muted-foreground">
                      <Camera className="h-6 w-6 mb-1" />
                      <span className="text-sm font-medium">Upload Avatar</span>
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Name Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Name</h3>
                  </div>

                  <div className="space-y-3">
                    {/* First Name and Last Name */}
                    <DisplayFieldGroup
                      fields={[
                        { label: "First Name", value: profileData.firstName },
                        { label: "Last Name", value: profileData.lastName },
                      ]}
                      variant="default"
                      onClick={() => console.log("Edit name fields")}
                    />

                    {/* User Name */}
                    <DisplayField
                      label="User Name"
                      value={profileData.userName}
                      variant="default"
                      onClick={() => console.log("Edit username")}
                    />
                  </div>
                </div>

                <Separator />

                {/* Birthday Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Cake className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Birthday</h3>
                  </div>
                  <DisplayField
                    label="Date of Birth"
                    value={profileData.dateOfBirth}
                    variant="default"
                    formatValue={(date) => {
                      if (date instanceof Date) {
                        return date.toLocaleDateString();
                      }
                      return String(date);
                    }}
                    onClick={() => console.log("Edit date of birth")}
                  />
                </div>

                <Separator />

                {/* Address Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Address</h3>
                  </div>

                  <DisplayFieldGroup
                    fields={[
                      { label: "Country", value: profileData.country },
                      { label: "State", value: profileData.state },
                      { label: "City", value: profileData.city },
                      { label: "Street", value: profileData.street },
                      { label: "ZIP", value: profileData.zip },
                    ]}
                    variant="default"
                    onClick={() => console.log("Edit address")}
                  />

                  {/* <RadioGroupField
                    name="addressVisibility"
                    label="Who can see your address?"
                    options={[
                      {
                        value: "private",
                        label: "Only me",
                        description: "Keep your address private",
                      },
                      {
                        value: "followers",
                        label: "Followers only",
                        description: "Visible to your followers",
                      },
                      {
                        value: "public",
                        label: "Everyone",
                        description: "Publicly visible",
                      },
                    ]}
                    direction="horizontal"
                  /> */}
                </div>

                <Separator />

                {/* Phone Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Phone</h3>
                  </div>

                  <DisplayField
                    label="Phone Number"
                    value={profileData.phoneNumber}
                    variant="default"
                    onClick={() => console.log("Edit phone number")}
                  />
                </div>

                <Separator />

                {/* Email Address Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Email Address</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Edit your primary email address for notifications and add an
                    alternate email address for extra security and communication
                    flexibility.
                  </p>

                  <DisplayFieldGroup
                    fields={[
                      {
                        label: "Primary Email",
                        value: profileData.primaryEmail,
                      },
                      {
                        label: "Secondary Email",
                        value: profileData.secondaryEmail,
                      },
                    ]}
                    variant="default"
                    onClick={() => console.log("Edit email addresses")}
                  />

                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Info className="h-4 w-4" />
                    <span>
                      Your alternate email will be used to gain access to your
                      account if you ever have issues with logging in with your
                      primary email.
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={showDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Profile
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={exitEdit}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteDialog}
        message="Are you sure you want to delete your profile? This action cannot be undone and will remove all your personal information."
        onClose={hideDelete}
        onConfirm={handleDeleteProfile}
        loading={isSaving}
      />
    </div>
  );
}
