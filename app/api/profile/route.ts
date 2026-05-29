import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isAuthed } from "@/lib/guard";

const ALLOWED = [
  "name",
  "bio",
  "logo_url",
  "footer",
  "bg_color",
  "bg_gradient_end",
  "text_color",
  "button_style",
  "button_border_color",
  "button_fill_color",
  "button_text_color",
  "button_radius",
  "button_shadow",
  "font",
  "social_position",
  "social_links",
] as const;

export async function PUT(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { id, ...rest } = body as Record<string, unknown>;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ ok: false, error: "id ausente" }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ALLOWED) {
    if (key in rest) update[key] = rest[key];
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("profiles").update(update).eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
