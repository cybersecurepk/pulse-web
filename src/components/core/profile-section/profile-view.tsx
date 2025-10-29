"use client";

import React from "react";
import { IdCard, User, Cake, MapPin, Phone, Mail, Edit3, GraduationCap, Briefcase } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DisplayField,
  DisplayFieldGroup,
} from "@/components/core/display-field";
import { ProfileFormData } from "./profile-form";
import { format } from "date-fns";

interface ProfileViewProps {
  data: ProfileFormData;
  title?: string;
  description?: string;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export function ProfileViewComponent({
  data,
  title = "Profile",
  description = "View your profile information",
  onEdit,
  showEditButton = true,
}: ProfileViewProps) {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <IdCard className="h-8 w-8 text-muted-foreground" />
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        <p className="text-muted-foreground">{description}</p>
        {showEditButton && onEdit && (
          <div className="mt-4">
            <Button onClick={onEdit}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="space-y-8">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 border-2 border-muted">
              <AvatarImage src={data.profileImage} alt="Profile" />
              <AvatarFallback className="text-lg">
                {data.name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Application Form Fields - Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>

            <DisplayField
              label="Full Name"
              value={data.name}
              variant="default"
            />

            <DisplayFieldGroup
              fields={[
                { label: "Gender", value: data.gender },
                { label: "Primary Phone", value: data.primaryPhone },
                { label: "Secondary Phone", value: data.secondaryPhone || "Not provided" },
                { label: "Current City", value: data.currentCity },
                { label: "Permanent City", value: data.permanentCity },
                { label: "Email", value: data.email },
              ]}
              variant="default"
            />
          </div>

          <Separator />

          {/* Application Form Fields - Education */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Education</h3>
            </div>

            <DisplayFieldGroup
              fields={[
                { label: "Years of Education", value: data.yearsOfEducation },
                { label: "Highest Degree", value: data.highestDegree },
                { label: "Majors", value: data.majors },
                { label: "University", value: data.university },
                { label: "Year of Completion", value: data.yearOfCompletion },
              ]}
              variant="default"
            />
          </div>

          <Separator />

          {/* Application Form Fields - Experience */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Experience</h3>
            </div>

            <DisplayField
              label="Total Experience"
              value={`${data.totalExperience} ${data.experienceUnit}`}
              variant="default"
            />

            {/* Experience Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Experience Details</h4>
              
              {data.experiences && data.experiences.length > 0 ? (
                <div className="space-y-4">
                  {data.experiences.map((exp, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <h5 className="text-sm font-medium">Experience {index + 1}</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <DisplayField
                          label="Organization"
                          value={exp.organization || "Not provided"}
                          variant="default"
                        />
                        <DisplayField
                          label="Designation"
                          value={exp.designation || "Not provided"}
                          variant="default"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <DisplayField
                          label="From"
                          value={exp.from ? format(exp.from, 'PPP') : "Not provided"}
                          variant="default"
                        />
                        <DisplayField
                          label="To"
                          value={exp.to ? format(exp.to, 'PPP') : "Not provided"}
                          variant="default"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No experience details provided</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}