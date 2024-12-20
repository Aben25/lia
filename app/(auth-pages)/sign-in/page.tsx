'use client';

import { signInAction } from '@/app/actions';
import { FormMessage } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const result = await signInAction(formData);
    if ('error' in result) {
      setError(result.error);
    } else {
      router.push('/protected');
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              className="text-primary font-medium hover:underline"
              href="/sign-up"
            >
              Sign up
            </Link>
          </p>
        </div>

        <form className="space-y-4" action={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-sm text-primary hover:underline"
                href="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full"
            />
          </div>

          <SubmitButton
            formAction={handleSubmit}
            pendingText="Signing in..."
            className="w-full"
          >
            Sign in
          </SubmitButton>

          {error && <FormMessage message={{ error: error }} />}
        </form>
      </div>
    </div>
  );
}
