'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  DollarSign,
  Heart,
  Menu,
  X,
  Mail,
  Phone,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@assets/logo/white_main_transparent@600x.png';
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

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    { href: '/protected', icon: Home, label: 'All Statistics' },
    { href: '/protected/your-child', icon: Heart, label: 'Your Child' },
    { href: '/protected/profile', icon: User, label: 'Profile' },
    {
      href: '/protected/my-contributions',
      icon: DollarSign,
      label: 'My Contributions',
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

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
      <Button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-primary text-primary-foreground"
        size="icon"
        variant="outline"
      >
        <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <aside
        className={cn(
          'bg-primary text-primary-foreground w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform z-10 transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col items-center space-y-2 px-4">
          <Image src={logo} alt="Logo" width={100} height={100} priority />
        </div>

        <nav className="space-y-1 mt-8">
          {navItems.map((item) => (
            <TooltipProvider key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center py-2.5 px-4 rounded transition duration-200',
                      pathname === item.href
                        ? 'bg-primary-foreground text-primary'
                        : 'hover:bg-primary-foreground/10 text-primary-foreground/80'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <div className="bg-primary-foreground/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-primary-foreground">
              Need Help?
            </h3>
            <p className="text-sm text-primary-foreground/80 mb-3">
              Contact our support team for assistance.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
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
                    onClick={() => (window.location.href = 'tel:+1234567890')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call Support
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoggedIn && (
          <div className="px-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </Button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
