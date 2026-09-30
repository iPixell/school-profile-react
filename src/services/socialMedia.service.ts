import { apiFetch } from "./api";

export interface SocialMedia {
 id: number;
 platform: string;
 url: string;
 createdAt: string;
 updatedAt: string;
}

interface SocialMediaResponse {
 message: string;
 data: SocialMedia[];
}

export async function getSocialMedias() {
 return apiFetch<SocialMediaResponse>("/social-medias");
}
