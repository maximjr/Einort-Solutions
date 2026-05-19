import { motion } from 'motion/react';
import { ReactNode } from 'react';

export function PageTransition({ children, keyPath }: { children: ReactNode; keyPath: string }) {
  return (
    <motion.div
      key={keyPath}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
