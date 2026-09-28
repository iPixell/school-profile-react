import { apiFetch } from "./api";
import type { Achievement } from "../types/achievement";

export function getLatestAchievements() {
  return apiFetch<Achievement[]>("/achievements/latest");
}