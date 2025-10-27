"use client";

import React from "react";
import { IdCard, User, Cake, MapPin, Phone, Mail, Edit3 } from "lucide-react";
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
                {data.firstName?.[0]}
                {data.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Name</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Edit your name here if you wish to make any changes. You can also
              edit your user name which will be shown publicly.
            </p>

            <div className="space-y-3">
              {/* First and Last Name in one box */}
              <DisplayFieldGroup
                fields={[
                  { label: "First Name", value: data.firstName },
                  { label: "Last Name", value: data.lastName },
                ]}
                variant="default"
                size="default"
                spacing="sm"
              />

              {/* User Name in separate box */}
              <DisplayField
                label="User Name"
                value={data.userName}
                variant="default"
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
              label="Date"
              value={data.dateOfBirth}
              variant="default"
              formatValue={(value) => {
                if (value instanceof Date) {
                  return value.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                }
                return String(value);
              }}
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
                { label: "Country", value: data.country },
                { label: "State", value: data.state },
                { label: "City", value: data.city },
                { label: "Street", value: data.street },
                { label: "ZIP", value: data.zip },
              ]}
              variant="default"
            />
          </div>

          <Separator />

          {/* Phone Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Phone</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Keep your contact number up to date.
            </p>

            <DisplayField
              label="Phone Number"
              value={data.phoneNumber}
              variant="default"
            />
          </div>

          <Separator />

          {/* Email Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Email Address</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage your email addresses for notifications and account
              recovery.
            </p>

            <DisplayFieldGroup
              fields={[
                { label: "Primary Email", value: data.primaryEmail },
                {
                  label: "Secondary Email",
                  value: data.secondaryEmail || "Not provided",
                },
              ]}
              variant="default"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
