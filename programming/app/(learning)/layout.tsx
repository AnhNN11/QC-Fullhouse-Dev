import LearningShell from '@/app/learning-shell';
import { getSessionUser } from '@/lib/user-auth';
export default async function LearningLayout({ children }: { children: React.ReactNode }) {
  return <LearningShell initialUser={await getSessionUser()}>{children}</LearningShell>;
}
