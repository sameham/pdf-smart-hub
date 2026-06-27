import { NextRequest, NextResponse } from "next/server";

/**
 * Manual setup endpoint - ينشئ admin_users record للمستخدم المسجل حالياً
 * 
 * ⚠️ هذا Endpoint يستخدم service_role key (محتاج نضيفه لـ Vercel)
 * أو يستخدم طريقة بديلة عبر Supabase Management API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // 1. حذف الـ policies القديمة اللي بتسبب recursion
    // (نقدر نعمل ده لو كان عندنا service_role access)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceKey) {
      // Fallback: نطلب من المستخدم يشغل SQL يدوياً
      return NextResponse.json(
        {
          success: false,
          error: "Service role key not configured",
          instructions: "Please run the SQL manually in Supabase Dashboard",
        },
        { status: 500 }
      );
    }

    // 2. استخدام service_role client (bypass RLS)
    const { createClient } = await import("@supabase/supabase-js");
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 3. حذف policies قديمة (بـ service_role نقدر نعمل ده)
    const { error: dropError } = await adminClient.rpc("exec_sql", {
      sql: `
        DROP POLICY IF EXISTS "Anyone authenticated can read admin_users" ON public.admin_users;
        DROP POLICY IF EXISTS "Super admins can manage admin_users" ON public.admin_users;
        DROP POLICY IF EXISTS "Allow first admin bootstrap" ON public.admin_users;
        DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
        DROP POLICY IF EXISTS "Authenticated can read admin_users" ON public.admin_users;
        DROP POLICY IF EXISTS "First admin can self-insert" ON public.admin_users;
      `,
    });

    if (dropError) {
      console.error("Drop policies error:", dropError);
    }

    // 4. إضافة المستخدم كأدمن
    const { data, error } = await adminClient
      .from("admin_users")
      .upsert({
        id: userId,
        role: "super_admin",
        is_active: true,
        notes: `Self-promoted via API${email ? ` (${email})` : ""}`,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST { userId, email } to promote a user to super_admin",
    note: "Requires SUPABASE_SERVICE_ROLE_KEY in env vars",
  });
}