"use client";

import React from "react";
import { CustomBreadcrumbs } from "@/components/core/custom-breadcrumbs";
import Button from "@/components/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EditPageLayoutProps {
  title: string;
  breadcrumbs: { name: string; href?: string }[];
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function EditPageLayout({
  title,
  breadcrumbs,
  children,
  headerContent,
  onSave,
  onCancel,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  loading,
}: EditPageLayoutProps) {
  return (
    <div className="space-y-4">
      <CustomBreadcrumbs heading={title} links={breadcrumbs} />

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {/* 👇 Optional profile/info header */}
          {headerContent && <div className="mt-2">{headerContent}</div>}
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave?.();
            }}
            className="space-y-6"
          >
            {children}

            <div className="flex justify-end gap-3 pt-4 border-t">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                >
                  {cancelLabel}
                </Button>
              )}
              {onSave && (
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={loading}
                >
                  {saveLabel}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
