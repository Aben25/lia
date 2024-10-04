'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div>
      <h1>Welcome to Love in Action</h1>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/sign-up">Sign Up</Link>
    </div>
  );
}
