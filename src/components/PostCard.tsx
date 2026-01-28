import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, formatTimeAgo } from '@/data/mockData';
import { MessageCircle, ThumbsUp, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PostCardProps {
  post: Post;
  courseId: string;
}

export default function PostCard({ post, courseId }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [hearts, setHearts] = useState(post.hearts);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikes(prev => prev + 1);
  };

  const handleHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHearts(prev => prev + 1);
  };

  return (
    <Link to={`/course/${courseId}/post/${post.id}`} className="block">
      <Card className="group bg-card shadow-card hover:shadow-elevated transition-all duration-300 border-0 rounded-xl overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          {/* Author & Time */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-medium shrink-0">
              {post.isAnonymous ? '🎭' : post.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {post.isAnonymous ? 'Anonymous' : post.authorName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Content */}
          <p className="text-foreground leading-relaxed mb-5 line-clamp-3 text-[15px]">
            {post.content}
          </p>

          {/* Reactions & Replies */}
          <div className="flex items-center gap-2 pt-4 border-t border-border/50">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 active:scale-95 text-sm font-medium"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{likes}</span>
            </button>
            <button 
              onClick={handleHeart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200 active:scale-95 text-sm font-medium"
            >
              <Heart className="w-4 h-4" />
              <span>{hearts}</span>
            </button>
            <span className="flex items-center gap-1.5 ml-auto text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">
              <MessageCircle className="w-4 h-4" />
              <span>{post.replyCount}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
