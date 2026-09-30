const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(
 endpoint: string,
 options?: RequestInit,
): Promise<T> {
 const response = await fetch(`${API_URL}${endpoint}`, {
  ...options,
  credentials: "include",
  headers: {
   "Content-Type": "application/json",
   ...options?.headers,
  },
 });

 const data = await response.json().catch(() => null);

 if (!response.ok) {
  throw new Error(data?.message || `API Error: ${response.status}`);
 }

 return data;
}
