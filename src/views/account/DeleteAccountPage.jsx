"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDeleteAccount } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DeleteAccountPage = () => {
  const { user } = useAuth();
  const deleteAccount = useDeleteAccount();
  const [confirmText, setConfirmText] = useState("");

  const canDelete = confirmText.trim().toUpperCase() === "DELETE";

  const handleDelete = () => {
    if (!canDelete) return;
    deleteAccount.mutate();
  };

  return (
    <div className="max-w-xl">
      <h2 className="mb-1 text-xl font-bold text-foreground">Delete Account</h2>
      <p className="mb-6 text-sm text-brand-gray">
        Permanently deactivate your NileCart account.
      </p>

      <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
        <AlertTriangle className="shrink-0 text-red-600" size={22} />
        <div className="text-sm text-red-800">
          <p className="font-semibold">This action cannot be undone</p>
          <p className="mt-1">
            Your account will be deactivated and you will lose access to orders,
            saved addresses, and wishlists linked to{" "}
            <span className="font-medium">{user?.email}</span>.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Type <span className="font-bold text-red-600">DELETE</span> to
            confirm
          </label>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="max-w-xs"
          />
        </div>

        <Button
          type="button"
          variant="destructive"
          disabled={!canDelete || deleteAccount.isPending}
          onClick={handleDelete}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          {deleteAccount.isPending ? "Deleting..." : "Delete my account"}
        </Button>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
