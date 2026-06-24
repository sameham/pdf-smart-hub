import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware لحماية صفحات الأدمن
 * - بيتحقق من وجود session
 * - بيتحقق من admin role
 * - بيروح لصفحة login لو مش مسجل
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // فقط صفحات الأدمن
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // التحقق من الـ session cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // استخراج الـ access token من الـ cookies
  const accessToken = request.cookies.get("sb-access-token")?.value
    || request.cookies.get(`sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`)?.value;

  if (!accessToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // التحقق من الـ user
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid session");
    }

    const user = await response.json();

    // التحقق من admin role
    const adminCheck = await fetch(
      `${supabaseUrl}/rest/v1/admin_users?id=eq.${user.id}&select=role,is_active`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!adminCheck.ok) {
      throw new Error("Failed to verify admin status");
    }

    const adminData = await adminCheck.json();

    if (!adminData || adminData.length === 0 || !adminData[0]?.is_active) {
      // مش admin
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(homeUrl);
    }

    // إضافة headers إضافية للـ request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-user-role", adminData[0].role);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};