'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { EnvVarWarning } from '@/components/env-var-warning';
import HeaderAuth from '@/components/header-auth';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { Bell, User, Home, Heart, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/sponsorships', label: 'My Sponsorships', icon: Heart },
];

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

export default function Header() {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const markAsRead = (notificationId) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-b-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/logo.png" alt="Logo" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <span className="font-bold">SponsorConnect</span>
          </Link>
          <nav className="hidden md:flex space-x-4">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <>
              <HeaderAuth />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[11px] font-medium text-white flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[380px] max-h-[500px] overflow-y-auto"
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {navItems.map(({ href, label, icon: Icon }) => (
                    <DropdownMenuItem key={href} asChild>
                      <Link href={href} className="flex items-center">
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
