import { apiFetch } from "./api";

export interface Achievement {
 id: number;
 competition: string;
 studentName: string;
 rank: string;
 level: string;
 year: number;
 photoUrl: string | null;
 createdAt: string;
 updatedAt: string;
}

interface AchievementResponse {
 message: string;
 data: Achievement[];
}

export async function getAchievements() {
 return apiFetch<AchievementResponse>("/achievements");
}
