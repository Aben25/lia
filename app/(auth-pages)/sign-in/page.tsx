'use client';

import { signInAction } from '@/app/actions';
import EmailLogin from '@/components/email-login';
import { FormMessage, Message } from '@/components/form-message';
import PhoneLogin from '@/components/phone-login';
import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';

type LoginType = 'email' | 'phone';

export default function Login({ searchParams }: { searchParams: Message }) {
  const [loginType, setLoginType] = useState<LoginType>('email');

  const secondaryBtnLabel =
    loginType === 'email' ? 'Sign in with phone' : 'Sign in with email';

  const toggleLoginType = (): LoginType =>
    loginType === 'email' ? 'phone' : 'email';

  return (
    <form className="flex-1 flex flex-col w-full sm:max-w-xs mx-0">
      <h1 className="text-2xl font-medium text-center">Sign in</h1>
      <p className="text-sm text-foreground text-center">
        Don't have an account?{' '}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      {loginType === 'email' ? <EmailLogin /> : <PhoneLogin />}
      <Button
        variant="outline"
        type="button"
        onClick={() => setLoginType(toggleLoginType())}
      >
        {secondaryBtnLabel}
      </Button>
      <FormMessage message={searchParams} />
    </form>
  );
}
