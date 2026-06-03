import { Container } from "../../components/layout/Container";
import { FadeUp } from "../../components/animations/FadeUp";
import { Button } from "../../components/ui/Button";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scaleText = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col justify-center min-h-[100vh] perspective-[1000px]"
    >
      {/* Abstract Background Elements with Parallax */}
      <motion.div
        style={{ y: yBackground }}
        className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 pointer-events-none will-change-transform"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="absolute top-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[150px] animate-pulse"
          style={{ animationDuration: "8s" }}
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3, ease: "easeOut", delay: 0.2 }}
          className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        ></motion.div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
      </motion.div>

      <Container className="text-left md:text-center relative z-10 flex flex-col md:items-center">
        <motion.div
          style={{ opacity: opacityText, scale: scaleText }}
          className="flex flex-col md:items-center w-full"
        >
          <FadeUp delay={0.1}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-xl shadow-2xl hover:border-white/20 transition-all mx-auto cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(10,102,194,0.8)] animate-pulse"></span>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-300">
                Enterprise Grade Engineering
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.2} duration={1.2}>
            <h1 className="text-[3.5rem] md:text-8xl lg:text-[8.5rem] font-display font-medium tracking-tighter leading-[0.9] mb-8 text-white max-w-6xl mx-auto drop-shadow-2xl">
              WE ENGINEER <br className="hidden md:block" />
              TOMORROW'S{" "}
              <span className="relative whitespace-nowrap">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-primary to-blue-600">
                  REALITY.
                </span>
                <div className="absolute -inset-x-2 -inset-y-4 bg-primary/20 blur-[80px] -z-10 rounded-full"></div>
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.4}>
            <h2 className="sr-only">
              Custom Web Development & Enterprise Software Engineering in USA,
              Canada, and Europe
            </h2>
            <p className="text-lg md:text-2xl text-text-muted mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
              Partner with Einort Solutions for premium custom software
              architecture. We engineer highly scalable SaaS platforms,
              enterprise web applications, and world-class AI automation systems
              for industry leaders across the US, Canada, and Europe.
            </p>
          </FadeUp>

          <FadeUp
            delay={0.5}
            className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto uppercase tracking-[0.2em] text-[11px] px-12 h-14 font-bold shadow-2xl"
            >
              Request Architecture Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto uppercase tracking-[0.2em] text-[11px] px-12 h-14 font-bold backdrop-blur-md"
            >
              View Our Work
            </Button>
          </FadeUp>
        </motion.div>

        <FadeUp
          delay={0.8}
          className="mt-28 w-full max-w-5xl opacity-40 hover:opacity-100 transition-opacity duration-700 hidden md:block"
        >
          <div className="grid grid-cols-6 gap-4 text-center items-center text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            <span>Next.js</span>
            <span>React</span>
            <span>TypeScript</span>
            <span>TailwindCSS</span>
            <span>Firebase</span>
            <span>PostgreSQL</span>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
