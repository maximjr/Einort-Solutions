import { motion, HTMLMotionProps, useReducedMotion } from "motion/react";

interface FadeUpProps extends HTMLMotionProps<"div"> {
  delay?:    number;
  duration?: number;
}

/**
 * Scroll-triggered fade-up animation.
 * Automatically disables motion when the user has enabled "Reduce Motion"
 * in their OS accessibility settings (WCAG 2.1 SC 2.3.3).
 */
export function FadeUp({
  children,
  delay    = 0,
  duration = 0.8,
  ...props
}: FadeUpProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 30 }}
      whileInView={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { duration, delay, ease: [0.16, 1, 0.3, 1] }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
