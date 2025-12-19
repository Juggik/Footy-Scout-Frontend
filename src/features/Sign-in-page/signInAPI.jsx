import { auth } from "../../../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default async function handleSignIn({ backendUrl, setStatus, setUser }) {
  try {
    setStatus("Opening Google sign-in...");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    setStatus("Getting ID token...");
    const idToken = await result.user.getIdToken();

    setStatus("Sending token to server to create session...");
    const resp = await fetch(`${backendUrl}/session`, {
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
    const meResp = await fetch(`${backendUrl}/me`, {
      method: "GET",
      credentials: "include", // send the session cookie
      headers: { Accept: "application/json" },
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
