import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware لحماية صفحات الأدمن
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // صفحات مش محتاجة حماية
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/setup")
  ) {
    return NextResponse.next();
  }

  // باقي صفحات الأدمن محتاجة auth
  if (pathname.startsWith("/admin")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      return NextResponse.next();
    }

    const host = new URL(supabaseUrl).hostname.split(".")[0];
    const authCookie = request.cookies.get(`sb-${host}-auth-token`);

    if (!authCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};