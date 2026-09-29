"use client";
import { useActionState, type ReactNode } from "react";
import type { ActionState } from "./actions";
import { Button } from "@/components/ui/button";

export default function AcademyForm({ action, children, label }: { action: (state: ActionState, form: FormData) => Promise<ActionState>; children: ReactNode; label: string }) {
  const [state, submit, pending] = useActionState(action, {});
  return <form action={submit} className="academy-form">{children}<Button type="submit" disabled={pending}>{pending ? "Đang xử lý…" : label}</Button>{state.error && <p role="alert" className="admin-form-error">{state.error}</p>}{state.success && <p role="status">{state.success}</p>}{state.accessCode && <code className="access-code">{state.accessCode}</code>}</form>;
}
