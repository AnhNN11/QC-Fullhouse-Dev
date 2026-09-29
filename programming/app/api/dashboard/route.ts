import { getDashboardData } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(await getDashboardData(), {
    headers: { "Cache-Control": "no-store" },
  });
}
