"use client";
import { useState } from "react";
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
import { registerUser } from "@/app/api-services/auth-services";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }
    try {
      setLoading(true);

      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Check if backend returned success === false
      if (response.success === false) {
        toast({
          variant: "destructive",
          title: response.message,
          description:
            response.message || "Something went wrong. Please try again.",
        });
        return;
      }

      // If success
      toast({
        title: "Account created successfully!",
        description: "You can now log in with your new account.",
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description:
          error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='name'>Full Name</FieldLabel>
              <Input
                id='name'
                type='text'
                placeholder='John Doe'
                required
                value={formData.name}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                required
                value={formData.email}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor='password'>Password</FieldLabel>
              <Input
                id='password'
                type='password'
                required
                value={formData.password}
                onChange={handleChange}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            {/* <Field>
              <FieldLabel htmlFor='confirmPassword'>
                Confirm Password
              </FieldLabel>
              <Input
                id='confirmPassword'
                type='password'
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field> */}

            <FieldGroup>
              <Field>
                <Button type='submit' disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                </Button>
                <Button variant='outline' type='button'>
                  Sign up with Google
                </Button>
                <FieldDescription className='px-6 text-center'>
                  Already have an account? <a href='/login'>Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
