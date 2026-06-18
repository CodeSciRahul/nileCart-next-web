"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUpdateProfile } from "@/hooks/useProfile";
import AvatarUpload from "@/components/account/AvatarUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { serializeStoredImage } from "@/lib/storedImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProfilePage = () => {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const [avatar, setAvatar] = useState(null);
  const [form, setForm] = useState({
    name: "",
    mobileNumber: "",
    gender: "",
    birthday: "",
  });

  useEffect(() => {
    if (!user) return;
    setAvatar(user.avatar ? { url: user.avatar } : null);
    setForm({
      name: user.name || "",
      mobileNumber: user.mobileNumber || "",
      gender: user?.gender || "",
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().slice(0, 10)
        : "",
    });
  }, [user]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAvatarChange = (nextAvatar) => {
    setAvatar(nextAvatar);
    updateProfile.mutate({
      avatar: serializeStoredImage(nextAvatar),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile.mutate({
      name: form.name,
      mobileNumber: form.mobileNumber || undefined,
      gender: form.gender || undefined,
      birthday: form.birthday || undefined,
    });
  };

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-foreground">Profile</h2>
      <p className="mb-6 text-sm text-brand-gray">
        Manage your personal details and preferences.
      </p>

      <div className="mb-8 max-w-lg rounded-xl border border-brand-cream bg-brand-cream/40 p-4">
        <AvatarUpload
          value={avatar}
          displayName={user?.name || user?.email || "User"}
          onChange={handleAvatarChange}
          disabled={updateProfile.isPending}
        />
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <Input value={user?.email || ""} disabled className="bg-brand-cream" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Full name</label>
          <Input
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Mobile number
          </label>
          <div className="flex items-center gap-2">
          <Input
            value={form.mobileNumber}
            onChange={handleChange("mobileNumber")}
            placeholder="10-digit mobile number"
          />
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => {}}>Verify Mobile</Button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Gender</label>
            <Select
              value={form?.gender || undefined}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Birthday</label>
            <Input
              type="date"
              value={form.birthday}
              onChange={handleChange("birthday")}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={updateProfile.isPending}
          className="bg-brand-amber text-brand-white hover:bg-brand-amber/90"
        >
          {updateProfile.isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
