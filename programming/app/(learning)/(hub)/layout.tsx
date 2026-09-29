import '@/app/academy.css';
import '@/app/public-hub.css';

export default function LearningHubLayout({ children }: { children: React.ReactNode }) {
  return <div className="public-hub learning-hub">{children}</div>;
}
