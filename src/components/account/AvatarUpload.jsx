"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { UPLOAD_FOLDERS, ACCEPT_IMAGE_INPUT } from "@/lib/uploadConstants";
import { getImageUrl, toStoredImage } from "@/lib/storedImage";
import { validateImageFile } from "@/services/uploadService";
import { Button } from "@/components/ui/button";

const AvatarUpload = ({
  value,
  displayName = "User",
  onChange,
  disabled = false,
}) => {
  const inputRef = useRef(null);
  const [localError, setLocalError] = useState(null);
  const { upload, isUploading, progress, error, reset } = useImageUpload({
    folder: UPLOAD_FOLDERS.PROFILES,
  });

  const imageUrl = getImageUrl(value);
  const initial = displayName.charAt(0).toUpperCase();
  const displayError = localError || error;

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setLocalError(validation.message);
      return;
    }

    setLocalError(null);
    reset();

    try {
      const result = await upload(file);
      onChange?.(toStoredImage(result));
    } catch (err) {
      setLocalError(err.message || "Could not upload photo.");
    }
  };

  const handleRemove = () => {
    setLocalError(null);
    reset();
    onChange?.(null);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative shrink-0">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-brand-amber/30 bg-brand-cream shadow-sm ring-4 ring-brand-amber/10">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-brand-amber">{initial}</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
          className="cursor-pointer absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-white bg-brand-amber text-foreground shadow-md transition hover:scale-105 disabled:opacity-60"
          aria-label="Change profile photo"
        >
          {isUploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Camera size={14} />
          )}
        </button>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Profile photo</p>
          <p className="text-xs text-brand-gray">
            JPG, PNG or WEBP. Square photos work best.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || isUploading}
            className="cursor-pointer border-brand-amber/30"
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="mr-1.5 animate-spin" />
                Uploading {progress}%
              </>
            ) : (
              <>
                <User size={14} className="mr-1.5" />
                {imageUrl ? "Change photo" : "Upload photo"}
              </>
            )}
          </Button>

          {imageUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="cursor-pointer border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} className="mr-1.5" />
              Remove
            </Button>
          )}
        </div>

        {displayError && (
          <p className="text-sm text-red-600">{displayError}</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_IMAGE_INPUT}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
    </div>
  );
};

export default AvatarUpload;
