import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getPost, getPostReplies, getCourse, formatTimeAgo } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, ArrowLeft, LogOut, ThumbsUp, Heart, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

export default function PostDetail() {
  const { courseId, postId } = useParams<{ courseId: string; postId: string }>();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [replyContent, setReplyContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!courseId || !postId) {
    return <Navigate to="/dashboard" replace />;
  }

  const course = getCourse(courseId);
  const post = getPost(postId);
  
  if (!course || !post) {
    return <Navigate to={`/course/${courseId}`} replace />;
  }

  const replies = getPostReplies(postId);

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
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Reply posted!",
      description: "Your reply has been added",
    });
    
    setReplyContent('');
    setIsAnonymous(false);
    setIsSubmitting(false);
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
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-bold text-foreground hidden sm:inline">ClassNote</span>
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
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Original Post */}
          <Card className="shadow-card border-0 mb-6 animate-fade-in">
            <CardContent className="p-5 sm:p-6">
              {/* Author & Time */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl">
                  {post.isAnonymous ? '🎭' : post.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {post.isAnonymous ? 'Anonymous' : post.authorName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTimeAgo(post.createdAt)} in {course.code}
                  </p>
                </div>
              </div>

              {/* Content */}
              <p className="text-foreground text-lg leading-relaxed mb-6">
                {post.content}
              </p>

              {/* Reactions */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{post.hearts}</span>
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
              {replies.map((reply, index) => (
                <Card 
                  key={reply.id} 
                  className="shadow-card border-0 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-base flex-shrink-0">
                        {reply.isAnonymous ? '🎭' : reply.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">
                            {reply.isAnonymous ? 'Anonymous' : reply.authorName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-foreground text-sm leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Reply Box */}
          <Card className="shadow-card border-0 sticky bottom-4 animate-fade-in">
            <CardContent className="p-4">
              <form onSubmit={handleReply}>
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px] resize-none border-0 bg-muted/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0"
                />
                
                <div className="flex items-center justify-between mt-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={isAnonymous}
                      onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                      className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      Reply anonymously 🎭
                    </span>
                  </label>
                  
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={isSubmitting || !replyContent.trim()}
                    className="gradient-primary hover:opacity-90 transition-opacity"
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
