import { apiFetch } from "./api";

export interface SchoolProfile {
  id: number;
  schoolName: string;
  shortInfo: string | null;
  about: string | null;
  history: string | null;
  vision: string | null;
  mission: string | null;
  bannerUrl: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SchoolProfileResponse {
  message: string;
  data: SchoolProfile;
}

export async function getSchoolProfile() {
  return apiFetch<SchoolProfileResponse>("/school-profile");
}

export async function updateSchoolProfile(
  formData: FormData,
) {
  const API_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(
    `${API_URL}/school-profile`,
    {
      method: "PUT",
      credentials: "include",
      body: formData,
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `API Error: ${response.status}`,
    );
  }

  return data as SchoolProfileResponse;
}