import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import React, { useState, useRef } from 'react';

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
    description: 'AI-driven analytics dashboard processing billions of data points into actionable executive insights.',
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
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden geometric-clip border border-white/5",
        project.featured ? "col-span-1 md:col-span-2 aspect-[16/9] md:aspect-[21/9]" : "col-span-1 aspect-[4/3] md:aspect-[4/5]"
      )}
    >
      <div className="absolute inset-0 bg-dark/60 z-10 transition-colors duration-700 pointer-events-none group-hover:bg-dark/10" />
      
      <motion.img 
        src={project.image} 
        alt={project.title}
        animate={{ scale: isHovered ? 1.05 : 1.01 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full object-cover filter saturate-50 group-hover:saturate-100 transition-all duration-700"
      />
      
      {/* Cinematic Glare Effect */}
      <div 
        className="absolute inset-0 z-15 bg-gradient-to-tr from-electric-blue/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen"
      />
      
      <div className="absolute inset-0 z-20 p-6 md:p-10 flex flex-col justify-between pointer-events-none">
        
        {/* Top Header */}
        <div className="flex justify-between items-start transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
           <div className="flex items-center gap-2 bg-dark/50 backdrop-blur-md px-3 py-1.5 border border-white/10">
             <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-pulse" />
             <span className="text-[9px] font-mono uppercase tracking-widest text-silver-metallic">Project ID: {String(project.id).padStart(3, '0')}</span>
           </div>
        </div>

        {/* Gradient Overlay for Text */}
        <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-dark via-dark/80 to-transparent -z-10" />
        
        <div className="relative z-30 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-electric-blue" />
            <p className="text-electric-blue font-mono font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">
              {project.category}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-5xl font-display font-medium text-white mb-2 tracking-tight group-hover:text-glow-silver transition-colors duration-500">{project.title}</h3>
              <div className={cn(
                "overflow-hidden transition-all duration-500 ease-[0.16,1,0.3,1]",
                isHovered ? "max-h-32 opacity-100 mt-4" : "max-h-0 opacity-0"
              )}>
                <p className="text-silver-metallic font-light leading-relaxed text-sm md:text-base">
                  {project.description}
                </p>
              </div>
            </div>
            
            <a href="#" className="pointer-events-auto shrink-0 w-12 h-12 md:w-16 md:h-16 geometric-clip-button bg-electric-blue text-white flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-700 ease-[0.16,1,0.3,1] hover:bg-neon-blue custom-shadow cursor-pointer">
               <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section id="work" ref={containerRef} className="relative bg-dark min-h-screen py-32 lg:py-48 pb-32 border-t border-white/5">
       {/* Background ambient lighting */}
       <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-electric-blue/5 blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-8 geometric-clip bg-white/5 flex items-center justify-center border border-white/10">
              <div className="w-1.5 h-1.5 bg-electric-blue" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-silver-metallic">Selected Architecture</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl lg:text-[72px] leading-[1.1] font-bold tracking-tight mb-8"
          >
            A legacy of <br/>
            <span className="text-gradient-metallic italic font-light font-display">elite execution.</span>
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2, duration: 0.8 }}
             className="text-silver-metallic max-w-2xl text-lg leading-relaxed font-light"
          >
            Explore our curated portfolio of digital ecosystems, immersive platforms, and enterprise solutions architected for the world's most ambitious brands.
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
          transition={{ duration: 0.8 }}
          className="mt-24 flex justify-center"
        >
          <button className="group relative flex items-center justify-center gap-4 border border-white/20 hover:border-neon-blue px-12 py-6 geometric-clip-button font-mono transition-all text-white overflow-hidden bg-dark/50">
            <span className="relative z-10 tracking-[0.2em] text-xs font-bold uppercase transition-colors group-hover:text-white">Load Database</span>
            <div className="absolute inset-0 bg-electric-blue transform scale-y-0 origin-bottom transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-y-100" />
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-neon-blue" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
