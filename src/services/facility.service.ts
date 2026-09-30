import { apiFetch } from "./api";

export interface Facility {
  id: number;
  name: string;
  description: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FacilityResponse {
  message: string;
  data: Facility[];
}

export async function getFacilities() {
  return apiFetch<FacilityResponse>("/facilities");
}