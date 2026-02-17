import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getCourse, getCourseResources, Resource } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useEnrollments } from '@/hooks/useEnrollments';
import { usePosts } from '@/hooks/usePosts';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, LogOut, MessageCircle, Star, MessagesSquare, Search, X, Send, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import ResourceList from '@/components/ResourceList';
import ChatTab from '@/components/ChatTab';
import ClassNoteLogo from '@/components/ClassNoteLogo';

export default function Course() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, logout } = useAuth();
  const { isEnrolled, isLoading: enrollLoading } = useEnrollments();
  const { posts, isLoading: postsLoading, createPost } = usePosts(courseId || '');
  const [activeTab, setActiveTab] = useState('discussion');
  const [resources, setResources] = useState<Resource[]>(() => getCourseResources(courseId || ''));
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({});

  // Fetch reply counts for posts
  useEffect(() => {
    if (posts.length === 0) return;
    const postIds = posts.map(p => p.id);
    supabase
      .from('post_replies')
      .select('post_id')
      .in('post_id', postIds)
      .then(({ data }) => {
        if (!data) return;
        const counts: Record<string, number> = {};
        data.forEach((r: { post_id: string }) => {
          counts[r.post_id] = (counts[r.post_id] || 0) + 1;
        });
        setReplyCounts(counts);
      });
  }, [posts]);

  const handleToggleSave = (postId: string) => {
    setSavedPostIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
  };

  if (!courseId) return <Navigate to="/dashboard" replace />;

  const course = getCourse(courseId);
  if (!course) return <Navigate to="/dashboard" replace />;

  if (enrollLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft text-primary font-medium">Loading...</div>
      </div>
    );
  }

  if (!isEnrolled(courseId)) return <Navigate to="/dashboard" replace />;

  const handleNewPost = async (content: string, isAnonymous: boolean, link?: string) => {
    const result = await createPost(content, isAnonymous, link);
    
    if (!result.error && link) {
      const newResource: Resource = {
        id: `res-${Date.now()}`,
        courseId,
        title: extractTitleFromUrl(link),
        url: link,
        sharedBy: isAnonymous ? 'Anonymous' : (user?.name || 'User'),
        sharedAt: new Date(),
      };
      setResources(prev => [newResource, ...prev]);
    }
    
    return result;
  };

  const extractTitleFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        return lastPart
          .replace(/[-_]/g, ' ')
          .replace(/\.[^.]+$/, '')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') || urlObj.hostname;
      }
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  // Filter posts by search query
  const filteredPosts = posts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.content.toLowerCase().includes(query) ||
      (!post.is_anonymous && post.author_name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/90 backdrop-blur-md shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-primary/10 transition-all duration-200 group">
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2">
              <ClassNoteLogo size="sm" />
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
              <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Course Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-primary-foreground bg-gradient-to-r ${course.color} mb-4 shadow-sm`}>
            <span className="w-2 h-2 rounded-full bg-primary-foreground/30 animate-pulse" />
            {course.semester}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground leading-tight">
            <span className="text-gradient">{course.code}</span>
            <span className="text-muted-foreground mx-3">—</span>
            {course.name}
          </h1>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="container mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-card border border-border/30 p-4 max-w-3xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts, chats, resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-12 rounded-xl bg-muted/30 border-border/50 text-base"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-3 px-1">
              Showing results for "<span className="text-foreground font-medium">{searchQuery}</span>"
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-wrap gap-2 mb-8">
            <TabsList className="h-auto p-1.5 bg-card/80 backdrop-blur-sm rounded-2xl shadow-card border border-border/30">
              <TabsTrigger value="discussion" className="font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-300 px-5 py-2.5">
                <MessageCircle className="w-4 h-4 mr-2" />Discussion
              </TabsTrigger>
            </TabsList>
            <TabsList className="h-auto p-1.5 bg-card/80 backdrop-blur-sm rounded-2xl shadow-card border border-border/30">
              <TabsTrigger value="chat" className="font-semibold rounded-xl data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-sm transition-all duration-300 px-5 py-2.5">
                <MessagesSquare className="w-4 h-4 mr-2" />Chat
              </TabsTrigger>
            </TabsList>
            <TabsList className="h-auto p-1.5 bg-card/80 backdrop-blur-sm rounded-2xl shadow-card border border-border/30">
              <TabsTrigger value="saved" className="font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-300 px-5 py-2.5">
                <Star className="w-4 h-4 mr-2" />Saved ({savedPostIds.size})
              </TabsTrigger>
            </TabsList>
            <TabsList className="h-auto p-1.5 bg-card/80 backdrop-blur-sm rounded-2xl shadow-card border border-border/30">
              <TabsTrigger value="resources" className="font-semibold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-300 px-5 py-2.5">
                <BookOpen className="w-4 h-4 mr-2" />Resources
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="discussion" className="mt-0 tab-content-enter">
            <div className="grid gap-6 max-w-3xl">
              <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-card border border-border/30 p-5 sm:p-6 card-hover">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
                    <Send className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">Start a Discussion</h3>
                    <p className="text-xs text-muted-foreground">Share with your classmates</p>
                  </div>
                </div>
                <CreatePost courseId={courseId} onPost={handleNewPost} />
              </div>
              
              <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-card border border-border/30 p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-sm">
                    <MessageCircle className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground">Discussion Feed</h3>
                    <p className="text-xs text-muted-foreground">Recent conversations</p>
                  </div>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {postsLoading ? (
                    <div className="text-center py-14 text-muted-foreground">
                      <div className="animate-pulse font-medium">Loading posts...</div>
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-14 text-muted-foreground">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                        {searchQuery ? <Search className="w-7 h-7 opacity-50" /> : <MessageCircle className="w-7 h-7 opacity-50" />}
                      </div>
                      <p className="font-semibold text-foreground">
                        {searchQuery ? 'No matching posts' : 'No posts yet'}
                      </p>
                      <p className="text-sm mt-1">
                        {searchQuery ? 'Try a different search term' : 'Be the first to start a discussion!'}
                      </p>
                    </div>
                  ) : (
                    filteredPosts.map((post, index) => (
                      <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <PostCard 
                          post={post} 
                          courseId={courseId}
                          replyCount={replyCounts[post.id] || 0}
                          isSaved={savedPostIds.has(post.id)}
                          onToggleSave={handleToggleSave}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-0 tab-content-enter">
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-card border border-border/30 p-5 sm:p-6 max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-sm">
                  <MessagesSquare className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">Course Chat</h3>
                  <p className="text-xs text-muted-foreground">Quick messages with your classmates</p>
                </div>
              </div>
              <ChatTab courseId={courseId} searchQuery={searchQuery} />
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0 tab-content-enter">
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-card border border-border/30 p-5 sm:p-6 max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-sm">
                  <Star className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground">Saved Posts</h3>
                  <p className="text-xs text-muted-foreground">Your bookmarked discussions</p>
                </div>
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {savedPostIds.size} saved
                </span>
              </div>
              
              <div className="space-y-4">
                {savedPostIds.size === 0 ? (
                  <div className="text-center py-14 text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                      <Star className="w-7 h-7 opacity-50" />
                    </div>
                    <p className="font-semibold text-foreground">No saved posts</p>
                    <p className="text-sm mt-1">Star posts to save them here!</p>
                  </div>
                ) : (
                  posts
                    .filter(post => savedPostIds.has(post.id))
                    .map((post, index) => (
                      <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <PostCard 
                          post={post} 
                          courseId={courseId}
                          replyCount={replyCounts[post.id] || 0}
                          isSaved={true}
                          onToggleSave={handleToggleSave}
                        />
                      </div>
                    ))
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0 tab-content-enter">
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl shadow-card border border-border/30 p-5 sm:p-6 max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-sm">
                  <BookOpen className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">Shared Resources</h3>
                  <p className="text-xs text-muted-foreground">Study materials from your classmates</p>
                </div>
              </div>
              <ResourceList resources={resources} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
