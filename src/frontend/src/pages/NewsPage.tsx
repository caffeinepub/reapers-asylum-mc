import { useNewsFeed } from '../hooks/useNewsFeed';
import { useIsCallerAdmin } from '../hooks/useIsCallerAdmin';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import NewsCard from '../components/NewsCard';
import PostNewsForm from '../components/PostNewsForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Newspaper } from 'lucide-react';

export default function NewsPage() {
  const { identity } = useInternetIdentity();
  const { data: news, isLoading, error } = useNewsFeed();
  const { data: isAdmin } = useIsCallerAdmin();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display text-4xl mb-4">Members Only</h1>
          <p className="text-muted-foreground">Please login to view club news.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-display text-4xl mb-4 text-destructive">Error Loading News</h1>
          <p className="text-muted-foreground">Unable to load news feed. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-display text-5xl md:text-6xl mb-4 chrome-text">Club News</h1>
        <p className="text-xl text-muted-foreground font-heading uppercase tracking-wider">
          Latest Announcements & Updates
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {isAdmin && (
          <div className="mb-12">
            <PostNewsForm />
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-2 border-border p-6 rounded">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : news && news.length > 0 ? (
          <div className="space-y-6">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No news posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
