"use client";

import { useState } from "react";
import { MapPin, Plus, Home, Briefcase } from "lucide-react";
import AddressModal from "@/components/addressModal";
import { useAddresses } from "@/hooks/useAddresses";
import { Button } from "@/components/ui/button";

const typeIcon = (type) => {
  if (type === "Work") return Briefcase;
  return Home;
};

const AddressesPage = () => {
  const { data: addresses = [], isLoading, isError, refetch } = useAddresses();
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return <p className="text-sm text-brand-gray">Loading addresses...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Could not load addresses. Please try again later.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Address</h2>
          <p className="text-sm text-brand-gray">
            Manage your saved delivery addresses.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setModalOpen(true)}
          className="bg-brand-amber text-brand-white hover:bg-brand-amber/90"
        >
          <Plus size={16} className="mr-1.5" />
          Add new address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-amber/30 bg-brand-cream/50 px-6 py-12 text-center">
          <MapPin className="mx-auto mb-3 text-brand-amber" size={40} />
          <h3 className="font-semibold text-foreground">No addresses saved</h3>
          <p className="mt-1 text-sm text-brand-gray">
            Add an address for faster checkout.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => {
            const Icon = typeIcon(address.addressType);

            return (
              <article
                key={address._id}
                className="rounded-xl border border-brand-cream p-4 transition hover:border-brand-amber/30 hover:shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-cream">
                      <Icon size={16} className="text-brand-amber" />
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {address.addressType}
                    </span>
                  </div>
                  {address.isDefault && (
                    <span className="rounded-full bg-brand-amber/20 px-2.5 py-0.5 text-xs font-semibold text-brand-amber">
                      Default
                    </span>
                  )}
                </div>

                <p className="font-medium text-foreground">{address.fullName}</p>
                <p className="mt-1 text-sm leading-relaxed text-brand-gray">
                  {address.addressLine}
                  {address.locality ? `, ${address.locality}` : ""}
                  <br />
                  {address.city}, {address.state} — {address.pincode}
                  <br />
                  {address.country}
                </p>
                <p className="mt-2 text-sm text-brand-gray">
                  Mobile: {address.mobileNumber}
                </p>
              </article>
            );
          })}
        </div>
      )}

      <AddressModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default AddressesPage;
