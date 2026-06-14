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
        className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm z-[90] md:z-[90] cursor-pointer"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: "100%", scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: "100%", scale: 0.98 }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed inset-0 top-0 sm:top-auto sm:inset-x-0 sm:bottom-0 sm:h-[90dvh] md:inset-auto z-[100] md:bottom-6 md:right-6 md:w-[420px] md:h-[680px] md:max-h-[calc(100vh-48px)] flex flex-col pointer-events-auto rounded-none sm:rounded-t-[32px] md:rounded-[24px] shadow-[0_-10px_80px_rgba(0,0,0,0.2)] dark:shadow-[0_-30px_100px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="hidden md:block absolute -inset-1 bg-gradient-to-b from-primary/10 to-transparent blur-xl -z-10 rounded-[28px] opacity-30"></div>
        
        <div className="flex-1 w-full h-full bg-white dark:bg-[#090b10] flex flex-col relative z-10 md:border md:border-black/5 dark:md:border-white/[0.08]">
          <div className="h-1.5 w-12 bg-black/10 dark:bg-white/[0.15] rounded-full mx-auto mt-3 mb-1 sm:block md:hidden shrink-0 hidden"></div>
          
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
    if (location.hash !== "#messages") {
      setIsOpen(false);
    }
  }, [location.pathname, location.hash]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[85] ${isOpen ? 'hidden md:block' : ''}`}
      >
        <button
          onClick={handleToggle}
          className={`relative group flex items-center justify-center w-[58px] h-[58px] md:w-16 md:h-16 rounded-full shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer overflow-hidden ${
            isOpen ? "bg-white/90 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/20 hover:bg-white dark:hover:bg-white/20" : "bg-[#0b0f19] dark:bg-primary hover:bg-[#1a2133] dark:hover:bg-primary-hover border border-white/10 dark:border-primary/20 backdrop-blur-md hover:scale-[1.03] active:scale-[0.95] shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          }`}
        >
          {isOpen ? (
             <X size={24} className="text-slate-900 dark:text-white relative z-10" />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/0 to-white/10 dark:from-primary dark:to-primary-border opacity-50 blur-md rounded-full pointer-events-none group-hover:opacity-100 transition-opacity"></div>
              <MessageSquare size={24} className="text-white relative z-10" />
            </>
          )}
        </button>
      </motion.div>

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

