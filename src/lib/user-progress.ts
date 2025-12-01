export type UserProgress = {
  currentLevelId: string;
  currentLessonId: string;
  xp: number;
  coins: number;
  streakDays: number;
  lastStudyDate: string | null;
  completedLessons: string[];
  earnedBadges: string[];
};
