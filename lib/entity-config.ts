export const entityConfigs = {
  teachers: {
    collection: "teachers",
    required: ["code", "name", "status"],
    allowed: ["key", "code", "name", "initials", "email", "classes", "score", "trend", "status", "managedBy", "order"],
    defaults: { managedBy: "qc-fullhouse", classes: 0, score: 0, trend: 0 },
    sort: { order: 1, name: 1 },
  },
  contests: {
    collection: "contests",
    required: ["code", "name", "teacherIds", "startTime", "endTime"],
    allowed: ["code", "name", "teacherIds", "startTime", "endTime", "sourceUrl", "sourceAuthors", "notes", "createdAt", "updatedAt"],
    defaults: {},
    sort: { endTime: 1, startTime: -1 },
  },
} as const;

export type EntityName = keyof typeof entityConfigs;

export function isEntityName(value: string): value is EntityName {
  return value in entityConfigs;
}
