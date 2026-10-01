import { apiFetch } from "./api";

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

export function createExtracurricular(data: {
  name: string;
  photoUrl?: string;
}) {
  return apiFetch<ItemResponse>("/extracurriculars", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateExtracurricular(
  id: number,
  data: {
    name: string;
    photoUrl?: string;
  },
) {
  return apiFetch<ItemResponse>(`/extracurriculars/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteExtracurricular(id: number) {
  return apiFetch<{ message: string }>(
    `/extracurriculars/${id}`,
    {
      method: "DELETE",
    },
  );
}