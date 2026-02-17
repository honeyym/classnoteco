import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Send, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreatePostProps {
  courseId: string;
  onPost: (content: string, isAnonymous: boolean, link?: string) => Promise<{ error: Error | null }>;
}

export default function CreatePost({ courseId, onPost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({ title: "Empty post", description: "Please write something before posting", variant: "destructive" });
      return;
    }

    if (link.trim() && !isValidUrl(link.trim())) {
      toast({ title: "Invalid link", description: "Please enter a valid URL (e.g., https://example.com)", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await onPost(content.trim(), isAnonymous, link.trim() || undefined);

    if (error) {
      toast({ title: "Error", description: "Failed to create post. Please try again.", variant: "destructive" });
    } else {
      toast({
        title: "Posted!",
        description: link.trim() ? "Your post and link have been shared with the class" : "Your post has been shared with the class",
      });
      setContent('');
      setLink('');
      setIsAnonymous(false);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={5000}
          className="min-h-[120px] resize-none border border-border/50 bg-muted/30 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 focus-visible:border-primary/50 text-base rounded-xl transition-all placeholder:text-muted-foreground/60"
        />
        
        <div className="flex items-center gap-3 px-1">
          <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <Input
            type="url"
            placeholder="Attach a link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="border border-border/50 bg-muted/30 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 focus-visible:border-primary/50 text-sm rounded-lg h-10 transition-all placeholder:text-muted-foreground/60"
          />
        </div>
        
        <div className="flex items-center justify-between gap-4 pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <Checkbox
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              className="border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded"
            />
            <span className="text-sm text-muted-foreground font-medium">Post anonymously 🎭</span>
          </label>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !content.trim()}
            size="lg"
            className="gradient-primary hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg px-6 font-semibold rounded-xl"
          >
            <Send className="w-4 h-4 mr-2" />
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}
