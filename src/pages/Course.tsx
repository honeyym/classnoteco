import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getCourse, getCoursePosts } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import ResourceList from '@/components/ResourceList';

export default function Course() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('discussion');

  if (!courseId) {
    return <Navigate to="/dashboard" replace />;
  }

  const course = getCourse(courseId);
  
  if (!course) {
    return <Navigate to="/dashboard" replace />;
  }

  const posts = getCoursePosts(courseId);

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
              <CreatePost courseId={courseId} />
              
              {/* Posts Feed */}
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No posts yet</p>
                    <p className="text-sm mt-1">Be the first to start a discussion!</p>
                  </div>
                ) : (
                  posts.map((post) => (
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
