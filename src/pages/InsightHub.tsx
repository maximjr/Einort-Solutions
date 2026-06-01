import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { CinematicTransition } from '../components/CinematicTransition';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

const categories = ["All", "Software Architecture", "UI/UX Design", "Enterprise SEO", "AI & Automation"];
const articles = [
  {
    slug: "future-of-enterprise-react-architecture",
    title: "The Future of Enterprise React Architecture in 2027",
    category: "Software Architecture",
    excerpt: "How elite software agencies are structuring front-end monoliths into scalable micro-frontends with React and Vite.",
    date: "Oct 12, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070"
  },
  {
    slug: "designing-high-conversion-saas-dashboards",
    title: "Designing High-Conversion SaaS Dashboards",
    category: "UI/UX Design",
    excerpt: "The psychology behind premium digital interfaces and why minimal, dark-mode dashboards drive 40% higher user retention.",
    date: "Oct 05, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070"
  },
  {
    slug: "programmatic-seo-for-global-startups",
    title: "Programmatic SEO for Global Startups",
    category: "Enterprise SEO",
    excerpt: "How we generated 5M+ organic impressions using headless CMS architectures and programmatic content silos.",
    date: "Sep 28, 2026",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015"
  }
];

export function InsightHub() {
  return (
    <CinematicTransition>
      <SEO 
        title="Engineering Insights & Digital Strategy"
        description="Read premium insights, case studies, and engineering briefs on custom software development, enterprise UI/UX, and architectural scaling."
        keywords="software engineering blog, UI UX design insights, enterprise SEO case studies, SaaS architecture blog"
        url="https://einort.com/insights"
        canonical="https://einort.com/insights"
      />
      
      <div className="pt-32 pb-24 min-h-screen bg-dark">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-premium-gold/30 bg-premium-gold/10 text-premium-gold text-xs font-semibold uppercase tracking-wider mb-8"
            >
              <BookOpen className="w-3 h-3 mr-2" /> The Intelligence Base
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold mb-6 font-display tracking-tight text-white"
            >
              Architecture & <span className="text-gradient-theme">Strategy.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/50 font-light leading-relaxed"
            >
              Technical briefs, design psychology, and growth blueprints from our lead engineers.
            </motion.p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((cat, idx) => (
              <motion.button 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.05) }}
                className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${idx === 0 ? 'bg-premium-gold text-dark font-bold hover:brightness-110' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'}`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <motion.article 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="group glass-panel rounded-3xl overflow-hidden border border-white/5 hover:border-premium-gold/30 transition-all flex flex-col h-full cursor-pointer hover:-translate-y-2 duration-500"
              >
                <div className="h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src={article.image} alt={article.title} loading="lazy" decoding="async" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 mb-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Tag className="w-3 h-3 text-premium-gold" /> {article.category}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-display font-medium text-white mb-3 group-hover:text-premium-gold transition-colors">{article.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-6 flex-grow">{article.excerpt}</p>
                  
                  <Link to={`/insights/${article.slug}`} className="mt-auto flex items-center justify-between text-xs font-semibold text-white group-hover:text-premium-gold transition-colors pt-6 border-t border-white/5">
                    Read Intelligence Brief
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-premium-gold/10 flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </CinematicTransition>
  );
}
