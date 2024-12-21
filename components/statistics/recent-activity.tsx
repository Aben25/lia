'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const activities = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      image: '/avatars/01.png',
      initials: 'JD',
    },
    action: 'created a new project',
    time: '2 minutes ago',
  },
  {
    id: 2,
    user: {
      name: 'Sarah Smith',
      image: '/avatars/02.png',
      initials: 'SS',
    },
    action: 'completed a task',
    time: '5 minutes ago',
  },
  {
    id: 3,
    user: {
      name: 'Mike Johnson',
      image: '/avatars/03.png',
      initials: 'MJ',
    },
    action: 'added a comment',
    time: '10 minutes ago',
  },
  {
    id: 4,
    user: {
      name: 'Emily Brown',
      image: '/avatars/04.png',
      initials: 'EB',
    },
    action: 'updated their profile',
    time: '15 minutes ago',
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.image} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name}
            </p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  );
}
