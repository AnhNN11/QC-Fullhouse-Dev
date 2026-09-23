export const entityConfigs = {
  teachers: {
    collection: "teachers",
    required: ["code", "name", "subject", "status"],
    allowed: ["key", "code", "name", "initials", "subject", "email", "phone", "classes", "score", "trend", "status", "managedBy", "order"],
    defaults: { managedBy: "qc-fullhouse", classes: 0, score: 0, trend: 0 },
    sort: { order: 1, name: 1 },
  },
  courses: {
    collection: "courses",
    required: ["code", "name", "level", "durationWeeks", "status"],
    allowed: ["code", "name", "level", "durationWeeks", "description", "status", "createdAt", "updatedAt"],
    defaults: {},
    sort: { createdAt: -1 },
  },
  classes: {
    collection: "course_classes",
    required: ["code", "name", "courseId", "teacherId", "startDate", "schedule", "status"],
    allowed: ["code", "name", "courseId", "teacherId", "startDate", "schedule", "room", "studentCount", "status", "createdAt", "updatedAt"],
    defaults: { studentCount: 0 },
    sort: { createdAt: -1 },
  },
  sessions: {
    collection: "class_sessions",
    required: ["classId", "sessionNo", "date", "startTime", "endTime", "topic", "status", "recordingStatus"],
    allowed: ["classId", "sessionNo", "date", "startTime", "endTime", "topic", "note", "status", "recordingUrl", "recordingStatus", "qcNote", "createdAt", "updatedAt"],
    defaults: { recordingStatus: "pending_upload" },
    sort: { date: -1, sessionNo: 1 },
  },
  contests: {
    collection: "contests",
    required: ["code", "name", "teacherId", "startTime", "endTime"],
    allowed: ["code", "name", "teacherId", "startTime", "endTime", "sourceUrl", "notes", "createdAt", "updatedAt"],
    defaults: {},
    sort: { endTime: 1, startTime: -1 },
  },
} as const;

export type EntityName = keyof typeof entityConfigs;

export function isEntityName(value: string): value is EntityName {
  return value in entityConfigs;
}
