import { apiFetch } from "./api";

export type StaffType = "TEACHER" | "ADMINISTRATIVE";

export type Staff = {
  id: number;
  name: string;
  position: string;
  type: StaffType;
  classTaught: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type StaffListResponse = {
  message: string;
  data: Staff[];
};

type StaffResponse = {
  message: string;
  data: Staff;
};

export function getStaff() {
  return apiFetch<StaffListResponse>("/staff");
}

export function createStaff(data: {
  name: string;
  position: string;
  type: StaffType;
  classTaught?: string;
  photoUrl?: string;
}) {
  return apiFetch<StaffResponse>("/staff", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateStaff(
  id: number,
  data: {
    name: string;
    position: string;
    type: StaffType;
    classTaught?: string;
    photoUrl?: string;
  },
) {
  return apiFetch<StaffResponse>(`/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteStaff(id: number) {
  return apiFetch<{ message: string }>(`/staff/${id}`, {
    method: "DELETE",
  });
}