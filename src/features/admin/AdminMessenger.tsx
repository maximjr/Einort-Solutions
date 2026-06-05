import { useState, useEffect, useRef } from "react";
import { 
  Send, 
  MessageSquare, 
  Loader2, 
  X,
  Paperclip,
  Activity,
  Flag,
  Archive,
  CheckCircle2,
  FolderLock,
  Globe,
  BellRing
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { messageService, Conversation, Message } from "../../services/admin/messageService";

interface AdminMessengerProps {
  clients: any[];
  currentAdminId: string;
}

import { useMessaging } from "../../hooks/useMessaging";

export function AdminMessenger({ clients, currentAdminId }: AdminMessengerProps) {
  const { conversations } = useMessaging();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [clientPresence, setClientPresence] = useState<Record<string, boolean>>({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [mockAttachment, setMockAttachment] = useState<string | null>(null);
  const [showAttachMock, setShowAttachMock] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);

  // 1. Register Admin Presence on mount
  useEffect(() => {
    messageService.setPresence(currentAdminId, true, "super_admin");
    return () => {
      messageService.setPresence(currentAdminId, false, "super_admin");
    };
  }, [currentAdminId]);

  // 3. Monitor individual Client Presences globally
  useEffect(() => {
    const unsubscibers: (() => void)[] = [];
    
    clients.forEach((c) => {
      const unsub = messageService.subscribePresence(c.id, (presence) => {
        setClientPresence((prev) => ({
          ...prev,
          [c.id]: !!presence?.isOnline
        }));
      });
      unsubscibers.push(unsub);
    });

    return () => {
      unsubscibers.forEach((unsub) => unsub());
    };
  }, [clients]);

  // 4. Handle selecting a client conversation
  useEffect(() => {
    if (!selectedClientId) {
      setSelectedConversation(null);
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    let active = true;

    async function openChat() {
      try {
        const id = await messageService.getOrCreateConversation(selectedClientId!, currentAdminId);
        if (!active) return;

        // Clear Admin unread counts when opening this conversation
        messageService.markAsRead(id, currentAdminId);

        // Map updates to conversation selection
        // Automatically handled by the effect below. No need for another manual subscription here.

        // Load Messages
        const unsubMsgs = messageService.subscribeMessages(id, (newMsgs) => {
          if (!active) return;
          setMessages(newMsgs);
          setLoadingMessages(false);
          // Auto clear admin unread counts on fresh incoming payload
          messageService.markAsRead(id, currentAdminId);
        }, (err) => {
          console.warn("Messages loading failed for conversation:", id, err);
          if (active) {
            setSyncError("Messages link broken.");
            setLoadingMessages(false);
          }
        });

        return () => {
          unsubMsgs();
        };
      } catch (err) {
        console.error("Error setting up dynamic chat pipeline:", err);
        if (active) setLoadingMessages(false);
      }
    }

    let unsubscribersPromise = openChat();

    return () => {
      active = false;
      unsubscribersPromise.then((unsub) => unsub?.());
    };
  }, [selectedClientId, currentAdminId]);

  // Map updates to conversation selection globally from hook
  useEffect(() => {
    if (selectedClientId && conversations.length > 0) {
      const id = `${selectedClientId}_${currentAdminId}`;
      const found = conversations.find((c) => c.id === id);
      if (found) {
        setSelectedConversation(found);
      }
    }
  }, [conversations, selectedClientId, currentAdminId]);

  // 5. Scroll to bottom of message panel
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingMessages]);

  // 6. Send payload
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !mockAttachment) return;
    if (!selectedClientId || !selectedConversation) return;

    setSending(true);
    const textToSend = inputText.trim();
    const attachments = mockAttachment ? [{ name: "Review and Document.pdf", url: mockAttachment }] : [];

    setInputText("");
    setMockAttachment(null);
    setShowAttachMock(false);

    try {
      await messageService.sendMessage(
        selectedConversation.id,
        currentAdminId,
        selectedClientId,
        textToSend || "Administrative documents shared.",
        attachments.length > 0 ? "file" : "text",
        attachments
      );
    } catch (err) {
      console.error("Administrative send action blocked:", err);
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

  const updatePriority = async (priority: string) => {
    if (!selectedConversation) return;
    try {
      await messageService.updateConversationPriority(selectedConversation.id, priority);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (status: string) => {
    if (!selectedConversation) return;
    try {
      await messageService.updateConversationStatus(selectedConversation.id, status);
    } catch (err) {
      console.error(err);
    }
  };

  const simulateAttachment = () => {
    setMockAttachment("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop");
    setShowAttachMock(false);
  };

  // Find client info safely
  const activeSelectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#030712] rounded-3xl border border-white/[0.05] p-6 lg:p-8 min-h-[550px] shadow-2xl relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[80px] rounded-full pointer-events-none -mr-40 -mt-40"></div>

      {syncError && (
        <div className="lg:col-span-12 bg-red-500/10 border border-red-500/20 px-5 py-3 rounded-2xl text-red-500 text-xs font-mono flex items-center gap-2 mb-2">
          <Activity size={14} className="animate-pulse" />
          <span>{syncError}</span>
        </div>
      )}

      {/* LEFT PANEL: Conversation and client directory */}
      <div className="lg:col-span-4 flex flex-col space-y-4 border-r border-white/5 pr-0 lg:pr-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
            <MessageSquare size={14} className="text-primary" /> Active Pipeline Directory
          </h3>
          <p className="text-[10px] text-slate-500 font-mono">Live synchronization with user database</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 max-h-[440px] pr-2 scrollbar-thin">
          {clients.length === 0 ? (
            <div className="py-12 text-center text-slate-600 text-xs font-light">
              No registered clients to display.
            </div>
          ) : (
            clients.map((c) => {
              // Find matching conversation in list to check last message and unread count
              const convId = `${c.id}_${currentAdminId}`;
              const conv = conversations.find((v) => v.id === convId);
              const unread = conv?.unreadCount?.[currentAdminId] || 0;
              const online = clientPresence[c.id] || false;
              const isSelected = selectedClientId === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? "bg-primary/10 border-primary/30 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                      : "bg-white/[0.015] border-white/[0.04] hover:bg-white/[0.03] text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="relative shrink-0 mt-0.5">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center font-bold text-xs uppercase">
                      {c.name ? c.name.substring(0, 2) : "CL"}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#030712] ${online ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)]" : "bg-slate-600"}`}></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-semibold truncate text-white">{c.name || "Client User"}</p>
                      {unread > 0 && (
                        <span className="flex items-center gap-1 bg-cyan-400 text-[#030712] text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono animate-bounce">
                          <BellRing size={7} /> {unread}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono truncate mb-1.5">{c.email}</p>
                    
                    {conv?.lastMessage ? (
                      <p className="text-[10px] text-slate-400 truncate leading-relaxed font-light font-sans italic">
                        {conv.lastMessage}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-600 truncate font-light font-mono">
                        Pipeline established
                      </p>
                    )}
                  </div>

                  {conv?.priority && conv.priority !== "none" && (
                    <span className={`absolute right-3 bottom-3 w-1.5 h-1.5 rounded-full ${
                      conv.priority === "high" ? "bg-red-500" : conv.priority === "medium" ? "bg-orange-500" : "bg-yellow-500"
                    }`}></span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Dynamic messaging zone */}
      <div className="lg:col-span-8 flex flex-col space-y-4 min-h-[460px]">
        {selectedClientId && activeSelectedClient ? (
          <div className="flex flex-col h-full bg-[#070a13] border border-white/[0.05] rounded-2xl overflow-hidden shadow-inner flex-1">
            {/* Header / Client Info & Flags controller */}
            <div className="px-5 py-4 bg-white/[0.02] border-b border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  {activeSelectedClient.name ? activeSelectedClient.name.substring(0, 2) : "CL"}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      {activeSelectedClient.name}
                    </h4>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-mono uppercase bg-white/5 border border-white/5 text-slate-400 capitalize`}>
                      {activeSelectedClient.accountType || "Standard"} Client
                    </span>
                    <span className={`w-2 h-2 rounded-full ${clientPresence[activeSelectedClient.id] ? "bg-emerald-400" : "bg-slate-600"}`}></span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{activeSelectedClient.email}</p>
                </div>
              </div>

              {/* CRM Priority Flags Selector & Thread status */}
              <div className="flex flex-wrap items-center gap-3 bg-white/[0.01] border border-white/5 p-2 rounded-xl shrink-0">
                <div className="flex items-center gap-1.5">
                  <Flag size={12} className="text-slate-500" />
                  <select
                    value={selectedConversation?.priority || "none"}
                    onChange={(e) => updatePriority(e.target.value)}
                    className="bg-transparent text-slate-400 hover:text-white text-[10px] uppercase font-bold tracking-wider rounded border border-white/5 focus:outline-none focus:border-primary px-1.5 py-0.5 h-6 font-mono cursor-pointer"
                  >
                    <option value="none">Priority: None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="w-[1px] h-4 bg-white/5"></div>

                <div className="flex items-center gap-1.5">
                  <Archive size={12} className="text-slate-500" />
                  <select
                    value={selectedConversation?.status || "active"}
                    onChange={(e) => updateStatus(e.target.value)}
                    className="bg-transparent text-slate-400 hover:text-white text-[10px] uppercase font-bold tracking-wider rounded border border-white/5 focus:outline-none focus:border-primary px-1.5 py-0.5 h-6 font-mono cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Timeline Stream Scroll */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 max-h-[280px] bg-[#05070e]/80">
              {loadingMessages ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 py-12">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500 font-mono">Syncing archive...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 py-12">
                  <Globe className="w-10 h-10 text-slate-700 animate-pulse" />
                  <div>
                    <h5 className="text-[11px] font-bold text-white uppercase tracking-wider mb-0.5">Secure Feed Established</h5>
                    <p className="text-slate-500 font-light text-[10px] leading-relaxed max-w-xs">
                      Send a message to sync with {activeSelectedClient.name}. All administrative logs and project updates are replicated securely.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((ms, idx) => {
                    const isMe = ms.senderId === currentAdminId;
                    return (
                      <div 
                        key={ms.id || idx}
                        className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
                      >
                        {!isMe && (
                          <div className="w-6 h-6 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center font-mono text-[9px] font-bold uppercase shrink-0">
                            CL
                          </div>
                        )}
                        <div className="max-w-[75%] flex flex-col">
                          <div className={`px-4 py-3 rounded-2xl text-xs font-light tracking-wide shadow-lg ${
                            isMe 
                              ? "bg-primary text-white rounded-br-none border border-primary/10" 
                              : "bg-white/[0.02] text-slate-200 rounded-bl-none border border-white/5"
                          }`}>
                            <p className="whitespace-pre-wrap leading-relaxed break-all">{ms.text}</p>
                            
                            {ms.attachments && ms.attachments.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                                {ms.attachments.map((attach, aIdx) => (
                                  <a 
                                    key={aIdx}
                                    href={attach.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 hover:underline hover:text-cyan-300"
                                  >
                                    <Paperclip size={10} className="shrink-0" />
                                    <span>{attach.name || "Attachment"}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
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
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>
              )}
            </div>

            {/* Admin reply composer */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/[0.01] border-t border-white/[0.05] space-y-3">
              {mockAttachment && (
                <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-[10px] font-mono text-emerald-400 animate-pulse">
                  <span className="truncate flex items-center gap-1.5">
                    <CheckCircle2 size={10} /> Document attached
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
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAttachMock(!showAttachMock)}
                    className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    <Paperclip size={14} />
                  </button>
                  <AnimatePresence>
                    {showAttachMock && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-12 left-0 w-44 bg-[#0e1322] border border-white/10 rounded-xl shadow-2xl p-2 z-30"
                      >
                        <button 
                          type="button"
                          onClick={simulateAttachment}
                          className="w-full text-left font-mono text-[9px] text-slate-300 hover:text-white hover:bg-white/5 py-1 px-1.5 rounded transition-colors cursor-pointer"
                        >
                          ✦ Attach Engineering Audit
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
                    placeholder={`Administrative secure payload ... (Ctrl + Enter to send)`}
                    disabled={sending}
                    rows={1}
                    className="w-full h-10 min-h-[40px] max-h-24 bg-white/[0.015] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none scrollbar-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending || (!inputText.trim() && !mockAttachment)}
                  className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white flex items-center justify-center shrink-0 cursor-pointer"
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-[#070a13]/50 border border-white/[0.05] rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-4 flex-1">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <FolderLock size={22} className="text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Administrative Message Command Panel</h3>
              <p className="text-slate-500 font-light text-xs max-w-sm leading-relaxed">
                Configure CRM priorities, archive threads, and respond in real-time to active user pipelines. Select a client from the left directory to open the channel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
