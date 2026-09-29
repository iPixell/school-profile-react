import { apiFetch } from "./api";

export interface PrincipalHistory {
 id: string;
 name: string;
 startYear: number;
 endYear: number | null;
}

interface PrincipalHistoryResponse {
 message: string;
 data: PrincipalHistory[];
}

export async function getPrincipalHistories() {
 return apiFetch<PrincipalHistoryResponse>("/principal-histories");
}
