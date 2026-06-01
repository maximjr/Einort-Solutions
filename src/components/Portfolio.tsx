import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import React, { useState, useRef } from 'react';
import { SEO } from './SEO';

const projects = [
  {
    id: 1,
    title: 'Neon Banking Core',
    category: 'Fintech Infrastructure',
    description: 'A revolutionary approach to global banking interfaces with real-time financial tracking and seamless cross-border transfers.',
    image: 'https://images.unsplash.com/photo-1616803140344-6682afb13cda?q=80&w=2670&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'Aura EV Platform',
    category: 'Immersive Experience',
    description: 'Cinematic configurator and launch platform for the next generation of sustainable luxury vehicles.',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2671&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 3,
    title: 'Nexus Data Engine',
    category: 'Enterprise Intelligence',
    description: 'Analytics dashboard processing billions of data points into actionable executive insights.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 4,
    title: 'Lumina Commerce',
    category: 'Headless Architecture',
    description: 'High-performance commerce architecture and striking brand identity for a premium direct-to-consumer label.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
    featured: true,
  }
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number; key?: React.Key }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/5 bg-dark",
        project.featured ? "col-span-1 md:col-span-2 aspect-[16/10] md:aspect-[21/9]" : "col-span-1 aspect-[4/5]"
      )}
    >
      <div className="absolute inset-0 bg-dark/40 z-10 transition-colors duration-700 pointer-events-none group-hover:bg-dark/10" />
      
      <motion.img 
        src={project.image} 
        alt={project.title}
        loading="lazy"
        animate={{ scale: isHovered ? 1.05 : 1.0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full object-cover filter saturate-50 group-hover:saturate-100 transition-all duration-700 opacity-80 group-hover:opacity-100"
      />
      
      <div className="absolute inset-0 z-20 p-6 md:p-10 flex flex-col justify-between pointer-events-none">
        
        {/* Top Header */}
        <div className="flex justify-between items-start">
           <div className="flex items-center gap-3 bg-dark/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
             <div className="w-1.5 h-1.5 bg-premium-gold rounded-full" />
             <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic font-medium">Protocol {String(project.id).padStart(3, '0')}</span>
           </div>
        </div>

        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-dark/90 via-dark/40 to-transparent -z-10" />
        
        <div className="relative z-30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-[1px] bg-premium-gold/50" />
            <p className="text-white/70 font-mono font-medium tracking-[0.1em] uppercase text-[9px] md:text-xs">
              {project.category}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-white mb-2 tracking-tight transition-colors duration-500">{project.title}</h3>
              <div className={cn(
                "overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1]",
                isHovered ? "max-h-32 opacity-100 mt-3" : "max-h-0 opacity-0"
              )}>
                <p className="text-silver-metallic font-sans font-light leading-relaxed text-sm md:text-base pr-4 max-w-xl">
                  {project.description}
                </p>
              </div>
            </div>
            
            <Link to="/contact" className="pointer-events-auto shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-dark flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-[0.16,1,0.3,1] hover:scale-110 custom-shadow cursor-pointer">
               <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  
  return (
    <section id="work" ref={containerRef} className="relative bg-dark min-h-screen py-24 lg:py-40 pb-32 border-t border-white/5 overflow-hidden">
      <SEO title="Our Work & Portfolio | EINORT SOLUTIONS" description="Explore our legacy of elite execution, enterprise web applications, and premium software architectures." />
       {/* Cinematic Deep Background */}
       <motion.div style={{ y: bgY }} className="absolute top-0 right-0 w-[800px] h-[800px] bg-premium-gold/5 blur-[200px] mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full mt-10">
        <div className="mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-1.5 h-1.5 bg-premium-gold rounded-full" />
            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-silver-metallic">Selected Architecture</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-5xl lg:text-[72px] leading-[1.05] font-semibold tracking-tight mb-8"
          >
            A legacy of <br className="hidden md:block"/>
            <span className="text-silver-metallic font-light">elite execution.</span>
          </motion.h1>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3, duration: 1 }}
             className="text-silver-metallic max-w-2xl font-sans text-[15px] leading-relaxed font-light"
          >
            Explore our curated archive of digital ecosystems, immersive platforms, and enterprise solutions engineered for the world's most ambitious entities.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 flex justify-center"
        >
          <button className="group relative flex items-center justify-center px-8 py-3.5 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-white overflow-hidden">
            <span className="relative z-10 text-[13px] font-sans font-semibold transition-colors">Load Blueprint Database</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
