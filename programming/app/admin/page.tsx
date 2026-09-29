import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminData } from "@/lib/db";
import AdminLoginForm from "./login-form";
import AdminShell from "./admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!await isAdminAuthenticated()) return <AdminLoginForm />;
  return <AdminShell initialData={await getAdminData()} />;
}
