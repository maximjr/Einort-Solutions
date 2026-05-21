export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 lg:py-16 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-3 group z-50">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="https://i.imgur.com/6V1ecDU.png" 
              alt="EINORT Logo" 
              className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-300" 
            />
          </div>
          <span className="font-display font-medium text-sm tracking-[0.1em] text-white">
            EINORT
          </span>
        </div>
        
        <div className="text-silver-metallic text-[11px] font-sans font-medium text-center">
          &copy; {new Date().getFullYear()} EINORT Solutions. <br className="md:hidden" /> All rights reserved.
        </div>
        
        <div className="flex items-center gap-6 text-[12px] font-sans font-medium text-silver-metallic">
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Dribbble</a>
        </div>
      </div>
    </footer>
  );
}
