import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getCourse, getCoursePosts, getCourseResources, Post, Resource } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, LogOut, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import ResourceList from '@/components/ResourceList';
import logo from '@/assets/logo.png';

export default function Course() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('discussion');
  const [posts, setPosts] = useState<Post[]>(() => getCoursePosts(courseId || ''));
  const [resources, setResources] = useState<Resource[]>(() => getCourseResources(courseId || ''));
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());

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
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6 sm:mb-8 h-12 p-1 bg-muted/60 rounded-xl">
            <TabsTrigger 
              value="discussion" 
              className="font-semibold rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all"
            >
              Discussion
            </TabsTrigger>
            <TabsTrigger 
              value="saved" 
              className="font-semibold rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all flex items-center gap-1.5"
            >
              <Star className="w-4 h-4" />
              Saved ({savedPostIds.size})
            </TabsTrigger>
            <TabsTrigger 
              value="resources" 
              className="font-semibold rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all"
            >
              Resources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussion" className="mt-0">
            <div className="max-w-2xl space-y-5 sm:space-y-6">
              {/* Create Post */}
              <CreatePost courseId={courseId} onPost={handleNewPost} />
              
              {/* Posts Feed */}
              <div className="space-y-4 sm:space-y-5">
                {sortedPosts.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 opacity-50" />
                    </div>
                    <p className="font-medium">No posts yet</p>
                    <p className="text-sm mt-1 opacity-75">Be the first to start a discussion!</p>
                  </div>
                ) : (
                  sortedPosts.map((post) => (
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
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="max-w-2xl space-y-4 sm:space-y-5">
              {savedPostIds.size === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
                    <Star className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="font-medium">No saved posts</p>
                  <p className="text-sm mt-1 opacity-75">Star posts to save them here for later!</p>
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
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0">
            <div className="max-w-2xl">
              <ResourceList resources={resources} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
