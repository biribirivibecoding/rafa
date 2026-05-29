import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isAuthed } from "@/lib/guard";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { profile_id, title, url, subtitle } = await req.json().catch(() => ({}));
  if (!profile_id) {
    return NextResponse.json({ ok: false, error: "profile_id ausente" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { count } = await supabase
    .from("links")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", profile_id);

  const { data, error } = await supabase
    .from("links")
    .insert({
      profile_id,
      title: title ?? "Novo link",
      url: url ?? "",
      subtitle: subtitle ?? null,
      position: count ?? 0,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, link: data });
}
