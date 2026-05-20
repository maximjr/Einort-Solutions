import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { SEO } from './SEO';
import { Settings, Check, Sparkles, ChevronLeft, Layout, Type, Palette, ArrowRight, Wand2, Monitor, Smartphone as SmartphoneIcon, Code, Layers } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const themes = [
  { id: 'obsidian', name: 'Obsidian Dark', primary: '#020617', secondary: '#0f172a', accent: '#3b82f6', text: '#f8fafc' },
  { id: 'ceramic', name: 'Ceramic White', primary: '#ffffff', secondary: '#f1f5f9', accent: '#000000', text: '#09090b' },
  { id: 'neon', name: 'Cyber Neon', primary: '#050505', secondary: '#111111', accent: '#00ffcc', text: '#e2e8f0' },
  { id: 'royal', name: 'Royal Velvet', primary: '#170f11', secondary: '#2a171d', accent: '#e82561', text: '#ffe4e6' },
];

const layouts = [
  { id: 'bento', name: 'Bento Grid', desc: 'Modern card-based architecture' },
  { id: 'split', name: 'Split Screen', desc: 'High-impact dual visual hierarchy' },
  { id: 'minimal', name: 'Zen Focus', desc: 'Ultra-minimalist spacious design' },
];

const fonts = [
  { id: 'sans', name: 'Inter', desc: 'Modern & Clean' },
  { id: 'display', name: 'Space Grotesk', desc: 'Technical & Bold' },
  { id: 'serif', name: 'Playfair', desc: 'Editorial & Elegant' },
  { id: 'mono', name: 'JetBrains Mono', desc: 'Developer & Brutalist' }
];

const buttonStyles = [
  { id: 'geometric', name: 'Geometric Clip', className: 'geometric-clip-button rounded-none' },
  { id: 'rounded', name: 'Pill Rounded', className: 'rounded-full' },
  { id: 'soft', name: 'Soft Edge', className: 'rounded-lg' },
];

