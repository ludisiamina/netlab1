export interface StudentProgress {
  score: number;
  completedLabs: string[];
  badges: string[];
  quizScore?: number; // Out of 20
  studentName?: string;
  lastActiveLab?: string;
}

export interface Badge {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export type LabId = 'lab1' | 'lab2' | 'lab3' | 'lab4' | 'lab5' | 'lab6' | 'exam';

export interface LabMeta {
  id: LabId;
  number: number;
  title: string;
  titleFr: string;
  subtitle: string;
  description: string;
  duration: string;
  xp: number;
  icon: string;
  color: string;
}

export const AUTHOR_SIGNATURE = 'إعداد الأستاذة أمينة – مادة الإعلام الآلي';
export const CURRICULUM_TAG = 'السنة الأولى ثانوي – مادة الإعلام الآلي – الجزائر';
