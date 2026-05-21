import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { SEO } from './SEO';
import { Check, Sparkles, ChevronLeft, Layout, Type, Palette, ArrowRight, Wand2, Monitor, Smartphone as SmartphoneIcon, Code, Layers } from 'lucide-react';
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

  // Memoized derived state for optimization
  const activeThemeObj = useMemo(() => themes.find(t => t.id === selections.theme) || themes[0], [selections.theme]);
  const activeFontFamily = useMemo(() => {
    switch(selections.font) {
      case 'serif': return 'font-serif';
      case 'display': return 'font-display';
      case 'mono': return 'font-mono tracking-tight';
      default: return 'font-sans';
    }
  }, [selections.font]);
  const activeButtonClass = useMemo(() => buttonStyles.find(b => b.id === selections.buttonStyle)?.className || 'rounded-none', [selections.buttonStyle]);

  const handleBuild = useCallback(async () => {
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
  }, [user, projectId, selections]);

  const triggerAISuggestion = useCallback(() => {
    setAiSuggesting(true);
    setTimeout(() => {
      const randomTheme = themes[Math.floor(Math.random() * themes.length)].id;
      const randomLayout = layouts[Math.floor(Math.random() * layouts.length)].id;
      const randomFont = fonts[Math.floor(Math.random() * fonts.length)].id;
      const randomBtn = buttonStyles[Math.floor(Math.random() * buttonStyles.length)].id;
      
      setSelections({ theme: randomTheme, layout: randomLayout, font: randomFont, buttonStyle: randomBtn });
      setAiSuggesting(false);
    }, 1500);
  }, []);

  if (loading || (!user && !authModalOpen)) {
    // Note: Delaying the un-auth guard so they can see the builder first, 
    // but the actual build requires auth.
  }

  return (
    <div className="h-[100dvh] bg-dark flex flex-col lg:flex-row overflow-hidden font-sans text-white">
      <SEO title={`Studio | ${projectId}`} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Control Panel (Sidebar) */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full lg:w-[420px] bg-dark/95 backdrop-blur-3xl border-r border-white/5 flex flex-col h-[45vh] lg:h-screen lg:fixed lg:left-0 z-20 order-2 lg:order-1 shadow-2xl relative"
      >
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />

        <div className="p-6 lg:pt-8 border-b border-white/5 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.1em] font-medium group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Exit
          </button>
          <div className="flex items-center gap-2 text-[10px] items-center font-sans font-medium uppercase tracking-[0.1em] text-white bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live Engine
          </div>
        </div>

        {/* Copilot Action */}
        <div className="p-6 border-b border-white/5 bg-white/[0.01]">
          <button 
            onClick={triggerAISuggestion}
            disabled={aiSuggesting}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/30 hover:bg-white/[0.05] group transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/10 border border-white/5 ${aiSuggesting ? 'animate-spin' : ''}`}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-sans font-medium text-white">AI Copilot</p>
                <p className="text-[11px] text-white/50">{aiSuggesting ? 'Synthesizing layout...' : 'Suggest optimal aesthetic'}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-2 border-b border-white/5 overflow-x-auto hide-scrollbar">
          {[
            { id: 'theme', icon: Palette, label: 'Theme' },
            { id: 'layout', icon: Layout, label: 'Layout' },
            { id: 'typography', icon: Type, label: 'Type' },
            { id: 'components', icon: Layers, label: 'UI' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 flex-shrink-0 px-4 py-4 text-[11px] font-sans uppercase tracking-[0.05em] font-medium transition-all border-b-2 ${activeTab === tab.id ? 'text-white border-white' : 'text-white/40 border-transparent hover:text-white/80'}`}
            >
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'theme' && (
              <motion.div key="theme" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{duration: 0.2}}>
                <h4 className="text-[11px] font-sans uppercase tracking-[0.1em] text-white/60 mb-4 font-medium">Color Matrix</h4>
                <div className="grid grid-cols-2 gap-3">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelections({...selections, theme: theme.id})}
                      className={`w-full p-4 rounded-2xl flex flex-col gap-4 transition-all duration-300 border ${selections.theme === theme.id ? 'border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                       <div className="flex items-center gap-1 w-full h-10 rounded-lg overflow-hidden">
                          <div className="flex-1 h-full" style={{backgroundColor: theme.primary}}></div>
                          <div className="w-3 h-full" style={{backgroundColor: theme.secondary}}></div>
                          <div className="w-6 h-full" style={{backgroundColor: theme.accent}}></div>
                       </div>
                       <div className="flex items-center justify-between w-full">
                         <span className="font-sans text-xs font-medium text-white/90">{theme.name}</span>
                         {selections.theme === theme.id && <Check className="w-3.5 h-3.5 text-white" />}
                       </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'layout' && (
              <motion.div key="layout" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{duration: 0.2}}>
                <h4 className="text-[11px] font-sans uppercase tracking-[0.1em] text-white/60 mb-4 font-medium">Structural Architecture</h4>
                <div className="space-y-3">
                  {layouts.map(layout => (
                    <button
                      key={layout.id}
                      onClick={() => setSelections({...selections, layout: layout.id})}
                      className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${selections.layout === layout.id ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                       <div className="text-left">
                         <span className="font-sans font-medium text-sm block mb-0.5 text-white">{layout.name}</span>
                         <span className="font-sans font-light text-xs text-white/50">{layout.desc}</span>
                       </div>
                       {selections.layout === layout.id && <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center"><Check className="w-3 h-3 text-dark" /></div>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'typography' && (
              <motion.div key="typography" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{duration: 0.2}}>
                <h4 className="text-[11px] font-sans uppercase tracking-[0.1em] text-white/60 mb-4 font-medium">Typographic Engine</h4>
                <div className="space-y-3">
                  {fonts.map(font => (
                    <button
                      key={font.id}
                      onClick={() => setSelections({...selections, font: font.id})}
                      className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${selections.font === font.id ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                       <div className="text-left">
                         <span className={`text-xl block mb-1 text-white ${font.id === 'serif' ? 'font-serif' : font.id === 'display' ? 'font-display' : font.id === 'mono' ? 'font-mono' : 'font-sans'}`}>{font.name}</span>
                         <span className="font-sans font-light text-xs text-white/50">{font.desc}</span>
                       </div>
                       {selections.font === font.id && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'components' && (
              <motion.div key="components" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{duration: 0.2}}>
                <h4 className="text-[11px] font-sans uppercase tracking-[0.1em] text-white/60 mb-4 font-medium">Component Styling</h4>
                <div className="space-y-3">
                  {buttonStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelections({...selections, buttonStyle: style.id})}
                      className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${selections.buttonStyle === style.id ? 'border-white bg-white/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                    >
                       <div className="text-left">
                         <span className="font-sans font-medium text-sm text-white">{style.name}</span>
                       </div>
                       <div className={`px-4 py-2 text-xs font-sans font-medium bg-white/10 text-white border border-white/10 ${style.className}`}>Button</div>
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
             className="w-full relative group rounded-2xl bg-white text-dark py-4 flex items-center justify-center gap-2 overflow-hidden transition-all hover:bg-white/90"
           >
             <span className="relative z-10 font-sans text-sm font-semibold flex items-center gap-2">
               {isBuilding ? 'Syncing...' : 'Save Configuration'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </span>
           </button>
        </div>
      </motion.div>

      {/* Preview Stage (Main Area) */}
      <div className="flex-1 order-1 lg:order-2 lg:ml-[420px] h-[55vh] lg:h-screen relative overflow-hidden bg-dark transition-colors duration-1000 flex flex-col">
        
        {/* Editor Top Bar */}
        <div className="h-14 border-b border-white/5 bg-dark/80 backdrop-blur-xl flex items-center justify-between px-6 z-10 relative">
           <div className="flex items-center gap-2 text-white/60 font-sans text-xs font-medium">
             <span>Prototype Layer</span> <span className="opacity-40">/</span> <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest">{projectId}</span>
           </div>
           
           <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
             <button onClick={() => setDeviceView('desktop')} className={`px-3 py-1.5 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}>
               <Monitor className="w-3.5 h-3.5" />
             </button>
             <button onClick={() => setDeviceView('mobile')} className={`px-3 py-1.5 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}>
               <SmartphoneIcon className="w-3.5 h-3.5" />
             </button>
           </div>
        </div>

        {/* Canvas Background Grid */}
        <div className="absolute inset-0 bg-[#070B16] z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        </div>
        
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 lg:p-8 relative z-10">
           
           {/* Rendering Engine Container */}
           <motion.div 
             key={`${selections.theme}-${selections.layout}-${selections.font}-${selections.buttonStyle}-${deviceView}`}
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
             className={`rounded-2xl shadow-2xl overflow-hidden transition-all duration-700 relative flex flex-col ${deviceView === 'mobile' ? 'w-[375px] h-[812px] rounded-[3rem] border-[12px] border-dark shadow-[0_0_50px_rgba(0,0,0,0.5)]' : 'w-full max-w-5xl aspect-[16/9] min-h-[600px] border border-white/10'}`}
             style={{ 
               backgroundColor: activeThemeObj.primary, 
             }}
           >
              {/* Synthetic Web Browser Header (desktop only) */}
              {deviceView === 'desktop' && (
                <div className="h-12 border-b flex items-center px-4 gap-4 bg-black/5 backdrop-blur-sm relative z-20" style={{ borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 15%, transparent)`}}>
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-red-400 transition-colors" />
                     <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-yellow-400 transition-colors" />
                     <div className="w-3 h-3 rounded-full bg-white/20 hover:bg-green-400 transition-colors" />
                   </div>
                   <div className="flex-1 max-w-sm mx-auto h-7 rounded bg-black/10 flex items-center justify-center border" style={{ borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 10%, transparent)` }}>
                      <div className="text-[10px] font-mono tracking-widest uppercase opacity-40 flex items-center gap-2" style={{color: activeThemeObj.text}}>
                        <Code className="w-3 h-3" /> prototype.local
                      </div>
                   </div>
                   <div className="w-16" /> {/* Spacer */}
                </div>
              )}

              {/* LIVE CUSTOMIZED CONTENT */}
              <div className="flex-1 overflow-y-auto relative custom-scrollbar z-10" style={{color: activeThemeObj.text, backgroundColor: activeThemeObj.primary}}>
                 {/* Internal Ambient Glows */}
                 <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] opacity-15 blur-[100px] rounded-full pointer-events-none transition-colors duration-1000 mix-blend-screen" style={{backgroundColor: activeThemeObj.accent}} />

                 <div className={`p-8 lg:p-14 h-full flex flex-col ${activeFontFamily}`}>
                   
                   {/* HEADER LOGIC */}
                   <header className="flex justify-between items-center mb-16 relative z-10">
                     <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded flex items-center justify-center" style={{backgroundColor: activeThemeObj.accent}}>
                         <div className="w-3 h-3 bg-white rounded-full mix-blend-exclusion" />
                       </div>
                       <span className={`font-bold tracking-tight ${activeFontFamily === 'font-display' ? 'text-2xl' : 'text-xl'}`}>Nexus</span>
                     </div>
                     <nav className="hidden md:flex gap-8 text-sm opacity-60 font-medium hover:opacity-100 transition-opacity">
                       <span className="cursor-pointer hover:opacity-100">Features</span>
                       <span className="cursor-pointer hover:opacity-100">Platform</span>
                       <span className="cursor-pointer hover:opacity-100">Enterprise</span>
                     </nav>
                     <button className={`px-5 py-2.5 text-sm font-medium ${activeButtonClass} transition-all hover:opacity-90`} style={{backgroundColor: activeThemeObj.accent, color: activeThemeObj.primary}}>
                        Sign In
                     </button>
                   </header>

                   {/* HERO SECTION */}
                   <div className={`max-w-3xl ${selections.layout === 'minimal' ? 'mx-auto flex flex-col items-center text-center mt-12' : ''} relative z-10`}>
                     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 text-xs font-semibold" style={{borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 30%, transparent)`, color: activeThemeObj.accent, backgroundColor: `color-mix(in srgb, ${activeThemeObj.accent} 10%, transparent)`}}>
                       <Sparkles className="w-3.5 h-3.5" /> Next-Gen Architecture
                     </div>
                     <h1 className={`${deviceView === 'mobile' ? 'text-5xl' : 'text-7xl'} font-semibold mb-6 tracking-tight leading-[1.05]`}>
                       Build software <br/>
                       <span className="italic font-light opacity-90 relative inline-block text-transparent bg-clip-text bg-gradient-to-r" style={{backgroundImage: `linear-gradient(to right, ${activeThemeObj.text}, ${activeThemeObj.accent})`}}>
                          at lightspeed.
                       </span>
                     </h1>
                     <p className={`opacity-70 leading-relaxed ${deviceView === 'mobile' ? 'text-base' : 'text-xl max-w-xl'} ${activeFontFamily === 'font-serif' ? 'font-sans' : 'font-light'}`}>
                       Experience flawless rendering and immediate visual feedback through our proprietary customization engine.
                     </p>
                     
                     <div className={`mt-10 flex flex-wrap gap-4 ${selections.layout === 'minimal' ? 'justify-center' : ''}`}>
                        <button className={`px-8 py-4 text-sm font-semibold ${activeButtonClass} flex items-center gap-2 transition-transform hover:scale-105`} style={{backgroundColor: activeThemeObj.text, color: activeThemeObj.primary}}>
                          Start Building <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className={`px-8 py-4 text-sm font-semibold border ${activeButtonClass} transition-colors hover:bg-white/5`} style={{borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 30%, transparent)`, color: activeThemeObj.text}}>
                          Documentation
                        </button>
                     </div>
                   </div>

                   {/* LAYOUT ARCHITECTURE VARIANTS */}
                   <div className="mt-24 relative z-10">
                     {selections.layout === 'bento' && (
                       <div className={`grid gap-5 ${deviceView === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                         <div className="col-span-1 md:col-span-2 aspect-[16/9] md:aspect-[2/1] rounded-3xl p-8 relative overflow-hidden backdrop-blur-md border flex flex-col justify-between group cursor-pointer" style={{backgroundColor: activeThemeObj.secondary, borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 20%, transparent)`}}>
                            <div className="absolute -top-10 -right-10 w-64 h-64 blur-[80px] opacity-20 rounded-full transition-transform duration-1000 group-hover:scale-150" style={{backgroundColor: activeThemeObj.accent}} />
                            <div className="flex justify-between items-center relative z-10 w-full mb-8">
                               <h4 className="text-xl font-medium">Analytics Engine</h4>
                               <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                            <div className="w-full flex-1 rounded-xl border border-dashed opacity-40 mt-auto flex items-center justify-center bg-black/5" style={{borderColor: activeThemeObj.accent}}>
                               <Monitor className="w-8 h-8 opacity-20" />
                            </div>
                         </div>
                         <div className="col-span-1 aspect-square md:aspect-auto rounded-3xl p-8 border flex flex-col group cursor-pointer" style={{backgroundColor: activeThemeObj.secondary, borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 20%, transparent)`}}>
                            <h4 className="text-sm font-medium mb-6 opacity-60 group-hover:opacity-100 transition-opacity">Global Edge Network</h4>
                            <div className="flex-1 flex flex-col justify-center gap-3">
                              {[100, 75, 40, 85].map((w, i) => (
                                <div key={i} className="h-2 rounded-full opacity-30 group-hover:opacity-60 transition-opacity overflow-hidden bg-black/20" style={{width: '100%'}}>
                                  <div className="h-full rounded-full transition-all duration-1000 delay-100" style={{backgroundColor: activeThemeObj.accent, width: `${w}%`}} />
                                </div>
                              ))}
                            </div>
                         </div>
                       </div>
                     )}

                     {selections.layout === 'split' && (
                       <div className={`flex gap-6 ${deviceView === 'mobile' ? 'flex-col' : 'h-[320px]'}`}>
                         <div className="flex-1 rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group border" style={{backgroundColor: activeThemeObj.secondary, borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 15%, transparent)`}}>
                            <div className="absolute inset-0 opacity-10 transition-transform duration-1000 group-hover:scale-110 object-cover bg-gradient-to-br from-transparent to-black/30" style={{backgroundColor: activeThemeObj.accent}} />
                            <div className="relative z-10">
                              <h4 className="text-3xl font-semibold mb-2">Visual Synthesis</h4>
                              <p className="opacity-60 text-sm max-w-sm">Object rendering and spatial computing integrated seamlessly into the DOM.</p>
                            </div>
                         </div>
                         <div className="flex-1 lg:max-w-sm space-y-4 flex flex-col">
                           <div className="flex-1 w-full rounded-3xl p-6 border flex flex-col justify-center relative overflow-hidden" style={{backgroundColor: activeThemeObj.primary, borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 20%, transparent)`}}>
                              <span className="opacity-50 text-xs font-semibold uppercase tracking-wider mb-2">Data Ingestion</span>
                              <div className="flex items-end gap-2 h-12">
                                {[30, 50, 80, 40, 100, 60, 20].map((h, i) => (
                                  <div key={i} className="w-full bg-current opacity-20 rounded-t-sm transition-all duration-700 hover:opacity-100" style={{height: `${h}%`, color: activeThemeObj.accent}} />
                                ))}
                              </div>
                           </div>
                           <div className="flex-1 w-full rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-lg" style={{backgroundColor: activeThemeObj.accent, color: activeThemeObj.primary}}>
                              <Wand2 className="w-6 h-6 mb-2 opacity-80" />
                              <span className="font-semibold">Optimize Flow</span>
                           </div>
                         </div>
                       </div>
                     )}

                     {selections.layout === 'minimal' && (
                       <div className="py-16 md:py-24 border-t border-b opacity-80 flex flex-col items-center text-center" style={{borderColor: `color-mix(in srgb, ${activeThemeObj.accent} 20%, transparent)`}}>
                         <Layout className="w-10 h-10 mb-8 opacity-30" style={{color: activeThemeObj.accent}} />
                         <h3 className="text-3xl md:text-4xl font-light max-w-2xl mb-6">Precision engineered. Focus on the core mechanics of your platform without distraction.</h3>
                         <span className="text-xs uppercase font-sans font-semibold tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Discover Architecture</span>
                       </div>
                     )}
                   </div>

                 </div>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/90 backdrop-blur-2xl px-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-10 max-w-xl w-full text-center relative overflow-hidden shadow-2xl"
            >
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-electric-blue/10 blur-[120px] rounded-full pointer-events-none" />
               
               <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                 <div className="absolute inset-0 border border-green-400/50 rounded-full animate-ping opacity-30" />
                 <Check className="w-8 h-8 text-green-400 relative z-10" />
               </div>

               <h2 className="text-3xl font-display font-semibold text-white mb-4 tracking-tight">Configuration Saved</h2>
               <p className="text-white/60 font-sans font-light leading-relaxed mb-8 text-sm md:text-base">
                 Your architecture settings for <span className="text-white font-medium">{projectId}</span> have been synchronized. The engineering protocol will begin shortly.
               </p>
               
               <div className="bg-dark/50 border border-white/5 p-5 rounded-2xl text-left mb-8">
                  <p className="text-xs font-sans uppercase tracking-[0.1em] text-white/40 mb-3 font-semibold">Active Matrix</p>
                  <ul className="space-y-2 font-sans text-sm text-white/70">
                     <li className="flex justify-between border-b border-white/5 pb-2"><span>Aesthetic:</span> <span className="text-white font-medium">{activeThemeObj.name}</span></li>
                     <li className="flex justify-between border-b border-white/5 pb-2"><span>Layout:</span> <span className="text-white font-medium">{layouts.find(l=>l.id===selections.layout)?.name}</span></li>
                     <li className="flex justify-between pt-1"><span>Typography:</span> <span className="text-white font-medium">{fonts.find(f=>f.id===selections.font)?.name}</span></li>
                  </ul>
               </div>

               <button 
                 onClick={() => navigate('/dashboard')}
                 className="rounded-xl w-full bg-white text-dark py-4 font-sans text-sm font-semibold hover:bg-white/90 transition-all"
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
