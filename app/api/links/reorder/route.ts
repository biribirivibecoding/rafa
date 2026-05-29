import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isAuthed } from "@/lib/guard";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { ids } = await req.json().catch(() => ({ ids: [] }));
  if (!Array.isArray(ids)) {
    return NextResponse.json({ ok: false, error: "ids invalido" }, { status: 400 });
  }

  const supabase = createAdminClient();
  await Promise.all(
    ids.map((id: string, position: number) =>
      supabase.from("links").update({ position }).eq("id", id)
    )
  );
  return NextResponse.json({ ok: true });
}
