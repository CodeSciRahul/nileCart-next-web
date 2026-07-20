/**
 * Auth gating public API — import from here in feature modules.
 *
 * @example
 * import { useAuthGate, AUTH_ACTIONS } from "@/lib/authGate";
 *
 * const { requireAuth } = useAuthGate();
 * await requireAuth({
 *   action: AUTH_ACTIONS.ADD_TO_CART,
 *   onSuccess: () => addToCart(),
 * });
 */

export { AUTH_ACTIONS, resolveAuthAction } from "./authActions";
export {
  saveAuthIntent,
  peekAuthIntent,
  consumeAuthIntent,
  clearAuthIntent,
} from "./authIntent";
export {
  useAuthGate,
  useRequireAuth,
  AuthGateProvider,
} from "@/context/AuthGateContext";
