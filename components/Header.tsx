// components/Header.tsx
import { Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="w-1/3">
            <Input type="text" placeholder="Type to search..." className="w-full" />
          </div>
          <div className="flex items-center">
            <button className="mr-4 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">2</span>
            </button>
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="/avatar.png" alt="Dr Dereje B" />
                <AvatarFallback>DB</AvatarFallback>
              </Avatar>
              <span className="ml-2 font-medium text-gray-800 dark:text-gray-200">Dr Dereje B</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
