import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  console.log("Token in layout:", token); // Debugging line to check the token

  if (!token) {
    redirect("/login");
  }

  return <div>{children}</div>;
}
