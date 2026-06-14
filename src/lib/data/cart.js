import { serverGet } from "../serverApi.js";

export async function fetchCart() {
  return serverGet("/cart", { authenticated: true });
}
