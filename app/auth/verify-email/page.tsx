'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyEmail() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="text-sm text-muted-foreground">
          We've sent you a verification link. Please check your email and click
          the link to verify your account.
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          Didn't receive the email? Check your spam folder or try signing in to
          resend the verification email.
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/sign-in">Return to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
