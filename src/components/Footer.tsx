import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 group mb-6">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="https://i.imgur.com/6V1ecDU.png" 
                  alt="EINORT Logo" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-300" 
                />
              </div>
              <span className="font-display font-medium text-sm tracking-[0.1em] text-white">
                EINORT
              </span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed max-w-xs">
              World-class digital agency engineering enterprise web applications, premium UI/UX, and highly scalable software solutions globally.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-mono text-[10px] uppercase tracking-widest mb-6">Global Services</h4>
            <ul className="space-y-4 text-xs text-white/50">
              <li><Link to="/agency/healthcare-web-development-usa" className="hover:text-premium-gold transition-colors">Healthcare Web Development USA</Link></li>
              <li><Link to="/agency/saas-development-canada" className="hover:text-premium-gold transition-colors">SaaS Development Canada</Link></li>
              <li><Link to="/agency/fintech-software-engineering-europe" className="hover:text-premium-gold transition-colors">Fintech Engineering Europe</Link></li>
              <li><Link to="/agency/ecommerce-website-design-africa" className="hover:text-premium-gold transition-colors">E-Commerce Design Africa</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-mono text-[10px] uppercase tracking-widest mb-6">Intelligence Base</h4>
            <ul className="space-y-4 text-xs text-white/50">
              <li><Link to="/process" className="hover:text-premium-gold transition-colors">Our Process</Link></li>
              <li><Link to="/faq" className="hover:text-premium-gold transition-colors">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-mono text-[10px] uppercase tracking-widest mb-6">Connect</h4>
            <ul className="space-y-4 text-xs text-white/50">
              <li><Link to="/book" className="hover:text-premium-gold transition-colors">Schedule Consultation</Link></li>
              <li><Link to="/contact" className="hover:text-premium-gold transition-colors">General Inquiry</Link></li>
              <li><a href="#" className="hover:text-premium-gold transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-premium-gold transition-colors">Twitter (X)</a></li>
            </ul>
          </div>
        </div>

        <div className="py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-silver-metallic text-[10px] font-mono tracking-widest font-medium text-center custom-text-balance">
            &copy; {new Date().getFullYear()} EINORT SOLUTIONS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-mono font-medium text-silver-metallic">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
