import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageCircle, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">ClassNote</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="gradient-primary hover:opacity-90 transition-opacity">
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-16 pb-24">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Where learning meets conversation
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
            Discuss, learn, and succeed{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              together
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            ClassNote is the discussion platform built for college students. Ask questions, share resources, and connect with classmates – all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="gradient-primary hover:opacity-90 transition-opacity text-base h-12 px-8"
            >
              <Link to="/signup">
                Get started free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="text-base h-12 px-8 border-border hover:bg-muted"
            >
              <Link to="/login">
                I have an account
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-2xl bg-card shadow-card animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">Course Discussions</h3>
            <p className="text-muted-foreground text-sm">
              Ask questions and get answers from your classmates and TAs
            </p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card shadow-card animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">Stay Anonymous</h3>
            <p className="text-muted-foreground text-sm">
              Post anonymously when you need to – no judgment, just learning
            </p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-card shadow-card animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">Share Resources</h3>
            <p className="text-muted-foreground text-sm">
              Find and share helpful study materials with your class
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">ClassNote</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 ClassNote. Made for students, by students.
          </p>
        </div>
      </footer>
    </div>
  );
}
