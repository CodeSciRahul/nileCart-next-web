import { serverGet } from "../serverApi.js";

export async function fetchAddresses() {
  return serverGet("/addresses", { authenticated: true });
}
