const rawUrl =
  import.meta.env.VITE_API_URL || "https://babaji-herbal.onrender.com/api";

// Trailing slash hatao, aur /api missing ho to add karo.
// Isse VITE_API_URL me /api ho ya na ho, dono case me sahi URL banega.
const normalizedBase = rawUrl.trim().replace(/\/+$/, "");

export const API_URL = normalizedBase.endsWith("/api")
  ? normalizedBase
  : `${normalizedBase}/api`;

export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");
