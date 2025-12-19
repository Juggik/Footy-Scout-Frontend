// src/pages/Sign-in-page/SignIn.jsx
import { useState } from "react";
import styles from "./SignIn.module.css";
import handleSignIn from "./signInAPI.jsx";

export default function SignInPage() {
  const [status, setStatus] = useState("Not signed in");
  const [user, setUser] = useState(null);
  const backendUrl =
    import.meta.env.VITE_API_URL || "https://footy-scout-backend.onrender.com";

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Sign in</h1>

      <button
        className={styles.btnSignin}
        onClick={() => handleSignIn({ backendUrl, setStatus, setUser })}
        type="button"
      >
        <span className={styles.icon} aria-hidden="true">
          G
        </span>
        <span>Sign in with Google</span>
      </button>

      <div className={styles.status}>{status}</div>

      {user && (
        <div className={styles.profile}>
          <p>
            <strong>UID:</strong> {user.uid}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Email verified:</strong> {String(user.email_verified)}
          </p>
        </div>
      )}
    </div>
  );
}
