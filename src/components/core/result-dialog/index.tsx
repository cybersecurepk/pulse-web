"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

export type ResultType = "success" | "error" | "warning" | "info";

export interface ResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: ResultType;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
  onCancel?: () => void;
  showCancel?: boolean;
}

const iconMap = {
  success: <CheckCircle className="h-6 w-6 text-green-600" />,
  error: <XCircle className="h-6 w-6 text-red-600" />,
  warning: <AlertCircle className="h-6 w-6 text-yellow-600" />,
  info: <Info className="h-6 w-6 text-blue-600" />,
};

export function ResultDialog({
  open,
  onOpenChange,
  type = "info",
  title,
  description,
  children,
  confirmText = "OK",
  onConfirm,
  cancelText = "Cancel",
  onCancel,
  showCancel = false,
}: ResultDialogProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {iconMap[type]}
            <span>{title}</span>
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children && <div className="py-4">{children}</div>}

        <DialogFooter className={showCancel ? "sm:justify-between" : ""}>
          {showCancel && (
            <Button variant="outline" onClick={handleCancel}>
              {cancelText}
            </Button>
          )}
          <Button onClick={handleConfirm} className={showCancel ? "" : "w-full"}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
