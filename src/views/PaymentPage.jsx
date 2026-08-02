"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  CreditCard,
  MapPin,
  Plus,
  Smartphone,
  Truck,
} from "lucide-react";
import AddressModal from "@/components/addressModal";
import CouponInput from "@/components/checkout/CouponInput";
import PriceSummary from "@/components/checkout/PriceSummary";
import CheckoutTrustBadges from "@/components/checkout/CheckoutTrustBadges";
import AuthRequiredState from "@/components/auth/AuthRequiredState";
import { Button } from "@/components/ui/button";
import { usePlaceOrder } from "@/hooks/useOrder";
import { useInitializeCheckout, usePaymentConfig } from "@/hooks/usePayment";
import { useAuth } from "@/context/AuthContext";
import { useAuthGate } from "@/context/AuthGateContext";
import { AUTH_ACTIONS } from "@/lib/authActions";
import { formatMoney } from "@/lib/currency";
import { showErrorToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export default function PaymentPage({ addresses = [], cart }) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { requireAuth } = useAuthGate();
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

  const handlePlaceCodOrder = async () => {
    if (!validateCheckout()) return;

    const run = () =>
      placeOrder.mutate({
        addressId: selectedAddress,
        paymentMethod: "cod",
      });

    if (isAuthenticated) {
      run();
      return;
    }

    await requireAuth({
      action: AUTH_ACTIONS.PLACE_ORDER,
      onSuccess: run,
    });
  };

  const handleOnlinePayment = async () => {
    if (!validateCheckout()) return;

    if (!onlineEnabled) {
      showErrorToast("Online payments are not available right now.");
      return;
    }

    const run = () =>
      initializeCheckout.mutate({ addressId: selectedAddress });

    if (isAuthenticated) {
      run();
      return;
    }

    await requireAuth({
      action: AUTH_ACTIONS.PLACE_ORDER,
      onSuccess: run,
    });
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

  if (authLoading) {
    return (
      <div className="py-16 text-center text-sm text-brand-gray">
        Preparing checkout...
      </div>
    );
  }

  if (!isAuthenticated || !cart) {
    return (
      <AuthRequiredState
        action={AUTH_ACTIONS.CHECKOUT}
        onAuthenticated={() => router.refresh()}
      />
    );
  }

  if (!hasItems) {
    return (
      <div className="mx-auto max-w-lg border border-dashed border-brand-amber/30 bg-brand-white px-6 py-16 text-center">
        <h1 className="text-xl font-black tracking-tight">Your bag is empty</h1>
        <p className="mt-2 text-sm text-brand-gray">
          Add items to your bag before proceeding to payment.
        </p>
        <Button
          type="button"
          className="mt-6 rounded-none bg-brand-amber font-bold text-foreground hover:bg-brand-amber/90"
          onClick={() => router.push("/checkout/bag")}
        >
          Go to bag
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
      <div className="min-w-0 space-y-5 sm:space-y-6">
        {/* Delivery address */}
        <section className="border border-brand-amber/25 bg-brand-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-amber/15 bg-brand-cream/30 px-4 py-4 sm:px-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gray">
                Step 1
              </p>
              <h2 className="mt-0.5 flex items-center gap-2 text-lg font-black tracking-tight">
                <MapPin size={18} className="text-brand-amber" />
                Delivery Address
              </h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-foreground transition hover:text-brand-amber"
              onClick={() => setIsAddressModalOpen(true)}
            >
              <Plus size={16} />
              Add New
            </button>
          </div>

          <div className="space-y-3 p-4 sm:p-5" role="radiogroup" aria-label="Delivery address">
            {addresses?.map((address) => {
              const selected = selectedAddress === address?._id;
              return (
                <label
                  key={address?._id}
                  className={cn(
                    "block cursor-pointer border p-4 transition duration-200",
                    selected
                      ? "border-brand-amber bg-brand-cream/50 ring-1 ring-brand-amber/40"
                      : "border-brand-amber/15 hover:border-brand-amber/40"
                  )}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="address"
                      checked={selected}
                      onChange={() => setSelectedAddress(address?._id)}
                      className="mt-1 accent-brand-amber"
                      aria-label={`Deliver to ${address?.fullName}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">{address?.fullName}</h3>
                        <span className="bg-brand-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-brand-amber/25">
                          {address?.addressType}
                        </span>
                        {address?.isDefault && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <CheckCircle size={13} />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                        {address?.addressLine}, {address?.locality},{" "}
                        {address?.city}, {address?.state}
                      </p>
                      <p className="text-sm text-brand-gray">
                        {address?.country} - {address?.pincode}
                      </p>
                      <p className="mt-2 text-sm font-medium">
                        Mobile: {address?.mobileNumber}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}

            {!addresses?.length && (
              <div className="border border-dashed border-brand-amber/30 px-6 py-12 text-center">
                <MapPin size={36} className="mx-auto mb-3 text-brand-amber" />
                <h3 className="font-bold">No address found</h3>
                <p className="mt-1 text-sm text-brand-gray">
                  Add a delivery address to continue.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 bg-brand-amber px-4 py-2.5 text-xs font-bold uppercase tracking-wide"
                >
                  <Plus size={14} />
                  Add address
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Payment method */}
        <section className="overflow-hidden border border-brand-amber/25 bg-brand-white shadow-sm">
          <div className="border-b border-brand-amber/15 bg-brand-cream/30 px-4 py-4 sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gray">
              Step 2
            </p>
            <h2 className="mt-0.5 flex items-center gap-2 text-lg font-black tracking-tight">
              <CreditCard size={18} className="text-brand-amber" />
              Payment Method
            </h2>
          </div>

          <div className="grid min-h-[420px] md:grid-cols-[260px_1fr]">
            <div
              className="border-b border-brand-amber/15 bg-brand-cream/20 md:border-b-0 md:border-r"
              role="tablist"
              aria-label="Payment methods"
            >
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const active = selectedPayment === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() =>
                      method.enabled && setSelectedPayment(method.id)
                    }
                    disabled={!method.enabled}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-brand-amber/10 p-4 text-left transition",
                      active
                        ? "border-l-4 border-l-brand-amber bg-brand-white"
                        : "border-l-4 border-l-transparent hover:bg-brand-cream/40",
                      !method.enabled && "cursor-not-allowed opacity-45"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center ring-1",
                        active
                          ? "bg-brand-amber/25 ring-brand-amber/40"
                          : "bg-brand-white ring-brand-amber/20"
                      )}
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold">{method.title}</h3>
                      <p className="mt-0.5 text-[11px] text-brand-gray">
                        {method.desc}
                      </p>
                      {!method.enabled && (
                        <p className="mt-1 text-[10px] font-semibold text-orange-600">
                          Currently unavailable
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-5 sm:p-6" role="tabpanel">
              {selectedPayment === "online" && (
                <div>
                  <h3 className="text-base font-black tracking-tight">
                    Pay Online
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="border border-brand-amber/25 bg-brand-cream/40 p-4">
                      <div className="flex items-start gap-3">
                        <Smartphone className="mt-0.5 size-5 shrink-0 text-brand-amber" />
                        <div className="text-sm">
                          <p className="font-bold">Secure Flutterwave checkout</p>
                          <p className="mt-1 text-brand-gray">
                            You will be redirected to a secure payment page to
                            pay with card, mobile money, or bank transfer.
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-xs leading-relaxed text-brand-gray">
                      <li>• Payment is verified on our server before confirmation</li>
                      <li>• Your order is created before redirect</li>
                      <li>• Stock is released if payment fails or is cancelled</li>
                    </ul>

                    <Button
                      type="button"
                      className="h-12 w-full rounded-none bg-brand-amber text-sm font-bold uppercase tracking-wide text-foreground hover:bg-brand-amber/90"
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
                  <h3 className="text-base font-black tracking-tight">
                    Cash On Delivery
                  </h3>
                  <div className="mt-4 mb-5 border border-brand-amber/30 bg-brand-cream/50 p-4">
                    <p className="text-sm leading-relaxed">
                      Pay cash when your order is delivered. No online payment
                      required.
                    </p>
                  </div>

                  <Button
                    type="button"
                    className="h-12 w-full rounded-none bg-brand-amber text-sm font-bold uppercase tracking-wide text-foreground hover:bg-brand-amber/90"
                    onClick={handlePlaceCodOrder}
                    disabled={isBusy || !selectedAddress}
                  >
                    {isPlacingOrder
                      ? "Placing order..."
                      : `Confirm Order · ${formattedTotal}`}
                  </Button>

                  {!selectedAddress && (
                    <p className="mt-2 text-xs text-brand-gray" role="status">
                      Select a delivery address to continue.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mini bag preview */}
        <section className="border border-brand-amber/20 bg-brand-white p-4 sm:p-5">
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gray">
            Order Summary · {items.length}{" "}
            {items.length === 1 ? "item" : "items"}
          </h3>
          <ul className="mt-3 divide-y divide-brand-amber/10">
            {items.slice(0, 4).map((item) => {
              const variant = item?.product?.variants?.find(
                (v) => v?.sku === item?.variantSku
              );
              return (
                <li
                  key={item._id}
                  className="flex items-center justify-between gap-3 py-2.5 text-sm"
                >
                  <span className="line-clamp-1 font-medium">
                    {item?.product?.title}
                    {variant?.size ? ` · ${variant.size}` : ""}
                  </span>
                  <span className="shrink-0 tabular-nums text-brand-gray">
                    ×{item.quantity}
                  </span>
                </li>
              );
            })}
            {items.length > 4 && (
              <li className="py-2 text-xs text-brand-gray">
                +{items.length - 4} more items
              </li>
            )}
          </ul>
          <button
            type="button"
            onClick={() => router.push("/checkout/bag")}
            className="mt-2 text-xs font-bold uppercase tracking-wide text-brand-gray underline-offset-2 hover:text-foreground hover:underline"
          >
            Edit bag
          </button>
        </section>
      </div>

      <aside className="min-w-0 space-y-4 lg:sticky lg:top-28 lg:self-start">
        <div className="space-y-4 border border-brand-amber/25 bg-brand-white p-4 shadow-sm sm:p-5">
          <CouponInput
            appliedCoupon={cart?.coupon}
            subtotal={cart?.subtotal ?? 0}
          />

          <div className="border-t border-brand-amber/15 pt-4">
            <PriceSummary cart={cart} items={items} currency={currency} />
          </div>
        </div>

        <CheckoutTrustBadges compact />
      </aside>

      <AddressModal
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
