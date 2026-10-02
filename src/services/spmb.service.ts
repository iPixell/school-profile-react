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

interface SpmbSingleResponse {
  message: string;
  data: Spmb;
}

interface SpmbFormData {
  title: string;
  description?: string;
  portalUrl?: string;
  photo?: File | null;
}

// GET /spmb
export async function getSpmb() {
  return apiFetch<SpmbResponse>("/spmb");
}

// POST /spmb
export async function createSpmb(formData: SpmbFormData) {
  const body = new FormData();

  body.append("title", formData.title);

  if (formData.description) {
    body.append("description", formData.description);
  }

  if (formData.portalUrl) {
    body.append("portalUrl", formData.portalUrl);
  }

  if (formData.photo) {
    body.append("photo", formData.photo);
  }

  return apiFetch<SpmbSingleResponse>("/spmb", {
    method: "POST",
    body,
  });
}

// PUT /spmb/:id
export async function updateSpmb(
  id: number,
  formData: SpmbFormData,
) {
  const body = new FormData();

  body.append("title", formData.title);

  if (formData.description) {
    body.append("description", formData.description);
  }

  if (formData.portalUrl) {
    body.append("portalUrl", formData.portalUrl);
  }

  if (formData.photo) {
    body.append("photo", formData.photo);
  }

  return apiFetch<SpmbSingleResponse>(`/spmb/${id}`, {
    method: "PUT",
    body,
  });
}

// DELETE /spmb/:id
export async function deleteSpmb(id: number) {
  return apiFetch<{ message: string }>(`/spmb/${id}`, {
    method: "DELETE",
  });
}