import { fetchAddresses } from "@/lib/data/addresses";
import { fetchCart } from "@/lib/data/cart";
import AddressPage from "@/views/AddressPage";

export default async function Address() {
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

  return <AddressPage addresses={addresses} cart={cart} />;
}
