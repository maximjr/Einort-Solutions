import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X } from "lucide-react";
import { ClientMessenger } from "../../features/client-portal/ClientMessenger";

// Fully loaded real-time messaging portal - ONLY mounted/initialized when isOpen === true
function ActiveClientMessagingManager({
  user,
  userData,
  onClose,
}: {
  user: any;
  userData: any;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-background/60 backdrop-blur-md z-[90] md:hidden cursor-pointer"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-x-0 bottom-0 top-16 md:top-auto md:inset-auto z-[95] md:bottom-28 md:right-8 md:w-[420px] md:h-[650px] max-h-[85dvh] flex flex-col pointer-events-auto rounded-t-3xl md:rounded-3xl shadow-[0_-30px_100px_rgba(0,0,0,0.5)] md:shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="hidden md:block absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent blur-xl -z-10 rounded-3xl opacity-50"></div>
        
        <div className="flex-1 w-full h-full bg-[#0a0f18]/95 backdrop-blur-md flex flex-col relative z-10 border border-t-white/[0.05] md:border-white/[0.08]">
          <div className="h-1.5 w-12 bg-white/[0.15] rounded-full mx-auto mt-3 mb-1 md:hidden shrink-0"></div>
          
          <div className="flex-1 overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
            <ClientMessenger
              userId={user.uid}
              userEmail={user.email || ""}
              userName={userData.fullName || userData.displayName || userData.name || "Valued Partner"}
              onClose={onClose}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function ActiveClientFloatingMessenger({ user, userData }: { user: any, userData: any }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (location.hash === "#messages") {
      setIsOpen(true);
    }
  }, [location.hash]);

  useEffect(() => {
    // Automatically close the messenger if the route path changes, 
    // or if the hash changes to anything other than #messages
    if (location.hash !== "#messages") {
      setIsOpen(false);
    }
  }, [location.pathname, location.hash]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* 
        LIGHTWEIGHT FAB BUTTON SHELL:
        Always renders initially with zero Firestore overhead and zero listener attachment when closed.
      */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] ${isOpen ? 'hidden md:block' : ''}`}
      >
        <button
          onClick={handleToggle}
          className={`relative group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
            isOpen ? "bg-white/10 backdrop-blur-md border border-white/20" : "bg-primary hover:bg-primary-hover border border-primary/20 backdrop-blur-md hover:scale-105 active:scale-95"
          }`}
        >
          {isOpen ? (
             <X size={24} className="text-white relative z-10" />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-primary-border opacity-50 blur-md rounded-full pointer-events-none group-hover:opacity-100 transition-opacity"></div>
              <MessageSquare size={24} className="text-white relative z-10" />
            </>
          )}
        </button>
      </motion.div>

      {/* 
        REAL-TIME MESSAGING INITIALIZATION:
        All heavy listeners, streams, presence subscriptions, and auth syncing hook connections 
        are isolated inside the conditionally-mounted ActiveClientMessagingManager.
        Unmounting instantly invokes full context and Firebase onSnapshot teardowns.
      */}
      <AnimatePresence>
        {isOpen && (
          <ActiveClientMessagingManager
            key="client-messaging"
            user={user}
            userData={userData}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

