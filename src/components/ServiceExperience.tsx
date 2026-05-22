import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Monitor, Building, Store, CreditCard, Hotel, Stethoscope, PlayCircle, Shield, Box, Smartphone, Fingerprint, Network, Layers, Sparkles, Users } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { SEO } from './SEO';
import { useState } from 'react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

const CURATED_PROJECTS: Record<string, any[]> = {
  'web-development': [
    { 
      id: 'corporate-web', 
      title: 'Corporate Business', 
      icon: Building, 
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', 
      stack: ['React', 'Next.js', 'Node'], 
      stats: 'Enterprise',
      process: ['Architecture Mapping', 'Performance Budgeting', 'Development', 'Load Testing'],
      interactiveStates: ['Mega Menu Navigation', 'Dynamic Page Transitions']
    },
    { 
      id: 'saas-engine', 
      title: 'SaaS Platforms', 
      icon: Monitor, 
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop', 
      stack: ['React', 'Next.js', 'PostgreSQL'], 
      stats: '99.9% Uptime',
      process: ['Database Design', 'API Specification', 'Authentication Logic', 'CI/CD Setup'],
      interactiveStates: ['Real-time Data Sync', 'WebSocket Live Updates']
    },
    { 
      id: 'ecommerce-hub', 
      title: 'E-Commerce', 
      icon: Store, 
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop', 
      stack: ['Shopify', 'Remix', 'Stripe'], 
      stats: 'High Conv.',
      process: ['Inventory Architecture', 'Payment Gateway Integration', 'Cart Optimization'],
      interactiveStates: ['Optimistic UI Cart', 'Instant Search Filtering']
    },
    { 
      id: 'hotel-hospitality', 
      title: 'Hotel & Hospitality', 
      icon: Hotel, 
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Vue', 'Express', 'Booking API'], 
      stats: 'High Yield',
      process: ['PMS Integration', 'Accessibility Audit', 'SEO Content Strategy'],
      interactiveStates: ['Live Availability Calendar', 'Immersive Room Galleries']
    },
    { 
      id: 'restaurant-web', 
      title: 'Restaurant Systems', 
      icon: PlayCircle, 
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop', 
      stack: ['React', 'Tailwind', 'Firebase'], 
      stats: 'Local Auth',
      process: ['Local SEO Strategy', 'Menu Data Structuring', 'POS Integration'],
      interactiveStates: ['Location-based Routing', 'Real-time Order Tracking']
    },
    { 
      id: 'healthcare-platforms', 
      title: 'Healthcare Platforms', 
      icon: Stethoscope, 
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Angular', 'Spring', 'HIPAA'], 
      stats: 'Secure',
      process: ['Compliance Audit', 'EHR Integration', 'Secure Auth Implementation'],
      interactiveStates: ['Encrypted messaging', 'Telehealth Video Overlay']
    },
    { 
      id: 'real-estate', 
      title: 'Real Estate Platforms', 
      icon: Building, 
      image: 'https://images.unsplash.com/photo-1560518884-ce5882228f44?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Next.js', 'Go', 'Mapbox'], 
      stats: 'Geo-Optimized',
      process: ['MLS Data Ingestion', 'Geospatial Indexing', 'Performance Tuning'],
      interactiveStates: ['Interactive Map Clusters', '3D Walkthrough Viewer']
    },
    { 
      id: 'educational-platforms', 
      title: 'Educational Learning', 
      icon: Layers, 
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032&auto=format&fit=crop', 
      stack: ['React', 'Django', 'LMS'], 
      stats: 'Scalable',
      process: ['Curriculum Data Modeling', 'Video Streaming Architecture', 'Gamification Logic'],
      interactiveStates: ['Progress Tracking Visuals', 'Live Annotation Boards']
    },
  ],
  'ui-ux-design': [
    { 
      id: 'saas-dashboard-ui', 
      title: 'SaaS Dashboard UI', 
      icon: Monitor, 
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Figma', 'Prototyping', 'Design System'], 
      stats: 'Modular',
      process: ['User Research', 'Wireframing', 'Design System'],
      interactiveStates: ['Hover Feedback', 'Drag & Drop Widgets']
    },
    { 
      id: 'mobile-app-ui', 
      title: 'Mobile App UI Systems', 
      icon: Smartphone, 
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Figma', 'Framer', 'iOS/Android'], 
      stats: 'Adaptive',
      process: ['Flow Mapping', 'Low-Fi Prototyping', 'Micro-interactions'],
      interactiveStates: ['Pull-to-refresh', 'Swipe Actions']
    },
    { 
      id: 'fintech-ui', 
      title: 'Fintech UI Design', 
      icon: CreditCard, 
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Figma', 'WebGL', 'Trust UI'], 
      stats: 'High Conv.',
      process: ['Security Audit', 'Data Visualization', 'High-Fidelity'],
      interactiveStates: ['Real-time Chart Scrubbing', 'Biometric UI']
    },
    { 
      id: 'healthcare-ux', 
      title: 'Healthcare UX Systems', 
      icon: Stethoscope, 
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop', 
      stack: ['User Flow', 'Accessibility', 'Prototyping'], 
      stats: 'AAA Grade',
      process: ['Persona Development', 'Accessibility Testing', 'HIPAA'],
      interactiveStates: ['Progressive', 'Accessible Validation']
    },
    { 
      id: 'ecommerce-ux', 
      title: 'E-Commerce UX Flows', 
      icon: Store, 
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop', 
      stack: ['Figma', 'UX Research', 'A/B Testing'], 
      stats: 'Conversion Focus',
      process: ['Funnel Analysis', 'Cart Optimization', 'A/B Testing'],
      interactiveStates: ['One-click Checkout', 'Dynamic Cart Drawer']
    },
    { 
      id: 'enterprise-dashboard', 
      title: 'Enterprise ERP UIs', 
      icon: Layers, 
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop', 
      stack: ['Figma', 'Data Viz', 'Complex UI'], 
      stats: 'Scalable',
      process: ['Architecture Mapping', 'Data Density', 'Component Scaling'],
      interactiveStates: ['Advanced Filtering', 'Collapsible Menus']
    },
    { 
      id: 'startup-design', 
      title: 'Startup Launch UI', 
      icon: Sparkles, 
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Figma', 'Branding', 'MVP UX'], 
      stats: 'Market Ready',
      process: ['Brand Identity', 'Product Positioning', 'Rapid Prototyping'],
      interactiveStates: ['Scroll Animations', 'Parallax Heroes']
    },
    { 
      id: 'gaming-ui', 
      title: 'Gaming Interfaces', 
      icon: PlayCircle, 
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Unreal', 'Unity UI', 'Figma'], 
      stats: 'Immersive',
      process: ['Diegetic Design', 'HUD Prototyping', 'VFX Integration'],
      interactiveStates: ['Controller Navigation', 'Particle Feedback']
    },
  ],
  'mobile-app-development': [
    { 
      id: 'food-delivery', 
      title: 'Food Delivery Apps', 
      icon: Store, 
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop', 
      stack: ['React Native', 'Firebase', 'Maps API'], 
      stats: '<1s Latency',
      process: ['Location Services Mapping', 'Payment Gateway Integration', 'Order State Machine'],
      interactiveStates: ['Live Map Tracking', 'Haptic Order Confirmation']
    },
    { 
      id: 'banking-app', 
      title: 'Banking Apps', 
      icon: CreditCard, 
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Swift', 'Kotlin', 'Secure Enclave'], 
      stats: 'Bank Grade',
      process: ['Threat Modeling', 'Core Banking API Integration', 'Native Security Implementation'],
      interactiveStates: ['FaceID/TouchID Authentication', 'Secure Data Obfuscation']
    },
    { 
      id: 'healthcare-app', 
      title: 'Healthcare Apps', 
      icon: Stethoscope, 
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Flutter', 'HealthKit', 'WebRTC'], 
      stats: 'HIPAA Compliant',
      process: ['Wearable Sync Integration', 'Telemedicine Infrastructure', 'Accessibility Audit'],
      interactiveStates: ['Health Data Dashboard', 'Video Call PIP Mode']
    },
    { 
      id: 'social-network', 
      title: 'Social Networking', 
      icon: Layers, 
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop', 
      stack: ['React Native', 'GraphQL', 'Redis'], 
      stats: 'Real-time',
      process: ['Social Graph Modeling', 'Notification Architecture', 'Media Processing Pipeline'],
      interactiveStates: ['Infinite Feed Scrolling', 'Instant Like Animations']
    },
    { 
      id: 'ecommerce-app', 
      title: 'E-Commerce Apps', 
      icon: Store, 
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop', 
      stack: ['Flutter', 'Stripe', 'Node.js'], 
      stats: 'High Conv.',
      process: ['Offline First Architecture', 'Push Notification Strategy', 'Checkout Streamlining'],
      interactiveStates: ['AR Product Preview', 'Apple Pay/Google Pay Integration']
    },
    { 
      id: 'fitness-app', 
      title: 'Fitness Tracking Apps', 
      icon: Monitor, 
      image: 'https://images.unsplash.com/photo-1510006851064-e6056cd0e3a8?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Flutter', 'TensorFlow', 'HealthKit'], 
      stats: 'Data Driven',
      process: ['Sensor Data Ingestion', 'AI Pose Estimation', 'Gamification Logic'],
      interactiveStates: ['Real-time Metric Dials', 'Workout Summary Confetti']
    },
    { 
      id: 'educational-app', 
      title: 'Educational Apps', 
      icon: Layers, 
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032&auto=format&fit=crop', 
      stack: ['Swift', 'Kotlin', 'Video Streaming'], 
      stats: 'Interactive',
      process: ['Content Delivery Network Setup', 'Offline DRM Playback', 'Assessment Engine'],
      interactiveStates: ['In-video Quiz Popups', 'Swipeable Flashcards']
    },
    { 
      id: 'erp-mobile', 
      title: 'ERP Mobile Apps', 
      icon: Network, 
      image: 'https://images.unsplash.com/photo-1586528116311-ad8ed716d408?q=80&w=2070&auto=format&fit=crop', 
      stack: ['React Native', 'PostgreSQL', 'GraphQL'], 
      stats: 'Enterprise',
      process: ['Role-based Access Control', 'Legacy System Bridging', 'Offline Sync Queues'],
      interactiveStates: ['Barcode Scanner Overlay', 'Approval Workflow Swipes']
    },
  ],
  'enterprise-erp-solutions': [
    { 
      id: 'hospital-erp', 
      title: 'Hospital ERP Systems', 
      icon: Stethoscope, 
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop', 
      stack: ['Angular', 'Java Spring', 'HL7'], 
      stats: 'Secure',
      process: ['Legacy Data Migration', 'HL7 Protocol Integration', 'Role-based Views'],
      interactiveStates: ['Patient Record Quick-View', 'Resource Allocation Heatmap']
    },
    { 
      id: 'school-management', 
      title: 'School Management', 
      icon: Layers, 
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2032&auto=format&fit=crop', 
      stack: ['React', 'Node.js', 'PostgreSQL'], 
      stats: 'Scalable',
      process: ['Multi-tenant Architecture', 'Parent-Teacher Portal Unification', 'Automated Reporting'],
      interactiveStates: ['Drag-drop Schedule Builder', 'Attendance One-click Actions']
    },
    { 
      id: 'inventory-management', 
      title: 'Inventory Management', 
      icon: Box, 
      image: 'https://images.unsplash.com/photo-1586528116311-ad8ed716d408?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Vue', 'Go', 'Redis'], 
      stats: 'Real-time',
      process: ['Warehouse Mapping', 'IoT Sensor Integration', 'Supply Chain Analytics'],
      interactiveStates: ['3D Warehouse Visualization', 'Low-stock Alert Modals']
    },
    { 
      id: 'hr-portal', 
      title: 'HR Management Platforms', 
      icon: Building, 
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', 
      stack: ['React', 'Spring Boot', 'AWS'], 
      stats: 'Scalable',
      process: ['Payroll API Integration', 'Onboarding Workflows', 'Performance Matrix Design'],
      interactiveStates: ['Org Chart Explorer', 'Interactive Goal Trackers']
    },
    { 
      id: 'accounting-finance', 
      title: 'Accounting & Finance', 
      icon: CreditCard, 
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2026&auto=format&fit=crop', 
      stack: ['React', 'Python', 'Blockchain'], 
      stats: 'Ledger Secured',
      process: ['Double-entry Database Design', 'OpenBanking API Setup', 'Tax Compliance Engine'],
      interactiveStates: ['General Ledger Drill-down', 'Cash Flow Forecasting Graphs']
    },
    { 
      id: 'crm-platforms', 
      title: 'CRM Platforms', 
      icon: Users, 
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop', 
      stack: ['React', 'Node.js', 'Elasticsearch'], 
      stats: 'Predictive',
      process: ['Sales Funnel Automation', 'Email Tracking Infrastructure', 'AI Lead Scoring'],
      interactiveStates: ['Kanban Pipeline Drag-drop', 'Communication History Timeline']
    },
    { 
      id: 'logistics-management', 
      title: 'Logistics Systems', 
      icon: Network, 
      image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=2070&auto=format&fit=crop', 
      stack: ['React Native', 'Go', 'Kafka'], 
      stats: 'High Yield',
      process: ['Route Optimization Algorithms', 'Fleet Telematics Integration', 'Event Driven Architecture'],
      interactiveStates: ['Live Fleet Mapping', 'Dynamic Reroute Suggestions']
    },
    { 
      id: 'multi-branch-erp', 
      title: 'Multi-Branch Platforms', 
      icon: Building, 
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', 
      stack: ['Next.js', 'Kubernetes', 'gRPC'], 
      stats: 'Global',
      process: ['Data Localization Sync', 'Inter-branch API Communication', 'Unified Analytics Rollup'],
      interactiveStates: ['Global Operations Dashboard', 'Cross-branch Transfer Interface']
    },
  ]
};

