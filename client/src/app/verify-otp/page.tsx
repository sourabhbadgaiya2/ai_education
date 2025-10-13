"use client";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp, // send OTP instead of token
            newPassword: p1,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Reset failed");

      router.push("/login"); // redirect after successful reset
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const valid = otp.length === 6 && p1.length >= 8 && p1 === p2;

  return (
    <section className='max-w-md mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter OTP and your new password.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <Input placeholder='Email' value={email} readOnly />
          <Input
            placeholder='OTP (6 digits)'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Input
            type='password'
            placeholder='New password (min 8 chars)'
            value={p1}
            onChange={(e) => setP1(e.target.value)}
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
          <Input
            type='password'
            placeholder='Confirm new password'
            value={p2}
            onChange={(e) => setP2(e.target.value)}
          />
          {error && <p className='text-sm text-destructive'>{error}</p>}
          <Button
            className='w-full'
            disabled={loading || !valid}
            onClick={submit}
          >
            Reset Password
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
