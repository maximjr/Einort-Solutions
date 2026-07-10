import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Loader2 } from "lucide-react";

interface PullToRefreshProps {
  onRefresh?: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // High-performance motion value (no re-renders during drag)
  const pullDistance = useMotionValue(0);
  
  const THRESHOLD = 80;
  const HEADER_OFFSET = 55; // Resting offset while reloading
  
  // Transform values for premium indicator effect
  const indicatorOpacity = useTransform(pullDistance, [10, 60], [0, 1]);
  const indicatorRotate = useTransform(pullDistance, [0, THRESHOLD * 1.5], [0, 360]);
  const indicatorScale = useTransform(pullDistance, [0, THRESHOLD, THRESHOLD + 40], [0.8, 1, 1.05]);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (!isTouchDevice) return;

    const element = containerRef.current;
    if (!element) return;

    let startY = 0;
    let isPulling = false;
    let hasTriggeredHaptic = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 0 && !isRefreshing) {
        startY = e.touches[0].clientY;
        isPulling = true;
        hasTriggeredHaptic = false;
      } else {
        isPulling = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      if (diff > 0 && window.scrollY <= 0) {
        if (e.cancelable) {
          e.preventDefault();
        }

        // Phase 1 + 2: Light Resistance & Elastic Drag
        let visualY = 0;
        const basePull = diff * 0.45; // Subdued friction
        
        if (basePull <= THRESHOLD) {
          visualY = basePull;
        } else {
          // Elastic curve when pulled past threshold
          const overpull = basePull - THRESHOLD;
          visualY = THRESHOLD + (50 * Math.log10(1 + overpull / 20));
        }

        pullDistance.set(visualY);

        // Phase 3: Trigger Point Haptic
        if (visualY >= THRESHOLD && !hasTriggeredHaptic) {
          hasTriggeredHaptic = true;
          triggerHaptic();
        } else if (visualY < THRESHOLD && hasTriggeredHaptic) {
          hasTriggeredHaptic = false;
        }
      } else if (diff < 0) {
        pullDistance.set(0);
        isPulling = false;
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      isPulling = false;
      
      const distance = pullDistance.get();

      if (distance >= THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        triggerHaptic();
        
        // Bounce into refreshing position
        animate(pullDistance, HEADER_OFFSET, {
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 0.8
        });
        
        try {
          if (onRefresh) {
            await onRefresh();
          } else {
            // Default behavior: short delay then reload
            await new Promise(resolve => setTimeout(resolve, 800));
            window.location.reload();
          }
        } finally {
          setIsRefreshing(false);
          // Phase 4: Smooth elastic snap-back
          animate(pullDistance, 0, {
            type: "spring",
            stiffness: 400,
            damping: 26,
            mass: 0.7
          });
        }
      } else if (!isRefreshing) {
        animate(pullDistance, 0, {
          type: "spring",
          stiffness: 400,
          damping: 26,
          mass: 0.7
        });
      }
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isRefreshing, pullDistance, onRefresh]);

  return (
    <div ref={containerRef} className="w-full relative touch-pan-y">
      {/* Floating Premium Indicator */}
      <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none z-[100] h-0 overflow-visible">
        <motion.div
           style={{ 
             y: pullDistance,
             opacity: isRefreshing ? 1 : indicatorOpacity,
             scale: isRefreshing ? 1 : indicatorScale
           }}
           className="absolute -top-14 bg-white/90 dark:bg-[#1a2133]/90 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex items-center justify-center w-10 h-10"
        >
          {isRefreshing ? (
             <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-full h-full flex items-center justify-center text-[#007AFF] dark:text-primary"
             >
                <Loader2 className="w-5 h-5" />
             </motion.div>
          ) : (
            <motion.div 
              style={{ rotate: indicatorRotate }}
              className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500"
            >
              <Loader2 className="w-5 h-5 opacity-90" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Content wrapper pushed down elastically */}
      <motion.div 
        style={{ y: pullDistance }}
        className="w-full min-h-screen relative z-10 bg-background"
      >
        {children}
      </motion.div>
    </div>
  );
}
