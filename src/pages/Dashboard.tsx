import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { courses } from '@/data/mockData';
import { LogOut, MessageCircle, Sparkles, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import logo from '@/assets/logo.png';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const totalMessages = courses.reduce((sum, course) => sum + course.newMessages, 0);

  return (
    <div className="min-h-screen gradient-subtle">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/8 via-accent/4 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="ClassNote" className="h-14 w-auto" style={{ mixBlendMode: 'multiply' }} />
          </Link>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/10">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold text-foreground block leading-tight">
                  {user?.name}
                </span>
                <span className="text-xs text-muted-foreground">Student</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-10 w-10 p-0"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-10">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-sm font-semibold mb-5 border border-primary/15 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Welcome back, {user?.name?.split(' ')[0]}!
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-foreground mb-4 tracking-tight">
            Your <span className="text-gradient">Courses</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg">Jump into discussions and collaborate with your classmates</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Courses', value: courses.length, icon: BookOpen, color: 'from-primary to-accent' },
            { label: 'New Messages', value: totalMessages, icon: MessageCircle, color: 'from-accent to-primary' },
            { label: 'This Week', value: '+12%', icon: TrendingUp, color: 'from-success to-accent' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-card/90 backdrop-blur-sm border border-border/30 shadow-card">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <Link 
              key={course.id} 
              to={`/course/${course.id}`}
              className="block group animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <Card className="h-full bg-card/95 backdrop-blur-sm shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 border border-border/30 overflow-hidden rounded-2xl card-interactive">
                {/* Course Color Bar */}
                <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-200">
                        {course.code}
                      </h3>
                      <p className="text-muted-foreground text-sm truncate mt-1.5">
                        {course.name}
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-muted/70 text-xs font-medium text-muted-foreground border border-border/50">
                          {course.semester}
                        </span>
                      </div>
                    </div>
                    
                    {course.newMessages > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary text-xs font-bold shadow-sm border border-primary/20">
                        <span className="status-dot status-dot-primary" />
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
