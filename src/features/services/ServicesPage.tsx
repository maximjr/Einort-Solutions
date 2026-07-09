import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container } from "../../components/layout/Container";
import { FadeUp } from "../../components/animations/FadeUp";
import { Card } from "../../components/ui/Card";
import { ArrowRight, Code2, LayoutTemplate, Database, Smartphone, PenTool, Share2, Target, Search, ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Helmet } from "react-helmet-async";
import { SEO } from "../../components/seo/SEO";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";

const servicesData: Record<string, any> = {
  "websites-web-apps": {
    title: "Websites & Web Apps",
    description: "Build stunning, high-performance websites and intelligent web applications engineered for growth, scalability, and premium user experience.",
    longDescription: "In today's fast-evolving African digital landscape, a generic website is no longer enough. Your web platform must serve as a 24/7 digital storefront, a lead generation engine, and a mark of ultimate credibility. We engineer highly performant, secure, and mobile-optimized web applications tailored for the Cameroonian and broader African market. Whether dealing with low-bandwidth environments or requiring seamless integrations with local payment gateways (like Mobile Money and Orange Money), we ensure your platform remains lightning-fast, highly converting, and globally competitive.",
    cameroonContext: "With internet penetration growing rapidly in Cameroon, businesses that offer robust, fast-loading, and mobile-first web experiences stand out instantly. We build systems that overcome local infrastructural challenges, ensuring your enterprise remains online and accessible to clients globally and locally, without compromise.",
    icon: <Code2 className="w-12 h-12 text-primary" />,
    features: [
      "Custom Software Architecture",
      "Full-stack React & Next.js",
      "Progressive Web Apps (PWA)",
      "High-converting Landing Pages"
    ],
    benefits: [
      "Process: We start with deep architectural planning and build pixel-perfect interfaces that capture your audience, delivering lightning-fast load times.",
      "Business Impact: Increase organic traffic, lower bounce rates, and turn your website into a powerful asset that directly drives revenue and leads.",
      "Next Level: Move from a generic online presence to a bespoke, enterprise-grade digital platform that outpaces competitors."
    ],
  },
  "ui-ux-design": {
    title: "UI/UX Design",
    description: "Crafting intuitive, visually exceptional, and conversion-focused user experiences that elevate digital engagement.",
    longDescription: "First impressions are digital. A poorly designed interface immediately erodes trust, especially in emerging markets where digital credibility is paramount. Our UI/UX design methodology goes beyond aesthetics; we focus on user psychology, cognitive load, and frictionless navigation. We create cinematic, Apple-level polished interfaces that not only look spectacular but guide your customers effortlessly toward making a purchase or contacting your team.",
    cameroonContext: "Many local applications suffer from clustered, confusing interfaces that deter users. We elevate Cameroonian businesses to international design standards, building trust and conveying premium quality, which allows you to command higher prices and dominate your competitors.",
    icon: <LayoutTemplate className="w-12 h-12 text-primary" />,
    features: [
      "Wireframing & Prototyping",
      "Interactive Design Systems",
      "User Journey Mapping",
      "Conversion Rate Optimization"
    ],
    benefits: [
      "Process: We map out user journeys, identify friction points, and craft beautiful interfaces designed explicitly to guide users toward action.",
      "Business Impact: Boost conversion rates, improve user retention, and ensure your customers have a seamless and frictionless experience.",
      "Next Level: Elevate your brand perception with a cinematic, Apple-level polish that commands premium pricing and trust."
    ],
  },
  "erp-solutions": {
    title: "ERP Solutions",
    description: "Streamline operations with intelligent ERP systems built to automate workflows, centralize management, and scale business efficiency.",
    longDescription: "As your business grows, relying on fragmented spreadsheets, paper-based records, and disconnected software creates massive bottlenecks. Our custom Enterprise Resource Planning (ERP) solutions centralize your data, automate repetitive tasks, and provide real-time visibility into your entire operation. From inventory management and HR to finance and customer relations, we build scalable systems that give business owners absolute control.",
    cameroonContext: "Many Cameroonian enterprises lose revenue due to operational inefficiencies, inventory theft, or poor data tracking. A custom ERP replaces chaos with clarity, digitizing your operations securely so you can manage your business remotely, track every CFA franc, and scale without administrative nightmares.",
    icon: <Database className="w-12 h-12 text-primary" />,
    features: [
      "Custom Business Logic",
      "Workflow Automation",
      "Centralized Data Hubs",
      "Scalable Cloud Infrastructure"
    ],
    benefits: [
      "Process: We analyze your internal operations to build a tailored system that eliminates data silos and manual repetitive tasks.",
      "Business Impact: Drastically reduce operational costs, eliminate human errors, and gain real-time visibility into every aspect of your business.",
      "Next Level: Transform your enterprise into a lean, data-driven organization capable of scaling without administrative bottlenecks."
    ],
  },
  "mobile-app-development": {
    title: "Mobile App Development",
    description: "Deliver premium mobile experiences with high-performance applications designed for seamless functionality and modern usability.",
    longDescription: "Africa is a mobile-first continent. To truly capture your audience, you need a mobile application that is fast, intuitive, and functional even in low-connectivity areas. We develop premium native and cross-platform mobile apps for iOS and Android that drive engagement, foster brand loyalty, and open direct marketing channels to your customers' pockets.",
    cameroonContext: "With smartphone usage exploding across Cameroon, an app gives you direct access to your clients via push notifications and localized services. We optimize our apps to be lightweight, data-efficient, and fully integrated with local tech ecosystems.",
    icon: <Smartphone className="w-12 h-12 text-primary" />,
    features: [
      "Native & Cross-Platform",
      "Fluid Animations",
      "Offline Architecture",
      "App Store Optimization"
    ],
    benefits: [
      "Process: From concept to deployment, we engineer mobile applications that feel native, responsive, and deeply engaging.",
      "Business Impact: Capture the mobile-first audience, increase user engagement, and build a direct marketing channel to your customers' pockets.",
      "Next Level: Establish a dominant mobile presence that fosters loyalty and recurring revenue through push notifications and seamless UX."
    ],
  },
  "branding-graphic-design": {
    title: "Branding & Graphic Design",
    description: "Develop a compelling visual identity with professional graphic design and brand strategy that resonates with your audience.",
    longDescription: "Your brand is your most valuable asset. It's the silent ambassador of your business. We don't just design logos; we architect comprehensive visual identities that communicate authority, trust, and premium quality. From cohesive color palettes and typography to marketing collateral and digital assets, we ensure your brand stands out instantly in a crowded marketplace.",
    cameroonContext: "In a market saturated with generic businesses, a strong, professional brand identity is the fastest way to build instant credibility. Cameroonian consumers are increasingly drawn to brands that look established and trustworthy. We help you transcend the 'local shop' aesthetic into a highly respected corporate entity.",
    icon: <PenTool className="w-12 h-12 text-primary" />,
    features: [
      "Visual Identity & Logos",
      "Brand Guidelines",
      "Marketing Collateral",
      "Premium Typography & Color Theory"
    ],
    benefits: [
      "Process: We distill your core values into a striking visual language, creating cohesive assets that tell your brand's unique story.",
      "Business Impact: Build instant recognition, foster brand loyalty, and differentiate yourself in a crowded market.",
      "Next Level: Transition from a commodity service to a highly sought-after premium brand that commands respect and attention."
    ],
  },
  "social-media-management": {
    title: "Social Media Management",
    description: "Enhance your online presence with strategic social media campaigns, content creation, and community engagement.",
    longDescription: "Social media is where your customers spend their time. But simply posting is not enough. You need a calculated strategy that drives engagement, builds community, and converts followers into paying clients. We handle end-to-end social media management, crafting stunning visuals, writing compelling copy, and executing strategies that elevate your brand's digital footprint across all relevant platforms.",
    cameroonContext: "Platforms like Facebook, Instagram, and LinkedIn are the primary discovery engines for businesses in Cameroon. We leverage local cultural nuances, trending topics, and strategic timing to ensure your content resonates deeply with the local demographic while maintaining a world-class aesthetic.",
    icon: <Share2 className="w-12 h-12 text-primary" />,
    features: [
      "Content Strategy",
      "Community Engagement",
      "Analytics & Reporting",
      "Growth Hacking"
    ],
    benefits: [
      "Process: We manage your digital footprint with tailored content schedules, striking visuals, and proactive community building.",
      "Business Impact: Amplify brand awareness, engage directly with your target demographic, and drive organic traffic to your primary funnels.",
      "Next Level: Become an industry authority and thought leader, building a passionate community around your business."
    ],
  },
  "digital-advertising": {
    title: "Digital Advertising",
    description: "Drive targeted traffic and conversions through data-driven digital advertising across Facebook, Instagram, and Google.",
    longDescription: "Stop relying on unpredictable word-of-mouth. Digital advertising is a predictable, scalable machine for generating revenue. We engineer high-converting ad campaigns on Facebook, Instagram, and Google, leveraging advanced targeting algorithms to place your offer directly in front of people actively looking to buy. We focus entirely on ROI, ensuring every franc spent brings measurable value back to your business.",
    cameroonContext: "Traditional advertising (billboards, radio) is expensive and impossible to track accurately. Digital ads allow Cameroonian businesses to target specific cities, neighborhoods, age groups, and interests with pinpoint accuracy. We optimize campaigns for the local market, driving real leads and sales.",
    icon: <Target className="w-12 h-12 text-primary" />,
    features: [
      "Google Search Ads",
      "Facebook & Instagram Ads",
      "Retargeting Campaigns",
      "A/B Testing & Optimization"
    ],
    benefits: [
      "Process: We leverage advanced targeting data to position your brand in front of high-intent buyers, constantly optimizing for the lowest acquisition cost.",
      "Business Impact: Generate immediate, measurable ROI, capture ready-to-buy leads, and predictably scale your revenue.",
      "Next Level: Stop relying solely on word-of-mouth and build a predictable, scalable lead generation engine."
    ],
  },
  "seo-workspace-setup": {
    title: "SEO & Google Workspace Setup",
    description: "Improve search visibility and streamline organizational productivity with expert SEO strategies and Workspace integrations.",
    longDescription: "Visibility and operational efficiency are the twin pillars of a modern enterprise. Search Engine Optimization (SEO) ensures that when a potential client searches for your services, your business appears first. Simultaneously, setting up Google Workspace professionalizes your internal communications (e.g., yourname@yourcompany.com) and provides enterprise-grade tools for secure document collaboration and storage.",
    cameroonContext: "Many local businesses still use generic @yahoo or @gmail addresses, which instantly diminishes trust, especially for B2B transactions. Furthermore, local SEO competition is often low, meaning a well-optimized website can easily capture the majority of organic search traffic in your sector in Cameroon.",
    icon: <Search className="w-12 h-12 text-primary" />,
    features: [
      "Technical SEO Audits",
      "Keyword Strategy",
      "Google Workspace Integration",
      "Productivity Automation"
    ],
    benefits: [
      "Process: We optimize your digital infrastructure for search engines while streamlining your internal communications with seamless Google Workspace deployments.",
      "Business Impact: Capture high-quality organic search traffic effortlessly, while empowering your team with professional, secure email and collaboration tools.",
      "Next Level: Future-proof your business by dominating search results and operating with enterprise-level efficiency and security."
    ],
  }
};

