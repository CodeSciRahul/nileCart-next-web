"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuthInstance, googleProvider, appleProvider } from "@/util/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/services/authService";
import { showErrorToast } from "@/lib/toast";

const categoryOptions = [
  "Dresses",
  "Denim",
  "T-shirts",
  "Blouses",
  "Tops",
  "Pants & Leggings",
  "Co-ords",
  "Sports&Gym",
  "Lingerie",
  "Swimwear",
];

const requireAuth = () => {
  const authInstance = getAuthInstance();
  if (!authInstance) {
    throw new Error("Firebase is not configured. Check your environment variables.");
  }
  return authInstance;
};

const mapAuthError = (err) => {
  const code = err?.code || "";
  const messages = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Try again.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/email-already-in-use": "An account already exists with this email.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/popup-closed-by-user": "Sign-in popup was closed.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
  };
  return (
    messages[code] || err?.message || "Something went wrong. Please try again."
  );
};

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { establishBackendSession, isAuthenticated } = useAuth();

  const redirectTo = searchParams.get("redirect") || "/";

  const [activeTab, setActiveTab] = useState("signup");
  const [showProfile, setShowProfile] = useState(false);
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const finishAuth = async (firebaseUser, profilePayload) => {
    const token = await firebaseUser.getIdToken();
    await establishBackendSession(token);

    if (profilePayload && Object.keys(profilePayload).length > 0) {
      try {
        await updateUserProfile(profilePayload);
      } catch {
        /* profile sync is optional; auth still succeeded */
      }
    }

    router.replace(redirectTo);
  };

  const buildProfilePayload = () => {
    const payload = {};
    if (name.trim()) payload.name = name.trim();
    if (birthday) payload.birthday = birthday;
    if (gender) payload.gender = gender;
    if (selectedCategories.length)
      payload.categoryPreferences = selectedCategories;
    return payload;
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email.trim() || !password) {
        throw new Error("Email and password are required.");
      }

      const credential = await createUserWithEmailAndPassword(
        requireAuth(),
        email.trim(),
        password
      );

      await sendEmailVerification(credential.user);
      await finishAuth(credential.user, buildProfilePayload());
    } catch (err) {
      const message = mapAuthError(err);
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email.trim() || !password) {
        throw new Error("Email and password are required.");
      }

      const credential = await signInWithEmailAndPassword(
        requireAuth(),
        email.trim(),
        password
      );

      await finishAuth(credential.user);
    } catch (err) {
      const message = mapAuthError(err);
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await signInWithPopup(requireAuth(), googleProvider);
      const profile =
        activeTab === "signup" && showProfile ? buildProfilePayload() : {};
      await finishAuth(result.user, profile);
    } catch (err) {
      const message = mapAuthError(err);
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await signInWithPopup(requireAuth(), appleProvider);
      const profile =
        activeTab === "signup" && showProfile ? buildProfilePayload() : {};
      await finishAuth(result.user, profile);
    } catch (err) {
      const message = mapAuthError(err);
      setError(message);
      showErrorToast(err, message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && !loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4">
        <p className="text-lg font-medium mb-4">You are already signed in.</p>
        <Link
          href="/"
          className="px-8 py-3 rounded-2xl bg-black text-brand-white font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream flex justify-center">
      <div className="w-full max-w-lg px-4 py-6">
        <Link
          href="/"
          className="block text-center text-5xl font-bold mb-6 hover:opacity-80"
        >
          NILECART
        </Link>

        <div className="bg-brand-amber py-4 text-center mb-8">
          <p className="font-bold text-xl md:text-2xl">
            Join for ₹1 Deals & more !
          </p>
        </div>

        {(error || success) && (
          <div
            className={`mb-6 px-4 py-3 rounded-2xl text-sm ${
              error
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {error || success}
          </div>
        )}

        <div className="flex border-b mb-8">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 pb-4 text-lg md:text-2xl cursor-pointer ${
              activeTab === "login"
                ? "border-b-2 border-black font-medium"
                : "text-brand-gray"
            }`}
          >
            LOGIN
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("signup");
              setError("");
              setSuccess("");
            }}
            className={`flex-1 pb-4 text-lg md:text-2xl cursor-pointer ${
              activeTab === "signup"
                ? "border-b-2 border-black font-semibold"
                : "text-brand-gray"
            }`}
          >
            SIGNUP
          </button>
        </div>

        {activeTab === "login" && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Login using Email</h2>

            <input
              placeholder="Enter Email"
              type="email"
              autoComplete="email"
              className="w-full h-14 rounded-2xl border border-gray-300 px-4 mb-5 bg-brand-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <div className="flex gap-3 mb-6">
              <input
                placeholder="Enter Password"
                type="password"
                autoComplete="current-password"
                className="flex-1 h-14 rounded-2xl border border-gray-300 px-4 bg-brand-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-black text-brand-white text-lg font-medium cursor-pointer disabled:opacity-60"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <div className="flex justify-center gap-8 mt-8">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-14 h-14 rounded-xl border bg-brand-white flex items-center justify-center text-xl disabled:opacity-60"
                aria-label="Login with Google"
              >
                G
              </button>
              <button
                type="button"
                onClick={handleAppleLogin}
                disabled={loading}
                className="w-14 h-14 rounded-xl bg-black text-brand-white flex items-center justify-center text-xl disabled:opacity-60"
                aria-label="Login with Apple"
              >
                
              </button>
            </div>
          </div>
        )}

        {activeTab === "signup" && (
          <>
            <h2 className="text-xl font-semibold mb-6">* Sign up using Email</h2>

            <input
              placeholder="Enter Email"
              type="email"
              autoComplete="email"
              className="w-full h-14 rounded-2xl border border-gray-300 px-4 mb-5 bg-brand-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <label className="block text-lg font-medium mb-3">
              * Enter Password
            </label>

            <div className="flex gap-3 mb-6">
              <input
                placeholder="Enter Password"
                className="flex-1 h-14 rounded-2xl border border-gray-300 px-4 bg-brand-white"
                value={password}
                type="password"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex items-start gap-3 mb-8">
              <input type="checkbox" defaultChecked className="mt-1" />
              <p className="text-sm md:text-base">
                Agree to receive communications related to order and promotional
                offers.
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <button
                type="button"
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 text-lg"
              >
                Complete my profile
                {showProfile ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
            </div>

            {showProfile && (
              <div className="space-y-10 mb-10">
                <div>
                  <label className="block text-2xl font-medium mb-4">
                    Birthday
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="w-full h-16 rounded-3xl border border-gray-300 bg-brand-white px-5"
                      disabled={loading}
                    />
                    <Calendar
                      size={22}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xl font-medium mb-4">Name</label>
                  <input
                    type="text"
                    maxLength={50}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Please do not exceed 50 characters"
                    className="w-full h-16 rounded-3xl border border-gray-300 bg-brand-white px-5"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-2xl font-medium mb-5">Gender</label>
                  <div className="flex flex-wrap gap-8">
                    {["Male", "Female", "Other"].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="gender"
                          checked={gender === item}
                          onChange={() => setGender(item)}
                          className="w-6 h-6"
                          disabled={loading}
                        />
                        <span className="text-xl">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-2xl font-medium mb-6">
                    Category Preference
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {categoryOptions.map((category) => {
                      const selected = selectedCategories.includes(category);
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => toggleCategory(category)}
                          disabled={loading}
                          className={`h-14 rounded-2xl border text-base md:text-lg transition-all disabled:opacity-60 ${
                            selected
                              ? "bg-black text-brand-white border-black"
                              : "bg-brand-white border-gray-300 text-black"
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-black text-brand-white text-lg font-medium mb-5 cursor-pointer disabled:opacity-60"
            >
              {loading ? "Creating account..." : "SIGNUP"}
            </button>

            <button
              type="button"
              disabled={loading}
              className="w-full h-14 rounded-2xl border border-gray-300 bg-brand-white text-lg mb-8 cursor-pointer disabled:opacity-60"
            >
              Sign up using Mobile Number
            </button>

            <div className="flex justify-center gap-8 mb-8">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-14 h-14 rounded-xl border bg-brand-white flex items-center justify-center text-xl disabled:opacity-60"
                aria-label="Sign up with Google"
              >
                G
              </button>
              <button
                type="button"
                onClick={handleAppleLogin}
                disabled={loading}
                className="w-14 h-14 rounded-xl bg-black text-brand-white flex items-center justify-center text-xl disabled:opacity-60"
                aria-label="Sign up with Apple"
              >
                
              </button>
            </div>

            <p className="text-center text-sm md:text-base">
              I agree to <span className="font-medium">T&C</span> and{" "}
              <span className="font-medium">Privacy Policy</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
