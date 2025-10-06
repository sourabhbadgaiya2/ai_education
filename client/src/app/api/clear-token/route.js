import { NextResponse } from "next/server";

export async function POST(request) {
  const response = NextResponse.json({
    success: true,
    message: "Token cleared",
  });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
