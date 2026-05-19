import { ReactNode, useEffect } from 'react';
import { motion } from 'motion/react';

export function CinematicTransition({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <>
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[100] bg-black origin-top pointer-events-none flex flex-col items-center justify-center border-b border-electric-blue/30"
      >
        <span className="text-white/20 text-[10px] tracking-[0.5em] font-bold uppercase animate-pulse">
           INITIALIZING SEQUENCE
        </span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {children}
      </motion.div>
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[100] bg-black origin-bottom pointer-events-none flex flex-col items-center justify-center border-t border-electric-blue/30"
      >
        <img 
          src="https://i.imgur.com/6V1ecDU.png" 
          alt="EINORT Logo" 
          className="w-16 h-16 object-contain transition-transform duration-300" 
        />
      </motion.div>
    </>
  );
}
