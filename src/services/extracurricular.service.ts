import { apiFetch } from "./api";

interface ExtracurricularSingleResponse {
  message: string;
  data: Extracurricular;
}

export type Extracurricular = {
  id: number;
  name: string;
  photoUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ListResponse = {
  message: string;
  data: Extracurricular[];
};

type ItemResponse = {
  message: string;
  data: Extracurricular;
};

export function getExtracurriculars() {
  return apiFetch<ListResponse>("/extracurriculars");
}

export function getExtracurricular(id: number) {
  return apiFetch<ExtracurricularSingleResponse>(
    `/extracurriculars/${id}`,
  );
}

export function createExtracurricular(
  name: string,
  photo?: File | null,
) {
  const formData = new FormData();
  formData.append("name", name);

  if (photo) {
    formData.append("photo", photo);
  }

  return apiFetch<ItemResponse>("/extracurriculars", {
    method: "POST",
    body: formData,
  });
}

export function updateExtracurricular(
  id: number,
  name: string,
  photo?: File | null,
) {
  const formData = new FormData();
  formData.append("name", name);

  if (photo) {
    formData.append("photo", photo);
  }

  return apiFetch<ItemResponse>(`/extracurriculars/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export function deleteExtracurricular(id: number) {
  return apiFetch<{ message: string }>(
    `/extracurriculars/${id}`,
    { method: "DELETE" },
  );
}
