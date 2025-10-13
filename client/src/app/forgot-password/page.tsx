"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "../api-services/auth-services";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await requestPasswordReset(email);

      if (!data) throw new Error(data?.message || "Failed to request OTP");

      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (e: any) {
      setError(e?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='max-w-md mx-auto'>
      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your registered email. We'll send a 6-digit code.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className='text-sm text-destructive'>{error}</p>}
          <Button
            className='w-full'
            disabled={loading || !email}
            onClick={submit}
          >
            {loading ? "Requesting..." : "Request OTP"}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
