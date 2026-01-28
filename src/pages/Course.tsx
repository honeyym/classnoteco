import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getCourse, getCoursePosts, Post } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, LogOut } from 'lucide-react';
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

  if (!courseId) {
    return <Navigate to="/dashboard" replace />;
  }

  const course = getCourse(courseId);
  
  if (!course) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleNewPost = (content: string, isAnonymous: boolean) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      courseId,
      authorId: user?.id || '1',
      authorName: user?.name || 'User',
      isAnonymous,
      content,
      createdAt: new Date(),
      likes: 0,
      hearts: 0,
      replyCount: 0,
    };
    setPosts(prev => [newPost, ...prev]);
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
        <div className="container mx-auto px-4 py-6">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-primary-foreground bg-gradient-to-r ${course.color} mb-3`}>
            {course.semester}
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            {course.code} - {course.name}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-xs grid-cols-2 mb-6">
            <TabsTrigger value="discussion" className="font-medium">
              Discussion
            </TabsTrigger>
            <TabsTrigger value="resources" className="font-medium">
              Resources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="discussion" className="mt-0">
            <div className="max-w-2xl space-y-6">
              {/* Create Post */}
              <CreatePost courseId={courseId} onPost={handleNewPost} />
              
              {/* Posts Feed */}
              <div className="space-y-4">
                {sortedPosts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No posts yet</p>
                    <p className="text-sm mt-1">Be the first to start a discussion!</p>
                  </div>
                ) : (
                  sortedPosts.map((post) => (
                    <PostCard key={post.id} post={post} courseId={courseId} />
                  ))
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0">
            <div className="max-w-2xl">
              <ResourceList courseId={courseId} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
