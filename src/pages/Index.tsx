import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Sparkles, ArrowRight, BookOpen, Zap, Shield, Heart } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import logoTransparent from '@/assets/logo-transparent-clean.png';

export default function Index() {
  return (
    <div className="min-h-screen gradient-subtle overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent/8 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="w-20" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl font-medium">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="gradient-primary hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-glow rounded-xl font-semibold btn-glow">
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative container mx-auto px-4 pt-4 pb-16">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Large centered logo */}
          <div className="flex justify-center mb-6">
            <img src={logoTransparent} alt="ClassNote" className="h-32 sm:h-40 lg:h-48 w-auto animate-float" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 shadow-sm border border-primary/20">
            <Sparkles className="w-4 h-4" />
            Where learning meets conversation
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-foreground mb-4 leading-[1.1] tracking-tight">
            Discuss, learn, and succeed{' '}
            <span className="text-gradient-animated">
              together
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            ClassNote is the discussion platform built for college students. Ask questions, share resources, and connect with classmates – all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="gradient-primary hover:opacity-90 transition-all duration-300 text-sm h-12 px-8 rounded-2xl shadow-md hover:shadow-glow font-semibold btn-glow group"
            >
              <Link to="/signup">
                Get started free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="text-sm h-12 px-8 border-2 border-border/60 hover:border-primary/30 hover:bg-primary/5 rounded-2xl font-semibold transition-all duration-300"
            >
              <Link to="/login">
                I have an account
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 mt-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['from-primary to-accent', 'from-accent to-primary', 'from-primary to-primary'].map((gradient, i) => (
                  <div 
                    key={i}
                    className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradient} border-2 border-background flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {['A', 'B', 'C'][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium">500+ students</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Heart className="w-4 h-4 text-destructive fill-destructive" />
              <span className="text-sm font-medium">Loved by students</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-5 mt-16 max-w-5xl mx-auto">
          {[
            {
              icon: MessageCircle,
              gradient: 'gradient-primary',
              title: 'Course Discussions',
              description: 'Ask questions and get answers from your classmates and TAs in real-time',
              delay: '100ms'
            },
            {
              icon: Shield,
              gradient: 'gradient-accent',
              title: 'Stay Anonymous',
              description: 'Post anonymously when you need to – no judgment, just learning',
              delay: '200ms'
            },
            {
              icon: Zap,
              gradient: 'gradient-warm',
              title: 'Real-time Chat',
              description: 'Quick messages with classmates for instant collaboration',
              delay: '300ms'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-2xl bg-card/90 backdrop-blur-sm shadow-card border border-border/30 animate-fade-in card-hover card-interactive group" 
              style={{ animationDelay: feature.delay }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.gradient} flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border border-primary/10">
            <BookOpen className="w-8 h-8 text-primary" />
            <h2 className="font-display font-bold text-xl text-foreground">Ready to ace your classes?</h2>
            <p className="text-sm text-muted-foreground max-w-md">Join thousands of students already using ClassNote to succeed together.</p>
            <Button asChild className="gradient-primary hover:opacity-90 rounded-xl font-semibold h-10 px-6 mt-1 btn-glow">
              <Link to="/signup">
                Start learning together
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative container mx-auto px-4 py-6 border-t border-border/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logoTransparent} alt="ClassNote" className="h-8 w-auto" />
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 ClassNote. Made for students, by students.
          </p>
        </div>
      </footer>
    </div>
  );
}
