'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ConsentSwitch from './ConsentSwitch';
import { RotateCw } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Button } from './ui/button';
import Spinner from './ui/spinner';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { stripUSPhone, formatUSInternational } from '@/utils/phoneFormat';

const RESEND_COOLDOWN = 30;

const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (val) => /^\+\d+/.test(val),
      'Must be a valid international number starting with +'
    )
    .refine(
      (val) => /^\+1 \d{3} \d{3} \d{4}$/.test(val),
      'Please enter a valid US phone number'
    ),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to receive text messages',
  }),
});

type PhoneSchema = z.infer<typeof phoneSchema>;

export default function PhoneSignInForm() {
  const supabase = createClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<PhoneSchema>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '', consent: false },
    mode: 'onSubmit',
  });

  const phone = watch('phone');
  const consent = watch('consent');

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [resendIntervalId, setResendIntervalId] =
    useState<NodeJS.Timeout | null>(null);

  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [formattedValue, setFormattedValue] = useState('');

  // Start cooldown timer and clear existing intervals
  const startResendCooldown = () => {
    if (resendIntervalId) {
      clearInterval(resendIntervalId);
    }

    setResendTimer(RESEND_COOLDOWN);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setResendIntervalId(interval);
  };

  const sendOtp = async (phone: string) => {
    phone = stripUSPhone(phone);

    try {
      setError('');
      setSuccess('');
      setIsLoading(true);

      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        setSuccess('OTP sent! Check your phone.');
        setStep('otp');
        startResendCooldown();
        setTimeout(() => otpRefs.current[0]?.focus(), 300);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSendOtp = async (data: PhoneSchema) => {
    await sendOtp(data.phone);
  };

  const onResendOtp = async () => {
    await sendOtp(phone);
  };

  const onVerifyOtp = async () => {
    try {
      setError('');
      setSuccess('');

      const otp = otpDigits.join('');
      if (otp.length < 6) {
        setError('Please enter the 6-digit OTP sent to your phone.');
        return;
      }

      setIsLoading(true);
      const { error: supabaseError } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (supabaseError) {
        setError(supabaseError.message);
      } else {
        router.refresh();
        router.push('/protected/your-child');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePhone = (e) => {
    e.preventDefault();
    setStep('phone');
    setOtpDigits(Array(6).fill(''));
    setError('');
    setSuccess('');
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);

    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePhoneInput = (e: React.FormEvent<HTMLInputElement>) => {
    const formatted = formatUSInternational(e.currentTarget.value);
    setFormattedValue(formatted);
    setValue('phone', formatted, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSendOtp)} className="space-y-4">
        {step === 'phone' ? (
          <>
            <Input
              autoFocus
              type="tel"
              inputMode="numeric"
              placeholder="+1 123 456 7890"
              value={formattedValue}
              onChange={(e) => {
                handlePhoneInput(e);
                register('phone').onChange(e);
              }}
              onBlur={register('phone').onBlur}
              className="w-full border px-4 py-2 rounded text-black placeholder-gray-400"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}

            <ConsentSwitch
              consent={consent}
              onChange={(checked) =>
                setValue('consent', checked, { shouldValidate: true })
              }
              register={register('consent')}
            />
            {errors.consent && (
              <p className="text-sm text-red-600">{errors.consent.message}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Sending OTP...</span>
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <Input
                type="text"
                value={phone}
                disabled
                className="w-full border px-4 py-2 rounded bg-gray-100 text-black"
              />
              <button
                type="button"
                onClick={handleChangePhone}
                className="text-sm text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>

            <div className="flex justify-center gap-2">
              {otpDigits.map((digit, i) => (
                <Input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el!)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-12 text-center border rounded text-xl"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                />
              ))}
            </div>

            <Button
              type="button"
              onClick={onVerifyOtp}
              className="w-full"
              size="lg"
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Verifying...</span>
                </>
              ) : (
                'Verify & Sign In'
              )}
            </Button>

            <div className="flex flex-col items-center space-y-2 mt-3">
              {resendTimer > 0 ? (
                <p className="text-xs text-gray-500">
                  Resend OTP in {resendTimer}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={onResendOtp}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <RotateCw className="w-4 h-4" />
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}
      </form>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      {success && (
        <p className="text-sm text-green-600 text-center">{success}</p>
      )}
    </div>
  );
}
