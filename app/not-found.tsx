'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">Oops! Page Not Found</h2>
      <p className="text-xl mb-8">We're currently working on this page. Please check back later!</p>
      <Link 
        href="/" 
        className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <ArrowLeft className="mr-2" size={20} />
        Go back home
      </Link>
    </div>
  );
}