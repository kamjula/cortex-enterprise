import { buildApiUrl } from "./config/api";

const ACCESS_KEY = "cortex_access_token";
const REFRESH_KEY = "cortex_refresh_token";
const USER_KEY = "cortex_user";

export function getSession() {
  try {
    const user = JSON.parse(sessionStorage.getItem(USER_KEY) || "null");
    const accessToken = sessionStorage.getItem(ACCESS_KEY);
    const refreshToken = sessionStorage.getItem(REFRESH_KEY);
    return accessToken && refreshToken && user ? { accessToken, refreshToken, user } : null;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession({ accessToken, refreshToken, user }) {
  sessionStorage.setItem(ACCESS_KEY, accessToken);
  sessionStorage.setItem(REFRESH_KEY, refreshToken);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export async function login(email, password) {
  const response = await fetch(buildApiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Login failed");
  saveSession(data);
  return data.user;
}

export async function logout() {
  const session = getSession();
  if (session?.refreshToken) {
    await fetch(buildApiUrl("/auth/logout"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    }).catch(() => {});
  }
  clearSession();
}

let refreshPromise = null;
async function refreshAccessToken() {
  const session = getSession();
  if (!session) return false;
  if (!refreshPromise) {
    refreshPromise = fetch(buildApiUrl("/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    }).then(async response => {
      if (!response.ok) throw new Error("Session expired");
      const data = await response.json();
      saveSession({ ...session, accessToken: data.accessToken, refreshToken: data.refreshToken });
      return true;
    }).catch(() => {
      clearSession();
      return false;
    }).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

const nativeFetch = window.fetch.bind(window);
export function installAuthenticatedFetch() {
  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    const isApi = url.startsWith(buildApiUrl("/"));
    const isAuth = url.includes("/auth/login") || url.includes("/auth/refresh") || url.includes("/auth/logout");
    let session = getSession();
    const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
    if (isApi && !isAuth && session?.accessToken) headers.set("Authorization", `Bearer ${session.accessToken}`);
    let response = await nativeFetch(input, { ...init, headers });
    if (response.status === 401 && isApi && !isAuth && session?.refreshToken && await refreshAccessToken()) {
      session = getSession();
      const retryHeaders = new Headers(headers);
      retryHeaders.set("Authorization", `Bearer ${session.accessToken}`);
      response = await nativeFetch(input, { ...init, headers: retryHeaders });
    }
    if (response.status === 401 && isApi && !isAuth) window.dispatchEvent(new Event("cortex-auth-expired"));
    return response;
  };
}
