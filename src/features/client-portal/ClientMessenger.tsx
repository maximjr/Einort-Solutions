import { useState, useEffect, useRef } from "react";
import {
  Send,
  MessageSquare,
  Loader2,
  X,
  Check,
  CheckCircle,
  Paperclip,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  messageService,
  Conversation,
  Message,
} from "../../services/admin/messageService";
import { useMessaging } from "../../hooks/useMessaging";

interface ClientMessengerProps {
  userId: string;
  userEmail: string;
  userName: string;
  onClose?: () => void;
}

export function ClientMessenger({
  userId,
  userEmail,
  userName,
  onClose,
}: ClientMessengerProps) {
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

    console.log(
      `SECURE MESSENGER: Establishing secure conduit for ${userName} (${userEmail})`,
    );

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

        const id = await messageService.getOrCreateConversation(
          userId,
          superAdminId,
        );
        if (active) {
          setConversationId(id);
        }
      } catch (err: any) {
        if (
          err?.code !== "permission-denied" &&
          !err?.message?.includes("Missing or insufficient permissions")
        ) {
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
      },
    );

    // Subscribe to Super Admin online status
    const unsubAdminPresence = messageService.subscribePresence(
      adminIdResolved,
      (presenceData) => {
        if (presenceData) {
          setAdminOnline(!!presenceData.isOnline);
        } else {
          setAdminOnline(false);
        }
      },
    );

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
    const attachments = mockAttachment
      ? [{ name: "Attached Document Reference", url: mockAttachment }]
      : [];

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
        attachments,
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
      setMockAttachment(
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop",
      );
    } else {
      setMockAttachment(
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
      );
    }
    setShowAttachMock(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent border-none overflow-hidden relative">
      {/* Messenger Header */}
      <div className="px-4 py-3.5 md:px-5 md:py-4 bg-[#0a0f18]/80 border-b border-white/[0.05] flex items-center justify-between relative z-15 backdrop-blur-3xl">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 border border-primary/20 flex items-center justify-center font-medium text-sm text-primary uppercase shadow-inner transition-colors`}
            >
              DT
            </div>
            {/* Realtime Admin Position Glow */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0f18] shadow-[0_0_8px_rgba(52,211,153,0.4)] ${adminOnline ? "bg-emerald-400" : "bg-slate-600 shadow-none"}`}
            ></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[13px] font-semibold tracking-wide text-white">
                Dev Team
              </h4>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold tracking-widest ${adminOnline ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-400"}`}
              >
                {adminOnline ? "Online" : "Away"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-light">
              <span className="opacity-70">Dedicated Enterprise Lead</span>
              {conversation?.priority && conversation.priority !== "none" && (
                <>
                  <span className="opacity-40">•</span>
                  <span className="text-[9px] text-amber-500/90 bg-amber-500/10 px-1.5 py-0.5 rounded-md uppercase font-semibold tracking-wider">
                    {conversation.priority} Priority
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Connection Indicator Notice */}
      {syncError && (
        <div className="bg-red-500/10 border-b border-red-500/20 py-2.5 px-5 text-[11px] text-red-400 flex items-center gap-2">
          <Activity size={12} className="text-red-400 animate-pulse" />
          <span>{syncError}</span>
        </div>
      )}

      {/* Message Timeline */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-gradient-to-b from-transparent to-black/10">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <p className="text-[11px] font-medium tracking-wide">
              Connecting secure tunnel...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-2xl relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl"></div>
              <MessageSquare size={24} className="relative z-10" />
            </div>
            <div className="space-y-2">
              <h5 className="text-[15px] font-semibold text-white tracking-wide">
                Communication Pipeline Ready
              </h5>
              <p className="text-slate-400 font-light text-[13px] leading-relaxed max-w-sm mx-auto">
                Your dedicated architect is ready to assist. Send deliverables,
                request audits, or start a new priority thread.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((ms, idx) => {
              const isMe = ms.senderId === userId;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={ms.id || idx}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2.5 group`}
                >
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/10 text-white flex items-center justify-center text-[10px] font-medium uppercase shrink-0 shadow-sm mb-5">
                      DT
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`px-4 py-3 text-[13.5px] font-light tracking-[0.01em] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all ${
                        isMe
                          ? "bg-gradient-to-br from-primary to-primary-hover text-white rounded-2xl rounded-br-sm border border-primary/20"
                          : "bg-white/[0.06] backdrop-blur-xl text-slate-100 rounded-2xl rounded-bl-sm border border-white/[0.08]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed break-words">
                        {ms.text}
                      </p>

                      {/* Attachments rendering */}
                      {ms.attachments && ms.attachments.length > 0 && (
                        <div
                          className={`mt-3 pt-3 border-t space-y-2 ${isMe ? "border-white/20" : "border-white/10"}`}
                        >
                          {ms.attachments.map((attach, aIdx) => (
                            <a
                              key={aIdx}
                              href={attach.url}
                              target="_blank"
                              rel="noreferrer"
                              className={`flex items-center gap-2 text-[12px] font-medium hover:underline transition-colors ${
                                isMe
                                  ? "text-white/90 hover:text-white"
                                  : "text-primary/90 hover:text-primary"
                              }`}
                            >
                              <Paperclip size={12} className="shrink-0" />
                              <span>{attach.name || "Attachment"}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Timestamp & Read ticks */}
                    <div
                      className={`flex items-center gap-1.5 mt-1.5 px-1 text-[10px] text-slate-500 font-medium ${isMe ? "justify-end" : "justify-start"} opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      <span>
                        {ms.timestamp
                          ? ms.timestamp.toDate
                            ? ms.timestamp
                                .toDate()
                                .toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                            : "Sent"
                          : "Now"}
                      </span>
                      {isMe && (
                        <span className="flex items-center ml-0.5">
                          {ms.read ? (
                            <CheckCircle size={10} className="text-primary" />
                          ) : (
                            <Check size={10} className="text-slate-500" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messageEndRef} className="h-2" />
          </div>
        )}
      </div>

      {/* Message input panel */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 md:p-4 bg-[#0a0f18]/90 border-t border-white/[0.05] relative z-10 backdrop-blur-3xl pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        {mockAttachment && (
          <div className="flex items-center justify-between mb-3 bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 text-[12px] text-primary">
            <span className="truncate flex items-center gap-2 font-medium">
              <Paperclip size={14} /> Attachment Ready
            </span>
            <button
              type="button"
              onClick={() => setMockAttachment(null)}
              className="text-primary/70 hover:text-primary p-0.5 cursor-pointer rounded-full hover:bg-primary/10 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2.5">
          {/* Quick Mock attachment */}
          <div className="relative shrink-0 mb-1">
            <button
              type="button"
              onClick={() => setShowAttachMock(!showAttachMock)}
              className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm"
            >
              <Paperclip size={15} />
            </button>
            <AnimatePresence>
              {showAttachMock && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-12 left-0 w-56 bg-[#1a2133] border border-white/[0.08] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-2 space-y-0.5 z-30"
                >
                  <p className="text-[10px] uppercase font-semibold text-slate-400 px-3 py-2 border-b border-white/5 mb-1.5">
                    Project Assets
                  </p>
                  <button
                    type="button"
                    onClick={() => simulateAttachment("blueprint")}
                    className="w-full text-left font-medium text-[12px] text-slate-200 hover:text-white hover:bg-white/5 py-2 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Paperclip size={12} className="text-primary" /> Blueprint
                    Document
                  </button>
                  <button
                    type="button"
                    onClick={() => simulateAttachment("audit")}
                    className="w-full text-left font-medium text-[12px] text-slate-200 hover:text-white hover:bg-white/5 py-2 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Paperclip size={12} className="text-primary" /> Deliverable
                    Audit
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
              placeholder={sending ? "Sending..." : "Message Dev Team..."}
              disabled={sending}
              rows={1}
              className="w-full min-h-[44px] max-h-32 bg-white/[0.04] border border-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-2xl px-4 py-3 text-[14px] text-white placeholder-slate-400 font-light focus:outline-none resize-none transition-all scrollbar-none shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={sending || (!inputText.trim() && !mockAttachment)}
            className="w-11 h-11 mb-0.5 rounded-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} className="ml-0.5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
