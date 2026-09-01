import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit";

// Called client-side right after a password-based sign-in/sign-up, since
// those flows never touch a server route (unlike OAuth/magic-link which
// redirect through /api/auth/callback). Relies on the session cookie the
// browser client has already written.
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await logAuditEvent({ userId: user.id, action: "auth.login", request });
  }

  return NextResponse.json({ success: true });
}
