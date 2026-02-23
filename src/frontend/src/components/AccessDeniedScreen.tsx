import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="p-6 bg-destructive/10 border-2 border-destructive inline-block">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>
        
        <h1 className="font-display text-4xl chrome-text mb-4">Access Denied</h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          You do not have permission to access this page. Administrator privileges are required.
        </p>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you believe you should have access, please contact an administrator and provide them
            with your principal ID from your profile page.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate({ to: '/' })}
              variant="outline"
              className="font-heading uppercase tracking-wider"
            >
              Go Home
            </Button>
            <Button
              onClick={() => navigate({ to: '/profile' })}
              className="font-heading uppercase tracking-wider"
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
