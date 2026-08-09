/**
 * Serializable auth intent for flows that leave the page (full /auth route).
 * In-modal sign-in prefers in-memory pending callbacks instead.
 */

const INTENT_KEY = "nilescart_auth_intent";
const INTENT_TTL_MS = 15 * 60 * 1000;

/**
 * @typedef {Object} AuthIntent
 * @property {string} actionId
 * @property {Record<string, unknown>} [payload]
 * @property {string} [returnPath]
 * @property {number} createdAt
 */

/** @returns {AuthIntent | null} */
export function peekAuthIntent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(INTENT_KEY);
    if (!raw) return null;
    const intent = JSON.parse(raw);
    if (!intent?.createdAt || Date.now() - intent.createdAt > INTENT_TTL_MS) {
      sessionStorage.removeItem(INTENT_KEY);
      return null;
    }
    return intent;
  } catch {
    return null;
  }
}

/** @param {Omit<AuthIntent, 'createdAt'>} intent */
export function saveAuthIntent(intent) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      INTENT_KEY,
      JSON.stringify({ ...intent, createdAt: Date.now() })
    );
  } catch {
    /* quota / private mode */
  }
}

/** @returns {AuthIntent | null} */
export function consumeAuthIntent() {
  const intent = peekAuthIntent();
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(INTENT_KEY);
    } catch {
      /* ignore */
    }
  }
  return intent;
}

export function clearAuthIntent() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(INTENT_KEY);
  } catch {
    /* ignore */
  }
}
