const apiBaseUrl = (import.meta.env.VITE_API_URL || "https://cortex-enterprise.onrender.com").replace(/\/$/, "");

export const buildApiUrl = (path) => `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
