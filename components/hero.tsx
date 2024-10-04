import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import logo from '@assets/logo/color_main_transparent@600x.png';

export default function Hero() {
  return (
    <div className="flex flex-col gap-12 items-center py-20 px-4 max-w-6xl mx-auto">
      <div className="w-full max-w-[200px]">
        <Image
          src={logo}
          alt="Love in Action Logo"
          width={200}
          height={200}
          layout="responsive"
        />
      </div>
      <h1 className="text-4xl lg:text-6xl font-bold text-center max-w-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Empowering Children Through Compassionate Sponsorship
      </h1>
      <p className="text-xl lg:text-2xl text-center max-w-2xl text-gray-600">
        Join Love in Action in our mission to provide education, healthcare, and
        hope to children in need around the world.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link href="/sign-up">Become a Sponsor</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Link href="https://loveinaction.co/">Learn More</Link>
        </Button>
      </div>
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </div>
  );
}
