import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, Tag, ArrowLeft, ChevronRight } from 'lucide-react';
import { CinematicTransition } from '../components/CinematicTransition';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

const formatStr = (str: string) => {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export function InsightArticle() {
  const { slug } = useParams();
  
  const title = slug ? formatStr(slug) : "Engineering Brief";
  const url = `https://einort.com/insights/${slug}`;
  
  const breadcrumbs = [
    { name: "Home", url: "https://einort.com" },
    { name: "Insights", url: "https://einort.com/insights" },
    { name: title, url: url }
  ];

  return (
    <CinematicTransition>
      <SEO 
        title={title}
        description={`Read our engineering brief and expert analysis on ${title.toLowerCase()}. Learn how EINORT SOLUTIONS architects premium digital experiences.`}
        keywords={`${title.toLowerCase()}, software architecture insights, web development best practices`}
        url={url}
        canonical={url}
        breadcrumbs={breadcrumbs}
        article={{
          publishedTime: "2026-10-12T00:00:00Z",
          author: ["EINORT Lead Architect"]
        }}
      />
      
      <div className="pt-32 pb-24 min-h-screen bg-dark">
        <div className="container mx-auto px-6 max-w-4xl">
           
           <Link to="/insights" className="inline-flex items-center text-xs font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-12">
             <ArrowLeft className="w-4 h-4 mr-2" /> Back to Intelligence Base
           </Link>

           <div className="mb-12">
             <div className="flex items-center gap-4 mb-6 text-[10px] font-mono text-premium-gold uppercase tracking-widest">
               <span className="flex items-center gap-1.5 bg-premium-gold/10 px-3 py-1 rounded-full"><Tag className="w-3 h-3" /> Software Architecture</span>
               <span className="flex items-center gap-1.5 text-white/40"><Clock className="w-3 h-3" /> 8 min read</span>
             </div>
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 font-display tracking-tight text-white leading-tight"
             >
               {title}
             </motion.h1>

             {/* Author Strip */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="flex items-center gap-4 py-6 border-y border-white/5 mb-12"
             >
               <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 grayscale border border-white/10">
                 <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="Lead Architect" loading="lazy" decoding="async" className="w-full h-full object-cover" />
               </div>
               <div>
                 <p className="font-medium text-white text-sm">Rheinard N.</p>
                 <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Lead Technical Architect</p>
               </div>
             </motion.div>
           </div>
           
           {/* Hero Image */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
             className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-16 relative glass-panel p-2"
           >
             <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070" className="w-full h-full object-cover rounded-2xl" loading="lazy" decoding="async" alt={title} />
           </motion.div>

           {/* Article Content - Typography Optimization for SEO/Accessibility */}
           <motion.article 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-medium prose-p:font-light prose-p:leading-relaxed prose-p:text-white/70 prose-a:text-premium-gold hover:prose-a:text-white prose-a:transition-colors"
           >
             <p className="lead text-xl text-white/90">
               In the modern era of digital product development, creating monolithic Single Page Applications (SPAs) is no longer sufficient for enterprise scale. Here is how we restructure platforms to achieve a 95+ Lighthouse score while handling millions of concurrent requests.
             </p>

             <h2>The Shift to Micro-Frontends</h2>
             <p>
               Traditional React applications suffer from bloat over time. By isolating distinct business domains into autonomous micro-frontends, engineering velocity increases by up to 40%.
             </p>
             
             <div className="bg-white/5 border-l-2 border-premium-gold p-6 my-8 rounded-r-2xl">
               <p className="m-0 text-white italic font-light">"The architecture you define today is the bottleneck you will face tomorrow. Build for scalability from day zero."</p>
             </div>

             <h2>Server-Side Rendering & Hydration Core</h2>
             <p>
               SEO is critical for enterprise software. With standard SPAs, indexing can be sluggish. We implement SSR architectures rendering static DOM elements immediately, followed by selective edge hydration.
             </p>

             <h3>Performance Benchmarking Matrix</h3>
             <ul>
               <li>Initial load time reduced by 60%.</li>
               <li>Time-to-Interactive (TTI) optimized for mobile networks.</li>
               <li>Semantic markup enabling Google NLP comprehension.</li>
             </ul>

             <p>
               Our architectural methodologies are strictly tailored to convert digital traffic into high-value revenue streams, utilizing psychological UX patterns merged with ruthless backend efficiency.
             </p>
           </motion.article>

           {/* Call to Action */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6 }}
             className="mt-20 glass-panel-light p-10 rounded-3xl border-premium-gold/30 text-center relative overflow-hidden"
           >
             <div className="absolute inset-0 bg-premium-gold/5 blur-3xl rounded-full" />
             <div className="relative z-10">
               <h3 className="text-2xl font-display font-medium text-white mb-4">Require architectural guidance?</h3>
               <p className="text-white/60 mb-8 max-w-lg mx-auto">Skip the generic templates and partner with world-class engineers. Let's design a scalable system for your enterprise.</p>
               <Link to="/book" className="inline-flex items-center justify-center px-8 py-4 bg-white text-dark rounded-full font-bold text-xs uppercase tracking-widest hover:brightness-90 transition-all font-mono">
                  Book Strategy Protocol <ChevronRight className="w-4 h-4 ml-2" />
               </Link>
             </div>
           </motion.div>

        </div>
      </div>
      <Footer />
    </CinematicTransition>
  );
}
