const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface RefreshResponse {
  message: string;
  accessToken: string;
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      const data = (await response
        .json()
        .catch(() => null)) as RefreshResponse | null;

      if (!response.ok || !data?.accessToken) {
        console.warn(
          "Refresh access token gagal:",
          data?.message || `HTTP ${response.status}`,
        );

        return null;
      }

      sessionStorage.setItem("accessToken", data.accessToken);

      return data.accessToken;
    } catch (error) {
      console.error("Gagal melakukan refresh access token:", error);

      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function clearSession() {
  sessionStorage.removeItem("accessToken");
  localStorage.removeItem("rememberMe");
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  retry = true,
): Promise<T> {
  let accessToken = sessionStorage.getItem("accessToken");

  const headers = new Headers(options?.headers);

  /*
   * Jangan set Content-Type untuk FormData.
   * Browser akan mengatur multipart/form-data boundary.
   */
  if (!(options?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  /*
   * Access token dikirim otomatis jika tersedia.
   */
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    cache: "no-store",
    headers,
  });

  /*
   * Access token mungkin sudah expired.
   *
   * Jangan refresh untuk:
   * - login
   * - refresh itu sendiri
   */
  if (
    response.status === 401 &&
    retry &&
    !endpoint.includes("/auth/login") &&
    !endpoint.includes("/auth/refresh")
  ) {
    accessToken = await refreshAccessToken();

    if (accessToken) {
      const retryHeaders = new Headers(options?.headers);

      if (
  options?.body &&
  !(options.body instanceof FormData)
) {
  headers.set("Content-Type", "application/json");
}

      retryHeaders.set("Authorization", `Bearer ${accessToken}`);

      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        cache: "no-store",
        headers: retryHeaders,
      });
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    /*
     * Login gagal.
     *
     * Jangan dianggap sebagai session expired.
     */
    if (endpoint.includes("/auth/login")) {
      throw new Error(
        data?.message || "Email atau password salah.",
      );
    }

    /*
     * Kalau request protected tetap 401
     * setelah refresh dicoba, berarti refresh session
     * memang tidak bisa digunakan lagi.
     */
    if (response.status === 401) {
      clearSession();

      throw new Error(
        "Sesi login sudah tidak aktif. Silakan login kembali.",
      );
    }

    throw new Error(
      data?.message || `API Error: ${response.status}`,
    );
  }

  return data as T;
}