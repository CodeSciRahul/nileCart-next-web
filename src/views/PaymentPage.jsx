"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  CreditCard,
  Truck,
  Plus,
  CheckCircle,
} from "lucide-react";
import AddressModal from "@/components/addressModal";
import CouponInput from "@/components/checkout/CouponInput";
import PriceSummary from "@/components/checkout/PriceSummary";

export default function PaymentPage({ addresses = [], cart }) {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [isAddressModalOpen, setIsAddressModal] = useState(false);

  useEffect(() => {
    const defaultAddress = addresses?.find((a) => a?.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress?._id);
    }
  }, [addresses]);

  const closeAddressModal = () => {
    setIsAddressModal(false);
  };

  const items = cart?.cart?.items || [];
  const orderTotal = cart?.total ?? cart?.subtotal ?? 0;

  const paymentMethods = [
    {
      id: "cod",
      title: "Cash On Delivery",
      icon: Truck,
      desc: "Pay when delivered",
    },
    {
      id: "card",
      title: "Credit / Debit Card",
      icon: CreditCard,
      desc: "Visa, Mastercard, Rupay",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          <div className="bg-brand-white rounded-xl border">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Select Delivery Address</h2>

              <button
                type="button"
                className="flex items-center gap-2 text-brand-amber font-medium"
                onClick={() => setIsAddressModal(true)}
              >
                <Plus size={18} />
                Add New Address
              </button>
            </div>

            <div className="p-5 space-y-4">
              {addresses?.map((address) => (
                <label
                  key={address?._id}
                  className={`block border rounded-xl p-4 cursor-pointer transition ${
                    selectedAddress === address?._id
                      ? "border-brand-amber bg-brand-cream"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === address?._id}
                      onChange={() => setSelectedAddress(address?._id)}
                      className="mt-1"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{address?.fullName}</h3>

                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                          {address?.addressType}
                        </span>

                        {address?.isDefault && (
                          <span className="text-green-600 flex items-center gap-1 text-sm">
                            <CheckCircle size={14} />
                            Default
                          </span>
                        )}
                      </div>

                      <p className="text-brand-gray mt-2 text-sm">
                        {address?.addressLine}, {address?.locality}, {address?.city},{" "}
                        {address?.state}
                      </p>

                      <p className="text-brand-gray text-sm">
                        {address?.country} - {address?.pincode}
                      </p>

                      <p className="mt-2 text-sm">
                        Mobile: {address?.mobileNumber}
                      </p>
                    </div>
                  </div>
                </label>
              ))}

              {!addresses?.length && (
                <div className="border rounded-xl p-10 text-center">
                  <MapPin size={40} className="mx-auto mb-3 text-brand-gray" />

                  <h3 className="font-medium">No Address Found</h3>

                  <p className="text-brand-gray text-sm mt-1">
                    Add a delivery address to continue.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-brand-white rounded-xl border overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold">Choose Payment Method</h2>
            </div>

            <div className="grid md:grid-cols-[300px_1fr] min-h-[450px]">
              <div className="border-r bg-gray-50">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full flex items-center gap-3 p-4 border-b text-left transition ${
                        selectedPayment === method.id
                          ? "bg-brand-white border-l-4 border-l-brand-amber"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={20} />

                      <div>
                        <h3 className="font-medium">{method.title}</h3>
                        <p className="text-xs text-brand-gray">{method.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-6">
                {selectedPayment === "card" && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">
                      Credit / Debit Card
                    </h3>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full border rounded-lg px-4 py-3"
                      />

                      <input
                        type="text"
                        placeholder="Card Holder Name"
                        className="w-full border rounded-lg px-4 py-3"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="border rounded-lg px-4 py-3"
                        />

                        <input
                          type="password"
                          placeholder="CVV"
                          className="border rounded-lg px-4 py-3"
                        />
                      </div>

                      <button
                        type="button"
                        className="w-full bg-brand-amber text-brand-white py-3 rounded-lg font-medium"
                      >
                        Pay ₹{orderTotal}
                      </button>
                    </div>
                  </div>
                )}

                {selectedPayment === "cod" && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">
                      Cash On Delivery
                    </h3>

                    <div className="bg-brand-cream border border-brand-amber/30 rounded-lg p-4 mb-5">
                      <p className="text-sm">
                        Pay cash when your order is delivered.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="w-full bg-brand-amber text-brand-white py-3 rounded-lg font-medium"
                    >
                      Confirm Order ₹{orderTotal}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="sticky top-24 space-y-4 rounded-lg border bg-brand-white p-5">
            <CouponInput
              appliedCoupon={cart?.coupon}
              subtotal={cart?.subtotal ?? 0}
            />

            <PriceSummary cart={cart} items={items} />
          </div>
        </div>
      </div>

      <AddressModal open={isAddressModalOpen} onClose={closeAddressModal} />
    </div>
  );
}
