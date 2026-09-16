// In production (Vercel), the /api/* routes are proxied to the backend service.
// In development, point to local backend server.
// Set NEXT_PUBLIC_API_URL="" in Vercel env vars to use same-origin routing.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL !== undefined
    ? process.env.NEXT_PUBLIC_API_URL
    : typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? ""
    : "http://localhost:8000";
