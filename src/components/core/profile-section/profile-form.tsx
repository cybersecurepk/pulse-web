"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
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
  Save,
  X,
  GraduationCap,
  Briefcase,
  PlusIcon,
  Calendar,
  Monitor,
  Users,
  Shield,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePickerField } from "@/components/core/hook-form/date-picker-field";
import { CITIES } from "@/feature/application/data/constants";
import { YEARS_OF_EDUCATION, DEGREES } from "@/feature/application/data/constants";

const profileSchema = z.object({
  profileImage: z.string().optional(),
  
  // Application form fields - Personal Information
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Gender is required",
  }),
  primaryPhone: z.string().min(1, "Primary phone is required"),
  secondaryPhone: z.string().optional(),
  currentCity: z.string().min(1, "Current city is required"),
  permanentCity: z.string().min(1, "Permanent city is required"),
  email: z.string().email("Invalid email address"),
  
  // Application form fields - Education
  yearsOfEducation: z.enum(["12", "14", "16", "18"], {
    message: "Years of education is required",
  }),
  highestDegree: z.enum(["HSSC", "A-Levels", "BS", "BSc", "MS", "MSc"], {
    message: "Highest degree is required",
  }),
  majors: z.string().min(1, "Majors is required"),
  university: z.string().min(1, "University is required"),
  yearOfCompletion: z.string().min(1, "Year of completion is required"),
  
  // Application form fields - Experience
  totalExperience: z.string().min(1, "Total experience is required"),
  experienceUnit: z.enum(["months", "years"], {
    message: "Experience unit is required",
  }),
  experiences: z.array(z.object({
    organization: z.string().optional(),
    designation: z.string().optional(),
    from: z.date().optional(),
    to: z.date().optional(),
  })).optional(),
  
  // Additional profile information
  workingDays: z.enum(["yes", "no"], {
    message: "Working days preference is required",
  }),
  weekends: z.enum(["yes", "no"], {
    message: "Weekends preference is required",
  }),
  onsiteSessions: z.enum(["yes", "no"], {
    message: "Onsite sessions preference is required",
  }),
  remoteSessions: z.enum(["yes", "no"], {
    message: "Remote sessions preference is required",
  }),
  blueTeam: z.boolean(),
  redTeam: z.boolean(),
  grc: z.boolean(),
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
      // Application form fields - Personal Information
      name: initialData?.name || "",
      gender: initialData?.gender || undefined,
      primaryPhone: initialData?.primaryPhone || "",
      secondaryPhone: initialData?.secondaryPhone || "",
      currentCity: initialData?.currentCity || "",
      permanentCity: initialData?.permanentCity || "",
      email: initialData?.email || "",
      
      // Application form fields - Education
      yearsOfEducation: initialData?.yearsOfEducation || undefined,
      highestDegree: initialData?.highestDegree || undefined,
      majors: initialData?.majors || "",
      university: initialData?.university || "",
      yearOfCompletion: initialData?.yearOfCompletion || "",
      totalExperience: initialData?.totalExperience || "",
      experienceUnit: initialData?.experienceUnit || "years",
      experiences: initialData?.experiences || [],
      workingDays: initialData?.workingDays || "no",
      weekends: initialData?.weekends || "no",
      onsiteSessions: initialData?.onsiteSessions || "no",
      remoteSessions: initialData?.remoteSessions || "no",
      blueTeam: initialData?.blueTeam || false,
      redTeam: initialData?.redTeam || false,
      grc: initialData?.grc || false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
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

  // Determine the title to display
  const displayTitle = title || 
    (isEditMode ? "Edit Profile" : 
     viewOnly ? "View Profile" : 
     isEditing ? "Edit Profile" : 
     "My Profile");

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          {/* {backUrl && (
            <Link href={backUrl}>
              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )} */}
          <IdCard className="h-8 w-8 text-muted-foreground" />
          <h1 className="text-3xl font-bold tracking-tight">
            {displayTitle}
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

              {/* Application Form Fields - Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>

                <Field.Text
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  required
                  disabled={!showEditControls}
                />

                <div className="space-y-2">
                  <Label>
                    Gender<span className="text-destructive">*</span>
                  </Label>
                  {showEditControls ? (
                    <RadioGroup
                      onValueChange={(value) => form.setValue("gender", value as "Male" | "Female" | "Other")}
                      defaultValue={form.getValues("gender")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="p-2 border rounded-md">
                      {profileData.gender}
                    </div>
                  )}
                  {form.formState.errors.gender && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.gender.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field.Text
                    name="primaryPhone"
                    label="Primary Phone"
                    placeholder="+92 300-000-0000"
                    required
                    disabled={!showEditControls}
                  />
                  <Field.Text
                    name="secondaryPhone"
                    label="Secondary Phone"
                    placeholder="+92 300-000-0000"
                    disabled={!showEditControls}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Current City<span className="text-destructive">*</span>
                    </Label>
                    {showEditControls ? (
                      <Select 
                        onValueChange={(value) => form.setValue("currentCity", value)}
                        defaultValue={form.getValues("currentCity")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {CITIES.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 border rounded-md">
                        {profileData.currentCity}
                      </div>
                    )}
                    {form.formState.errors.currentCity && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.currentCity.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Permanent City<span className="text-destructive">*</span>
                    </Label>
                    {showEditControls ? (
                      <Select 
                        onValueChange={(value) => form.setValue("permanentCity", value)}
                        defaultValue={form.getValues("permanentCity")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {CITIES.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 border rounded-md">
                        {profileData.permanentCity}
                      </div>
                    )}
                    {form.formState.errors.permanentCity && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.permanentCity.message}
                      </p>
                    )}
                  </div>
                </div>

                <Field.Text
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={!showEditControls}
                />
              </div>

              <Separator />

              {/* Application Form Fields - Education */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Education</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Years of Education<span className="text-destructive">*</span>
                    </Label>
                    {showEditControls ? (
                      <Select 
                        onValueChange={(value) => form.setValue("yearsOfEducation", value as "12" | "14" | "16" | "18")}
                        defaultValue={form.getValues("yearsOfEducation")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select years" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS_OF_EDUCATION.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 border rounded-md">
                        {profileData.yearsOfEducation}
                      </div>
                    )}
                    {form.formState.errors.yearsOfEducation && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.yearsOfEducation.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Highest Degree<span className="text-destructive">*</span>
                    </Label>
                    {showEditControls ? (
                      <Select 
                        onValueChange={(value) => form.setValue("highestDegree", value as "HSSC" | "A-Levels" | "BS" | "BSc" | "MS" | "MSc")}
                        defaultValue={form.getValues("highestDegree")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEGREES.map((degree) => (
                            <SelectItem key={degree} value={degree}>
                              {degree}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 border rounded-md">
                        {profileData.highestDegree}
                      </div>
                    )}
                    {form.formState.errors.highestDegree && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.highestDegree.message}
                      </p>
                    )}
                  </div>
                </div>

                <Field.Text
                  name="majors"
                  label="Majors"
                  placeholder="e.g., Computer Science"
                  required
                  disabled={!showEditControls}
                />

                <Field.Text
                  name="university"
                  label="University"
                  placeholder="Enter university name"
                  required
                  disabled={!showEditControls}
                />

                <div className="space-y-2">
                  <Label>
                    Year of Completion<span className="text-destructive">*</span>
                  </Label>
                  {showEditControls ? (
                    <Field.Text
                      name="yearOfCompletion"
                      placeholder="Enter year of completion"
                      required
                      disabled={!showEditControls}
                    />
                  ) : (
                    <div className="p-2 border rounded-md">
                      {profileData.yearOfCompletion}
                    </div>
                  )}
                  {form.formState.errors.yearOfCompletion && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.yearOfCompletion.message}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Application Form Fields - Experience */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Experience</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <Field.Text
                      name="totalExperience"
                      label="Total Experience"
                      placeholder="Enter number (e.g., 5)"
                      required
                      disabled={!showEditControls}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <div className="space-y-2">
                      <Label>
                        Unit<span className="text-destructive">*</span>
                      </Label>
                      {showEditControls ? (
                        <Select 
                          onValueChange={(value) => form.setValue("experienceUnit", value as "months" | "years")}
                          defaultValue={form.getValues("experienceUnit")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 border rounded-md">
                          {profileData.experienceUnit}
                        </div>
                      )}
                      {form.formState.errors.experienceUnit && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.experienceUnit.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Experience Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Experience Details</h4>
                    {showEditControls && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ organization: "", designation: "", from: undefined, to: undefined })}
                      >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Experience
                      </Button>
                    )}
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-medium">Experience {index + 1}</h5>
                        {showEditControls && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field.Text
                          name={`experiences.${index}.organization`}
                          label="Organization"
                          placeholder="Enter organization name"
                          disabled={!showEditControls}
                        />
                        <Field.Text
                          name={`experiences.${index}.designation`}
                          label="Designation"
                          placeholder="e.g., Senior Developer"
                          disabled={!showEditControls}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {showEditControls ? (
                          <>
                            <DatePickerField
                              name={`experiences.${index}.from`}
                              label="From"
                              mode="single"
                            />
                            <DatePickerField
                              name={`experiences.${index}.to`}
                              label="To"
                              mode="single"
                            />
                          </>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>From</Label>
                              <div className="p-2 border rounded-md">
                                {form.watch(`experiences.${index}.from`) 
                                  ? format(form.watch(`experiences.${index}.from`)!, 'PPP')
                                  : 'Not provided'}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>To</Label>
                              <div className="p-2 border rounded-md">
                                {form.watch(`experiences.${index}.to`) 
                                  ? format(form.watch(`experiences.${index}.to`)!, 'PPP')
                                  : 'Not provided'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Additional Profile Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Availability</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Working Days<span className="text-destructive">*</span>
                    </Label>
                    {showEditControls ? (
                      <Select 
                        onValueChange={(value) => form.setValue("workingDays", value as "yes" | "no")}
                        defaultValue={form.getValues("workingDays")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 border rounded-md">
                        {profileData.workingDays === "yes" ? "Available" : "Not Available"}
                      </div>
                    )}
                    {form.formState.errors.workingDays && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.workingDays.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Weekends<span className="text-destructive">*</span>
                    </Label>
                    {showEditControls ? (
                      <Select 
                        onValueChange={(value) => form.setValue("weekends", value as "yes" | "no")}
                        defaultValue={form.getValues("weekends")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 border rounded-md">
                        {profileData.weekends === "yes" ? "Available" : "Not Available"}
                      </div>
                    )}
                    {form.formState.errors.weekends && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.weekends.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Onsite Sessions<span className="text-destructive">*</span>
                    </Label>
                    {showEditControls ? (
                      <Select 
                        onValueChange={(value) => form.setValue("onsiteSessions", value as "yes" | "no")}
                        defaultValue={form.getValues("onsiteSessions")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 border rounded-md">
                        {profileData.onsiteSessions === "yes" ? "Available" : "Not Available"}
                      </div>
                    )}
                    {form.formState.errors.onsiteSessions && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.onsiteSessions.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Remote Sessions<span className="text-destructive">*</span>
                    </Label>
                    {showEditControls ? (
                      <Select 
                        onValueChange={(value) => form.setValue("remoteSessions", value as "yes" | "no")}
                        defaultValue={form.getValues("remoteSessions")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 border rounded-md">
                        {profileData.remoteSessions === "yes" ? "Available" : "Not Available"}
                      </div>
                    )}
                    {form.formState.errors.remoteSessions && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.remoteSessions.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Interests & Specializations */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Interests & Specializations</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    {showEditControls ? (
                      <Checkbox
                        id="blueTeam"
                        checked={form.watch("blueTeam")}
                        onCheckedChange={(checked) => form.setValue("blueTeam", !!checked)}
                      />
                    ) : (
                      <div className="flex items-center h-5">
                        {profileData.blueTeam ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 border rounded"></div>
                        )}
                      </div>
                    )}
                    <Label htmlFor="blueTeam">Blue Team</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    {showEditControls ? (
                      <Checkbox
                        id="redTeam"
                        checked={form.watch("redTeam")}
                        onCheckedChange={(checked) => form.setValue("redTeam", !!checked)}
                      />
                    ) : (
                      <div className="flex items-center h-5">
                        {profileData.redTeam ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 border rounded"></div>
                        )}
                      </div>
                    )}
                    <Label htmlFor="redTeam">Red Team</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    {showEditControls ? (
                      <Checkbox
                        id="grc"
                        checked={form.watch("grc")}
                        onCheckedChange={(checked) => form.setValue("grc", !!checked)}
                      />
                    ) : (
                      <div className="flex items-center h-5">
                        {profileData.grc ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 border rounded"></div>
                        )}
                      </div>
                    )}
                    <Label htmlFor="grc">GRC</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              {(isEditing || isEditMode) && !viewOnly && (
                <div className="flex justify-between pt-4">
                  <div className="flex gap-2 ml-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (isEditMode && userId) {
                          router.push(`/admin/account/profile/${userId}`);
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

                    <Button type="submit" disabled={isSaving} className="cursor-pointer">
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