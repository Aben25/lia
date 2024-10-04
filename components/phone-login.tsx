import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { SubmitButton } from './submit-button';
import { sendOtp, verifyOtp } from '@/app/actions';

const PhoneLogin = () => {
  const [otpStep, setOtpStep] = useState<
    'SEND_OTP' | 'RESEND_OTP' | 'VERIFY_OTP'
  >('SEND_OTP');
  const submitBtnLabel =
    otpStep === 'SEND_OTP'
      ? 'Send OTP'
      : otpStep === 'RESEND_OTP'
        ? 'Resend OTP'
        : 'Sign in';

  const submitBtnPendingText =
    otpStep === 'VERIFY_OTP' ? 'Signing In...' : 'Sending...';

  const handleFormSubmit = async (formData: FormData) => {
    if (otpStep === 'VERIFY_OTP') {
      verifyOtp(formData);
    } else {
      sendOtp(formData)
        .then((res) => {
          if (res.error) {
            setOtpStep('RESEND_OTP');
          } else {
            setOtpStep('VERIFY_OTP');
          }
        })
        .catch(() => setOtpStep('RESEND_OTP'));
    }
  };
  return (
    <div className="flex flex-col gap-2 [&>input]:mb-3 [&>input]:text-base [&>input]:p-4 [&>input]:h-10  mt-8">
      <div className="phone-input">
        <Label htmlFor="phone">Phone number</Label>
        <Input type="tel" name="phone" placeholder="888-888-8888" required />
      </div>
      {otpStep === 'VERIFY_OTP' && (
        <>
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
        </>
      )}

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
