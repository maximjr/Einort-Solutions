import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const threshold = 80;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
      } else {
        setStartY(0);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startY > 0 && !isRefreshing && window.scrollY === 0) {
        const y = e.touches[0].clientY;
        const distance = y - startY;
        
        if (distance > 0) {
          // Apply friction
          const pull = Math.min(distance * 0.4, threshold + 40);
          setPullDistance(pull);
          
          if (e.cancelable) {
            e.preventDefault();
          }
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        setPullDistance(threshold);
        try {
          // Trigger the haptic-like refresh
          if (navigator.vibrate) navigator.vibrate(50);
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
          setStartY(0);
        }
      } else {
        setPullDistance(0);
        setStartY(0);
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
  }, [startY, pullDistance, isRefreshing, onRefresh]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Pull indicator */}
      <motion.div
        animate={{ y: isRefreshing ? threshold : pullDistance }}
        transition={{ ease: "easeOut", duration: 0.15 }}
        className="fixed top-[-50px] left-0 right-0 flex justify-center items-center z-50 h-[50px] pointer-events-none"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <RefreshCw
            className={`w-5 h-5 text-primary ${isRefreshing ? "animate-spin" : ""}`}
            style={{
              transform: `rotate(${pullDistance * 2}deg)`,
              opacity: Math.min(pullDistance / threshold, 1),
            }}
          />
        </div>
      </motion.div>
      
      {/* Content wrapper */}
      <motion.div
        animate={{ y: isRefreshing ? threshold : pullDistance }}
        transition={{ ease: "easeOut", duration: 0.15 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
