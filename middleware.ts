import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";

const ADMIN_HOST_PREFIX = "admin.";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = (req.headers.get("host") || "").split(":")[0];
  const isAdminSubdomain = host.startsWith(ADMIN_HOST_PREFIX);

  // No subdominio admin.*, reescreve a raiz para /admin
  if (isAdminSubdomain && !url.pathname.startsWith("/admin") && !url.pathname.startsWith("/api")) {
    const rewritten = url.clone();
    rewritten.pathname = `/admin${url.pathname === "/" ? "" : url.pathname}`;
    return guard(req, NextResponse.rewrite(rewritten));
  }

  // Protege rotas /admin (exceto login)
  if (url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/login")) {
    return guard(req, NextResponse.next());
  }

  return NextResponse.next();
}

async function guard(req: NextRequest, passThrough: NextResponse) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const authed = await verifySessionToken(token);
  if (authed) return passThrough;

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
