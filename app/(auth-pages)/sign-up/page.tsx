'use client';

import { signUpAction } from '@/app/actions';
import { FormMessage } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { SmtpMessage } from '../smtp-message';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState<{ type?: string; content?: string } | null>(null);
  const router = useRouter();

  const handleSignUp = async (formData: FormData) => {
    const result = await signUpAction(formData);
    if (result.showPopup || result.error) {
      setShowPopup(true);
      setMessage({ 
        type: result.success ? 'success' : 'error', 
        content: result.message || result.error 
      });
    }
  };

  const isEmailAlreadyRegistered = message?.content?.includes('Email already registered');

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto" action={handleSignUp}>
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{' '}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={handleSignUp} pendingText="Signing up...">
            Sign up
          </SubmitButton>
        </div>
      </form>
      <SmtpMessage />
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{message?.type === 'success' ? 'Sign Up Successful' : 'Sign Up Failed'}</DialogTitle>
          </DialogHeader>
          <p>{message?.content}</p>
          {message?.type === 'success' ? (
            <Button onClick={() => router.push('/sign-in')}>Go to Login Page</Button>
          ) : isEmailAlreadyRegistered ? (
            <div className="flex flex-col gap-2 mt-4">
              <Button onClick={() => router.push('/sign-in')}>Go to Login Page</Button>
              <Button onClick={() => router.push('/forgot-password')} variant="outline">Reset Password</Button>
            </div>
          ) : (
            <>
              <p className="mt-4">
                If you need assistance, please contact us at:
                <br />
                Email: <a href="mailto:abenuro@gmail.com" className="text-primary">abenuro@gmail.com</a>
                <br />
                Phone: <a href="tel:2404616140" className="text-primary">240-461-6140</a>
              </p>
              <Button onClick={() => setShowPopup(false)} className="mt-4">Close</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}