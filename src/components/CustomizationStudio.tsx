import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SEO } from './SEO';
import { Settings, Check, Sparkles, ChevronLeft, Layout, Type, Palette, ArrowRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const themes = [
  { id: 'dark', name: 'Obsidian Dark', primary: '#020617', secondary: '#0f172a', accent: '#2563eb' },
  { id: 'light', name: 'Ceramic White', primary: '#ffffff', secondary: '#f1f5f9', accent: '#000000' },
  { id: 'neon', name: 'Cyber Neon', primary: '#0a0a0a', secondary: '#171717', accent: '#00ffcc' },
];

const layouts = [
  { id: 'bento', name: 'Bento Grid' },
  { id: 'split', name: 'Split Screen' },
  { id: 'minimal', name: 'Minimalist Focus' },
];

const fonts = [
  { id: 'sans', name: 'Inter (Modern Sans)' },
  { id: 'display', name: 'Space Grotesk (Tech Headings)' },
  { id: 'serif', name: 'Playfair (Editorial)' },
];

export function CustomizationStudio() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('theme');
  const [selections, setSelections] = useState({
    theme: 'dark',
    layout: 'bento',
    font: 'display',
  });
  
  const [isBuilding, setIsBuilding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fallback if not authenticated
  useEffect(() => {
    if (!loading && user === null) {
      navigate('/services');
    }
  }, [user, loading, navigate]);

  const activeThemeObj = themes.find(t => t.id === selections.theme) || themes[0];

  const handleBuild = async () => {
    if (!user) return;
    
    setIsBuilding(true);
    try {
      await addDoc(collection(db, 'projectSubmissions'), {
        userId: user.uid,
        userEmail: user.email,
        projectId,
        selections,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setIsBuilding(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-8">
         <div className="w-8 h-8 rounded-full border-2 border-electric-blue border-t-transparent animate-spin mb-4" />
         <p className="text-xs font-mono uppercase tracking-[0.2em] text-electric-blue font-bold">Synchronizing Sandbox...</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-dark flex flex-col lg:flex-row overflow-hidden pt-20 lg:pt-0">
      <SEO title="Project Customization Studio" />

      {/* Control Panel (Sidebar) */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-96 bg-dark-blue/80 backdrop-blur-xl border-r border-white/5 flex flex-col h-[50vh] lg:h-screen lg:fixed lg:left-0 z-20 order-2 lg:order-1"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between lg:mt-24">
          <button onClick={() => navigate(-1)} className="text-silver-metallic hover:text-white transition-colors flex items-center gap-2 text-xs font-mono tracking-widest uppercase">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-electric-blue bg-electric-blue/10 px-3 py-1.5 border border-electric-blue/20 geometric-clip">
            <Sparkles className="w-3 h-3" /> Live Studio
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-4 border-b border-white/5 max-w-full overflow-x-auto hide-scrollbar">
          {[
            { id: 'theme', icon: Palette, label: 'Theme' },
            { id: 'layout', icon: Layout, label: 'Layout' },
            { id: 'typography', icon: Type, label: 'Typography' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 flex-shrink-0 px-4 py-2 text-xs font-mono uppercase tracking-[0.1em] font-bold transition-all border-b-2 ${activeTab === tab.id ? 'text-white border-electric-blue bg-white/5' : 'text-silver-metallic border-transparent hover:text-white'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          <AnimatePresence mode="wait">
            {activeTab === 'theme' && (
              <motion.div key="theme" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h4 className="text-xs font-mono uppercase tracking-widest text-silver-metallic mb-4 font-bold flex items-center gap-2">
                  Color Ecosystem <span className="text-[9px] bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded-sm">AI Suggested</span>
                </h4>
                <div className="space-y-4">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelections({...selections, theme: theme.id})}
                      className={`w-full p-4 border rounded-xl geometric-clip flex items-center justify-between transition-all duration-300 ${selections.theme === theme.id ? 'border-electric-blue bg-electric-blue/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-white/20 flex overflow-hidden geometric-clip-button">
                             <div className="flex-1 h-full" style={{backgroundColor: theme.primary}}></div>
                             <div className="flex-1 h-full" style={{backgroundColor: theme.accent}}></div>
                          </div>
                          <span className="font-sans font-medium text-sm text-left">{theme.name}</span>
                       </div>
                       {selections.theme === theme.id && <Check className="w-4 h-4 text-electric-blue" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'layout' && (
              <motion.div key="layout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h4 className="text-xs font-mono uppercase tracking-widest text-silver-metallic mb-4 font-bold">Structural Architecture</h4>
                <div className="space-y-4">
                  {layouts.map(layout => (
                    <button
                      key={layout.id}
                      onClick={() => setSelections({...selections, layout: layout.id})}
                      className={`w-full p-4 border rounded-xl geometric-clip flex items-center justify-between transition-all duration-300 ${selections.layout === layout.id ? 'border-electric-blue bg-electric-blue/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                    >
                       <span className="font-sans font-medium text-sm">{layout.name}</span>
                       {selections.layout === layout.id && <Check className="w-4 h-4 text-electric-blue" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'typography' && (
              <motion.div key="typography" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h4 className="text-xs font-mono uppercase tracking-widest text-silver-metallic mb-4 font-bold">Typographic Identity</h4>
                <div className="space-y-4">
                  {fonts.map(font => (
                    <button
                      key={font.id}
                      onClick={() => setSelections({...selections, font: font.id})}
                      className={`w-full p-4 border rounded-xl geometric-clip flex items-center justify-between transition-all duration-300 ${selections.font === font.id ? 'border-electric-blue bg-electric-blue/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                    >
                       <span className={`text-sm ${font.id === 'serif' ? 'font-serif' : font.id === 'display' ? 'font-display' : 'font-sans'}`}>{font.name}</span>
                       {selections.font === font.id && <Check className="w-4 h-4 text-electric-blue" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* CTA Footer */}
        <div className="p-6 border-t border-white/5 bg-dark">
           <button 
             onClick={handleBuild}
             disabled={isBuilding}
             className="w-full relative group geometric-clip-button bg-electric-blue text-white py-4 px-6 flex items-center justify-center gap-3 overflow-hidden transition-all hover:bg-neon-blue"
           >
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-45deg] group-hover:transition-transform group-hover:translate-x-[150%] duration-1000" />
             <span className="relative z-10 font-mono text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
               {isBuilding ? 'Compiling Protocol...' : 'Build Project'} <ArrowRight className="w-4 h-4" />
             </span>
           </button>
        </div>
      </motion.div>

      {/* Preview Stage (Main Area) */}
      <div className="flex-1 order-1 lg:order-2 lg:ml-96 h-[50vh] lg:h-screen relative overflow-hidden bg-dark transition-colors duration-1000" style={{ backgroundColor: activeThemeObj.primary }}>
        {/* Background Grid for preview */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 lg:p-16">
           <motion.div 
             key={`${selections.theme}-${selections.layout}-${selections.font}`}
             initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
             animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
             transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
             className="w-full h-full lg:max-w-4xl lg:aspect-video lg:h-auto rounded-xl shadow-2xl border flex flex-col overflow-hidden geometric-clip transition-all duration-700"
             style={{ 
               backgroundColor: activeThemeObj.secondary, 
               borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 30%, transparent)`,
               boxShadow: `0 25px 50px -12px color-mix(in srgb, ${activeThemeObj.accent} 20%, transparent)`
             }}
           >
              {/* Synthetic Browser Header */}
              <div className="h-10 border-b flex items-center px-4 gap-2" style={{ borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 20%, transparent)`}}>
                 <div className="w-3 h-3 rounded-full bg-red-500/50" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                 <div className="w-3 h-3 rounded-full bg-green-500/50" />
                 <div className="flex-1 flex justify-center text-[10px] font-mono tracking-widest uppercase opacity-50" style={{color: activeThemeObj.id === 'light' ? '#000' : '#fff'}}>
                    {projectId} • Preview Mode
                 </div>
              </div>

              {/* Dynamic Preview Content based on layout */}
              <div className="flex-1 p-8 overflow-y-auto" style={{color: activeThemeObj.id === 'light' ? '#0f172a' : '#f8fafc'}}>
                 <div className="max-w-xl mb-12">
                   <h1 
                    className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${selections.font === 'serif' ? 'font-serif' : selections.font === 'display' ? 'font-display' : 'font-sans'}`}
                   >
                     Transforming architecture into <span style={{color: activeThemeObj.accent}}>Digital Reality</span>.
                   </h1>
                   <p className={`opacity-70 leading-relaxed max-w-lg ${selections.font === 'serif' ? 'font-sans' : 'font-light'}`}>
                     This live preview synchronizes with your configuration panel. Every computational choice is rendered instantly through our intelligent rendering engine.
                   </p>
                 </div>

                 {/* Layout Variations */}
                 {selections.layout === 'bento' && (
                   <div className="grid grid-cols-3 gap-4">
                     <div className="col-span-2 aspect-video rounded-xl p-6 relative overflow-hidden" style={{backgroundColor: activeThemeObj.primary}}>
                        <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-50 rounded-full" style={{backgroundColor: activeThemeObj.accent}} />
                        <h4 className="text-xl font-medium relative z-10">Primary Display</h4>
                     </div>
                     <div className="col-span-1 rounded-xl p-6" style={{backgroundColor: activeThemeObj.primary}}>
                        <h4 className="text-sm font-medium mb-2" style={{color: activeThemeObj.accent}}>Metrics Grid</h4>
                        <div className="space-y-2 mt-4">
                          {[1,2,3].map(i => <div key={i} className="h-2 w-full rounded-full opacity-20" style={{backgroundColor: activeThemeObj.accent}} />)}
                        </div>
                     </div>
                   </div>
                 )}

                 {selections.layout === 'split' && (
                   <div className="flex gap-6 h-64">
                     <div className="flex-1 rounded-xl p-8 flex flex-col justify-end" style={{backgroundColor: activeThemeObj.primary}}>
                        <h4 className="text-2xl font-medium" style={{color: activeThemeObj.accent}}>Interactive Feature</h4>
                     </div>
                     <div className="flex-1 space-y-4">
                       <div className="h-1/2 w-full rounded-xl" style={{backgroundColor: activeThemeObj.primary}} />
                       <div className="h-1/2 w-full rounded-xl" style={{backgroundColor: activeThemeObj.primary}} />
                     </div>
                   </div>
                 )}

                 {selections.layout === 'minimal' && (
                   <div className="flex flex-col items-center justify-center text-center py-12">
                     <div className="w-24 h-24 rounded-full border border-dashed mb-8 flex items-center justify-center italic font-serif" style={{borderColor: activeThemeObj.accent}}>Space</div>
                     <h3 className="text-2xl font-light max-w-md">Minimalism is not a lack of something. It's simply the perfect amount of something.</h3>
                   </div>
                 )}
              </div>
           </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark/90 backdrop-blur-md px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="glass-panel border-electric-blue p-8 md:p-12 geometric-clip w-full max-w-xl text-center relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 blur-[100px] rounded-full pointer-events-none" />
               
               <div className="w-20 h-20 bg-electric-blue/10 border border-electric-blue/30 rounded-full flex items-center justify-center mx-auto mb-8 geometric-clip-button relative">
                 <div className="absolute inset-0 border border-electric-blue animate-ping opacity-50 rounded-full" />
                 <Check className="w-8 h-8 text-electric-blue relative z-10" />
               </div>

               <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">Architecture Received</h2>
               <p className="text-silver-metallic font-light leading-relaxed mb-8 max-w-sm mx-auto">
                 Your project details have been successfully received by the EINORT SOLUTIONS Development Team. 
                 <br/><br/>
                 Our experts will review your configuration and contact you shortly with a project proposal and timeline.
               </p>

               <button 
                 onClick={() => navigate('/dashboard')}
                 className="geometric-clip-button px-8 py-4 bg-white/5 border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white transition-all w-full"
               >
                 Return to Dashboard
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
