import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Event, EventType } from '../backend';

interface EventCardProps {
  event: Event;
}

function getEventTypeLabel(type: EventType): string {
  switch (type) {
    case EventType.ride:
      return 'Ride';
    case EventType.meeting:
      return 'Meeting';
    case EventType.social:
      return 'Social';
    case EventType.fundraiser:
      return 'Fundraiser';
    case EventType.other:
      return 'Other';
    default:
      return 'Event';
  }
}

function getEventTypeVariant(type: EventType): 'default' | 'secondary' | 'outline' {
  if (type === EventType.ride) return 'default';
  if (type === EventType.meeting) return 'secondary';
  return 'outline';
}

export default function EventCard({ event }: EventCardProps) {
  const startDate = new Date(Number(event.startTime) / 1000000);
  const endDate = new Date(Number(event.endTime) / 1000000);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Card className="border-2 hover:border-primary transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="font-display text-3xl flex-1">{event.title}</CardTitle>
          <img src="/assets/generated/event-icon.dim_128x128.png" alt="" className="h-12 w-12" />
        </div>
        <Badge variant={getEventTypeVariant(event.eventType)} className="w-fit font-heading uppercase">
          {getEventTypeLabel(event.eventType)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{event.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatDate(startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              {formatTime(startDate)} - {formatTime(endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
