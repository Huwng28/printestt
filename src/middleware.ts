import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("authToken")?.value;
  const path = req.nextUrl.pathname;

  // ✅ Bỏ qua middleware cho các route không cần đăng nhập
  const publicRoutes = ["/login", "/signup", "/"];
  if (publicRoutes.includes(path) || path.match(/^\/collection\/.+/)) {
    return NextResponse.next();
  }

  // ❌ Nếu chưa đăng nhập, redirect về login
  if (!authToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// 🔥 Chỉ áp dụng middleware cho trang cần bảo vệ
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