export function ServicesPage() {
  const { serviceId } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    const cacheKey = `einort_service_${serviceId}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        // Re-attach the React element icon since it cannot be serialized
        const staticData = servicesData[serviceId];
        setService({ ...parsed, icon: staticData?.icon });
        setLoading(false);
        return;
      } catch (err) {
        console.warn("Failed to parse cached service data", err);
      }
    }

    // Simulate network delay to demonstrate caching benefit
    setLoading(true);
    const timer = setTimeout(() => {
      const data = servicesData[serviceId];
      if (data) {
        // Strip out non-serializable JSX elements before caching
        const { icon, ...serializableData } = data;
        localStorage.setItem(cacheKey, JSON.stringify(serializableData));
        setService(data);
      } else {
        setService(null);
      }
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [serviceId]);

  if (loading) {
    return (
      <Container className="py-32 text-center h-[70vh] flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-text-muted text-sm tracking-wider uppercase font-mono">Loading Service...</p>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container className="py-32 text-center h-[70vh] flex flex-col justify-center">
        <h1 className="text-4xl text-white font-display">Service Not Found</h1>
      </Container>
    );
  }

  const jsonLdSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "Einort Solutions",
    },
  });

  return (
    <>
      <SEO 
        title={`${service.title} Services | Enterprise Software & Web Development`}
        description={service.description}
        schema={jsonLdSchema}
      />
      <section className="pt-32 pb-24 bg-surface min-h-[80dvh] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <Container>
          <div className="mb-16 relative z-10 max-w-4xl">
            <FadeUp>
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/#services" },
                  { label: service.title },
                ]}
              />
              <div className="mb-6">{service.icon}</div>
              <h1 className="text-4xl md:text-6xl font-display font-medium text-white mb-6 leading-[1.1] tracking-tight">
                {service.title}
              </h1>
              <p className="text-2xl text-text-muted font-light leading-relaxed mb-8">
                {service.description}
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10 mb-24">
            <div className="col-span-1 lg:col-span-2 space-y-12">
              <FadeUp delay={0.1}>
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-display text-white mb-4">Enterprise Overview</h2>
                  <p className="text-text-muted leading-relaxed text-[17px] font-light">{service.longDescription}</p>
                </div>
              </FadeUp>
              
              <FadeUp delay={0.3}>
                 <h2 className="text-2xl font-display text-white mb-6">Execution Process & Value</h2>
                 <div className="space-y-6">
                    {service.benefits.map((benefit: string, i: number) => {
                       const parts = benefit.split(': ');
                       const title = parts[0];
                       const desc = parts.length > 1 ? parts.slice(1).join(': ') : '';
                       
                       return (
                         <div key={i} className="bg-background/50 border border-white/5 p-6 rounded-xl hover:border-white/10 transition-colors">
                           <h4 className="text-white font-medium mb-2">{title}</h4>
                           <p className="text-text-muted font-light leading-relaxed">{desc || title}</p>
                         </div>
                       )
                    })}
                 </div>
              </FadeUp>
            </div>

            <div className="col-span-1">
              <FadeUp delay={0.4}>
                <Card className="bg-background/50 border-white/5 p-8 sticky top-32">
                  <h3 className="text-white font-display text-lg mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" /> Core Capabilities
                  </h3>
                  <ul className="space-y-4 text-sm text-text-muted font-light">
                    {service.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-primary/50 shadow-[0_0_8px_rgba(10,102,194,0.6)] rounded-full shrink-0"></div>{" "}
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-8 border-t border-white/5">
                     <p className="text-sm text-text-muted mb-4 font-light">Ready to elevate your enterprise?</p>
                     <Button
                        onClick={() =>
                          document
                            .getElementById("contact")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="w-full flex items-center justify-center gap-2 uppercase font-bold tracking-[0.15em] text-[11px] h-12"
                      >
                        Request a Consultation
                      </Button>
                  </div>
                </Card>
              </FadeUp>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
