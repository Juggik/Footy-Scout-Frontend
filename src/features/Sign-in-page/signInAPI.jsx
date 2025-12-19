// src/features/signin/signInApi.js
import { auth } from "../../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import * as authApi from "../../api/authApi";

/**
 * Returns { success: boolean, error?: Error }
 */
export default async function handleSignIn({ refreshUser, setStatus } = {}) {
  try {
    setStatus?.("Opening Google sign-in...");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    setStatus?.("Getting ID token...");
    const idToken = await result.user.getIdToken();

    setStatus?.("Sending token to server to create session...");
    await authApi.createSession(idToken);

    setStatus?.("Server session created. Fetching profile...");
    await refreshUser();

    setStatus?.("Signed in");
    return { success: true };
  } catch (err) {
    // Distinguish user-cancelled popup if you want
    const message = err?.code === "auth/popup-closed-by-user"
      ? "Sign-in cancelled"
      : err?.message || String(err);

    console.error("handleSignIn error:", err);
    setStatus?.("Sign-in failed: " + message);

    // Let caller decide what to do; return failure info
    return { success: false, error: err };
  }
}
