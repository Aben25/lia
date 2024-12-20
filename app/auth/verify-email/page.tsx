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
          We've sent you a verification link. Please check your email to verify
          your account.
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          <p>
            If you don't see the email in your inbox, please check your spam
            folder.
          </p>
          <p>
            Still can't find it?{' '}
            <Link
              href="/auth/sign-in"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Try signing in again
            </Link>
          </p>
        </div>

        <Button asChild className="w-full" size="lg">
          <Link href="/auth/sign-in">Back to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
