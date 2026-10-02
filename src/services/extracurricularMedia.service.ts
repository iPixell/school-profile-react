import { apiFetch } from "./api";

export interface ExtracurricularMedia {
    id: number;
    extracurricularId: number;
    type: "IMAGE" | "VIDEO";
    url: string;
    createdAt: string;
    updatedAt: string;
}

interface MediaListResponse {
    message: string;
    data: ExtracurricularMedia[];
}

interface MediaResponse {
    message: string;
    data: ExtracurricularMedia;
}

export async function getExtracurricularMedia(
    extracurricularId: number,
) {
    return apiFetch<MediaListResponse>(
        `/extracurriculars/${extracurricularId}/media`,
    );
}

export async function uploadExtracurricularMedia(
    extracurricularId: number,
    file: File,
) {
    const formData = new FormData();
    formData.append("file", file);

    return apiFetch<MediaResponse>(
        `/extracurriculars/${extracurricularId}/media`,
        {
            method: "POST",
            body: formData,
        },
    );
}
