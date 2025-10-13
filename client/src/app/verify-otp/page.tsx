// /app/verify-otp/page.tsx
"use client";

import VerifyOtpPage from "@/components/VerifyOtpPage";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function VerifyOtpWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpPage />
    </Suspense>
  );
}
