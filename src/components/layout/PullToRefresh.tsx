import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "motion/react";
import { RefreshCw } from "lucide-react";

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const MAX_PULL = 120;
  const THRESHOLD = 80;

  useEffect(() => {
    // Only apply on touch devices for mobile view
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (!isTouchDevice) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && startY > 0 && !isRefreshing) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 0) {
          // If we drag down at the top of the page
          // prevent native scroll
          if (e.cancelable) {
            e.preventDefault();
          }
          setIsPulling(true);
          const rawProgress = diff * 0.5; // slow down factor
          const boundedProgress = Math.min(rawProgress, MAX_PULL);
          setPullProgress(boundedProgress);
          controls.set({ y: boundedProgress });
        }
      }
    };

    const handleTouchEnd = async () => {
      if (isPulling) {
        setIsPulling(false);
        setStartY(0);

        if (pullProgress > THRESHOLD && !isRefreshing) {
          setIsRefreshing(true);
          // Snap instantly to loading position
          await controls.start({ 
            y: 40, 
            transition: { ease: "easeOut", duration: 0.15 } 
          });
          
          // Trigger reload very quickly
          setTimeout(() => {
            window.location.reload();
          }, 350);
          
        } else if (!isRefreshing) {
          // Snap back immediately
          controls.start({ 
            y: 0, 
            transition: { ease: "easeOut", duration: 0.15 } 
          });
          setPullProgress(0);
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    // Important: non-passive for touchmove to be able to preventDefault
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startY, isPulling, pullProgress, isRefreshing, controls]);

  return (
    <div ref={containerRef} className="w-full relative">
      {/* Visual Indicator */}
      <div className="fixed top-0 left-0 w-full flex justify-center pointer-events-none z-[100] h-0 overflow-visible">
        <motion.div
          animate={{ 
            y: isRefreshing ? 50 : Math.max(0, pullProgress),
            opacity: isRefreshing ? 1 : Math.min(pullProgress / THRESHOLD, 1)
          }}
          transition={{ ease: "easeOut", duration: 0.12 }}
          style={{ y: -50 }}
          className="bg-surface border border-white/10 rounded-full p-2.5 shadow-2xl flex items-center justify-center mt-2"
        >
          <motion.div
            animate={isRefreshing ? { rotate: 360 } : { rotate: (pullProgress / THRESHOLD) * 360 }}
            transition={isRefreshing ? { repeat: Infinity, duration: 0.8, ease: "linear" } : { duration: 0 }}
          >
            <RefreshCw className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>
      </div>

      {/* Content wrapper pushed down slightly while pulling */}
      <motion.div animate={controls} style={{ y: 0 }}>
        {children}
      </motion.div>
    </div>
  );
}
