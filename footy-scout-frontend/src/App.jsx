// src/App.jsx
import { useState } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function App() {
  const [status, setStatus] = useState("Not signed in");

  async function handleSignIn() {
    try {
      setStatus("Opening Google sign-in...");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setStatus("Getting ID token...");
      const idToken = await user.getIdToken();

      setStatus("Sending token to test endpoint...");
      // Replace this URL with any endpoint you want to inspect in DevTools.
      const testUrl =
        "https://httpbizzzzzzzzzzzzhsdhdhuheuiehueh8383y8y3eieioheshksdfhkhds8n.org/post";

      // Send token in Authorization header and in JSON body
      await fetch(testUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ idToken }),
        // credentials not needed for cross-origin test; include if sending to your backend
      });

      setStatus("Request sent. Check Network tab for the request details.");
    } catch (err) {
      console.error(err);
      setStatus("Sign-in or send failed: " + (err.message || err));
    }
  }

  return (
    <div id="root">
      <div className="card">
        <h1>Sign in</h1>
        <button className="btn-signin" onClick={handleSignIn}>
          <span className="icon">G</span>
          Sign in with Google
        </button>
        <div className="status">{status}</div>
      </div>
    </div>
  );
}

export default App;
