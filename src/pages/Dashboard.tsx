import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { courses } from '@/data/mockData';
import { LogOut, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import logo from '@/assets/logo.png';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/90 backdrop-blur-md shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="ClassNote" className="h-16 w-auto" style={{ mixBlendMode: 'multiply' }} />
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
              <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground">
                {user?.name}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Welcome back!
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">
            Your <span className="text-gradient">Courses</span>
          </h1>
          <p className="text-muted-foreground text-lg">Jump into a discussion with your classmates</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <Link 
              key={course.id} 
              to={`/course/${course.id}`}
              className="block group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full bg-card/90 backdrop-blur-sm shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1.5 border border-border/30 overflow-hidden animate-fade-in rounded-2xl">
                {/* Course Color Bar */}
                <div className={`h-1.5 bg-gradient-to-r ${course.color}`} />
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                        {course.code}
                      </h3>
                      <p className="text-muted-foreground text-sm truncate mt-1">
                        {course.name}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-muted/60 text-xs font-medium text-muted-foreground">
                          {course.semester}
                        </span>
                      </div>
                    </div>
                    
                    {course.newMessages > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/15 text-primary text-xs font-bold shadow-sm">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {course.newMessages}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
