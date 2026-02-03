import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function Index() {
  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="w-20" /> {/* Spacer */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground rounded-xl">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="gradient-primary hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-glow rounded-xl">
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-8 pb-24">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          {/* Large centered logo */}
          <img 
            src={logo} 
            alt="ClassNote" 
            className="h-52 sm:h-72 lg:h-96 w-auto mx-auto mb-6"
            style={{ mixBlendMode: 'multiply' }}
          />
          
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Where learning meets conversation
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
            Discuss, learn, and succeed{' '}
            <span className="text-gradient">
              together
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            ClassNote is the discussion platform built for college students. Ask questions, share resources, and connect with classmates – all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="gradient-primary hover:opacity-90 transition-all duration-200 text-base h-13 px-8 rounded-xl shadow-sm hover:shadow-glow"
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
              className="text-base h-13 px-8 border-border/60 hover:bg-muted rounded-xl"
            >
              <Link to="/login">
                I have an account
              </Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto">
          <div className="text-center p-7 rounded-2xl bg-card/90 backdrop-blur-sm shadow-card border border-border/30 animate-fade-in card-hover" style={{ animationDelay: '100ms' }}>
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-5 shadow-sm">
              <MessageCircle className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">Course Discussions</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ask questions and get answers from your classmates and TAs
            </p>
          </div>
          
          <div className="text-center p-7 rounded-2xl bg-card/90 backdrop-blur-sm shadow-card border border-border/30 animate-fade-in card-hover" style={{ animationDelay: '200ms' }}>
            <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Users className="w-7 h-7 text-accent-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">Stay Anonymous</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Post anonymously when you need to – no judgment, just learning
            </p>
          </div>
          
          <div className="text-center p-7 rounded-2xl bg-card/90 backdrop-blur-sm shadow-card border border-border/30 animate-fade-in card-hover" style={{ animationDelay: '300ms' }}>
            <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-5 shadow-sm">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">Share Resources</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Find and share helpful study materials with your class
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="ClassNote" className="h-10 w-auto" style={{ mixBlendMode: 'multiply' }} />
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 ClassNote. Made for students, by students.
          </p>
        </div>
      </footer>
    </div>
  );
}
