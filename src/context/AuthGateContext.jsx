"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { resolveAuthAction } from "@/lib/authActions";
import {
  clearAuthIntent,
  consumeAuthIntent,
  saveAuthIntent,
} from "@/lib/authIntent";
import AuthGatePrompt from "@/components/auth/AuthGatePrompt";
import AuthIntentResume from "@/components/auth/AuthIntentResume";

const AuthGateContext = createContext(null);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function AuthGateProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("prompt");
  const [actionConfig, setActionConfig] = useState(() =>
    resolveAuthAction("GENERIC")
  );
  const [busy, setBusy] = useState(false);

  const pendingRef = useRef(null);
  const resolveRef = useRef(null);
  const completingRef = useRef(false);
  const authRef = useRef({ isAuthenticated, authLoading });
  const openRef = useRef(false);

  useEffect(() => {
    authRef.current = { isAuthenticated, authLoading };
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const settle = useCallback((authenticated) => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    pendingRef.current = null;
    setOpen(false);
    setPhase("prompt");
    setBusy(false);
    resolve?.(authenticated);
  }, []);

  const cancel = useCallback(() => {
    if (busy) return;
    clearAuthIntent();
    settle(false);
  }, [busy, settle]);

  const completeSuccess = useCallback(async () => {
    if (completingRef.current) return;
    completingRef.current = true;
    const pending = pendingRef.current;
    setBusy(true);
    try {
      if (pending?.onSuccess) {
        await pending.onSuccess();
      }
      clearAuthIntent();
      settle(true);
    } catch {
      settle(true);
    } finally {
      completingRef.current = false;
    }
  }, [settle]);

  const waitForBootstrap = useCallback(async () => {
    const maxWait = 8000;
    const start = Date.now();
    while (authRef.current.authLoading && Date.now() - start < maxWait) {
      await sleep(40);
    }
  }, []);

  /**
   * @param {object | string} [optionsOrAction]
   * @returns {Promise<boolean>}
   */
  const requireAuth = useCallback(
    async (optionsOrAction = {}) => {
      const options =
        typeof optionsOrAction === "string"
          ? { action: optionsOrAction }
          : optionsOrAction || {};

      const config = resolveAuthAction(options.action || "GENERIC");
      const mode = options.mode || "modal";

      await waitForBootstrap();

      if (authRef.current.isAuthenticated) {
        if (options.onSuccess) await options.onSuccess();
        return true;
      }

      // Coalesce duplicate prompts into one promise
      if (openRef.current && resolveRef.current) {
        pendingRef.current = {
          actionId: config.id,
          onSuccess: options.onSuccess || pendingRef.current?.onSuccess,
          payload: options.payload ?? pendingRef.current?.payload,
        };
        setActionConfig(config);
        return new Promise((resolve) => {
          const prev = resolveRef.current;
          resolveRef.current = (value) => {
            prev?.(value);
            resolve(value);
          };
        });
      }

      if (mode === "redirect") {
        const returnPath =
          options.redirectTo ||
          (typeof window !== "undefined"
            ? `${window.location.pathname}${window.location.search}`
            : pathname || "/");

        saveAuthIntent({
          actionId: config.id,
          payload: options.payload || {},
          returnPath,
        });

        const params = new URLSearchParams({
          redirect: returnPath,
          intent: config.id,
        });
        router.push(`/auth?${params.toString()}`);
        return false;
      }

      return new Promise((resolve) => {
        pendingRef.current = {
          actionId: config.id,
          onSuccess: options.onSuccess,
          payload: options.payload,
        };
        resolveRef.current = resolve;
        setActionConfig(config);
        setPhase("prompt");
        setOpen(true);
      });
    },
    [pathname, router, waitForBootstrap]
  );

  // Session became authenticated while the gate is open
  useEffect(() => {
    if (!(isAuthenticated && open)) return;
    queueMicrotask(() => {
      completeSuccess();
    });
  }, [isAuthenticated, open, completeSuccess]);

  // Resume intents after /auth redirect
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const intent = consumeAuthIntent();
    if (!intent) return;
    window.dispatchEvent(
      new CustomEvent("nilescart:auth-intent", { detail: intent })
    );
  }, [authLoading, isAuthenticated]);

  const startSignIn = useCallback(() => setPhase("form"), []);

  const value = useMemo(
    () => ({
      requireAuth,
      cancelAuthGate: cancel,
      isAuthGateOpen: open,
      authGateAction: actionConfig,
    }),
    [requireAuth, cancel, open, actionConfig]
  );

  return (
    <AuthGateContext.Provider value={value}>
      {children}
      <AuthIntentResume />
      <AuthGatePrompt
        open={open}
        phase={phase}
        action={actionConfig}
        busy={busy}
        onOpenChange={(next) => {
          if (!next) cancel();
        }}
        onContinue={startSignIn}
        onCancel={cancel}
        onAuthSuccess={completeSuccess}
      />
    </AuthGateContext.Provider>
  );
}

export function useAuthGate() {
  const context = useContext(AuthGateContext);
  if (!context) {
    throw new Error("useAuthGate must be used within AuthGateProvider");
  }
  return context;
}

/**
 * @param {string | object} [action]
 */
export function useRequireAuth(action = "GENERIC") {
  const { requireAuth } = useAuthGate();

  return useCallback(
    async (fn, options = {}) => {
      const ok = await requireAuth({ action, ...options });
      if (!ok) return undefined;
      if (typeof fn === "function") return fn();
      return true;
    },
    [requireAuth, action]
  );
}
