import { useState } from 'react';
import { usePostNews } from '../hooks/usePostNews';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function PostNewsForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { mutate: postNews, isPending } = usePostNews();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const postedBy = userProfile?.name || 'Admin';

    postNews(
      { title: title.trim(), content: content.trim(), postedBy },
      {
        onSuccess: () => {
          setTitle('');
          setContent('');
          toast.success('News posted successfully!');
        },
        onError: (error) => {
          toast.error('Failed to post news: ' + error.message);
        },
      }
    );
  };

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Post Announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter news title"
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter news content"
              rows={6}
              required
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full font-heading uppercase" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Post News
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
