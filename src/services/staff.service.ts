import { apiFetch } from "./api";

export interface Staff {
  id: number;
  name: string;
  position: string;
  type: "TEACHER" | "ADMINISTRATIVE";
  classTaught: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface StaffResponse {
  message: string;
  data: Staff[];
}

export async function getStaff() {
  return apiFetch<StaffResponse>("/staff");
}