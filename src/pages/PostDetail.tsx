import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getCourse } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { usePostDetail } from '@/hooks/usePosts';
import { ArrowLeft, LogOut, ThumbsUp, Heart, Send, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import ClassNoteLogo from '@/components/ClassNoteLogo';
import { formatDistanceToNow } from 'date-fns';

export default function PostDetail() {
  const { courseId, postId } = useParams<{ courseId: string; postId: string }>();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const { post, replies, isLoading, addReply, editReply } = usePostDetail(postId || '');
  const [replyContent, setReplyContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  if (!courseId || !postId) return <Navigate to="/dashboard" replace />;

  const course = getCourse(courseId);
  if (!course) return <Navigate to={`/course/${courseId}`} replace />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading post...</div>
      </div>
    );
  }

  if (!post) return <Navigate to={`/course/${courseId}`} replace />;

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast({ title: "Empty reply", description: "Please write something before replying", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await addReply(replyContent.trim(), isAnonymous);
    
    if (error) {
      toast({ title: "Error", description: "Failed to post reply. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Reply posted!", description: "Your reply has been added" });
      setReplyContent('');
      setIsAnonymous(false);
    }
    setIsSubmitting(false);
  };

  const handleEditReply = async (replyId: string) => {
    if (!editContent.trim()) return;
    setIsSubmitting(true);
    const { error } = await editReply(replyId, editContent.trim());
    if (error) {
      toast({ title: "Error", description: "Failed to update reply.", variant: "destructive" });
    } else {
      toast({ title: "Reply updated!" });
      setEditingReplyId(null);
      setEditContent('');
    }
    setIsSubmitting(false);
  };

  const postTime = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/course/${courseId}`} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2">
              <ClassNoteLogo size="sm" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl font-medium shrink-0">
                  {post.is_anonymous ? '🎭' : post.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {post.is_anonymous ? 'Anonymous' : post.author_name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {postTime} in {course.code}
                  </p>
                </div>
              </div>

              <p className="text-foreground text-[17px] leading-relaxed mb-6">{post.content}</p>

              {post.link && (
                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mb-4 block">
                  🔗 {post.link}
                </a>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-muted-foreground">
                  <ThumbsUp className="w-5 h-5" />
                  <span>{post.likes}</span>
                </span>
                <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-muted-foreground">
                  <Heart className="w-5 h-5" />
                  <span>{post.hearts}</span>
                </span>
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
                replies.map((reply, index) => {
                  const replyTime = formatDistanceToNow(new Date(reply.created_at), { addSuffix: true });
                  return (
                    <Card key={reply.id} className="bg-card shadow-card border-0 rounded-xl overflow-hidden" style={{ animationDelay: `${index * 50}ms` }}>
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-base font-medium shrink-0">
                            {reply.is_anonymous ? '🎭' : reply.author_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="font-semibold text-sm text-foreground">
                                {reply.is_anonymous ? 'Anonymous' : reply.author_name}
                              </span>
                              <span className="text-xs text-muted-foreground">{replyTime}</span>
                              {user?.id === reply.user_id && editingReplyId !== reply.id && (
                                <button
                                  onClick={() => { setEditingReplyId(reply.id); setEditContent(reply.content); }}
                                  className="ml-auto p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                  aria-label="Edit reply"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            {editingReplyId === reply.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  maxLength={5000}
                                  className="min-h-[60px] resize-none border border-border/50 bg-muted/30 rounded-lg text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" disabled={isSubmitting || !editContent.trim()} onClick={() => handleEditReply(reply.id)} className="h-7 px-3 text-xs">
                                    <Check className="w-3 h-3 mr-1" />Save
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => { setEditingReplyId(null); setEditContent(''); }} className="h-7 px-3 text-xs">
                                    <X className="w-3 h-3 mr-1" />Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-foreground text-[15px] leading-relaxed">{reply.content}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
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
                  maxLength={5000}
                  className="min-h-[100px] resize-none border border-border/50 bg-muted/30 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 focus-visible:border-primary/50 rounded-xl transition-all placeholder:text-muted-foreground/60"
                />
                
                <div className="flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <Checkbox
                      checked={isAnonymous}
                      onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                      className="border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded"
                    />
                    <span className="text-sm text-muted-foreground font-medium">Reply anonymously 🎭</span>
                  </label>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !replyContent.trim()}
                    className="gradient-primary hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg px-5 font-semibold rounded-xl"
                  >
                    <Send className="w-4 h-4 mr-2" />Reply
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
