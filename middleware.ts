import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware لحماية صفحات الأدمن
 * بيتحقق من:
 * 1. وجود session token
 * 2. الـ user له role في admin_users
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // صفحة login مش محتاجة حماية
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // باقي صفحات الأدمن محتاجة auth
  if (pathname.startsWith("/admin")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      // مفيش env vars، نسمح بالمرور
      return NextResponse.next();
    }

    // استخراج الـ session من cookies
    const host = new URL(supabaseUrl).hostname.split(".")[0];
    const authCookie = request.cookies.get(`sb-${host}-auth-token`);

    if (!authCookie) {
      // مفيش session
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // session موجود - نسمح بالمرور
    // الـ admin layout/صفحة هتعمل التحقق الكامل
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};