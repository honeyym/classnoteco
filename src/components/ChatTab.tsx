import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Send, MessageCircle, User } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  course_id: string;
  user_id: string;
  author_name: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
}

interface ChatTabProps {
  courseId: string;
  searchQuery?: string;
}

export default function ChatTab({ courseId, searchQuery: externalSearchQuery }: ChatTabProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
      setIsLoading(false);
    };

    fetchMessages();
  }, [courseId]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${courseId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `course_id=eq.${courseId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages',
          filter: `course_id=eq.${courseId}`,
        },
        (payload) => {
          const deletedId = payload.old.id;
          setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [courseId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;

    setIsSending(true);

    // For now, using a mock UUID since we're using localStorage auth
    // This will be replaced when real auth is implemented
    const mockUserId = crypto.randomUUID();

    const { error } = await supabase.from('chat_messages').insert({
      course_id: courseId,
      user_id: mockUserId,
      author_name: user.name,
      content: newMessage.trim(),
      is_anonymous: isAnonymous,
    });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }

    setIsSending(false);
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return format(date, 'MMM d, yyyy');
  };

  // Filter messages by search query (use external search query from parent)
  const searchQuery = externalSearchQuery || '';
  const filteredMessages = messages.filter((message) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      message.content.toLowerCase().includes(query) ||
      (!message.is_anonymous && message.author_name.toLowerCase().includes(query))
    );
  });

  // Group filtered messages by date
  const groupedMessages = filteredMessages.reduce((groups, message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-pulse text-muted-foreground">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-380px)]">
      {searchQuery && (
        <p className="text-sm text-muted-foreground mb-3 px-1">
          {filteredMessages.length} chat result{filteredMessages.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Messages Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4"
      >
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 opacity-50" />
            </div>
            <p className="font-medium">
              {searchQuery ? 'No matching messages' : 'No messages yet'}
            </p>
            <p className="text-sm mt-1 opacity-75">
              {searchQuery ? 'Try a different search term' : 'Start the conversation!'}
            </p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-medium px-2">
                  {date}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Messages for this date */}
              <div className="space-y-2">
                {dateMessages.map((message) => (
                  <div
                    key={message.id}
                    className="group flex gap-3 hover:bg-primary/5 rounded-xl p-3 -mx-2 transition-all duration-200"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                      {message.is_anonymous ? (
                        <User className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <span className="text-sm font-bold text-primary">
                          {message.author_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {message.is_anonymous ? 'Anonymous' : message.author_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 break-words mt-0.5 leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border/40 pt-5 mt-4">
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="flex gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 h-11 rounded-xl bg-muted/30 border-border/50 focus-visible:ring-primary/30"
              disabled={isSending}
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || isSending}
              className="gradient-primary h-11 px-5 rounded-xl shadow-sm hover:shadow-glow transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 px-1">
            <Switch
              id="anonymous-chat"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous-chat" className="text-sm text-muted-foreground cursor-pointer font-medium">
              Post anonymously 🎭
            </Label>
          </div>
        </form>
      </div>
    </div>
  );
}
