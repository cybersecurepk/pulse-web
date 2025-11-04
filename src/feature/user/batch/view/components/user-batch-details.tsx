"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetBatchByIdQuery } from "@/service/rtk-query/batches/batch-api";

interface UserBatchDetailsProps {
  batchId: string;
}

export function UserBatchDetails({ batchId }: UserBatchDetailsProps) {
  const { data: batch, isLoading } = useGetBatchByIdQuery(batchId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <p>Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center text-muted-foreground">Batch not found</div>
      </div>
    );
  }

  // Status badge styling
  const statusColors: Record<string, string> = {
    pending: "bg-blue-100 text-blue-800",
    on_going: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabel = batch.status === 'on_going' ? 'On Going' : 
                     batch.status.charAt(0).toUpperCase() + batch.status.slice(1);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/user/batch">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Batch Details</h1>
        </div>
        <p className="text-muted-foreground">
          View detailed information about your batch
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{batch.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <span className="font-mono">{batch.batchCode}</span>
                <Separator orientation="vertical" className="h-4" />
                <Badge
                  variant="secondary"
                  className={statusColors[batch.status] || "bg-gray-100 text-gray-800"}
                >
                  {statusLabel}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span>{batch.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Start Date:</span>
                <span>{new Date(batch.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">End Date:</span>
                <span>{new Date(batch.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Max Capacity:</span>
                <span>{batch.maxCapacity}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Session Type:</span>
                <Badge variant="outline">
                  {batch.sessionType.charAt(0).toUpperCase() + batch.sessionType.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Active:</span>
                <Badge variant={batch.isActive ? "default" : "secondary"}>
                  {batch.isActive ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          {batch.description && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-muted-foreground">{batch.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}