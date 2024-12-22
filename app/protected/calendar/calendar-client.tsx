'use client';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Event type styles with darker colors for better visibility
const eventTypeStyles = {
  birthday: 'bg-pink-600',
  school: 'bg-blue-600',
  medical: 'bg-red-600',
  sports: 'bg-green-600',
  art: 'bg-purple-600',
};

interface Event {
  id: number;
  title: string;
  date: Date;
  type: string;
  description: string;
  time: string;
}

interface CalendarClientProps {
  events: Event[];
}

export default function CalendarClient({ events }: CalendarClientProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), date));
  };

  // Function to handle day click
  const handleDayClick = (day: Date | undefined) => {
    if (day) {
      const dayEvents = getEventsForDate(day);
      setSelectedDayEvents(dayEvents);
      setIsDialogOpen(dayEvents.length > 0);
    }
  };

  // Custom day content renderer
  const DayContent = ({ date, ...props }: { date: Date }) => {
    const dayEvents = getEventsForDate(date);
    return (
      <div className="relative w-full h-full flex flex-col items-center">
        <div className="text-center">{format(date, 'd')}</div>
        {dayEvents.length > 0 && (
          <div className="absolute bottom-1 left-0 right-0 flex gap-0.5 justify-center">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  eventTypeStyles[event.type as keyof typeof eventTypeStyles]
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Calendar</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        {/* Calendar */}
        <Card className="bg-card">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              onDayClick={handleDayClick}
              className="p-4"
              components={{
                DayContent: (props) => <DayContent {...props} />,
              }}
              showOutsideDays={true}
              defaultMonth={new Date(2023, 11)} // December 2023
            />
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter((event) => event.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 text-sm"
                  >
                    <Badge
                      className={cn(
                        'w-2 h-2 rounded-full p-0',
                        eventTypeStyles[
                          event.type as keyof typeof eventTypeStyles
                        ]
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{event.title}</p>
                      <p className="text-muted-foreground">
                        {format(new Date(event.date), 'MMM d, yyyy')} at{' '}
                        {event.time}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Events for {date ? format(date, 'MMMM d, yyyy') : ''}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 p-4">
              {selectedDayEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Badge
                        className={cn(
                          'w-2 h-2 rounded-full p-0',
                          eventTypeStyles[
                            event.type as keyof typeof eventTypeStyles
                          ]
                        )}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {event.time}
                        </p>
                        <p className="text-sm mt-2">{event.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
