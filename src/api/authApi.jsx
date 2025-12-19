// src/api/authApi.js
import client from "./client";

export async function createSession(idToken) {
  // POST /session - server sets HttpOnly cookie
  const resp = await client.post("/session", { idToken });
  return resp.data;
}

export async function getMe() {
  // GET /me - server verifies cookie and returns profile
  const resp = await client.get("/me");
  return resp.data;
}

// export async function logout() {
  // POST /logout or similar endpoint to clear session cookie
//   const resp = await client.post("/logout");
//   return resp.data;
// }

// Optional: refresh endpoint if you implement refresh-token flow
// export async function refresh() {
//   const resp = await client.post("/auth/refresh");
//   return resp.data;
// }
