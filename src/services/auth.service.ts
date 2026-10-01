import { apiFetch } from "./api";

interface LoginResponse {
 message: string;
 accessToken: string;
}

export async function loginAdmin(email: string, password: string) {
 return apiFetch<LoginResponse>("/auth/login", {
  method: "POST",
  body: JSON.stringify({
   email,
   password,
  }),
 });
}
