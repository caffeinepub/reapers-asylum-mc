import { useEvents } from '../hooks/useEvents';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import EventCard from '../components/EventCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';

export default function EventsPage() {
  const { identity } = useInternetIdentity();
  const { data: events, isLoading, error } = useEvents();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-4xl mb-4">Members Only</h1>
          <p className="text-muted-foreground">Please login to view club events.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-display text-4xl mb-4 text-destructive">Error Loading Events</h1>
          <p className="text-muted-foreground">Unable to load events. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header with Road Banner */}
      <section
        className="relative h-64 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/road-banner.dim_1200x400.png)' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-6xl chrome-text drop-shadow-lg">Club Events</h1>
          <p className="text-xl text-gray-300 mt-2 font-heading uppercase tracking-wider">
            Rides • Meetings • Gatherings
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-2 border-border p-6 rounded">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No upcoming events. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
