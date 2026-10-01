import { apiFetch } from "./api";

export interface ExtracurricularMedia {
 id: number;
 extracurricularId: number;
 type: "IMAGE" | "VIDEO";
 url: string;
 createdAt: string;
 updatedAt: string;
}

interface ExtracurricularMediaResponse {
 message: string;
 data: ExtracurricularMedia[];
}

export async function getExtracurricularMedia(extracurricularId: number) {
 return apiFetch<ExtracurricularMediaResponse>(
  `/extracurriculars/${extracurricularId}/media`,
 );
}
