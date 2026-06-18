import OrderSuccessPage from "@/views/OrderSuccessPage";

export default async function OrderSuccess({ searchParams }) {
  const params = await searchParams;

  return (
    <OrderSuccessPage orderNumber={params?.orderNumber || ""} />
  );
}
