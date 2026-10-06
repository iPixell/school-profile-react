import { apiFetch } from "./api";

export interface SocialMedia {
  id: number;
  platform: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface SocialMediaListResponse {
  message: string;
  data: SocialMedia[];
}

interface SocialMediaResponse {
  message: string;
  data: SocialMedia;
}

export async function getSocialMedias() {
  return apiFetch<SocialMediaListResponse>("/social-medias");
}

export async function createSocialMedia(data: {
  platform: string;
  url: string;
}) {
  return apiFetch<SocialMediaResponse>("/social-medias", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSocialMedia(
  id: number,
  data: {
    platform: string;
    url: string;
  },
) {
  return apiFetch<SocialMediaResponse>(`/social-medias/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteSocialMedia(id: number) {
  return apiFetch<{ message: string }>(`/social-medias/${id}`, {
    method: "DELETE",
  });
}