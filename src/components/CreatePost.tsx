import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreatePostProps {
  courseId: string;
  onPost?: () => void;
}

export default function CreatePost({ courseId, onPost }: CreatePostProps) {
  const [content, setContent] = useState('');
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

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Posted!",
      description: "Your post has been shared with the class",
    });
    
    setContent('');
    setIsAnonymous(false);
    setIsSubmitting(false);
    onPost?.();
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
