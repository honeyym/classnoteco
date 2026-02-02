import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getPost, getPostReplies, getCourse, formatTimeAgo, Post, Reply } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, LogOut, ThumbsUp, ThumbsDown, Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

export default function PostDetail() {
  const { courseId, postId } = useParams<{ courseId: string; postId: string }>();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [replyContent, setReplyContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replies, setReplies] = useState<Reply[]>(() => getPostReplies(postId || ''));
  const [postReactions, setPostReactions] = useState(() => {
    const post = getPost(postId || '');
    return { likes: post?.likes || 0 };
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!courseId || !postId) {
    return <Navigate to="/dashboard" replace />;
  }

  const course = getCourse(courseId);
  const post = getPost(postId);
  
  if (!course || !post) {
    return <Navigate to={`/course/${courseId}`} replace />;
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim()) {
      toast({
        title: "Empty reply",
        description: "Please write something before replying",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      postId,
      authorId: user?.id || '1',
      authorName: user?.name || 'User',
      isAnonymous,
      content: replyContent.trim(),
      createdAt: new Date(),
    };
    
    setReplies(prev => [...prev, newReply]);
    
    toast({
      title: "Reply posted!",
      description: "Your reply has been added",
    });
    
    setReplyContent('');
    setIsAnonymous(false);
    setIsSubmitting(false);
  };

  const handleLike = () => {
    if (isLiked) {
      setPostReactions(prev => ({ ...prev, likes: prev.likes - 1 }));
      setIsLiked(false);
    } else {
      setPostReactions(prev => ({ ...prev, likes: prev.likes + 1 }));
      setIsLiked(true);
      if (isDisliked) {
        setIsDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      if (isLiked) {
        setPostReactions(prev => ({ ...prev, likes: prev.likes - 1 }));
        setIsLiked(false);
      }
    }
  };

  const handleSave = () => {
    setIsSaved(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              to={`/course/${courseId}`} 
              className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="ClassNote" className="h-10 w-auto" />
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.name}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Original Post */}
          <Card className="bg-card shadow-card border-0 mb-6 rounded-xl overflow-hidden">
            <CardContent className="p-5 sm:p-6">
              {/* Author & Time */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl font-medium shrink-0">
                  {post.isAnonymous ? '🎭' : post.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {post.isAnonymous ? 'Anonymous' : post.authorName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatTimeAgo(post.createdAt)} in {course.code}
                  </p>
                </div>
              </div>

              {/* Content */}
              <p className="text-foreground text-[17px] leading-relaxed mb-6">
                {post.content}
              </p>

              {/* Reactions */}
              <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95 font-medium ${
                    isLiked 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{postReactions.likes}</span>
                </button>
                <button 
                  onClick={handleDislike}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95 font-medium ${
                    isDisliked 
                      ? 'text-muted-foreground bg-muted' 
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                  aria-label="Dislike"
                >
                  <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95 font-medium ml-auto ${
                    isSaved 
                      ? 'text-yellow-500 bg-yellow-500/10' 
                      : 'text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10'
                  }`}
                  aria-label={isSaved ? 'Unsave post' : 'Save post'}
                >
                  <Star className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Replies Section */}
          <div className="mb-6">
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">
              {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
            </h2>
            
            <div className="space-y-3">
              {replies.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="font-medium">No replies yet</p>
                  <p className="text-sm mt-1 opacity-75">Be the first to respond!</p>
                </div>
              ) : (
                replies.map((reply, index) => (
                  <Card 
                    key={reply.id} 
                    className="bg-card shadow-card border-0 rounded-xl overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-base font-medium shrink-0">
                          {reply.isAnonymous ? '🎭' : reply.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-semibold text-sm text-foreground">
                              {reply.isAnonymous ? 'Anonymous' : reply.authorName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-foreground text-[15px] leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Reply Box */}
          <Card className="bg-card shadow-elevated border-0 sticky bottom-4 rounded-xl overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <form onSubmit={handleReply} className="space-y-4">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[100px] resize-none border border-border/50 bg-muted/30 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 focus-visible:border-primary/50 rounded-xl transition-all placeholder:text-muted-foreground/60"
                />
                
                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <Checkbox
                      checked={isAnonymous}
                      onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                      className="border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded"
                    />
                    <span className="text-sm text-muted-foreground font-medium">
                      Reply anonymously 🎭
                    </span>
                  </label>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !replyContent.trim()}
                    className="gradient-primary hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg px-5 font-semibold rounded-xl"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
