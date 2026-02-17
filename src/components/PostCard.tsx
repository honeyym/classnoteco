import { Link } from 'react-router-dom';
import { DbPost } from '@/hooks/usePosts';
import { MessageCircle, ThumbsUp, ThumbsDown, Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: DbPost;
  courseId: string;
  replyCount?: number;
  isSaved?: boolean;
  onToggleSave?: (postId: string) => void;
}

export default function PostCard({ post, courseId, replyCount = 0, isSaved = false, onToggleSave }: PostCardProps) {
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(post.id);
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <Link to={`/course/${courseId}/post/${post.id}`} className="block group">
      <Card className="bg-card/90 backdrop-blur-sm shadow-card hover:shadow-elevated transition-all duration-300 border border-border/30 rounded-2xl overflow-hidden hover:-translate-y-1">
        <CardContent className="p-5 sm:p-6">
          {/* Author & Time */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 flex items-center justify-center text-lg font-bold shrink-0 border border-primary/20">
              {post.is_anonymous ? '🎭' : (
                <span className="text-gradient">{post.author_name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {post.is_anonymous ? 'Anonymous' : post.author_name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
            </div>
            <button 
              onClick={handleSave}
              className={`p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                isSaved 
                  ? 'text-primary bg-primary/15 shadow-sm' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
              aria-label={isSaved ? 'Unsave post' : 'Save post'}
            >
              <Star className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <p className="text-foreground leading-relaxed mb-5 line-clamp-3 text-[15px]">{post.content}</p>

          {/* Reactions & Replies */}
          <div className="flex items-center gap-2 pt-4 border-t border-border/40">
            <span className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground`}>
              <ThumbsUp className="w-4 h-4" />
              <span>{post.likes}</span>
            </span>
            <span className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground`}>
              <Heart className="w-4 h-4" />
              <span>{post.hearts}</span>
            </span>
            <span className="flex items-center gap-1.5 ml-auto text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium bg-muted/50 px-3 py-2 rounded-xl">
              <MessageCircle className="w-4 h-4" />
              <span>{replyCount}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