const defaultProjects = [
  { id: 'business', title: 'Business Websites', icon: Building, image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', stack: ['React', 'Tailwind'], stats: 'Fast' },
  { id: 'saas', title: 'SaaS Platforms', icon: Monitor, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop', stack: ['Next.js', 'Postgres'], stats: 'Secure' },
  { id: 'ecommerce', title: 'E-Commerce', icon: Store, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop', stack: ['Shopify', 'Remix'], stats: 'High ROI' },
];

export function ServiceExperience() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Format title (e.g. web-development -> Web Development)
  const title = serviceId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Architecture';

  const projects = serviceId && CURATED_PROJECTS[serviceId] ? CURATED_PROJECTS[serviceId] : defaultProjects;

  const handleProjectSelect = (categoryId: string) => {
    setSelectedProject(categoryId);
    if (!user) {
      setAuthModalOpen(true);
    } else {
      navigate(`/studio/${categoryId}`);
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    if (selectedProject) {
      navigate(`/studio/${selectedProject}`);
    }
  };

  return (
    <section className="relative min-h-[100dvh] bg-dark text-white overflow-hidden py-32 lg:py-48 flex items-center">
      <SEO title={`${title} - Case Studies`} />

      {/* Ambient Lighting Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-premium-gold/5 blur-[150px] mix-blend-screen pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[#ffffff02] mix-blend-overlay pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full mt-10 lg:mt-0">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-20 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-2 border border-white/5 rounded-full bg-white/[0.02] mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-white/70" />
            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-silver-metallic">Curated Showcase</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-[72px] font-display font-semibold leading-[1.05] tracking-tight mb-8"
          >
            {title} <br className="hidden md:block" />
            <span className="text-silver-metallic font-light">
              Case Studies.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-base md:text-lg text-silver-metallic font-sans font-light leading-relaxed max-w-2xl text-center"
          >
            Select a project architecture prototype below to review its technical breakdown. Authenticate to enter the live Customization Studio and build your system interface.
          </motion.p>
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleProjectSelect(category.id)}
              className="group relative cursor-pointer rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden min-h-[440px] flex flex-col justify-between hover:bg-white/[0.04] transition-colors duration-500"
            >
              {/* Background Image & Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={category.image} 
                  alt={category.title}
                  loading="lazy"
                  className="w-full h-full object-cover filter saturate-0 group-hover:saturate-50 transition-all duration-1000 scale-105 group-hover:scale-100 mix-blend-luminosity opacity-30 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent z-10 transition-all duration-700" />
              </div>

              {/* Status Header */}
              <div className="relative z-20 p-6 flex justify-between items-start">
                 <div className="flex items-center gap-2 bg-dark/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                   <div className="w-1.5 h-1.5 rounded-full bg-premium-gold animate-pulse" />
                   <span className="text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-white/80">Architecture Ready</span>
                 </div>
              </div>

              {/* Content Footer */}
              <div className="relative z-20 p-6 flex flex-col pt-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                
                <div className="flex flex-wrap items-center gap-2 mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                   {category.stack.map((tech: string, i: number) => (
                     <span key={i} className="text-[10px] font-sans font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded">
                       {tech}
                     </span>
                   ))}
                </div>

                <div className="mb-4">
                  <h3 className="text-2xl font-display font-medium text-white transition-colors leading-tight mb-2">{category.title}</h3>
                  <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-silver-metallic">{category.stats}</p>
                </div>

                {category.process && (
                   <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-[200ms] h-0 group-hover:h-auto overflow-hidden">
                     <p className="text-[10px] font-sans font-medium text-white/60 mb-2 mt-4 ml-1">Design Process</p>
                     <div className="flex flex-wrap gap-1.5 mb-3">
                       {category.process.map((step: string, i: number) => (
                         <span key={i} className="text-[10px] text-white/80 border border-white/10 px-2 py-1 flex items-center gap-1 rounded-sm">
                           {step}
                         </span>
                       ))}
                     </div>
                   </div>
                )}
                
                {category.interactiveStates && (
                   <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-[300ms] h-0 group-hover:h-auto overflow-hidden mb-2">
                     <p className="text-[10px] font-sans font-medium text-white/60 mb-2 ml-1">Interactive Triggers</p>
                     <div className="flex flex-wrap gap-1.5">
                       {category.interactiveStates.map((state: string, i: number) => (
                         <span key={i} className="text-[10px] text-premium-gold border border-premium-gold/30 bg-premium-gold/5 px-2 py-1 rounded-sm">
                           {state}
                         </span>
                       ))}
                     </div>
                   </div>
                )}
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 group-hover:border-white/15 transition-colors">
                  <span className="text-[12px] font-sans font-medium text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
                    Initialize Studio
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors duration-500">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Project CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 lg:mt-32 max-w-4xl mx-auto rounded-3xl bg-white/[0.02] border border-white/10 p-10 md:p-16 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative z-10 flex flex-col items-center">
            <Layers className="w-10 h-10 text-white/60 mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4 tracking-tight">Can't Find What You're Looking For?</h2>
            <p className="text-sm md:text-base text-silver-metallic font-sans font-light mb-8 max-w-xl">
              Describe your custom project requirements through our intelligent project intake system and receive real-time technical recommendations.
            </p>
            
            <button
              onClick={() => navigate('/custom-project')}
              className="px-6 py-3 rounded-xl bg-white text-dark font-sans font-medium text-sm hover:bg-white/90 transition-colors flex items-center gap-2"
            >
              Create Custom Project
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
        title="Initialize Sandbox"
        subtitle="Authenticate to access the Customization Studio and deploy your configuration."
      />
    </section>
  );
}
