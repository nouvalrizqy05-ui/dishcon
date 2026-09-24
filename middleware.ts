import { NextRequest, NextResponse } from "next/server";

const roleRules = [
  { prefix: "/admin", role: "admin" },
  { prefix: "/mitra", role: "mitra" },
  { prefix: "/mahasiswa", role: "mahasiswa" }
] as const;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname === "/mitra/login" || pathname === "/mitra/register") return NextResponse.next();
  const rule = roleRules.find((item) => pathname === item.prefix || pathname.startsWith(`${item.prefix}/`));
  if (!rule) return NextResponse.next();

  const session = req.cookies.get("dishcon_session")?.value;
  const role = req.cookies.get("dishcon_role")?.value;

  if (!session || !role) {
    const url = req.nextUrl.clone();
    url.pathname = rule.role === "admin" ? "/admin/login" : "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (role !== rule.role) {
    const url = req.nextUrl.clone();
    url.pathname = role === "admin" ? "/admin/dashboard" : role === "mitra" ? "/mitra/dashboard" : role === "mahasiswa" ? "/mahasiswa/dashboard" : "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mitra/:path*", "/mahasiswa/:path*"]
};
