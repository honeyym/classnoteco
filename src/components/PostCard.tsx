import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, formatTimeAgo } from '@/data/mockData';
import { MessageCircle, ThumbsUp, ThumbsDown, Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PostCardProps {
  post: Post;
  courseId: string;
}

export default function PostCard({ post, courseId }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [hearts, setHearts] = useState(post.hearts);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isHearted, setIsHearted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
    setIsSaved(prev => !prev);
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
            {/* Save Button */}
            <button 
              onClick={handleSave}
              className={`p-2 rounded-lg transition-all duration-200 active:scale-95 ${
                isSaved 
                  ? 'text-yellow-500 bg-yellow-500/10' 
                  : 'text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10'
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
          <div className="flex items-center gap-2 pt-4 border-t border-border/50">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 active:scale-95 text-sm font-medium ${
                isLiked 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <button 
              onClick={handleDislike}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 active:scale-95 text-sm font-medium ${
                isDisliked 
                  ? 'text-muted-foreground bg-muted' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
              aria-label="Dislike"
            >
              <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleHeart}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 active:scale-95 text-sm font-medium ${
                isHearted 
                  ? 'text-red-500 bg-red-500/10' 
                  : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${isHearted ? 'fill-current' : ''}`} />
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
