import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreatePostProps {
  courseId: string;
  onPost?: (content: string, isAnonymous: boolean, link?: string) => void;
}

export default function CreatePost({ courseId, onPost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation if link is provided
    if (link.trim() && !isValidUrl(link.trim())) {
      toast({
        title: "Invalid link",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onPost?.(content.trim(), isAnonymous, link.trim() || undefined);
    
    toast({
      title: "Posted!",
      description: link.trim() 
        ? "Your post and link have been shared with the class" 
        : "Your post has been shared with the class",
    });
    
    setContent('');
    setLink('');
    setIsAnonymous(false);
    setIsSubmitting(false);
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Card className="shadow-card border-0">
      <CardContent className="p-4 sm:p-5">
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-0 bg-muted/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 text-base"
          />
          
          {/* Optional Link Field */}
          <div className="mt-3 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Input
              type="url"
              placeholder="Attach a link (optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border-0 bg-muted/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 text-sm"
            />
          </div>
          
          <div className="flex items-center justify-between mt-4 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm text-muted-foreground">
                Post anonymously 🎭
              </span>
            </label>
            
            <Button 
              type="submit" 
              disabled={isSubmitting || !content.trim()}
              className="gradient-primary hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
