import { getCourseResources, formatTimeAgo } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';

interface ResourceListProps {
  courseId: string;
}

export default function ResourceList({ courseId }: ResourceListProps) {
  const resources = getCourseResources(courseId);

  if (resources.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No resources shared yet</p>
        <p className="text-sm mt-1">Links shared in discussions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resources.map((resource, index) => (
        <a
          key={resource.id}
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Card className="shadow-card hover:shadow-elevated transition-all duration-200 border-0 group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <LinkIcon className="w-5 h-5 text-accent" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {resource.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Shared by {resource.sharedBy} • {formatTimeAgo(resource.sharedAt)}
                </p>
              </div>
              
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
