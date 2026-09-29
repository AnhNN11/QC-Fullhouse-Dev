export type Course = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  level: string;
  lessons: number;
  students: string;
  progress: number;
  enrolled?: boolean;
  introVideoUrl?: string;
  audience?: string;
  outcomes?: string[];
  prerequisites?: string[];
  modules: string[];
};

export type Problem = {
  gradingEnabled?: boolean;
  id: number;
  slug: string;
  title: string;
  topic: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  acceptance: string;
  status: "done" | "started" | "new";
  statement: string;
  exampleInput: string;
  exampleOutput: string;
  explanation: string;
  constraints: string[];
  starterCode: string;
};

export type Learner = {
  name: string;
  initials: string;
  level: number;
  xp: number;
  streak: number;
  bestStreak: number;
};

export type DashboardData = {
  today: string;
  learner: Learner;
  courses: Course[];
  problems: Problem[];
  topics: string[];
  solvedCount: number;
  totalProblems: number;
  learningDays: number[];
  weeklyActivity: number[];
};

export type SubmissionResult = {
  accepted: boolean;
  passed: number;
  total: number;
  runtimeMs: number;
  message: string;
};
