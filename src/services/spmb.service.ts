import { apiFetch } from "./api";

export interface Spmb {
  id: number;
  title: string;
  description: string | null;
  photoUrl: string | null;
  portalUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SpmbResponse {
  message: string;
  data: Spmb[];
}

export async function getSpmb() {
  return apiFetch<SpmbResponse>("/spmb");
}