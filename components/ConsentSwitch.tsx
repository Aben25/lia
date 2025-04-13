'use client';

import * as Switch from '@radix-ui/react-switch';
import Link from 'next/link';
import { UseFormRegisterReturn } from 'react-hook-form';

type ConsentSwitchProps = {
  consent: boolean;
  onChange: (checked: boolean) => void;
  register: UseFormRegisterReturn;
};

const CONSENT_TEXT = `By providing your phone number you agree to receive 
    text messages with one-time passcode (OTP) from Love In Action for 
    authentication and account verification. Message frequency varies. 
    Msg and data rates may apply. Reply HELP for more info or STOP to opt-out.`;

export default function ConsentSwitch({
  consent,
  onChange,
  register,
}: ConsentSwitchProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Switch.Root
          id="consent"
          checked={consent}
          onCheckedChange={onChange}
          className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-black transition-colors"
        >
          <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 transition-transform data-[state=checked]:translate-x-5" />
        </Switch.Root>
        <input type="checkbox" {...register} className="hidden" />
        <label htmlFor="consent" className="text-sm text-gray-500">
          I accept the{' '}
          <Link
            href="/terms-of-service"
            className="text-blue-500 hover:underline"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy-policy"
            className="text-blue-500 hover:underline"
          >
            Privacy Policy
          </Link>{' '}
        </label>
      </div>

      {/* Consent Text */}
      <p className="text-xs text-gray-500 mt-3 leading-relaxed">
        {CONSENT_TEXT}
      </p>
    </div>
  );
}
