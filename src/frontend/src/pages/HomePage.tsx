import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, Newspaper, Image } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const features = [
    {
      icon: Users,
      title: 'Members',
      description: 'Meet the brotherhood of Reapers Asylum MC',
      link: '/members',
    },
    {
      icon: Calendar,
      title: 'Events',
      description: 'Upcoming rides, meetings, and club gatherings',
      link: '/events',
    },
    {
      icon: Newspaper,
      title: 'News',
      description: 'Latest announcements and club updates',
      link: '/news',
    },
    {
      icon: Image,
      title: 'Gallery',
      description: 'Photos from our rides and events',
      link: '/gallery',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-background.dim_1920x800.png)' }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <img
            src="/assets/generated/reapers-asylum-logo.dim_400x400.png"
            alt="Reapers Asylum MC"
            className="h-48 w-48 md:h-64 md:w-64 mx-auto mb-8 drop-shadow-2xl object-contain"
          />
          <h1 className="font-display text-6xl md:text-8xl mb-6 chrome-text drop-shadow-lg">
            Reapers Asylum MC
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-heading uppercase tracking-wider">
            Brotherhood • Freedom • The Open Road
          </p>
          {!isAuthenticated && (
            <p className="text-lg text-gray-400 mb-6">Login to access member features</p>
          )}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl mb-6 chrome-text">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Reapers Asylum MC is more than just a motorcycle club—we're a brotherhood bound by loyalty, respect, and
              a passion for the open road. We ride together, stand together, and face life's challenges as one united
              family. Our mission is to preserve the spirit of freedom, honor the traditions of motorcycle culture, and
              support our brothers and sisters through thick and thin.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-12 chrome-text">Explore the Club</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} to={feature.link} className="group">
                <Card className="h-full transition-all hover:shadow-metal-lg hover:border-primary border-2">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className="mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-6 chrome-text">Join the Brotherhood</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Interested in becoming part of Reapers Asylum MC? Login to explore member features and connect with the
            club.
          </p>
          {!isAuthenticated && (
            <Button size="lg" className="font-heading text-lg uppercase tracking-wider">
              Get Started
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
