import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getCourse, getCoursePosts, getCourseResources, Post, Resource } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, LogOut, MessageCircle, Star, MessagesSquare, Search, X, Send, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import ResourceList from '@/components/ResourceList';
import ChatTab from '@/components/ChatTab';
import logo from '@/assets/logo.png';

export default function Course() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('discussion');
  const [posts, setPosts] = useState<Post[]>(() => getCoursePosts(courseId || ''));
  const [resources, setResources] = useState<Resource[]>(() => getCourseResources(courseId || ''));
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleSave = (postId: string) => {
    setSavedPostIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (!courseId) {
    return <Navigate to="/dashboard" replace />;
  }

  const course = getCourse(courseId);
  
  if (!course) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleNewPost = (content: string, isAnonymous: boolean, link?: string) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      courseId,
      authorId: user?.id || '1',
      authorName: user?.name || 'User',
      isAnonymous,
      content,
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
      hearts: 0,
      replyCount: 0,
    };
    setPosts(prev => [newPost, ...prev]);

    // If a link was attached, add it to resources
    if (link) {
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
  };

  const extractTitleFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      // Try to create a readable title from the URL
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1];
        // Convert slug to title case
        return lastPart
          .replace(/[-_]/g, ' ')
          .replace(/\.[^.]+$/, '') // Remove file extension
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') || urlObj.hostname;
      }
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  // Sort posts newest first
  const sortedPosts = [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Filter posts by search query
  const filteredPosts = sortedPosts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.content.toLowerCase().includes(query) ||
      (!post.isAnonymous && post.authorName.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard" 
              className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="ClassNote" className="h-20 w-auto" style={{ mixBlendMode: 'multiply' }} />
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

      {/* Course Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-primary-foreground bg-gradient-to-r ${course.color} mb-3 shadow-sm`}>
            {course.semester}
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground leading-tight">
            {course.code} - {course.name}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation Card */}
          <div className="bg-card rounded-2xl shadow-card p-2 mb-6 inline-block">
            <TabsList className="grid grid-cols-4 h-11 p-1 bg-muted/40 rounded-xl gap-1">
              <TabsTrigger 
                value="discussion" 
                className="font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all px-4"
              >
                Discussion
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-1.5 px-4"
              >
                <MessagesSquare className="w-4 h-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all flex items-center gap-1.5 px-4"
              >
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span> ({savedPostIds.size})
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all px-4"
              >
                Resources
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="discussion" className="mt-0">
            <div className="grid gap-6 max-w-3xl">
              {/* Search Zone */}
              <div className="bg-card rounded-2xl shadow-card p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Search className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">Search Posts</h3>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Find past discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-xl bg-muted/30 border-border/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                )}
              </div>

              {/* Create Post Zone */}
              <div className="bg-card rounded-2xl shadow-card p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Send className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">Start a Discussion</h3>
                </div>
                <CreatePost courseId={courseId} onPost={handleNewPost} />
              </div>
              
              {/* Posts Feed Zone */}
              <div className="bg-card rounded-2xl shadow-card p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">Discussion Feed</h3>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                        {searchQuery ? (
                          <Search className="w-6 h-6 opacity-50" />
                        ) : (
                          <MessageCircle className="w-6 h-6 opacity-50" />
                        )}
                      </div>
                      <p className="font-medium">
                        {searchQuery ? 'No matching posts' : 'No posts yet'}
                      </p>
                      <p className="text-sm mt-1 opacity-75">
                        {searchQuery 
                          ? `Try a different search term`
                          : 'Be the first to start a discussion!'}
                      </p>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        courseId={courseId} 
                        isSaved={savedPostIds.has(post.id)}
                        onToggleSave={handleToggleSave}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            <div className="bg-card rounded-2xl shadow-card p-4 sm:p-5 max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessagesSquare className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">Course Chat</h3>
                  <p className="text-xs text-muted-foreground">Quick messages with your classmates</p>
                </div>
              </div>
              <ChatTab courseId={courseId} />
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="bg-card rounded-2xl shadow-card p-4 sm:p-5 max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">Saved Posts</h3>
                  <p className="text-xs text-muted-foreground">{savedPostIds.size} saved for later</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {savedPostIds.size === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                      <Star className="w-6 h-6 opacity-50" />
                    </div>
                    <p className="font-medium">No saved posts</p>
                    <p className="text-sm mt-1 opacity-75">Star posts to save them here!</p>
                  </div>
                ) : (
                  sortedPosts
                    .filter(post => savedPostIds.has(post.id))
                    .map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        courseId={courseId}
                        isSaved={true}
                        onToggleSave={handleToggleSave}
                      />
                    ))
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0">
            <div className="bg-card rounded-2xl shadow-card p-4 sm:p-5 max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-accent" />
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
