// src/api/client.jsx
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "https://footy-scout-backend.onrender.com";

const client = axios.create({
  baseURL,
  withCredentials: true, // ensure HttpOnly cookies are sent
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// AuthProvider can register a handler to be called when a 401 is detected.
// Keep this here to avoid circular imports between client and auth code.
let onUnauthorized = null;
export function setOnUnauthorized(handler) {
  onUnauthorized = typeof handler === "function" ? handler : null;
}

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;

    // If there's no response (network error), just reject
    if (!response) return Promise.reject(error);

    // Only handle 401 here
    if (response.status !== 401) return Promise.reject(error);

    // Prevent infinite retry loops
    if (config && config._retry) return Promise.reject(error);
    if (config) config._retry = true;

    // Mark the error so components can detect that auth was handled centrally
    error.isAuthHandled = true;

    // Call the registered handler (AuthProvider should register one)
    try {
      if (typeof onUnauthorized === "function") {
        onUnauthorized(error);
      }
    } catch (handlerErr) {
      // swallow handler errors but log for debugging
      // eslint-disable-next-line no-console
      console.error("onUnauthorized handler error:", handlerErr);
    }

    return Promise.reject(error);
  }
);

export default client;
