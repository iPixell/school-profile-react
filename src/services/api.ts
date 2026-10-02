const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

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
      const response = await fetch(
        `${API_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data =
        (await response.json().catch(() => null)) as
          | RefreshResponse
          | null;

      if (!response.ok || !data?.accessToken) {
        return null;
      }

      sessionStorage.setItem(
        "accessToken",
        data.accessToken,
      );

      return data.accessToken;
    } catch (error) {
      console.error(
        "Gagal melakukan refresh access token:",
        error,
      );

      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function clearSession() {
  sessionStorage.removeItem("accessToken");
  localStorage.removeItem("rememberMe");
}

function redirectToLogin() {
  clearSession();

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  retry = true,
): Promise<T> {
  let accessToken =
    sessionStorage.getItem("accessToken");

  const headers = new Headers(options?.headers);

  /**
   * JSON hanya digunakan kalau body bukan FormData.
   *
   * Kalau FormData, Content-Type JANGAN dibuat manual.
   * Browser yang akan membuat multipart boundary.
   */
  if (!(options?.body instanceof FormData)) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  /**
   * Access token otomatis dikirim
   * untuk request yang membutuhkan login.
   */
  if (accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  let response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers,
    },
  );

  /**
   * Kalau access token expired:
   *
   * 401
   * ↓
   * refresh token
   * ↓
   * dapat access token baru
   * ↓
   * ulang request awal
   */
  if (
    response.status === 401 &&
    retry &&
    !endpoint.includes("/auth/login") &&
    !endpoint.includes("/auth/refresh")
  ) {
    accessToken = await refreshAccessToken();

    if (accessToken) {
      const retryHeaders = new Headers(
        options?.headers,
      );

      if (
        !(options?.body instanceof FormData)
      ) {
        retryHeaders.set(
          "Content-Type",
          "application/json",
        );
      }

      retryHeaders.set(
        "Authorization",
        `Bearer ${accessToken}`,
      );

      response = await fetch(
        `${API_URL}${endpoint}`,
        {
          ...options,
          credentials: "include",
          headers: retryHeaders,
        },
      );
    } else {
      /**
       * Refresh token juga sudah tidak valid.
       * Baru session dihentikan.
       */
      redirectToLogin();

      throw new Error(
        "Sesi login telah berakhir. Silakan login kembali.",
      );
    }
  }

  const data =
    await response.json().catch(() => null);

  if (!response.ok) {
    /**
     * Pesan teknis auth tidak ditampilkan
     * langsung kepada admin.
     */
    if (
      response.status === 401 ||
      data?.message ===
        "Access token diperlukan" ||
      data?.message ===
        "Invalid access token" ||
      data?.message ===
        "Token expired"
    ) {
      redirectToLogin();

      throw new Error(
        "Sesi login telah berakhir. Silakan login kembali.",
      );
    }

    throw new Error(
      data?.message ||
        `API Error: ${response.status}`,
    );
  }

  return data as T;
}