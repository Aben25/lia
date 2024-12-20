import { forgotPasswordAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form className="space-y-4" action={forgotPasswordAction}>
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

          <SubmitButton
            formAction={forgotPasswordAction}
            pendingText="Sending reset link..."
            className="w-full"
          >
            Send reset link
          </SubmitButton>

          {searchParams && <FormMessage message={searchParams} />}

          <div className="text-center text-sm">
            <Link className="text-primary hover:underline" href="/sign-in">
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
