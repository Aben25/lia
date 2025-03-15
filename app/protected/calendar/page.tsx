import CalendarClient from './calendar-client';

// Sample event data
const sampleEvents = [
  {
    id: 1,
    title: "Sarah's Birthday",
    date: new Date(2024, 0, 15), // January 15, 2024
    type: 'birthday',
    description: "Sarah's 12th birthday celebration",
    time: '2:00 PM',
  },
  {
    id: 2,
    title: 'School Performance',
    date: new Date(2024, 0, 20), // January 20, 2024
    type: 'school',
    description: 'Annual school talent show performance',
    time: '4:30 PM',
  },
  {
    id: 3,
    title: 'Medical Check-up',
    date: new Date(2024, 0, 25), // January 25, 2024
    type: 'medical',
    description: 'Regular health check-up at City Hospital',
    time: '10:00 AM',
  },
  {
    id: 4,
    title: 'Soccer Match',
    date: new Date(2024, 1, 5), // February 5, 2024
    type: 'sports',
    description: 'Inter-school soccer tournament',
    time: '3:00 PM',
  },
  {
    id: 5,
    title: 'Art Exhibition',
    date: new Date(2024, 1, 10), // February 10, 2024
    type: 'art',
    description: "Display of children's artwork at Community Center",
    time: '1:00 PM',
  },
  {
    id: 6,
    title: 'Annual LIA Staff Meeting',
    date: new Date(2023, 11, 21), // December 21, 2023
    type: 'school',
    description: 'End of year staff meeting and planning session',
    time: '9:00 AM',
  },
];

export default function CalendarPage() {
  return <CalendarClient events={sampleEvents} />;
}
