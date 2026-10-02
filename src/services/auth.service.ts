import { apiFetch, clearSession } from "./api";

interface LoginResponse {
 message: string;
 accessToken: string;
}

interface RefreshResponse {
 message: string;
 accessToken: string;
}

export async function loginAdmin(email: string, password: string) {
 const data = await apiFetch<LoginResponse>(
  "/auth/login",
  {
   method: "POST",
   body: JSON.stringify({
    email,
    password,
   }),
  },
  false,
 );

 sessionStorage.setItem("accessToken", data.accessToken);

 return data;
}

export async function refreshAdminToken() {
 const data = await apiFetch<RefreshResponse>(
  "/auth/refresh",
  {
   method: "POST",
  },
  false,
 );

 sessionStorage.setItem("accessToken", data.accessToken);

 return data;
}

export async function logoutAdmin() {
  await apiFetch<{ message: string }>(
    "/auth/logout",
    {
      method: "POST",
    },
    true,
  );

  clearSession();
}