import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ClientMessenger } from "../../features/client-portal/ClientMessenger";
import { useMessaging } from "../../hooks/useMessaging";
import { messageService } from "../../services/admin/messageService";

export function GlobalFloatingMessenger() {
  const { user, userData } = useAuth();
  const location = useLocation();
  const { conversations } = useMessaging();
  const [isOpen, setIsOpen] = useState(false);
  const [adminIdResolved, setAdminIdResolved] = useState("super_admin");
  const [unreadCount, setUnreadCount] = useState(0);

  const isClient = user && userData && userData.role !== "admin" && userData.role !== "super_admin" && !userData.isAdmin;

  useEffect(() => {
    if (location.hash === "#messages" && isClient) {
      setIsOpen(true);
    }
  }, [location.hash, isClient]);

  useEffect(() => {
    if (!isClient) return;

    let active = true;

    async function resolveAdmin() {
      try {
        const id = await messageService.getSuperAdminUid();
        if (active) {
          setAdminIdResolved(id);
        }
      } catch (err) {
        console.error("Failed to resolve admin ID:", err);
      }
    }

    resolveAdmin();

    return () => {
      active = false;
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !user || !adminIdResolved) return;
    const conversationId = `${user.uid}_${adminIdResolved}`;
    const found = conversations.find((c) => c.id === conversationId);
    if (found?.unreadCount) {
      setUnreadCount(found.unreadCount[user.uid] || 0);
    } else {
      setUnreadCount(0);
    }
  }, [conversations, user, isClient, adminIdResolved]);

  if (!isClient) return null;

  return (
    <>
      {/* Floating Launcher Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100]"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
            isOpen ? "bg-white/10 backdrop-blur-md border border-white/20" : "bg-primary hover:bg-primary-hover border border-primary/20 backdrop-blur-md hover:scale-105 active:scale-95"
          }`}
        >
          {isOpen ? (
             <X size={24} className="text-white relative z-10" />
          ) : (
            <>
              {/* Internal glow for primary state */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-primary-border opacity-50 blur-md rounded-full pointer-events-none group-hover:opacity-100 transition-opacity"></div>
              <MessageSquare size={24} className="text-white relative z-10" />
            </>
          )}

          {/* Unread Indicator */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-400 rounded-full border-2 border-[#030712] flex items-center justify-center text-[#030712] font-bold text-[10px] animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20">
              {unreadCount}
            </span>
          )}


        </button>
      </motion.div>

      {/* Floating Messenger Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-md z-[90] md:hidden cursor-pointer"
              onClick={() => setIsOpen(false)}
            />

            {/* Messenger Container */}
            <motion.div
              initial={{ opacity: 0, y: "100%", scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: "100%", scale: 1 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-x-0 bottom-0 top-16 md:top-auto md:inset-auto z-[95] md:bottom-28 md:right-8 md:w-[420px] md:h-[650px] max-h-[85dvh] flex flex-col pointer-events-auto rounded-t-3xl md:rounded-3xl shadow-[0_-30px_100px_rgba(0,0,0,0.5)] md:shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Glossy shadow container for desktop */}
              <div className="hidden md:block absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent blur-xl -z-10 rounded-3xl opacity-50"></div>
              
              <div className="flex-1 w-full h-full bg-[#0a0f18]/95 backdrop-blur-3xl flex flex-col relative z-10 border border-t-white/[0.05] md:border-white/[0.08]">
                {/* Mobile Drag Handle */}
                <div className="h-1.5 w-12 bg-white/[0.15] rounded-full mx-auto mt-3 mb-1 md:hidden shrink-0"></div>
                
                <div className="flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
                  <ClientMessenger
                    userId={user.uid}
                    userEmail={user.email || ""}
                    userName={userData.fullName || "Valued Partner"}
                    onClose={() => setIsOpen(false)}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
