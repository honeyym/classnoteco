import { Link } from 'react-router-dom';
import { Post, formatTimeAgo } from '@/data/mockData';
import { MessageCircle, ThumbsUp, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PostCardProps {
  post: Post;
  courseId: string;
}

export default function PostCard({ post, courseId }: PostCardProps) {
  return (
    <Link to={`/course/${courseId}/post/${post.id}`}>
      <Card className="group shadow-card hover:shadow-elevated transition-all duration-200 border-0 animate-fade-in">
        <CardContent className="p-4 sm:p-5">
          {/* Author & Time */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg">
              {post.isAnonymous ? '🎭' : post.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {post.isAnonymous ? 'Anonymous' : post.authorName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Content */}
          <p className="text-foreground leading-relaxed mb-4 line-clamp-3">
            {post.content}
          </p>

          {/* Reactions & Replies */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <ThumbsUp className="w-4 h-4" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1.5 hover:text-destructive transition-colors">
              <Heart className="w-4 h-4" />
              {post.hearts}
            </span>
            <span className="flex items-center gap-1.5 ml-auto group-hover:text-primary transition-colors">
              <MessageCircle className="w-4 h-4" />
              {post.replyCount} replies
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
