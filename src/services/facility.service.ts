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

interface FacilitySingleResponse {
  message: string;
  data: Facility;
}

interface FacilityFormData {
  name: string;
  description?: string;
  photo?: File | null;
}

export async function getFacilities() {
  return apiFetch<FacilityResponse>("/facilities");
}

export async function createFacility(formData: FacilityFormData) {
  const body = new FormData();

  body.append("name", formData.name);

  if (formData.description) {
    body.append("description", formData.description);
  }

  if (formData.photo) {
    body.append("photo", formData.photo);
  }

  return apiFetch<FacilitySingleResponse>("/facilities", {
    method: "POST",
    body,
  });
}

export async function updateFacility(
  id: number,
  formData: FacilityFormData,
) {
  const body = new FormData();

  body.append("name", formData.name);

  if (formData.description) {
    body.append("description", formData.description);
  }

  if (formData.photo) {
    body.append("photo", formData.photo);
  }

  return apiFetch<FacilitySingleResponse>(`/facilities/${id}`, {
    method: "PUT",
    body,
  });
}

export async function deleteFacility(id: number) {
  return apiFetch<{ message: string }>(`/facilities/${id}`, {
    method: "DELETE",
  });
}