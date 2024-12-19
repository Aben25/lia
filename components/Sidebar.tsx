'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  DollarSign,
  Heart,
  Menu,
  X,
  Mail,
  Phone,
  LogOut,
  HelpCircle,
  FolderKanban,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@assets/logo/white_main_transparent@600x.png';
import logoDark from '@assets/logo/black.png';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from 'next-themes';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const navItems = [
    {
      href: '/protected',
      icon: LayoutDashboard,
      label: 'All Statistics',
      description: 'View overall statistics and metrics',
    },
    {
      href: '/protected/your-child',
      icon: Heart,
      label: 'Your Child',
      description: 'View and manage your sponsored child',
    },
    {
      href: '/protected/my-contributions',
      icon: DollarSign,
      label: 'My Contributions',
      description: 'Track your donations and contributions',
    },
    {
      href: '/protected/projects',
      icon: FolderKanban,
      label: 'Projects',
      description: 'Manage your projects',
    },
  ];

  const handleEmailSupport = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href =
      'mailto:info@loveinaction.co?subject=Support Request';
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of your account.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Sign out failed',
        description: 'There was an error signing you out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-20 p-2"
        size="icon"
        variant="outline"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-[#1e1e2f] text-white w-64 flex flex-col fixed inset-y-0 left-0 transform z-10 transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Logo */}
        <div className="flex justify-center items-center h-20 border-b border-white/10">
          <Image
            src={theme === 'dark' ? logoDark : logo}
            alt="Logo"
            width={120}
            height={40}
            priority
            className="object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <TooltipProvider key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center px-4 py-3 rounded-lg transition-colors duration-200',
                      pathname === item.href
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-blue-500/10 hover:text-white'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>

        {/* Help Section */}
        <div className="p-4 border-t border-white/10">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-blue-500/10"
              >
                <HelpCircle className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">Need Help?</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                  <Mail className="h-4 w-4" />
                  Email Support
                </Button>
                <Button
                  className="flex items-center justify-center gap-2"
                  onClick={() => (window.location.href = 'tel:+1234567890')}
                >
                  <Phone className="h-4 w-4" />
                  Call Support
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Sign Out Button */}
          {isLoggedIn && (
            <Button
              variant="ghost"
              className="w-full justify-start mt-2 text-gray-300 hover:text-white hover:bg-blue-500/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">Sign Out</span>
            </Button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
