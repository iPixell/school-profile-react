import { apiFetch } from "./api";

export type PrincipalHistory = {
  id: number;
  name: string;
  period: string;
  createdAt: string;
  updatedAt: string;
};

type PrincipalHistoryListResponse = {
  message: string;
  data: PrincipalHistory[];
};

type PrincipalHistoryResponse = {
  message: string;
  data: PrincipalHistory;
};

export function getPrincipalHistories() {
  return apiFetch<PrincipalHistoryListResponse>(
    "/principal-histories",
  );
}

export function createPrincipalHistory(data: {
  name: string;
  period: string;
}) {
  return apiFetch<PrincipalHistoryResponse>(
    "/principal-histories",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export function updatePrincipalHistory(
  id: number,
  data: {
    name: string;
    period: string;
  },
) {
  return apiFetch<PrincipalHistoryResponse>(
    `/principal-histories/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export function deletePrincipalHistory(id: number) {
  return apiFetch<{ message: string }>(
    `/principal-histories/${id}`,
    {
      method: "DELETE",
    },
  );
}