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
    <form className="flex-1 flex flex-col w-full sm:max-w-xs mx-0" action={handleSubmit}>
      <h1 className="text-2xl font-medium text-center">Sign in</h1>
      <p className="text-sm text-foreground text-center">
        Don't have an account?{' '}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 [&>input]:text-base [&>input]:p-4 [&>input]:h-10  mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton
          className="text-base h-14 sm:h-11 mt-2"
          pendingText="Signing In..."
        >
          Sign in
        </SubmitButton>
        {error && <FormMessage message={{ type: 'error', message: error }} />}
      </div>
    </form>
  );
}
