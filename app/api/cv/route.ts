import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createResumeSchema } from "@/lib/validations/resume";
import { PLAN_LIMITS } from "@/lib/constants";
import type { PlanType } from "@/types";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ resumes: data });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single<{ plan: PlanType }>();

  const plan = profile?.plan ?? "free";
  const maxResumes = PLAN_LIMITS[plan].max_resumes;

  if (Number.isFinite(maxResumes)) {
    const { count } = await supabase
      .from("resumes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count ?? 0) >= maxResumes) {
      return NextResponse.json(
        { error: "Batas jumlah CV tercapai. Upgrade ke Pro untuk membuat CV tanpa batas." },
        { status: 403 }
      );
    }
  }

  const body = await request.json();
  const parsed = createResumeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: parsed.data.title ?? "CV Saya",
      data: parsed.data.data,
      template: parsed.data.template ?? "minimalis",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ resume: data }, { status: 201 });
}
