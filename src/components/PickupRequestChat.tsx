import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";
import { format } from "date-fns";

interface ChatMessage {
  id: string;
  request_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender_name?: string;
}

interface PickupRequestChatProps {
  requestId: string;
  donorId: string;
  requesterId: string;
}

export const PickupRequestChat = ({ requestId, donorId, requesterId }: PickupRequestChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    // Using type assertion since table may not be in types yet
    const { data, error } = await (supabase
      .from('pickup_request_messages' as any)
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true }) as any);

    if (!error && data) {
      // Fetch sender names
      const senderIds = [...new Set(data.map((m: any) => m.sender_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', senderIds as string[]);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p.name]) || []);
      
      setMessages(data.map((m: any) => ({
        id: m.id,
        request_id: m.request_id,
        sender_id: m.sender_id,
        message: m.message,
        created_at: m.created_at,
        sender_name: profileMap.get(m.sender_id) || 'Unknown'
      })));
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat-${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pickup_request_messages',
          filter: `request_id=eq.${requestId}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    const { error } = await (supabase
      .from('pickup_request_messages' as any)
      .insert({
        request_id: requestId,
        sender_id: user.id,
        message: newMessage.trim()
      }) as any);

    if (!error) {
      setNewMessage("");
      fetchMessages();
    }
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOwnMessage = (senderId: string) => senderId === user?.id;

  return (
    <div className="flex flex-col h-[300px] border rounded-lg bg-muted/30">
      <div className="px-3 py-2 border-b bg-background rounded-t-lg">
        <h4 className="font-medium text-sm">Chat</h4>
        <p className="text-xs text-muted-foreground">Discuss pickup details</p>
      </div>
      
      <ScrollArea className="flex-1 p-3" ref={scrollRef as any}>
        <div className="space-y-3">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${isOwnMessage(msg.sender_id) ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    isOwnMessage(msg.sender_id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border'
                  }`}
                >
                  {!isOwnMessage(msg.sender_id) && (
                    <p className="text-xs font-medium mb-1 opacity-70">{msg.sender_name}</p>
                  )}
                  <p className="text-sm">{msg.message}</p>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {format(new Date(msg.created_at), 'h:mm a')}
                </span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <div className="p-2 border-t bg-background rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={sending}
          />
          <Button size="icon" onClick={handleSend} disabled={sending || !newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PickupRequestChat;
