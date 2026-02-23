import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminBadge() {
  return (
    <Badge
      variant="destructive"
      className="font-heading uppercase tracking-wider text-xs px-3 py-1 blood-glow"
    >
      <Shield className="h-3 w-3 mr-1" />
      Admin
    </Badge>
  );
}
