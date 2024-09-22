import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import Link from 'next/link';
import { SubmitButton } from './submit-button';
import { signInAction } from '@/app/actions';

const EmailLogin = () => {
  return (
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
        formAction={signInAction}
      >
        Sign in
      </SubmitButton>
    </div>
  );
};

export default EmailLogin;
