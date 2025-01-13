import React from "react";
import {
  AlertDialog as ShadcnAlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface AlertDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
}) => {
  return (
    <ShadcnAlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <p>{message}</p>
        <div className="flex justify-end gap-2 mt-4">
          <AlertDialogCancel asChild>
            <button className="text-gray-500">Fortryd</button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Slet
            </button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </ShadcnAlertDialog>
  );
};

export default AlertDialog;
