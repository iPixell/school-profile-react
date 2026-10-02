import { apiFetch } from "./api";

export interface PrincipalHistory {
 id: number;
 name: string;
 period: string;
 createdAt: string;
 updatedAt: string;
}

interface PrincipalHistoryListResponse {
 message: string;
 data: PrincipalHistory[];
}

interface PrincipalHistorySingleResponse {
 message: string;
 data: PrincipalHistory;
}

export async function getPrincipalHistories() {
 return apiFetch<PrincipalHistoryListResponse>("/principal-histories");
}

export async function createPrincipalHistory(data: {
 name: string;
 period: string;
}) {
 return apiFetch<PrincipalHistorySingleResponse>("/principal-histories", {
  method: "POST",
  body: JSON.stringify(data),
 });
}

export async function updatePrincipalHistory(
 id: number,
 data: {
  name: string;
  period: string;
 },
) {
 return apiFetch<PrincipalHistorySingleResponse>(`/principal-histories/${id}`, {
  method: "PUT",
  body: JSON.stringify(data),
 });
}

export async function deletePrincipalHistory(id: number) {
 return apiFetch<{ message: string }>(`/principal-histories/${id}`, {
  method: "DELETE",
 });
}
