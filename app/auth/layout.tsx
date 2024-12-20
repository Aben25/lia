import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col max-w-screen-xl mx-auto px-4 gap-8 py-8">
      {/* Logo */}
      <div className="flex justify-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Love in Action"
            width={180}
            height={60}
            className="dark:invert"
            priority
          />
        </Link>
      </div>

      {/* Auth Form Container */}
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-[400px] p-6 bg-card rounded-lg border shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
