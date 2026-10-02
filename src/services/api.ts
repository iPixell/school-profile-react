const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
    return null;
   }

   // Simpan access token baru secara internal.
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

 // Jangan set Content-Type untuk FormData.
 // Browser yang akan mengatur multipart/form-data boundary.
 if (!(options?.body instanceof FormData)) {
  headers.set("Content-Type", "application/json");
 }

 // Access token otomatis dikirim ke backend.
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
  * Kalau access token expired:
  *
  * 1. Minta access token baru menggunakan refresh token.
  * 2. Simpan access token baru.
  * 3. Ulangi request awal.
  *
  * User tidak perlu tahu proses ini.
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

   if (!(options?.body instanceof FormData)) {
    retryHeaders.set("Content-Type", "application/json");
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
   * PENTING:
   *
   * Kalau ini login dan password salah,
   * tampilkan pesan dari backend.
   *
   * Jangan ubah menjadi "Sesi login telah berakhir".
   */
  if (endpoint.includes("/auth/login")) {
   throw new Error(data?.message || "Email atau password salah.");
  }

  /*
   * Kalau request protected benar-benar gagal setelah
   * refresh token dicoba, jangan redirect otomatis.
   *
   * User tetap berada di halaman admin.
   */
  if (response.status === 401) {
   clearSession();

   throw new Error("Sesi login sudah tidak aktif. Silakan login kembali.");
  }

  throw new Error(data?.message || `API Error: ${response.status}`);
 }

 return data as T;
}
