export interface Achievement {
  id: number | string;
  competition: string;
  studentName: string;
  rank: string;
  level: string;
  year: number;
  photoUrl: string | null;
}