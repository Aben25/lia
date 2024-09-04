'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, User, DollarSign, Heart, Menu, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import logo from "@assets/logo/white_main_transparent@600x.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "All Statistics" },
    { href: "/protected/your-child", icon: Heart, label: "Your Child" },
    { href: "/donation", icon: DollarSign, label: "Donation" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-blue-900 text-white rounded-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "bg-blue-900 text-white w-64 space-y-6 py-7 px-2 fixed h-full z-10 transition-all duration-300 ease-in-out",
        isOpen ? "left-0" : "-left-64",
        "lg:left-0" // Always visible on large screens
      )}>
        <div className="flex flex-col items-left space-y-2 px-4">
          <Image src={logo} alt="Logo" width={100} height={100} />
        </div>

        <nav className="space-y-2 mt-8">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center py-2.5 px-4 rounded transition duration-200",
                pathname === item.href 
                  ? "bg-blue-800 text-white" 
                  : "hover:bg-blue-800 text-blue-100"
              )}
              onClick={() => setIsOpen(false)} // Close sidebar on mobile when link is clicked
            >
              <item.icon className="mr-3" size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <div className="bg-blue-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-blue-200 mb-3">Contact our support team for assistance.</p>
            <a 
              href="mailto:support@loveinaction.org" 
              className="inline-block bg-white text-blue-900 px-4 py-2 rounded text-sm font-medium hover:bg-blue-100 transition duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;