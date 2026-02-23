import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { News } from '../backend';
import { Clock, User } from 'lucide-react';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  const timestamp = new Date(Number(news.timestamp) / 1000000);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Card className="border-2 hover:border-primary transition-colors">
      <CardHeader>
        <CardTitle className="font-display text-3xl">{news.title}</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{news.postedBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(timestamp)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap">{news.content}</p>
      </CardContent>
    </Card>
  );
}
