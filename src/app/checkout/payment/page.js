import { fetchAddresses } from "@/lib/data/addresses";
import { fetchCart } from "@/lib/data/cart";
import PaymentPage from "@/views/PaymentPage";

export default async function Payment() {
  let addresses = [];
  let cart = null;

  try {
    const [addressData, cartData] = await Promise.all([
      fetchAddresses(),
      fetchCart(),
    ]);
    addresses = addressData?.addresses || [];
    cart = cartData;
  } catch {
    addresses = [];
    cart = null;
  }

  return <PaymentPage addresses={addresses} cart={cart} />;
}
