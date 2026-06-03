import { useParams, Link } from "react-router-dom";
import { Container } from "../../components/layout/Container";
import { FadeUp } from "../../components/animations/FadeUp";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { SEO } from "../../components/seo/SEO";
import { Building2, ArrowRight, Cog, LayoutGrid } from "lucide-react";

export function IndustryPage() {
  const { industry } = useParams<{ industry: string }>();
  const formattedIndustry = industry ? industry.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Enterprise";

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": `${formattedIndustry} Software Development`,
    "provider": {
      "@type": "Organization",
      "name": "Einort Solutions"
    },
    "description": `Specialized enterprise software architecture, custom ERPs, and premium web platforms tailored for the ${formattedIndustry} industry.`
  });

  return (
    <>
      <SEO schema={schema} />
      <section className="pt-32 pb-24 bg-surface min-h-[80vh] relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full mix-blend-screen pointer-events-none"></div>

        <Container>
          <div className="max-w-4xl mx-auto border-l-2 border-primary/20 pl-6 md:pl-10 relative">
            <div className="absolute -left-[2px] top-0 w-[2px] h-32 bg-gradient-to-b from-primary to-transparent"></div>
            
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
                <Building2 size={14} className="text-primary" />
                <span className="text-xs uppercase tracking-widest font-bold text-primary">
                  {formattedIndustry} Digital Solutions
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-medium text-white tracking-tight mb-8 leading-tight">
                Enterprise Software for 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 block mt-2">
                  {formattedIndustry} Leaders
                </span>
              </h1>
              <p className="text-xl text-slate-400 font-light max-w-2xl leading-relaxed mb-10">
                Einort Solutions builds highly reliable, customized digital infrastructure specifically for the {formattedIndustry} sector. Empower your operations with bespoke software architecture that scales with your ambition.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/#contact">
                  <Button variant="primary" size="lg" className="gap-2 uppercase text-xs tracking-widest font-bold">
                    Start {formattedIndustry} Project <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-24">
            {[
              {
                icon: <Cog size={24} />,
                title: "Custom ERP & CRM",
                desc: `Bespoke internal systems designed perfectly around your ${formattedIndustry} workflows.`
              },
              {
                icon: <LayoutGrid size={24} />,
                title: "Client-Facing Portals",
                desc: `World-class digital experiences that build trust and drive conversions in your sector.`
              },
              {
                icon: <Building2 size={24} />,
                title: "Legacy Modernization",
                desc: "Securely transform outdated systems into lightning-fast, modern cloud-native applications."
              }
            ].map((feature, i) => (
              <FadeUp key={i} delay={0.2 + (i * 0.1)}>
                <Card className="p-8 h-full bg-background/50 border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 font-light text-sm leading-relaxed">{feature.desc}</p>
                </Card>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
