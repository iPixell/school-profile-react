import { apiFetch } from "./api";
import type { SchoolProfile } from "../types/school";

export function getSchoolProfile() {
  return apiFetch<SchoolProfile>("/school-profile");
}