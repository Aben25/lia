import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import Link from 'next/link';
import { SubmitButton } from './submit-button';
import { sendOtp, signInAction } from '@/app/actions';

const PhoneLogin = () => {
  const [submitBtnLabel, setSubmitBtnLabel] = useState<
    'Send OTP' | 'Sign in' | 'Resend OTP'
  >('Send OTP');
  const submitBtnPendingText: 'Sending...' | 'Signing In...' =
    submitBtnLabel === 'Sign in' ? 'Signing In...' : 'Sending...';
  const handleFormSubmit = async (form: FormData) => {
    sendOtp(form)
      .then(() => setSubmitBtnLabel('Sign in'))
      .catch(() => setSubmitBtnLabel('Resend OTP'));
  };
  return (
    <div className="flex flex-col gap-2 [&>input]:mb-3 [&>input]:text-base [&>input]:p-4 [&>input]:h-10  mt-8">
      <div className="phone-input">
        <Label htmlFor="phone">Phone number</Label>
        <Input type="tel" name="phone" placeholder="888-888-8888" required />
      </div>
      <div className="otp-input">
        <Label htmlFor="otp">OTP</Label>
        <Input
          type="number"
          minLength={6}
          name="otp"
          placeholder="One time pin"
          required
        />
      </div>
      <SubmitButton
        className="text-base h-14 sm:h-11 mt-2"
        pendingText={submitBtnPendingText}
        formAction={handleFormSubmit}
      >
        {submitBtnLabel}
      </SubmitButton>
    </div>
  );
};

export default PhoneLogin;
