export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-electric-blue/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 lg:py-24 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-4 group z-50">
          <div className="relative">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="https://i.imgur.com/6V1ecDU.png" 
                alt="EINORT Logo" 
                className="w-full h-full object-contain transition-transform group-hover:scale-110 duration-500 relative z-10" 
              />
              <div className="absolute inset-0 bg-electric-blue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
          <span className="font-display font-medium text-lg tracking-[0.2em] text-white">
            EINORT<span className="text-electric-blue font-bold">.</span>
          </span>
        </div>
        
        <div className="text-silver-metallic text-xs font-mono uppercase tracking-widest text-center md:text-left">
          &copy; {new Date().getFullYear()} EINORT <span className="text-electric-blue font-bold">SOLUTIONS</span>. <br className="md:hidden" /> ALL RIGHTS RESERVED.
        </div>
        
        <div className="flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-[0.2em] text-silver-metallic">
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Dribbble</a>
        </div>
      </div>
    </footer>
  );
}
