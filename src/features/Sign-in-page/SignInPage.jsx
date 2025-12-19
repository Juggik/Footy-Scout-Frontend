// src/features/signin/SignInPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";
import handleSignIn from "./signInApi";
import useAuth from "../../auth/useAuth";

export default function SignInPage() {
  const [status, setStatus] = useState("Not signed in");
  const [busy, setBusy] = useState(false);
  const { user, refreshUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect after sign-in (need to add the homepage then redirect to it after sign in from here)
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) return;

    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from, { replace: true });
    }
    // otherwise stay on the sign-in page and show the profile UI
  }, [isAuthenticated, loading, navigate, location.state]);

  async function onSignIn() {
    setBusy(true);
    setStatus("Starting sign-in...");
    try {
      const result = await handleSignIn({ refreshUser, setStatus });
      // handleSignIn may return { success: true } or { success: false, error }
      if (result?.success === false) {
        setStatus("Sign-in failed");
      }
    } catch (err) {
      // If handleSignIn throws, show a friendly message
      setStatus(err?.message || "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  // While auth is being derived, show a loader to avoid flicker
  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Sign in</h1>

      <button
        className={styles.btnSignin}
        onClick={onSignIn}
        type="button"
        disabled={busy}
        aria-busy={busy}
      >
        <span className={styles.icon} aria-hidden="true">
          G
        </span>
        <span>{busy ? "Signing in…" : "Sign in with Google"}</span>
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
