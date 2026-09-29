import type { Course } from './types';

export function isCourseInProgress(course: Course) {
  return course.enrolled === true && course.progress > 0 && course.progress < 100;
}

export function dashboardCourseHref(course: Course, signedIn: boolean) {
  return `/courses/${encodeURIComponent(course.id)}${signedIn && course.enrolled === true ? '/learn' : ''}`;
}

export function dashboardCourseLabel(course: Course, signedIn: boolean) {
  if (!signedIn || !course.enrolled) return 'Khám phá';
  if (course.progress >= 100) return 'Ôn tập';
  return course.progress > 0 ? 'Tiếp tục' : 'Vào học';
}
