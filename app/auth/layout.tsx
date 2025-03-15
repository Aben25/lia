import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-6 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src="/images/Love-Your-Neighbor_20230420_221017_855.jpg"
            alt="Children in community"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
            priority
          />
        </div>
        <div className="relative z-20 flex items-center">
          <Link href="/">
            <Image
              src="/images/color_main_transparent@600x.png"
              alt="Logo"
              width={200}
              height={70}
              priority
              className="dark:invert"
            />
          </Link>
        </div>
        <div className="relative z-20 flex-1 flex flex-col justify-center -mt-20">
          <blockquote className="space-y-2">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Our Mission:
              </h2>
              <p className="text-xl leading-relaxed text-white/90">
                Providing holistic services to children in underprivileged
                communities.
              </p>
            </div>
            <footer className="text-sm text-white/70">
              Making a difference, one child at a time
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-6">
        <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
          {children}
        </div>
      </div>
    </div>
  );
}
