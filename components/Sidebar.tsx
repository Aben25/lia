'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, User, DollarSign, Heart, Menu, X, Mail, Phone } from 'lucide-react';
import { cn } from "@/lib/utils";
import logo from "@assets/logo/white_main_transparent@600x.png";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/protected", icon: Home, label: "All Statistics" },
    { href: "/protected/your-child", icon: Heart, label: "Your Child" },
    { href: "/protected/profile", icon: User, label: "Profile" },
    { href: "/protected/my-contributions", icon: DollarSign, label: "My Contributions" },
    
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleEmailSupport = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href = 'mailto:info@loveinaction.co?subject=Support Request';
  };

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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-white text-blue-900 hover:bg-blue-100">
                  Contact Support
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Contact Support</DialogTitle>
                  <DialogDescription>
                    Choose how you'd like to get in touch with our support team.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Button 
                    className="flex items-center justify-center gap-2" 
                    onClick={handleEmailSupport}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email Support
                  </Button>
                  <Button 
                    className="flex items-center justify-center gap-2"
                    onClick={() => window.location.href = 'tel:+1234567890'} // Replace with actual support phone number
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call Support
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;