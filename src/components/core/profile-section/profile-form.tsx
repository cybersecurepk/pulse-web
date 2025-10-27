"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Form } from "@/components/ui/form";
import { Field } from "@/components/core/hook-form";
import { useBoolean } from "@/hooks/use-boolean";
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
} from "lucide-react";

// Validation schema
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  userName: z.string().min(1, "Username is required"),
  dateOfBirth: z.date(),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street is required"),
  zip: z.string().min(1, "ZIP code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  primaryEmail: z.string().email("Invalid email address"),
  secondaryEmail: z.string().optional(),
  profileImage: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export interface ProfileFormProps {
  // Optional userId - if provided, it's edit mode
  userId?: string;
  // Initial data (for create mode or pre-fill)
  initialData?: Partial<ProfileFormData>;
  // Callback to fetch user data (for edit mode)
  fetchUserData?: (id: string) => Promise<ProfileFormData>;
  // Callback when saving
  onSave?: (data: ProfileFormData) => Promise<void>;
  // Callback when deleting
  onDelete?: () => Promise<void>;
  // UI props
  title?: string;
  description?: string;
  backUrl?: string;
  // View mode (read-only)
  viewOnly?: boolean;
  // Optional id field
  id?: string;
  role?: string;
}

export function ProfileFormComponent({
  userId,
  initialData,
  fetchUserData,
  onSave,
  onDelete,
  title,
  description,
  backUrl,
  viewOnly = false,
}: ProfileFormProps) {
  const router = useRouter();
  const isEditMode = !!userId;
  // Only set loading to true if we're in edit mode and need to fetch data
  const [loading, setLoading] = React.useState(isEditMode && !initialData);

  const {
    value: isEditing,
    onToggle: toggleEdit,
    onFalse: exitEdit,
  } = useBoolean(!viewOnly && !isEditMode);

  const {
    value: isSaving,
    onTrue: startSaving,
    onFalse: stopSaving,
  } = useBoolean(false);

  // Form setup
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      userName: initialData?.userName || "",
      dateOfBirth: initialData?.dateOfBirth || new Date(),
      country: initialData?.country || "",
      state: initialData?.state || "",
      city: initialData?.city || "",
      street: initialData?.street || "",
      zip: initialData?.zip || "",
      phoneNumber: initialData?.phoneNumber || "",
      primaryEmail: initialData?.primaryEmail || "",
      secondaryEmail: initialData?.secondaryEmail || "",
    },
  });

  // Load user data if editing and we don't have initialData
  React.useEffect(() => {
    if (!userId || !fetchUserData || initialData) return;

    const loadUserData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserData(userId);
        form.reset(data);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, fetchUserData, form, initialData]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormData) => {
    startSaving();
    try {
      if (onSave) {
        await onSave(data);
      }

      if (isEditMode) {
        router.push(backUrl || "/admin/profiles");
      } else {
        exitEdit();
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      stopSaving();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  const profileData = form.watch();
  const showEditControls = isEditing || isEditMode;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          {backUrl && (
            <Link href={backUrl}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <IdCard className="h-8 w-8 text-muted-foreground" />
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode
              ? "Edit Profile"
              : viewOnly
              ? "View Profile"
              : isEditing
              ? "Edit Profile"
              : "My Profile"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {description ||
            (isEditMode || isEditing
              ? "Update profile information below."
              : "View your profile information.")}
        </p>
      </div>

      <Card>
        <CardHeader className="border-b">
          {/* Empty header with border for visual separation */}
        </CardHeader>

        <CardContent className="space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field.Text
                    name="firstName"
                    label="First Name"
                    placeholder="Enter first name"
                    required
                    disabled={!showEditControls}
                  />
                  <Field.Text
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter last name"
                    required
                    disabled={!showEditControls}
                  />
                </div>

                <Field.Text
                  name="userName"
                  label="User Name"
                  placeholder="Enter username"
                  required
                  disabled={!showEditControls}
                />
              </div>

              <Separator />

              {/* Birthday Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Cake className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Birthday</h3>
                </div>
                {showEditControls ? (
                  <Field.DatePicker
                    name="dateOfBirth"
                    label="Date of Birth"
                    required
                  />
                ) : (
                  <div className="p-2 border rounded-md">
                    {profileData.dateOfBirth?.toLocaleDateString()}
                  </div>
                )}
              </div>

              <Separator />

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Address</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field.Text
                    name="country"
                    label="Country"
                    placeholder="Enter country"
                    required
                    disabled={!showEditControls}
                  />
                  <Field.Text
                    name="state"
                    label="State"
                    placeholder="Enter state"
                    required
                    disabled={!showEditControls}
                  />
                  <Field.Text
                    name="city"
                    label="City"
                    placeholder="Enter city"
                    required
                    disabled={!showEditControls}
                  />
                  <Field.Text
                    name="zip"
                    label="ZIP Code"
                    placeholder="Enter ZIP code"
                    required
                    disabled={!showEditControls}
                  />
                </div>

                <Field.Text
                  name="street"
                  label="Street"
                  placeholder="Enter street address"
                  required
                  disabled={!showEditControls}
                />
              </div>

              <Separator />

              {/* Phone Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Phone</h3>
                </div>

                <Field.Text
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  required
                  disabled={!showEditControls}
                />
              </div>

              <Separator />

              {/* Email Address Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Email Address</h3>
                </div>

                <Field.Text
                  name="primaryEmail"
                  label="Primary Email"
                  type="email"
                  placeholder="Enter primary email"
                  required
                  disabled={!showEditControls}
                />

                <Field.Text
                  name="secondaryEmail"
                  label="Secondary Email (Optional)"
                  type="email"
                  placeholder="Enter secondary email"
                  disabled={!showEditControls}
                />
              </div>

              {/* Action Buttons */}
              {(isEditing || isEditMode) && !viewOnly && (
                <div className="flex justify-between pt-4">
                  <div className="flex gap-2 ml-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (isEditMode && userId) {
                          router.push(`/admin/account/profile?id=${userId}`);
                        } else if (backUrl) {
                          router.push(backUrl);
                        } else {
                          exitEdit();
                        }
                      }}
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
  );
}
