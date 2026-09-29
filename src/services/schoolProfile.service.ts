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
