import { apiFetch } from "./api";

export type SchoolProfile = {
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
};

type SchoolProfileResponse = {
  message: string;
  data: SchoolProfile;
};

export function getSchoolProfile() {
  return apiFetch<SchoolProfileResponse>("/school-profile");
}

export function updateSchoolProfile(
  data: {
    schoolName: string;
    shortInfo: string;
    about: string;
    history: string;
    vision: string;
    mission: string;
    bannerUrl: string;
    logoUrl: string;
  },
) {
  return apiFetch<SchoolProfileResponse>("/school-profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}