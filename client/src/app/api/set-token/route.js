import { NextResponse } from "next/server";

export async function POST(request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ message: "Token missing" }, { status: 400 });
  }

  const isProduction = process.env.NODE_ENV === "production";

  const response = NextResponse.json({ success: true });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 24 * 60 * 60,
    path: "/",
  });

  return response;
}
