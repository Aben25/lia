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
  Bell,
  MessageCircle,
  BarChart3,
  Calendar,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface SidebarProps {
  className?: string;
}

const mockNotifications = [
  {
    id: 1,
    type: 'birthday',
    title: 'Upcoming Birthday',
    message:
      'Your sponsee Abebe will be celebrating their 12th birthday next week!',
    date: new Date().toISOString(),
    read: false,
    icon: '🎂',
  },
  {
    id: 2,
    type: 'graduation',
    title: 'Graduation Ceremony',
    message:
      "Kebede is graduating from primary school this month. Don't forget to send your congratulations!",
    date: new Date().toISOString(),
    read: false,
    icon: '🎓',
  },
  {
    id: 3,
    type: 'achievement',
    title: 'Academic Excellence',
    message:
      'Almaz achieved top marks in their recent exams! They wanted to thank you for your support.',
    date: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    icon: '🌟',
  },
  {
    id: 4,
    type: 'general',
    title: 'New Letter Received',
    message: 'You have received a new letter from your sponsee Tigist.',
    date: new Date(Date.now() - 172800000).toISOString(),
    read: true,
    icon: '✉️',
  },
];

const Sidebar = ({ className }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);
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

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const markAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const navItems = [
    {
      href: '/protected',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'View your dashboard',
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
    {
      href: '/protected/calendar',
      icon: Calendar,
      label: 'Calendar',
      description: 'View upcoming events',
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
        className="lg:hidden fixed top-2 left-4 z-50 p-2"
        size="icon"
        variant="outline"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-[#F08451] text-white w-64 flex flex-col fixed inset-y-0 left-0 transform z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Logo */}
        <div className="flex justify-center items-center h-16 px-4 sticky top-0 bg-[#F08451] z-10">
          <Image
            src={logo}
            alt="Love in Action"
            width={120}
            height={40}
            priority
            className="object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {/* Notifications */}
          <div className="mb-4">
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          'w-full flex items-center px-3 py-2 rounded-lg transition-colors duration-200 text-white hover:bg-white/10 relative group'
                        )}
                      >
                        <Bell className="h-5 w-5 mr-3 text-white/80 group-hover:text-white" />
                        <span className="text-sm font-medium">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent
                align="end"
                className="w-[300px] lg:w-[380px] max-h-[80vh] overflow-y-auto"
              >
                <DropdownMenuLabel className="py-3 px-4 text-lg font-semibold">
                  Notifications
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start p-4 cursor-pointer hover:bg-accent ${
                        !notification.read ? 'bg-muted/50' : ''
                      }`}
                      onSelect={() => markAsRead(notification.id)}
                    >
                      <div className="flex w-full items-start gap-3">
                        <span className="text-xl">{notification.icon}</span>
                        <div className="flex-1">
                          <div className="flex w-full justify-between items-center">
                            <span className="font-medium">
                              {notification.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(
                                new Date(notification.date),
                                'MMM d, h:mm a'
                              )}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                console.log('Navigation item clicked:', item.label);
                console.log('Target href:', item.href);
                setIsOpen(false); // Close mobile menu after click
              }}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-all hover:text-white hover:bg-white/10',
                pathname === item.href ? 'bg-white/10' : 'text-white/70'
              )}
            >
              <item.icon className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-white/70">
                    {item.description}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* Help Section */}
        <div className="p-3 mt-auto sticky bottom-0 bg-[#F08451]">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10 group"
              >
                <HelpCircle className="h-5 w-5 mr-3 text-white/80 group-hover:text-white" />
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
              className="w-full justify-start mt-2 text-white hover:bg-white/10 group"
              onClick={handleSignOut}
            >
              <LogOut className="h-6 w-6 mr-3 text-white/80 group-hover:text-white" />
              <span className="text-base font-medium">Sign Out</span>
            </Button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
