import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Send, MessageCircle, User, ThumbsUp, Reply, X } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  course_id: string;
  user_id: string;
  author_name: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  likes: number;
  parent_id: string | null;
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
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        setMessages((data as ChatMessage[]) || []);
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
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `course_id=eq.${courseId}`,
        },
        (payload) => {
          const updatedMsg = payload.new as ChatMessage;
          setMessages((prev) =>
            prev.map((msg) => (msg.id === updatedMsg.id ? updatedMsg : msg))
          );
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

    const mockUserId = crypto.randomUUID();

    const { error } = await supabase.from('chat_messages').insert({
      course_id: courseId,
      user_id: mockUserId,
      author_name: user.name,
      content: newMessage.trim(),
      is_anonymous: isAnonymous,
      parent_id: replyingTo?.id || null,
    });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
      setReplyingTo(null);
    }

    setIsSending(false);
  };

  const handleLike = async (message: ChatMessage) => {
    const isLiked = likedMessages.has(message.id);
    const newLikes = isLiked ? message.likes - 1 : message.likes + 1;

    // Optimistic update
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(message.id);
      } else {
        newSet.add(message.id);
      }
      return newSet;
    });

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id ? { ...msg, likes: newLikes } : msg
      )
    );

    // Update in database
    const { error } = await supabase
      .from('chat_messages')
      .update({ likes: newLikes })
      .eq('id', message.id);

    if (error) {
      console.error('Error updating likes:', error);
      // Revert on error
      setLikedMessages((prev) => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.add(message.id);
        } else {
          newSet.delete(message.id);
        }
        return newSet;
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, likes: message.likes } : msg
        )
      );
    }
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
    inputRef.current?.focus();
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

  // Filter messages by search query
  const searchQuery = externalSearchQuery || '';
  const filteredMessages = messages.filter((message) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      message.content.toLowerCase().includes(query) ||
      (!message.is_anonymous && message.author_name.toLowerCase().includes(query))
    );
  });

  // Separate parent messages and replies
  const parentMessages = filteredMessages.filter((msg) => !msg.parent_id);
  const repliesMap = filteredMessages.reduce((acc, msg) => {
    if (msg.parent_id) {
      if (!acc[msg.parent_id]) acc[msg.parent_id] = [];
      acc[msg.parent_id].push(msg);
    }
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  // Group parent messages by date
  const groupedMessages = parentMessages.reduce((groups, message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  const renderMessage = (message: ChatMessage, isReply = false) => {
    const isLiked = likedMessages.has(message.id);
    const replies = repliesMap[message.id] || [];

    return (
      <div key={message.id} className={isReply ? 'ml-12 mt-2' : ''}>
        <div
          className={`group flex gap-3 hover:bg-primary/5 rounded-xl p-3 -mx-2 transition-all duration-200 ${
            isReply ? 'bg-muted/30' : ''
          }`}
        >
          {/* Avatar */}
          <div className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20`}>
            {message.is_anonymous ? (
              <User className={`${isReply ? 'w-3 h-3' : 'w-4 h-4'} text-muted-foreground`} />
            ) : (
              <span className={`${isReply ? 'text-xs' : 'text-sm'} font-bold text-primary`}>
                {message.author_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className={`font-semibold ${isReply ? 'text-xs' : 'text-sm'} text-foreground`}>
                {message.is_anonymous ? 'Anonymous' : message.author_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTime(message.created_at)}
              </span>
              {isReply && (
                <span className="text-xs text-muted-foreground">• reply</span>
              )}
            </div>
            <p className={`${isReply ? 'text-xs' : 'text-sm'} text-foreground/90 break-words mt-0.5 leading-relaxed`}>
              {message.content}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleLike(message)}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  isLiked
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-primary' : ''}`} />
                {message.likes > 0 && <span>{message.likes}</span>}
              </button>
              {!isReply && (
                <button
                  onClick={() => handleReply(message)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  <Reply className="w-3.5 h-3.5" />
                  {replies.length > 0 && <span>{replies.length}</span>}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Render replies */}
        {!isReply && replies.length > 0 && (
          <div className="border-l-2 border-primary/20 ml-5">
            {replies.map((reply) => renderMessage(reply, true))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-pulse text-muted-foreground">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
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
        {parentMessages.length === 0 ? (
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
                {dateMessages.map((message) => renderMessage(message))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-t-xl border-t border-x border-primary/20">
          <Reply className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            Replying to{' '}
            <span className="font-medium text-foreground">
              {replyingTo.is_anonymous ? 'Anonymous' : replyingTo.author_name}
            </span>
          </span>
          <button
            onClick={() => setReplyingTo(null)}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className={`border-t border-border/40 pt-5 mt-4 ${replyingTo ? 'mt-0 pt-3' : ''}`}>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={replyingTo ? 'Write a reply...' : 'Type a message...'}
              className="flex-1 h-12 rounded-xl bg-muted/30 border-border/50 focus-visible:ring-primary/30 text-base"
              disabled={isSending}
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || isSending}
              className="gradient-primary h-12 px-6 rounded-xl shadow-sm hover:shadow-glow transition-all duration-200"
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
