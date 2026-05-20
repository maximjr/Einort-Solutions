export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-electric-blue/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-electric-blue/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 lg:py-24 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex items-center gap-4 group z-50">
          <div className="relative">
            <div className="w-12 h-12 flex items-center justify-center geometric-diamond bg-white/5 border border-white/10 group-hover:border-electric-blue/50 transition-colors duration-500">
              <img 
                src="https://i.imgur.com/6V1ecDU.png" 
                alt="EINORT Logo" 
                className="w-10 h-10 object-contain transition-transform group-hover:scale-110 duration-500 relative z-10 p-1" 
              />
              <div className="absolute inset-0 bg-electric-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>
          <span className="font-display font-bold text-xl tracking-[0.2em] text-white">
            EINORT<span className="text-electric-blue font-bold">.</span>
          </span>
        </div>
        
        <div className="text-silver-metallic text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-center font-bold">
          &copy; {new Date().getFullYear()} EINORT <span className="text-neon-blue font-bold">SOLUTIONS</span>. <br className="md:hidden" /> ALL SYSTEMS OPERATIONAL.
        </div>
        
        <div className="flex items-center gap-6 text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.2em] text-silver-metallic">
          <a href="#" className="hover:text-electric-blue transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 geometric-diamond bg-white/20 group-hover:bg-electric-blue transition-colors"></span> LinkedIn</a>
          <a href="#" className="hover:text-electric-blue transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 geometric-diamond bg-white/20 group-hover:bg-electric-blue transition-colors"></span> Twitter</a>
          <a href="#" className="hover:text-electric-blue transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 geometric-diamond bg-white/20 group-hover:bg-electric-blue transition-colors"></span> Dribbble</a>
        </div>
      </div>
    </footer>
  );
}
