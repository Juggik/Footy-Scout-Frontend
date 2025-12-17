// src/pages/Sign-in-page/SignIn.jsx
import { useState } from "react";
import { auth } from "../../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import styles from "./SignIn.module.css";

export default function SignIn() {
  const [status, setStatus] = useState("Not signed in");
  const [user, setUser] = useState(null);
  const BackendUrl = process.env.REACT_APP_API_URL || "https://footy-scout-backend.onrender.com";

  async function handleSignIn() {
    try {
      setStatus("Opening Google sign-in...");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      setStatus("Getting ID token...");
      const idToken = await result.user.getIdToken();

      setStatus("Sending token to server to create session...");
      const resp = await fetch(`${BackendUrl}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // allow browser to receive HttpOnly cookie
        body: JSON.stringify({ idToken }),
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => resp.statusText);
        setStatus("Server session creation failed: " + errText);
        return;
      }

      setStatus("Server session created. Fetching profile...");

      // Call /me to get the user profile that the server verifies from the session cookie
      const meResp = await fetch(`${BackendUrl}/me`, {
        method: "GET",
        credentials: "include", // send the session cookie
        headers: { "Accept": "application/json" },
      });

      if (!meResp.ok) {
        const errText = await meResp.text().catch(() => meResp.statusText);
        setStatus("Failed to fetch profile: " + errText);
        return;
      }

      const profile = await meResp.json();
      setUser(profile);
      setStatus(`Signed in as ${profile.email || profile.uid}`);

    } catch (err) {
      console.error(err);
      setStatus("Sign-in failed: " + (err?.message || String(err)));
    }
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Sign in</h1>

      <button className={styles.btnSignin} onClick={handleSignIn} type="button">
        <span className={styles.icon} aria-hidden="true">
          G
        </span>
        <span>Sign in with Google</span>
      </button>

      <div className={styles.status}>{status}</div>

      {user && (
        <div className={styles.profile}>
          <p><strong>UID:</strong> {user.uid}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Email verified:</strong> {String(user.email_verified)}</p>
        </div>
      )}
    </div>
  );
}
