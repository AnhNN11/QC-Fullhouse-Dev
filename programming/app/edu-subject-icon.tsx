import {
  Accessibility, Binary, Blocks, Braces, ChartNoAxesCombined,
  Code2, Database, FileCode2, Files, Filter, FolderOpen, GitBranch,
  Hash, Layers, LayoutTemplate, Link2, ListOrdered, ListTree,
  MessageSquare, Network, NotebookPen, Search, ShieldCheck,
  Sigma, Sparkles, Table2, Terminal, TestTube2, Timer, Workflow,
  type LucideIcon,
} from 'lucide-react';

// Match each subject in eduPrograms, not just the course's overall category.
const icons: Record<string, readonly LucideIcon[]> = {
  frontend: [FileCode2, LayoutTemplate, Braces, Blocks, Accessibility, FolderOpen],
  python: [Terminal, GitBranch, Blocks, ListTree, Files, TestTube2],
  algorithms: [Search, Timer, Filter, ListOrdered, GitBranch, Workflow],
  'data-structures': [Binary, Layers, ListOrdered, Link2, Hash, Network],
  sql: [Table2, Link2, Sigma, Layers, Filter, Database],
  interview: [ListOrdered, Network, ChartNoAxesCombined, MessageSquare, ShieldCheck, NotebookPen],
};

export default function EduSubjectIcon({ program, index }: { program: string; index: number }) {
  const Icon = icons[program]?.[index] ?? (index === 0 ? Code2 : Sparkles);
  return <span className="ed-subject-icon" aria-hidden="true"><Icon size={34} strokeWidth={1}/></span>;
}
