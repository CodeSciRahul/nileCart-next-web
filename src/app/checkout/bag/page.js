import { fetchCart } from "@/lib/data/cart";
import BagPage from "@/views/BagPage";

export default async function Bag() {
  let cart = null;

  try {
    cart = await fetchCart();
  } catch {
    cart = null;
  }

  return <BagPage cart={cart} />;
}
