export type TeacherStatus = "active" | "warning" | "reviewing";

export type TeacherRecord = {
  key: string;
  name: string;
  initials: string;
  classes: number;
  score: number;
  trend: number;
  status: TeacherStatus;
};

export type DashboardData = {
  stats: {
    totalTeachers: number;
    averageScore: number;
    evaluatedSessions: number;
    attentionNeeded: number;
  };
  teachers: TeacherRecord[];
  pendingRecordings: Array<{
    day: string;
    month: string;
    title: string;
    teacher: string;
    time: string;
    room: string;
    color: string;
    reviewStatus: string;
  }>;
  tip: string;
};
