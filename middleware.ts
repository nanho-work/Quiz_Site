import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();
  if (hostname === "admin.koofy.co.kr" && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/"] };
