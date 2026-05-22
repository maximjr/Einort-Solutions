import { Link } from 'react-router-dom';
import { GitMerge, LayoutDashboard, Fingerprint, ArrowRight } from 'lucide-react';

const summaries = [
  {
    id: 'process',
    title: 'Process',
    description: 'Explore our meticulous methodology. We operate on a foundation of precision and transparency.',
    link: '/process',
    icon: GitMerge,
  },
  {
    id: 'work',
    title: 'Portfolio',
    description: 'View our catalog of transformative software, showcasing innovation and execution at scale.',
    link: '/work',
    icon: LayoutDashboard,
  },
  {
    id: 'about',
    title: 'About Us',
    description: 'Learn about our philosophy, our standards of craftsmanship, and the team behind the engineering.',
    link: '/about',
    icon: Fingerprint,
  },
];

export function HomeSummary() {
  return (
    <section className="py-24 relative z-10 border-t border-white/5 bg-dark">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-premium-gold/30 bg-premium-gold/10 text-premium-gold text-xs font-semibold uppercase tracking-wider mb-6">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tight text-white">
            Explore our ecosystem.
          </h2>
          <p className="text-white/60 text-lg sm:text-xl font-light leading-relaxed">
            Delve deeper into our core competencies, our standardized methodologies, and the people driving the innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaries.map((item) => (
            <Link 
              key={item.id} 
              to={item.link}
              className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-premium-gold/50 hover:bg-premium-gold/[0.05] transition-all duration-300"
            >
              <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-premium-gold/10 flex items-center justify-center text-premium-gold mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-sm font-light text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                  {item.description}
                </p>
              </div>
              <div className="flex items-center text-premium-gold text-sm font-semibold tracking-wide">
                 Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
