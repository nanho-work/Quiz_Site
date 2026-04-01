import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const baseUrl =
    process.env.KEVINTAX_API_BASE_URL ||
    process.env.NEXT_PUBLIC_KEVINTAX_API_BASE_URL;

  if (!baseUrl) {
    return new NextResponse(
      "서버 환경변수 KEVINTAX_API_BASE_URL이 설정되지 않았습니다.",
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new NextResponse("잘못된 요청 본문입니다.", { status: 400 });
  }

  try {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const forwardedHost =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host");

    const upstreamHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (origin) {
      upstreamHeaders.origin = origin;
    }
    if (referer) {
      upstreamHeaders.referer = referer;
    }
    if (forwardedHost) {
      upstreamHeaders["x-forwarded-host"] = forwardedHost;
    }

    const upstreamResponse = await fetch(
      `${baseUrl.replace(/\/$/, "")}/public/marketing/consultation-leads`,
      {
        method: "POST",
        headers: upstreamHeaders,
        body: JSON.stringify(payload),
      }
    );

    const responseText = await upstreamResponse.text();
    return new NextResponse(responseText, {
      status: upstreamResponse.status,
      headers: {
        "Content-Type":
          upstreamResponse.headers.get("content-type") ||
          "application/json; charset=utf-8",
      },
    });
  } catch {
    return new NextResponse("상담 서버 연결에 실패했습니다.", { status: 502 });
  }
}
