import { apiFetch } from "./api";

export interface Extracurricular {
 id: number;
 name: string;
 photoUrl: string | null;
 createdAt: string;
 updatedAt: string;
}

interface ExtracurricularResponse {
 message: string;
 data: Extracurricular[];
}

export async function getExtracurriculars() {
 return apiFetch<ExtracurricularResponse>("/extracurriculars");
}
