export type Enrollment = {
  _id: string;
  courseId: string;
  userId: string;
  status: "active" | "revoked";
  enrolledAt: Date;
  updatedAt?: Date;
};

export function enrollmentKey(userId: string, courseId: string) {
  return JSON.stringify([userId, courseId]);
}
