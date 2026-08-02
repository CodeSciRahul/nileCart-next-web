"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Building2, Home, MapPin } from "lucide-react";

import { useCreateAddress } from "@/hooks/useAddresses";
import { useAuth } from "@/context/AuthContext";
import { useAuthGate } from "@/context/AuthGateContext";
import { AUTH_ACTIONS } from "@/lib/authActions";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, "Enter valid mobile number"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter valid pincode"),
  addressLine: z.string().min(5, "Address is required"),
  locality: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string(),
  addressType: z.enum(["Home", "Work", "Other"]),
  isDefault: z.boolean(),
});

const ADDRESS_TYPES = [
  { value: "Home", icon: Home },
  { value: "Work", icon: Briefcase },
  { value: "Other", icon: Building2 },
];

function Field({ label, error, children, className = "" }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gray">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

const fieldControlClass =
  "h-10 rounded-none border-brand-amber/25 bg-brand-white focus-visible:border-brand-amber focus-visible:ring-brand-amber/25";

const AddressModal = ({ open, onClose, onSuccess }) => {
  const createAddressMutation = useCreateAddress();
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthGate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      pincode: "",
      addressLine: "",
      locality: "",
      city: "",
      state: "",
      country: "Uganda",
      addressType: "Home",
      isDefault: false,
    },
  });

  const onSubmit = async (data) => {
    const run = () => {
      createAddressMutation.mutate(data, {
        onSuccess: () => {
          reset();
          onClose();
          onSuccess?.();
        },
      });
    };

    if (isAuthenticated) {
      run();
      return;
    }

    await requireAuth({
      action: AUTH_ACTIONS.SAVE_ADDRESS,
      onSuccess: run,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        overlayClassName="bg-black/45 supports-backdrop-filter:backdrop-blur-sm"
        className="max-h-[90vh] gap-0 overflow-hidden rounded-none border-0 bg-brand-white p-0 ring-1 ring-brand-amber/20 sm:max-w-lg"
      >
        <DialogHeader className="border-b border-brand-amber/15 bg-brand-cream/60 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3 pr-8">
            <span className="flex size-10 shrink-0 items-center justify-center bg-brand-amber text-foreground">
              <MapPin size={18} strokeWidth={2.25} />
            </span>
            <div>
              <DialogTitle className="text-lg font-black tracking-tight text-foreground">
                Add New Address
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-brand-gray">
                We’ll use this for delivery and order updates.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          id="address-form"
          onSubmit={handleSubmit(onSubmit)}
          className="max-h-[min(60vh,520px)] space-y-4 overflow-y-auto px-5 py-5 sm:px-6"
        >
          <Field label="Full Name" error={errors.fullName?.message}>
            <Input
              placeholder="James Mukasa"
              className={fieldControlClass}
              {...register("fullName")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mobile Number" error={errors.mobileNumber?.message}>
              <Input
                placeholder="0772123456"
                className={fieldControlClass}
                {...register("mobileNumber")}
              />
            </Field>
            <Field label="Pincode" error={errors.pincode?.message}>
              <Input
                placeholder="256002"
                className={fieldControlClass}
                {...register("pincode")}
              />
            </Field>
          </div>

          <Field label="Address" error={errors.addressLine?.message}>
            <Textarea
              rows={3}
              placeholder="Plot 15, Kampala Road, Nakasero"
              className={cn(
                fieldControlClass,
                "min-h-22 resize-none py-2.5"
              )}
              {...register("addressLine")}
            />
          </Field>

          <Field label="Locality">
            <Input
              placeholder="Ntinda"
              className={fieldControlClass}
              {...register("locality")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" error={errors.city?.message}>
              <Input
                placeholder="Kampala"
                className={fieldControlClass}
                {...register("city")}
              />
            </Field>
            <Field label="State" error={errors.state?.message}>
              <Input
                placeholder="Central Region"
                className={fieldControlClass}
                {...register("state")}
              />
            </Field>
          </div>

          <Field label="Country">
            <Input
              placeholder="Uganda"
              className={fieldControlClass}
              {...register("country")}
            />
          </Field>

          <Field label="Address Type">
            <Controller
              control={control}
              name="addressType"
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2" role="radiogroup">
                  {ADDRESS_TYPES.map(({ value, icon: Icon }) => {
                    const selected = field.value === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => field.onChange(value)}
                        className={cn(
                          "flex items-center justify-center gap-1.5 border px-2 py-2.5 text-xs font-bold uppercase tracking-wide transition",
                          selected
                            ? "border-brand-amber bg-brand-amber text-foreground"
                            : "border-brand-amber/25 bg-brand-white text-brand-gray hover:border-brand-amber/50 hover:text-foreground"
                        )}
                      >
                        <Icon size={14} strokeWidth={2} aria-hidden />
                        {value}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </Field>

          <Controller
            control={control}
            name="isDefault"
            render={({ field }) => (
              <label className="flex cursor-pointer items-center gap-3 border border-brand-amber/20 bg-brand-cream/40 px-3 py-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <span className="text-sm font-medium text-foreground">
                  Make this my default address
                </span>
              </label>
            )}
          />
        </form>

        <DialogFooter className="mx-0 mb-0 rounded-none border-t border-brand-amber/15 bg-brand-cream/40 p-4 sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-none border-brand-amber/30"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="address-form"
            disabled={createAddressMutation.isPending}
            className="rounded-none bg-brand-amber font-bold uppercase tracking-wide text-foreground hover:bg-brand-amber/90"
          >
            {createAddressMutation.isPending ? "Saving..." : "Save Address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
