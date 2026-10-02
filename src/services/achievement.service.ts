import { apiFetch } from "./api";
import type { Achievement } from "../types/achievement";

interface AchievementListResponse {
  message?: string;
  data: Achievement[];
}

interface AchievementResponse {
  message?: string;
  data: Achievement;
}

export async function getAchievements(): Promise<Achievement[]> {
  const response = await apiFetch<
    Achievement[] | AchievementListResponse
  >("/achievements");

  return Array.isArray(response) ? response : response.data;
}

export async function createAchievement(formData: FormData) {
  return apiFetch<AchievementResponse>("/achievements", {
    method: "POST",
    body: formData,
  });
}

export async function updateAchievement(
  id: number | string,
  formData: FormData,
) {
  return apiFetch<AchievementResponse>(`/achievements/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteAchievement(id: number | string) {
  return apiFetch<{ message: string }>(`/achievements/${id}`, {
    method: "DELETE",
  });
}