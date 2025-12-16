// src/pages/SignIn/SignIn.jsx
import { useState } from "react";
import { auth } from "../../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import styles from "./SignIn.module.css";

export default function SignIn() {
  const [status, setStatus] = useState("Not signed in");

  async function handleSignIn() {
    try {
      setStatus("Opening Google sign-in...");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      setStatus("Getting ID token...");
      const idToken = await result.user.getIdToken();

      // Development: log token and update status
      console.log("ID token:", idToken);
      setStatus("Signed in. Token acquired (check console).");

      // TODO: send token to your backend when ready
      // await fetch("/api/auth", { method: "POST", headers: { Authorization: `Bearer ${idToken}` }, body: JSON.stringify({ idToken }) });
    } catch (err) {
      console.error(err);
      setStatus("Sign-in failed: " + (err?.message || String(err)));
    }
  }

 return (
    <div className={styles.card}>
      <h1 className={styles.title}>Sign in</h1>

      <button className={styles.btnSignin} onClick={handleSignIn} type="button">
        <span className={styles.icon} aria-hidden="true">G</span>
        <span>Sign in with Google</span>
      </button>

      <div className={styles.status}>{status}</div>
    </div>
  );
}
