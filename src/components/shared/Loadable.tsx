import { Suspense, ComponentType, useState, useEffect } from "react";

/**
 * A highly polished, performant fallback loader that prevents 
 * flicker on fast network connections using a slight delay.
 */
function DefaultLoadingFallback() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Delay showing the spinner for 250ms to prevent flickering on fast loads
    const timer = setTimeout(() => setShow(true), 250);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="min-h-[60vh] w-full bg-background flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="relative flex items-center justify-center mb-4">
        {/* Decorative ambient background blur */}
        <div className="absolute w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        {/* Sleek modern continuous spinner */}
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="text-xs font-mono text-text-muted/60 tracking-widest uppercase animate-pulse">
        Initializing Module...
      </p>
    </div>
  );
}

/**
 * Loadable Higher-Order Component (HOC)
 * Combines React.lazy + Suspense with consistent fallback UI and flash-free transitions
 */
export function Loadable<P extends object>(
  LazyComponent: ComponentType<P>,
  CustomFallback: ComponentType | null = null
): ComponentType<P> {
  const Fallback = CustomFallback || DefaultLoadingFallback;

  return function (props: P) {
    return (
      <Suspense fallback={<Fallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
