"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/app/api-services/auth-services";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchCurrentUser } from "@/app/store/features/authSlice";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(formData);

      if (response.success === false) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: response.message || "Invalid credentials",
        });
        return;
      }

      toast({
        title: "Login successful!",
        description: "Redirecting to dashboard...",
      });

      await dispatch(fetchCurrentUser());
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description:
          error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='m@example.com'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <a
                    href='#'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <Button type='submit' disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <Button variant='outline' type='button'>
                  Login with Google
                </Button>
                <FieldDescription className='text-center'>
                  Don&apos;t have an account? <a href='/signup'>Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
