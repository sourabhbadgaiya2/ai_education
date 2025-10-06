// import { ReactNode } from "react";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// export default async function DashboardLayout({
//   children,
// }: DashboardLayoutProps) {
//   const cookieStore = await cookies();

//   const token = cookieStore.get("token")?.value;

//   console.log("Token in layout:", token); // Debugging line to check the token

//   if (!token) {
//     redirect("/login");
//   }

//   return <div>{children}</div>;
// }

import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken"; // You can use this to validate JWT tokens

interface DashboardLayoutProps {
  children: ReactNode;
}

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || ""; // Your JWT secret

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Redirect if token is missing
  if (!token) {
    redirect("/login");
  }

  // Optional: validate token
  try {
    jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // Token is invalid or expired
    redirect("/login");
  }

  return <div>{children}</div>;
}
