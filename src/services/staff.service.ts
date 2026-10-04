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
  photo?: File;
}) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("position", data.position);
  formData.append("type", data.type);

  if (data.classTaught) {
    formData.append("classTaught", data.classTaught);
  }

  if (data.photo) {
    formData.append("photo", data.photo);
  }

  return apiFetch<StaffResponse>("/staff", {
    method: "POST",
    body: formData,
  });
}

export function updateStaff(
  id: number,
  data: {
    name: string;
    position: string;
    type: StaffType;
    classTaught?: string;
    photo?: File;
  },
) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("position", data.position);
  formData.append("type", data.type);

  if (data.classTaught) {
    formData.append("classTaught", data.classTaught);
  }

  if (data.photo) {
    formData.append("photo", data.photo);
  }

  return apiFetch<StaffResponse>(`/staff/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export function deleteStaff(id: number) {
  return apiFetch<{ message: string }>(`/staff/${id}`, {
    method: "DELETE",
  });
}