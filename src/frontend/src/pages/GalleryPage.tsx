import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Image } from 'lucide-react';

export default function GalleryPage() {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Image className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-4xl mb-4">Members Only</h1>
          <p className="text-muted-foreground">Please login to view the photo gallery.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl md:text-6xl mb-4 chrome-text">Photo Gallery</h1>
        <p className="text-xl text-muted-foreground font-heading uppercase tracking-wider">
          Memories from the Road
        </p>
      </div>

      <div className="text-center py-12">
        <Image className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Gallery coming soon. Photos from rides and events will be displayed here.</p>
      </div>
    </div>
  );
}
