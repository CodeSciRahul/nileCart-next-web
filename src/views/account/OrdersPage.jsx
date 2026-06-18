"use client";

import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import { useMyOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";

const STATUS_LABELS = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const statusColor = (status) => {
  if (status === "delivered") return "bg-green-100 text-green-700";
  if (status === "cancelled" || status === "returned")
    return "bg-red-100 text-red-700";
  return "bg-brand-amber/20 text-brand-amber";
};

const OrdersPage = () => {
  const { data, isLoading, isError } = useMyOrders();
  const orders = data?.orders || [];

  if (isLoading) {
    return <p className="text-sm text-brand-gray">Loading your orders...</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Could not load orders. Please try again later.
      </p>
    );
  }

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-foreground">Orders</h2>
      <p className="mb-6 text-sm text-brand-gray">
        Track and review your recent purchases.
      </p>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-amber/30 bg-brand-cream/50 px-6 py-12 text-center">
          <Package className="mx-auto mb-3 text-brand-amber" size={40} />
          <h3 className="font-semibold text-foreground">No orders yet</h3>
          <p className="mt-1 text-sm text-brand-gray">
            When you place an order, it will show up here.
          </p>
          <Button
            asChild
            className="mt-5 bg-brand-amber text-brand-white hover:bg-brand-amber/90"
          >
            <Link href="/">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const firstItem = order.items?.[0];
            const moreCount = (order.items?.length || 0) - 1;

            return (
              <article
                key={order._id}
                className="rounded-xl border border-brand-cream bg-brand-white p-4 transition hover:border-brand-amber/30 hover:shadow-sm md:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">
                      Order #{order.orderNumber}
                    </p>
                    <p className="mt-1 text-sm text-brand-gray">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(order.orderStatus)}`}
                  >
                    {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  {firstItem?.image ? (
                    <img
                      src={firstItem.image}
                      alt={firstItem.title}
                      className="h-16 w-14 rounded-lg border border-brand-cream object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-14 items-center justify-center rounded-lg bg-brand-cream">
                      <ShoppingBag size={20} className="text-brand-gray" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {firstItem?.title || "Order items"}
                    </p>
                    {moreCount > 0 && (
                      <p className="text-sm text-brand-gray">
                        +{moreCount} more item{moreCount > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    ₹{order.total}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
