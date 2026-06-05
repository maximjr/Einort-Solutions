import { useState, useEffect, useRef } from "react";
import { 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Loader2, 
  X, 
  Check, 
  CheckCircle,
  Paperclip,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { messageService, Conversation, Message } from "../../services/admin/messageService";
import { useMessaging } from "../../hooks/useMessaging";

interface ClientMessengerProps {
  userId: string;
  userEmail: string;
  userName: string;
  onClose?: () => void;
}

export function ClientMessenger({ userId, userEmail, userName, onClose }: ClientMessengerProps) {
  const { conversations } = useMessaging();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [adminIdResolved, setAdminIdResolved] = useState<string>("super_admin");
  const [inputText, setInputText] = useState("");
  const [adminOnline, setAdminOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [showAttachMock, setShowAttachMock] = useState(false);
  const [mockAttachment, setMockAttachment] = useState<string | null>(null);

  const messageEndRef = useRef<HTMLDivElement>(null);

  // 1. Establish/Fetch conversation-record on mount
  useEffect(() => {
    let active = true;
    
    console.log(`SECURE MESSENGER: Establishing secure conduit for ${userName} (${userEmail})`);

    // Register offline presence cleanup inside this viewport
    messageService.setPresence(userId, true, "client");

    async function initConversation() {
      try {
        const superAdminId = await messageService.getSuperAdminUid();
        if (active) {
          setAdminIdResolved(superAdminId);
        }
        
        // Ensure legacy conversations get migrated gracefully to prevent message loss
        await messageService.migrateLegacyConversation(userId, superAdminId);

        const id = await messageService.getOrCreateConversation(userId, superAdminId);
        if (active) {
          setConversationId(id);
        }
      } catch (err: any) {
        if (err?.code !== "permission-denied" && !err?.message?.includes("Missing or insufficient permissions")) {
          console.error("Failed to establish secure conduit:", err);
        }
        if (active) {
          setSyncError("Communication channel initializing...");
          setLoading(false);
        }
      }
    }

    initConversation();

    return () => {
      active = false;
      messageService.setPresence(userId, false, "client");
    };
  }, [userId, userEmail, userName]);

  // 2. Subscribe to conversation info & message streams
  useEffect(() => {
    if (!conversationId) return;

    // Reset unread count for the client on open or new incoming
    messageService.markAsRead(conversationId, userId);

    const unsubMessages = messageService.subscribeMessages(
      conversationId,
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
        // Clear unread counts whenever messages list updates / we are actively looking at it
        messageService.markAsRead(conversationId, userId);
      },
      (err) => {
        console.warn("Messages stream subscription failure:", err);
        setSyncError("Messages streams read authorization denied.");
        setLoading(false);
      }
    );

    // Subscribe to Super Admin online status
    const unsubAdminPresence = messageService.subscribePresence(adminIdResolved, (presenceData) => {
      if (presenceData) {
        setAdminOnline(!!presenceData.isOnline);
      } else {
        setAdminOnline(false);
      }
    });

    return () => {
      unsubMessages();
      unsubAdminPresence();
    };
  }, [conversationId, userId, adminIdResolved]);

  // Keep local conversation state updated from hook
  useEffect(() => {
    if (conversationId && conversations) {
      const found = conversations.find((c) => c.id === conversationId);
      if (found) {
        setConversation(found);
      }
    }
  }, [conversations, conversationId]);

  // 3. Scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 4. Send action
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !mockAttachment) return;
    if (!conversationId) return;

    setSending(true);
    const textToSend = inputText.trim();
    const attachments = mockAttachment ? [{ name: "Attached Document Reference", url: mockAttachment }] : [];

    setInputText("");
    setMockAttachment(null);
    setShowAttachMock(false);

    try {
      await messageService.sendMessage(
        conversationId,
        userId,
        adminIdResolved,
        textToSend || "Shared an attachment preview reference.",
        attachments.length > 0 ? "file" : "text",
        attachments
      );
    } catch (err) {
      console.error("Error sending enterprise payload:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const simulateAttachment = (type: string) => {
    if (type === "blueprint") {
      setMockAttachment("https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop");
    } else {
      setMockAttachment("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop");
    }
    setShowAttachMock(false);
  };

  return (
    <div className="flex flex-col h-[520px] bg-[#0b0f19] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Messenger Header */}
      <div className="px-5 py-4 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between relative z-15">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary uppercase shadow-inner`}>
              SA
            </div>
            {/* Realtime Admin Position Glow */}
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0b0f19] ${adminOnline ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-slate-600"}`}></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Super Admin</h4>
              <span className={`text-[8px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-widest ${adminOnline ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-slate-400 border border-white/5"}`}>
                {adminOnline ? "Online" : "Away"}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-light">
              <ShieldCheck size={10} className="text-primary" /> 
              <span>SECURE EXECUTIVE CONDUIT</span>
              {conversation?.priority && conversation.priority !== "none" && (
                <span className="text-[8px] text-amber-400 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/15 uppercase font-mono tracking-wider">
                  {conversation.priority} Priority
                </span>
              )}
            </p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 px-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-xs flex items-center gap-1 cursor-pointer"
          >
            <X size={14} /> Close
          </button>
        )}
      </div>

      {/* Connection Indicator Notice */}
      {syncError && (
        <div className="bg-red-500/10 border-b border-red-500/20 py-2 px-4 text-[10px] text-red-400 font-mono flex items-center gap-2">
          <Activity size={10} className="text-red-400 animate-pulse" />
          <span>{syncError}</span>
        </div>
      )}

      {/* Message Timeline */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-[#070a13]/50">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono">Connecting pipeline...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <MessageSquare size={18} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Tunnel Established</h5>
              <p className="text-slate-400 font-light text-[11px] leading-relaxed max-w-xs">
                Welcome to your private priority channel. Send a blueprint, request an audit revision, or talk directly with your dedicated lead.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((ms, idx) => {
              const isMe = ms.senderId === userId;
              return (
                <div 
                  key={ms.id || idx}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {!isMe && (
                    <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-mono text-[9px] font-bold uppercase shrink-0">
                      SA
                    </div>
                  )}
                  <div className="max-w-[80%] flex flex-col">
                    <div className={`px-4 py-3 rounded-2xl text-xs font-light tracking-wide shadow-lg ${
                      isMe 
                        ? "bg-primary text-white rounded-br-none border border-primary/10" 
                        : "bg-white/[0.02] text-slate-200 rounded-bl-none border border-white/5"
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed break-all">{ms.text}</p>
                      
                      {/* Attachments rendering */}
                      {ms.attachments && ms.attachments.length > 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-1.5">
                          {ms.attachments.map((attach, aIdx) => (
                            <a 
                              key={aIdx}
                              href={attach.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 hover:underline hover:text-cyan-300"
                            >
                              <Paperclip size={10} className="shrink-0" />
                              <span>{attach.name || "Attachment"}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Timestamp & Read ticks */}
                    <div className={`flex items-center gap-1.5 mt-1 text-[9px] text-slate-500 font-mono ${isMe ? "justify-end" : "justify-start"}`}>
                      <span>
                        {ms.timestamp ? (
                          ms.timestamp.toDate ? (
                            ms.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          ) : (
                            "Sent"
                          )
                        ) : (
                          "Now"
                        )}
                      </span>
                      {isMe && (
                        <span className="text-primary flex items-center">
                          <Check size={11} className={`${ms.read ? "text-cyan-400" : "text-slate-500"}`} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        )}
      </div>

      {/* Message input panel */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white/[0.01] border-t border-white/[0.06] relative z-10 space-y-3">
        {mockAttachment && (
          <div className="flex items-center justify-between bg-cyan-950/20 border border-cyan-500/20 rounded-xl px-3 py-2 text-[10px] font-mono text-cyan-400 animate-pulse">
            <span className="truncate flex items-center gap-1.5">
              <Paperclip size={10} /> Document ready for uplink
            </span>
            <button 
              type="button" 
              onClick={() => setMockAttachment(null)}
              className="text-slate-500 hover:text-white p-0.5 cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          {/* Quick Mock attachment */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowAttachMock(!showAttachMock)}
              className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <Paperclip size={16} />
            </button>
            <AnimatePresence>
              {showAttachMock && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-13 left-0 w-48 bg-[#0e1322] border border-white/10 rounded-xl shadow-2xl p-2 space-y-1 z-30"
                >
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 px-2 py-1 font-mono border-b border-white/5 mb-1">Uplink Attachment</p>
                  <button 
                    type="button"
                    onClick={() => simulateAttachment("blueprint")}
                    className="w-full text-left font-mono text-[10px] text-slate-300 hover:text-white hover:bg-white/5 py-1.5 px-2 rounded-lg transition-colors cursor-pointer"
                  >
                    ✦ Project Blueprint.pdf
                  </button>
                  <button 
                    type="button"
                    onClick={() => simulateAttachment("audit")}
                    className="w-full text-left font-mono text-[10px] text-slate-300 hover:text-white hover:bg-white/5 py-1.5 px-2 rounded-lg transition-colors cursor-pointer"
                  >
                    ✦ Deliverable Audit.pdf
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={sending ? "Transmitting..." : "Secure message tunnel. Enter message..."}
              disabled={sending}
              rows={1}
              className="w-full h-11 min-h-[44px] max-h-32 bg-white/[0.02] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 font-light focus:outline-none resize-none transition-all scrollbar-thin"
            />
          </div>

          <button
            type="submit"
            disabled={sending || (!inputText.trim() && !mockAttachment)}
            className="h-11 px-4 rounded-xl bg-primary hover:bg-primary-hover border border-primary/20 hover:border-primary-hover disabled:opacity-50 text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all cursor-pointer"
          >
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
        <div className="flex justify-between items-center px-1 text-[9px] text-slate-600 font-light">
          <span>Shift + Enter for new line</span>
          <span className="flex items-center gap-1">
            <CheckCircle size={9} className="text-primary" /> Active AES-256 replication
          </span>
        </div>
      </form>
    </div>
  );
}
