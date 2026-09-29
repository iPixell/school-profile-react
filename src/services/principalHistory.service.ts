import { apiFetch } from "./api";

export interface PrincipalHistory {
 id: number;
 name: string;
 period: string;
 createdAt: string;
 updatedAt: string;
}

interface PrincipalHistoryResponse {
 message: string;
 data: PrincipalHistory[];
}

export async function getPrincipalHistories() {
 return apiFetch<PrincipalHistoryResponse>("/principal-histories");
}
