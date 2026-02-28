import { Resource, formatTimeAgo } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';
import { getSafeHref } from '@/lib/urlValidation';

interface ResourceListProps {
  resources: Resource[];
}

export default function ResourceList({ resources }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
          <LinkIcon className="w-8 h-8 opacity-50" />
        </div>
        <p className="font-medium">No resources shared yet</p>
        <p className="text-sm mt-1 opacity-75">Links shared in discussions will appear here</p>
      </div>
    );
  }

  // Sort resources by date, newest first
  const sortedResources = [...resources].sort((a, b) => b.sharedAt.getTime() - a.sharedAt.getTime());

  return (
    <div className="space-y-3">
      {sortedResources.map((resource, index) => {
        const safeHref = getSafeHref(resource.url);
        const card = (
          <Card className="bg-card shadow-card hover:shadow-elevated transition-all duration-300 border-0 group rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <CardContent className="p-4 sm:p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center shrink-0">
                <LinkIcon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {resource.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  Shared by {resource.sharedBy} • {formatTimeAgo(resource.sharedAt)}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>
        );
        return safeHref ? (
          <a key={resource.id} href={safeHref} target="_blank" rel="noopener noreferrer" className="block">
            {card}
          </a>
        ) : (
          <div key={resource.id} className="block">{card}</div>
        );
      })}
    </div>
  );
}
