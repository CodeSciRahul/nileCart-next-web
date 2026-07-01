"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CreditCard,
  Truck,
  Plus,
  CheckCircle,
  Smartphone,
} from "lucide-react";
import AddressModal from "@/components/addressModal";
import CouponInput from "@/components/checkout/CouponInput";
import PriceSummary from "@/components/checkout/PriceSummary";
import { Button } from "@/components/ui/button";
import { usePlaceOrder } from "@/hooks/useOrder";
import { useInitializeCheckout, usePaymentConfig } from "@/hooks/usePayment";
import { formatMoney } from "@/lib/currency";
import { showErrorToast } from "@/lib/toast";

export default function PaymentPage({ addresses = [], cart }) {
  const router = useRouter();
  const placeOrder = usePlaceOrder();
  const initializeCheckout = useInitializeCheckout();
  const { data: paymentConfig } = usePaymentConfig();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const currency = paymentConfig?.currency || "UGX";
  const onlineEnabled = paymentConfig?.onlinePaymentsEnabled ?? false;

  useEffect(() => {
    const defaultAddress = addresses?.find((a) => a?.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress?._id);
    }
  }, [addresses]);

  const items = cart?.cart?.items || [];
  const orderTotal = cart?.total ?? cart?.subtotal ?? 0;
  const hasItems = items.length > 0;
  const isPlacingOrder = placeOrder.isPending;
  const isStartingPayment = initializeCheckout.isPending;
  const isBusy = isPlacingOrder || isStartingPayment;
  const formattedTotal = formatMoney(orderTotal, currency);

  const validateCheckout = () => {
    if (!hasItems) {
      showErrorToast("Your bag is empty. Add items before placing an order.");
      return false;
    }

    if (!selectedAddress) {
      showErrorToast("Please select a delivery address.");
      return false;
    }

    return true;
  };

  const handlePlaceCodOrder = () => {
    if (!validateCheckout()) return;

    placeOrder.mutate({
      addressId: selectedAddress,
      paymentMethod: "cod",
    });
  };

  const handleOnlinePayment = () => {
    if (!validateCheckout()) return;

    if (!onlineEnabled) {
      showErrorToast("Online payments are not available right now.");
      return;
    }

    initializeCheckout.mutate({ addressId: selectedAddress });
  };

  const paymentMethods = [
    {
      id: "cod",
      title: "Cash On Delivery",
      icon: Truck,
      desc: "Pay when delivered",
      enabled: true,
    },
    {
      id: "online",
      title: "Pay Online",
      icon: CreditCard,
      desc: "Card, mobile money, bank transfer",
      enabled: onlineEnabled,
    },
  ];

  if (!cart) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10 text-brand-gray">
        Sign in to complete your order.
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Your bag is empty</h1>
        <p className="text-brand-gray mt-2 text-sm">
          Add items to your bag before proceeding to payment.
        </p>
        <Button
          type="button"
          className="mt-6 bg-brand-amber text-brand-white hover:bg-brand-amber/90"
          onClick={() => router.push("/checkout/bag")}
        >
          Go to bag
        </Button>
      </div>
    );
  }

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
                onClick={() => setIsAddressModalOpen(true)}
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
                      onClick={() => method.enabled && setSelectedPayment(method.id)}
                      disabled={!method.enabled}
                      className={`w-full flex items-center gap-3 p-4 border-b text-left transition ${
                        selectedPayment === method.id
                          ? "bg-brand-white border-l-4 border-l-brand-amber"
                          : "hover:bg-gray-100"
                      } ${!method.enabled ? "cursor-not-allowed opacity-50" : ""}`}
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
                {selectedPayment === "online" && (
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Pay Online</h3>

                    <div className="space-y-4">
                      <div className="rounded-lg border bg-brand-cream/50 p-4">
                        <div className="flex items-start gap-3">
                          <Smartphone className="mt-0.5 size-5 text-brand-amber" />
                          <div className="text-sm">
                            <p className="font-medium">Secure Flutterwave checkout</p>
                            <p className="text-brand-gray mt-1">
                              You will be redirected to a secure payment page to pay with
                              card, mobile money, or bank transfer.
                            </p>
                          </div>
                        </div>
                      </div>

                      <ul className="text-brand-gray space-y-1 text-sm">
                        <li>• Payment is verified on our server before confirmation</li>
                        <li>• Your order is created before redirect</li>
                        <li>• Stock is released if payment fails or is cancelled</li>
                      </ul>

                      <Button
                        type="button"
                        className="w-full bg-brand-amber py-6 text-base font-medium text-brand-white hover:bg-brand-amber/90"
                        onClick={handleOnlinePayment}
                        disabled={isBusy || !selectedAddress || !onlineEnabled}
                      >
                        {isStartingPayment
                          ? "Redirecting to payment..."
                          : `Pay ${formattedTotal}`}
                      </Button>
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
                        Pay cash when your order is delivered. No online payment
                        required.
                      </p>
                    </div>

                    <Button
                      type="button"
                      className="w-full bg-brand-amber text-brand-white py-6 text-base font-medium hover:bg-brand-amber/90"
                      onClick={handlePlaceCodOrder}
                      disabled={isBusy || !selectedAddress}
                    >
                      {isPlacingOrder
                        ? "Placing order..."
                        : `Confirm Order ${formattedTotal}`}
                    </Button>

                    {!selectedAddress && (
                      <p className="text-brand-gray mt-2 text-xs">
                        Select a delivery address to continue.
                      </p>
                    )}
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

            <PriceSummary cart={cart} items={items} currency={currency} />
          </div>
        </div>
      </div>

      <AddressModal
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
