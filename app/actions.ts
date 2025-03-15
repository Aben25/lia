'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export interface SendOtpResponse {
  messageId: string;
  error: {
    message: string;
    status: number;
    code: string;
  } | null;
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const supabase = createClient();
  const origin = headers().get('origin');

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return { error: error.message };
  } else if (data?.user?.identities?.length === 0) {
    return {
      success: false,
      message:
        'Email already registered. Please sign in or reset your password.',
      showPopup: true,
    };
  } else {
    return {
      success: true,
      message:
        'Thanks for signing up! Please check your email for a verification link.',
      showPopup: true,
    };
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (!data?.session) {
    return { error: 'No session created' };
  }

  return redirect('/protected/your-child');
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const supabase = createClient();
  const origin = headers().get('origin');
  const callbackUrl = formData.get('callbackUrl')?.toString();

  if (!email) {
    return encodedRedirect(
      'error',
      '/auth/reset-password',
      'Email is required'
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/auth/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      'error',
      '/auth/reset-password',
      'Could not reset password'
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    'success',
    '/auth/reset-password',
    'Check your email for a link to reset your password.'
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient();

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      'error',
      '/auth/reset-password',
      'Password and confirm password are required'
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      'error',
      '/auth/reset-password',
      'Passwords do not match'
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      'error',
      '/auth/reset-password',
      'Password update failed'
    );
  }

  return encodedRedirect('success', '/auth/reset-password', 'Password updated');
};

export const sendOtp = async (formData: FormData): Promise<SendOtpResponse> => {
  const phone = formData.get('phone') as string;
  const supabase = createClient();

  return supabase.auth
    .signInWithOtp({
      phone,
    })
    .then(({ data, error }) => {
      return {
        messageId: data.messageId ?? '',
        error: error
          ? {
              message: error.message,
              status: error.status ?? 0,
              code: error.code ?? '',
            }
          : null,
      };
    });
};

export const verifyOtp = async (formData: FormData) => {
  const phone = formData.get('phone') as string;
  const token = formData.get('otp') as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message);
  }

  return redirect('/protected');
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect('/auth/sign-in');
};
