import Link from 'next/link';
import { Home, Users, DollarSign, User } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="bg-blue-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center space-x-2 px-4">
        <img src="/logo.svg" alt="Love in Action" className="h-8 w-8" />
        <span className="text-2xl font-extrabold">love in action</span>
      </div>
      <nav>
        <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-800">
          <Home className="inline-block mr-2" size={20} /> All Statistics
        </Link>
        <Link href="/children" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-800">
          <Users className="inline-block mr-2" size={20} /> Your Children
        </Link>
        <Link href="/donation" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-800">
          <DollarSign className="inline-block mr-2" size={20} /> Donation
        </Link>
        <Link href="/profile" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-800">
          <User className="inline-block mr-2" size={20} /> Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;