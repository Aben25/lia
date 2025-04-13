'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInFormData, signInSchema } from '@/lib/validations/auth';
import EmailSignInForm from '@/components/EmailSignInForm';
import LoginFormPhone from '@/components/login-form-phone';
import AuthModeSelector from '@/components/auth-mode-selector';
import PhoneSignInForm from '@/components/PhoneSignInForm';

export default function SignIn() {
  const [authMethod, setAuthMethod] = useState('email');

  return (
    <div className="w-full space-y-6 min-h-404">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <AuthModeSelector activeMode={authMethod} onChange={setAuthMethod} />

      {authMethod === 'email' ? <EmailSignInForm /> : <PhoneSignInForm />}
    </div>
  );
}
