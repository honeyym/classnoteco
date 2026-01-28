import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { courses } from '@/data/mockData';
import { LogOut, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import logo from '@/assets/logo.png';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="ClassNote" className="h-12 w-auto" />
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Hey, {user?.name}! 👋
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Your Courses</h1>
          <p className="text-muted-foreground">Jump into a discussion with your classmates</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <Link 
              key={course.id} 
              to={`/course/${course.id}`}
              className="block"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="group h-full shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden animate-fade-in">
                {/* Course Color Bar */}
                <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {course.code}
                      </h3>
                      <p className="text-muted-foreground text-sm truncate">
                        {course.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {course.semester}
                      </p>
                    </div>
                    
                    {course.newMessages > 0 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <MessageCircle className="w-3 h-3" />
                        {course.newMessages} new
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
