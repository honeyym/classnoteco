import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, formatTimeAgo } from '@/data/mockData';
import { MessageCircle, ThumbsUp, ThumbsDown, Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PostCardProps {
  post: Post;
  courseId: string;
  isSaved?: boolean;
  onToggleSave?: (postId: string) => void;
}

export default function PostCard({ post, courseId, isSaved = false, onToggleSave }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [hearts, setHearts] = useState(post.hearts);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isHearted, setIsHearted] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
      if (isDisliked) {
        setIsDisliked(false);
      }
    }
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      if (isLiked) {
        setLikes(prev => prev - 1);
        setIsLiked(false);
      }
    }
  };

  const handleHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isHearted) {
      setHearts(prev => prev - 1);
      setIsHearted(false);
    } else {
      setHearts(prev => prev + 1);
      setIsHearted(true);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(post.id);
  };

  return (
    <Link to={`/course/${courseId}/post/${post.id}`} className="block group">
      <Card className="bg-card/90 backdrop-blur-sm shadow-card hover:shadow-elevated transition-all duration-300 border border-border/30 rounded-2xl overflow-hidden hover:-translate-y-1">
        <CardContent className="p-5 sm:p-6">
          {/* Author & Time */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 flex items-center justify-center text-lg font-bold shrink-0 border border-primary/20">
              {post.isAnonymous ? '🎭' : (
                <span className="text-gradient">{post.authorName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {post.isAnonymous ? 'Anonymous' : post.authorName}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>
            {/* Save Button */}
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
          <p className="text-foreground leading-relaxed mb-5 line-clamp-3 text-[15px]">
            {post.content}
          </p>

          {/* Reactions & Replies */}
          <div className="flex items-center gap-2 pt-4 border-t border-border/40">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95 text-sm font-medium ${
                isLiked 
                  ? 'text-primary bg-primary/15 shadow-sm' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <button 
              onClick={handleDislike}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95 text-sm font-medium ${
                isDisliked 
                  ? 'text-muted-foreground bg-muted shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
              aria-label="Dislike"
            >
              <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleHeart}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95 text-sm font-medium ${
                isHearted 
                  ? 'text-destructive bg-destructive/15 shadow-sm' 
                  : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${isHearted ? 'fill-current' : ''}`} />
              <span>{hearts}</span>
            </button>
            <span className="flex items-center gap-1.5 ml-auto text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium bg-muted/50 px-3 py-2 rounded-xl">
              <MessageCircle className="w-4 h-4" />
              <span>{post.replyCount}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
