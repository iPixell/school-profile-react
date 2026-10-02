import { apiFetch } from "./api";

interface LoginResponse {
  message: string;
  accessToken: string;
}

interface RefreshResponse {
  message: string;
  accessToken: string;
}

export async function loginAdmin(
  email: string,
  password: string,
) {
  return apiFetch<LoginResponse>(
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
}

export async function refreshAdminToken() {
  return apiFetch<RefreshResponse>(
    "/auth/refresh",
    {
      method: "POST",
    },
    false,
  );
}