export function CustomizationStudio() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('theme');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  
  const [selections, setSelections] = useState({
    theme: 'obsidian',
    layout: 'bento',
    font: 'display',
    buttonStyle: 'geometric',
  });
  
  const [isBuilding, setIsBuilding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fallback removed so they can browse without authentication.
  // useEffect(() => {
  //   if (!loading && user === null) {
  //     navigate('/services');
  //   }
  // }, [user, loading, navigate]);

  const activeThemeObj = themes.find(t => t.id === selections.theme) || themes[0];
  const activeFontFamily = selections.font === 'serif' ? 'font-serif' : selections.font === 'display' ? 'font-display' : selections.font === 'mono' ? 'font-mono' : 'font-sans';
  const activeButtonClass = buttonStyles.find(b => b.id === selections.buttonStyle)?.className || 'rounded-none';

  const handleBuild = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    setIsBuilding(true);
    try {
      await addDoc(collection(db, 'projectSubmissions'), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Unknown',
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

  const triggerAISuggestion = () => {
    setAiSuggesting(true);
    setTimeout(() => {
      // Simulate intelligent applying combo based on random or logic
      const randomTheme = themes[Math.floor(Math.random() * themes.length)].id;
      const randomLayout = layouts[Math.floor(Math.random() * layouts.length)].id;
      const randomFont = fonts[Math.floor(Math.random() * fonts.length)].id;
      const randomBtn = buttonStyles[Math.floor(Math.random() * buttonStyles.length)].id;
      
      setSelections({ theme: randomTheme, layout: randomLayout, font: randomFont, buttonStyle: randomBtn });
      setAiSuggesting(false);
    }, 1500);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-8">
         <div className="w-8 h-8 rounded-full border-2 border-electric-blue border-t-transparent animate-spin mb-4" />
         <p className="text-xs font-mono uppercase tracking-[0.2em] text-electric-blue font-bold">Synchronizing Sandbox Session...</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-dark flex flex-col lg:flex-row overflow-hidden font-sans text-white">
      <SEO title={`Studio | ${projectId}`} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Control Panel (Sidebar) */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-[400px] bg-dark/95 backdrop-blur-2xl border-r border-white/5 flex flex-col h-[40vh] lg:h-screen lg:fixed lg:left-0 z-20 order-2 lg:order-1 shadow-2xl relative"
      >
        {/* Subtle glowing edge */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-electric-blue/30 to-transparent" />

        <div className="p-6 lg:pt-8 border-b border-white/5 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-silver-metallic hover:text-white transition-colors flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase font-bold group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Exit Sandbox
          </button>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-electric-blue bg-electric-blue/10 px-3 py-1.5 border border-electric-blue/20 geometric-clip shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <div className="w-1.5 h-1.5 rounded-full bg-electric-blue animate-pulse" /> Live Engine
          </div>
        </div>

        {/* Copilot Action */}
        <div className="p-4 px-6 border-b border-white/5 bg-gradient-to-r from-electric-blue/5 to-transparent">
          <button 
            onClick={triggerAISuggestion}
            disabled={aiSuggesting}
            className="w-full flex items-center justify-between p-4 holographic-panel border border-electric-blue/30 hover:border-electric-blue group transition-all duration-500 geometric-clip"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 geometric-diamond flex items-center justify-center bg-electric-blue/20 border border-electric-blue/50 ${aiSuggesting ? 'animate-spin' : ''}`}>
                <Wand2 className="w-4 h-4 text-electric-blue" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-electric-blue">System Protocol</p>
                <p className="text-xs text-silver-metallic mt-0.5">{aiSuggesting ? 'Synthesizing...' : 'Generate Optimal Aesthetic'}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-electric-blue opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-white/5 overflow-x-auto hide-scrollbar">
          {[
            { id: 'theme', icon: Palette, label: 'Theme' },
            { id: 'layout', icon: Layout, label: 'Layout' },
            { id: 'typography', icon: Type, label: 'Type' },
            { id: 'components', icon: Layers, label: 'UI' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 flex-shrink-0 px-4 py-4 text-[10px] font-mono uppercase tracking-[0.2em] font-bold transition-all border-b-[2px] ${activeTab === tab.id ? 'text-electric-blue border-electric-blue bg-electric-blue/5' : 'text-silver-metallic border-transparent hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-3 h-3" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'theme' && (
              <motion.div key="theme" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic mb-6 font-bold">Color Hierarchy</h4>
                <div className="grid grid-cols-2 gap-4">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelections({...selections, theme: theme.id})}
                      className={`w-full p-4 border geometric-clip flex flex-col gap-4 transition-all duration-300 ${selections.theme === theme.id ? 'border-electric-blue bg-electric-blue/10 shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-1 ring-electric-blue/50' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                    >
                       <div className="flex items-center gap-2 w-full h-12 geometric-clip overflow-hidden">
                          <div className="flex-1 h-full" style={{backgroundColor: theme.primary}}></div>
                          <div className="w-4 h-full" style={{backgroundColor: theme.secondary}}></div>
                          <div className="w-8 h-full" style={{backgroundColor: theme.accent}}></div>
                       </div>
                       <div className="flex items-center justify-between w-full">
                         <span className="font-mono text-[9px] uppercase tracking-widest font-bold">{theme.name}</span>
                         {selections.theme === theme.id && <Check className="w-3 h-3 text-electric-blue" />}
                       </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'layout' && (
              <motion.div key="layout" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic mb-6 font-bold">Structural Architecture</h4>
                <div className="space-y-4">
                  {layouts.map(layout => (
                    <button
                      key={layout.id}
                      onClick={() => setSelections({...selections, layout: layout.id})}
                      className={`w-full p-5 border geometric-clip flex items-center justify-between transition-all duration-300 ${selections.layout === layout.id ? 'border-electric-blue bg-electric-blue/10 shadow-[0_0_20px_rgba(37,99,235,0.15)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                    >
                       <div className="text-left">
                         <span className="font-sans font-bold text-sm block mb-1">{layout.name}</span>
                         <span className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic">{layout.desc}</span>
                       </div>
                       {selections.layout === layout.id && <div className="w-6 h-6 geometric-diamond bg-electric-blue/20 flex items-center justify-center"><Check className="w-3 h-3 text-electric-blue" /></div>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'typography' && (
              <motion.div key="typography" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic mb-6 font-bold">Typographic Engine</h4>
                <div className="space-y-4">
                  {fonts.map(font => (
                    <button
                      key={font.id}
                      onClick={() => setSelections({...selections, font: font.id})}
                      className={`w-full p-5 border geometric-clip flex items-center justify-between transition-all duration-300 ${selections.font === font.id ? 'border-electric-blue bg-electric-blue/10 shadow-[0_0_20px_rgba(37,99,235,0.15)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                    >
                       <div className="text-left">
                         <span className={`text-xl block mb-1 ${font.id === 'serif' ? 'font-serif' : font.id === 'display' ? 'font-display' : font.id === 'mono' ? 'font-mono uppercase tracking-tight' : 'font-sans'}`}>{font.name}</span>
                         <span className="font-mono text-[9px] uppercase tracking-widest text-silver-metallic leading-tight block">{font.desc}</span>
                       </div>
                       {selections.font === font.id && <Check className="w-4 h-4 text-electric-blue" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'components' && (
              <motion.div key="components" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-silver-metallic mb-6 font-bold">Component Styling</h4>
                <div className="space-y-4">
                  {buttonStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelections({...selections, buttonStyle: style.id})}
                      className={`w-full p-5 border geometric-clip flex items-center justify-between transition-all duration-300 ${selections.buttonStyle === style.id ? 'border-electric-blue bg-electric-blue/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                    >
                       <div className="text-left flex-1 border-r border-white/10 mr-4">
                         <span className="font-sans font-bold text-sm block mb-1 text-white">{style.name}</span>
                       </div>
                       
                       <div className={`px-4 py-2 text-xs font-mono bg-white/10 text-white ${style.className}`}>Button</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA Footer */}
        <div className="p-6 border-t border-white/5 bg-dark relative z-30">
           <button 
             onClick={handleBuild}
             disabled={isBuilding}
             className="w-full relative group geometric-clip bg-electric-blue text-white py-5 px-6 flex items-center justify-center gap-3 overflow-hidden transition-all hover:bg-white hover:text-dark hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
           >
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] skew-x-[-45deg] group-hover:transition-transform group-hover:translate-x-[150%] duration-1000" />
             <span className="relative z-10 font-mono text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
               {isBuilding ? 'Transmitting...' : 'Initiate Development'} <ArrowRight className="w-4 h-4" />
             </span>
           </button>
        </div>
      </motion.div>

      {/* Preview Stage (Main Area) */}
      <div className="flex-1 order-1 lg:order-2 lg:ml-[400px] h-[60vh] lg:h-screen relative overflow-hidden bg-dark transition-colors duration-1000 flex flex-col">
        
        {/* Editor Top Bar (Figma-Style) */}
        <div className="h-14 border-b border-white/10 bg-dark/80 backdrop-blur-xl flex items-center justify-between px-6 z-10 relative">
           <div className="flex items-center gap-4 text-silver-metallic font-mono text-[10px] uppercase tracking-widest">
             <span className="text-white opacity-50">PROTOTYPE</span> / <span className="text-white font-bold">{projectId}</span>
           </div>
           
           <div className="flex items-center gap-2 bg-dark/50 p-1 border border-white/10 rounded-md">
             <button onClick={() => setDeviceView('desktop')} className={`p-1.5 rounded-sm transition-colors ${deviceView === 'desktop' ? 'bg-white/10 text-white' : 'text-silver-metallic hover:text-white'}`}>
               <Monitor className="w-4 h-4" />
             </button>
             <button onClick={() => setDeviceView('mobile')} className={`p-1.5 rounded-sm transition-colors ${deviceView === 'mobile' ? 'bg-white/10 text-white' : 'text-silver-metallic hover:text-white'}`}>
               <SmartphoneIcon className="w-4 h-4" />
             </button>
           </div>
        </div>

        {/* Canvas Background Grid */}
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" style={{ backgroundPosition: 'center center' }} />
        </div>
        
        <div className="flex-1 overflow-auto flex items-center justify-center p-8 relative z-10">
           
           {/* Rendering Engine Container */}
           <motion.div 
             key={`${selections.theme}-${selections.layout}-${selections.font}-${deviceView}`}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
             className={`rounded-xl shadow-2xl border flex flex-col overflow-hidden transition-all duration-700 relative ${deviceView === 'mobile' ? 'w-[375px] h-[812px]' : 'w-full max-w-5xl aspect-[16/9] min-h-[600px]'}`}
             style={{ 
               backgroundColor: activeThemeObj.primary, 
               borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 20%, transparent)`,
               boxShadow: `0 30px 60px -15px color-mix(in srgb, ${activeThemeObj.accent} 30%, transparent)`
             }}
           >
              {/* Synthetic Browser / Device Header */}
              <div className="h-10 border-b flex items-center px-4 gap-3 bg-black/10 backdrop-blur-sm" style={{ borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 15%, transparent)`}}>
                 <div className="flex gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                   <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                 </div>
                 <div className="flex-1 max-w-sm mx-auto h-6 rounded-md bg-black/5 flex items-center justify-center border" style={{ borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 10%, transparent)` }}>
                    <div className="text-[9px] font-mono tracking-widest uppercase opacity-40 flex items-center gap-2" style={{color: activeThemeObj.text}}>
                      <Code className="w-3 h-3" /> localhost:3000
                    </div>
                 </div>
              </div>

              {/* LIVE CUSTOMIZED CONTENT */}
              <div className="flex-1 overflow-y-auto relative custom-scrollbar" style={{color: activeThemeObj.text, backgroundColor: activeThemeObj.primary}}>
                 {/* Internal Gradient Glows native to the selected theme */}
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 blur-[100px] rounded-full pointer-events-none transition-colors duration-1000" style={{backgroundColor: activeThemeObj.accent}} />

                 <div className={`p-8 lg:p-12 h-full flex flex-col ${activeFontFamily}`}>
                   
                   {/* HEADER LOGIC */}
                   <header className="flex justify-between items-center mb-16 relative z-10">
                     <span className={`font-bold tracking-tighter ${activeFontFamily === 'font-display' ? 'text-2xl' : 'text-xl'}`}>NEXUS.</span>
                     <nav className="hidden md:flex gap-8 text-sm opacity-60">
                       <span>Features</span>
                       <span>Architecture</span>
                       <span>Enterprise</span>
                     </nav>
                     <button className={`px-6 py-2.5 text-xs uppercase tracking-widest font-bold ${activeButtonClass} transition-shadow hover:shadow-lg`} style={{backgroundColor: activeThemeObj.accent, color: activeThemeObj.primary}}>
                        Initialize
                     </button>
                   </header>

                   {/* HERO SECTION */}
                   <div className={`max-w-2xl ${selections.layout === 'minimal' ? 'mx-auto flex flex-col items-center text-center mt-12' : ''} relative z-10`}>
                     <h1 className={`${deviceView === 'mobile' ? 'text-4xl' : 'text-6xl'} font-bold mb-6 tracking-tight leading-[1.05]`}>
                       Engineer the <br/>
                       <span className="italic font-light opacity-90 relative inline-block">
                          Impossible.
                          <span className="absolute bottom-1 left-0 w-full h-[3px] opacity-50" style={{backgroundColor: activeThemeObj.accent}} />
                       </span>
                     </h1>
                     <p className={`opacity-70 leading-relaxed ${deviceView === 'mobile' ? 'text-sm' : 'text-lg max-w-lg'} ${activeFontFamily === 'font-serif' ? 'font-sans' : 'font-light'}`}>
                       This container synthesizes your chosen parameters in real-time. Experience flawless visual feedback utilizing our proprietary rendering engine.
                     </p>
                     
                     <div className={`mt-10 flex flex-wrap gap-4 ${selections.layout === 'minimal' ? 'justify-center' : ''}`}>
                        <button className={`px-8 py-4 text-sm uppercase tracking-[0.2em] font-bold ${activeButtonClass} flex items-center gap-2`} style={{backgroundColor: activeThemeObj.accent, color: activeThemeObj.primary}}>
                          Deploy Scale <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className={`px-8 py-4 text-sm font-bold border ${activeButtonClass}`} style={{borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 30%, transparent)`, color: activeThemeObj.text}}>
                          Read Docs
                        </button>
                     </div>
                   </div>

                   {/* LAYOUT ARCHITECTURE VARIANTS */}
                   <div className="mt-20 relative z-10">
                     {selections.layout === 'bento' && (
                       <div className={`grid gap-4 ${deviceView === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                         <div className="col-span-1 md:col-span-2 aspect-[16/9] md:aspect-[2/1] rounded-2xl p-8 relative overflow-hidden backdrop-blur-md border flex flex-col justify-between" style={{backgroundColor: activeThemeObj.secondary, borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 20%, transparent)`}}>
                            <div className="absolute -top-20 -right-20 w-64 h-64 blur-[80px] opacity-20 rounded-full" style={{backgroundColor: activeThemeObj.accent}} />
                            <h4 className="text-xl font-medium relative z-10">Enterprise Analytics</h4>
                            <div className="w-full h-1/2 rounded-lg border border-dashed opacity-30 mt-auto" style={{borderColor: activeThemeObj.accent}} />
                         </div>
                         <div className="col-span-1 rounded-2xl p-8 border flex flex-col" style={{backgroundColor: activeThemeObj.secondary, borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 20%, transparent)`}}>
                            <h4 className="text-sm font-medium mb-6 opacity-60">Global Network</h4>
                            <div className="flex-1 flex flex-col justify-between gap-2">
                              {[100, 75, 40, 85].map((w, i) => (
                                <div key={i} className="h-2 rounded-full opacity-30" style={{backgroundColor: activeThemeObj.accent, width: `${w}%`}} />
                              ))}
                            </div>
                         </div>
                       </div>
                     )}

                     {selections.layout === 'split' && (
                       <div className={`flex gap-6 ${deviceView === 'mobile' ? 'flex-col' : 'h-[300px]'}`}>
                         <div className="flex-1 rounded-2xl p-8 flex flex-col justify-end relative overflow-hidden group" style={{backgroundColor: activeThemeObj.secondary}}>
                            <div className="absolute inset-0 opacity-10 transition-transform duration-1000 group-hover:scale-105" style={{backgroundColor: activeThemeObj.accent}} />
                            <h4 className="text-2xl font-medium relative z-10">Visual Synthesis</h4>
                            <p className="opacity-50 text-sm mt-2 relative z-10">Real-time object rendering</p>
                         </div>
                         <div className="flex-1 space-y-4 flex flex-col">
                           <div className="flex-1 w-full rounded-2xl p-6 border flex items-end" style={{backgroundColor: activeThemeObj.primary, borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 30%, transparent)`}}>
                              <span className="opacity-60 text-sm">Data Ingestion</span>
                           </div>
                           <div className="flex-1 w-full rounded-2xl p-6" style={{backgroundColor: activeThemeObj.accent, color: activeThemeObj.primary}}>
                              <span className="font-bold">Protocol Active</span>
                           </div>
                         </div>
                       </div>
                     )}

                     {selections.layout === 'minimal' && (
                       <div className="py-12 border-t border-b opacity-80 flex flex-col items-center text-center" style={{borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 20%, transparent)`}}>
                         <Layout className="w-8 h-8 mb-6 opacity-40" />
                         <h3 className="text-2xl font-light max-w-lg mb-4">Precision over excess. Focus on the core mechanics of your platform.</h3>
                         <span className="text-[10px] uppercase font-mono tracking-widest opacity-50 border-b pb-1" style={{borderColor: activeThemeObj.accent}}>View Structure</span>
                       </div>
                     )}
                   </div>

                 </div>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Cinematic Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark/90 backdrop-blur-2xl px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="holographic-panel border-electric-blue/50 p-8 md:p-14 geometric-clip w-full max-w-2xl text-center relative overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)]"
            >
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-electric-blue/10 blur-[120px] rounded-full pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-neon-blue/10 blur-[100px] rounded-full pointer-events-none" />
               
               <div className="w-24 h-24 bg-dark border border-electric-blue/50 shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center mx-auto mb-10 geometric-diamond relative group">
                 <div className="absolute inset-0 border border-electric-blue animate-ping opacity-30 geometric-diamond" />
                 <Check className="w-10 h-10 text-electric-blue relative z-10" />
               </div>

               <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">Project Received</h2>
               <p className="text-silver-metallic font-light leading-relaxed mb-6 text-base md:text-lg">
                 Your Project details for <span className="text-white font-bold">{projectId}</span> have been received by our Dev Team and We will get back to You ASAP with a follow up Email containing your Invoice and other project details.
               </p>
               
               <div className="bg-dark-blue/50 border border-white/5 p-6 text-left mb-10 geometric-clip-right">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-electric-blue mb-4 font-bold">Transmission Ledger</p>
                  <ul className="space-y-3 font-mono text-[11px] text-silver-metallic tracking-wider">
                     <li className="flex justify-between border-b border-white/5 pb-2"><span>Aesthetic Matrix:</span> <span className="text-white">{activeThemeObj.name}</span></li>
                     <li className="flex justify-between border-b border-white/5 pb-2"><span>Structural Layout:</span> <span className="text-white">{selections.layout}</span></li>
                     <li className="flex justify-between border-b border-white/5 pb-2"><span>Typographic Engine:</span> <span className="text-white">{fonts.find(f=>f.id===selections.font)?.name}</span></li>
                  </ul>
               </div>

               <p className="text-silver-metallic font-light mb-10 max-w-md mx-auto">
                 Our team will review your parameters and coordinate a strategy deployment mapping shortly.
               </p>

               <button 
                 onClick={() => navigate('/dashboard')}
                 className="geometric-clip bg-white text-dark w-full py-5 font-mono text-xs font-bold uppercase tracking-[0.2em] hover:bg-electric-blue hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
               >
                 Return to Command Center
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
