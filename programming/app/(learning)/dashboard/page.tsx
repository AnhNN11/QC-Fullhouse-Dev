import Dashboard from "@/app/dashboard";
import { getDashboardData } from "@/lib/db";
import { getSessionUser } from "@/lib/user-auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  return <Dashboard initialData={await getDashboardData()} initialUser={await getSessionUser()} />;
}
