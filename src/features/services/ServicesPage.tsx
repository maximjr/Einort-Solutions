import { useParams } from "react-router-dom";
import { Container } from "../../components/layout/Container";
import { FadeUp } from "../../components/animations/FadeUp";
import { Card } from "../../components/ui/Card";
import { Layers, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { SEO } from "../../components/seo/SEO";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";

const servicesData: Record<string, any> = {
  "enterprise-web": {
    title: "Enterprise Web Development",
    description:
      "Scalable, secure, and lightning-fast web applications engineered for heavy traffic and complex business logic.",
    icon: <Layers className="w-12 h-12 text-primary" />,
    features: [
      "Microservices Architecture",
      "React/Next.js/Vue",
      "Serverless Infrastructure",
    ],
    benefits: [
      "99.99% Uptime",
      "Global Edge Caching",
      "Military-grade Security",
    ],
  },
  saas: {
    title: "SaaS Platform Architecture",
    description:
      "End-to-end SaaS engineering handling multi-tenancy, billing, real-time sync, and scalable databases.",
    icon: <Zap className="w-12 h-12 text-primary" />,
    features: [
      "Multi-tenant Systems",
      "Stripe Integration",
      "WebSocket Real-time Data",
    ],
    benefits: [
      "Rapid Time-to-Market",
      "Frictionless Onboarding",
      "High Retention UX",
    ],
  },
  "ui-ux": {
    title: "UI/UX Systems",
    description:
      "World-class, cinematic, and premium product design systems that convert and elevate brand positioning.",
    icon: <Shield className="w-12 h-12 text-primary" />,
    features: ["Apple-level Polish", "Framer Motion", "Design Systems (Figma)"],
    benefits: [
      "Increased Conversion",
      "Lower Bounce Rates",
      "Elite Brand Perception",
    ],
  },
};

export function ServicesPage() {
  const { serviceId } = useParams();
  const service = serviceId ? servicesData[serviceId] : null;

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
        title={`${service.title} | EINORT Solutions`}
        description={service.description}
        schema={jsonLdSchema}
      />
      <section className="pt-32 pb-24 bg-surface min-h-[80vh] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24 relative z-10">
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
              <p className="text-xl text-text-muted font-light leading-relaxed mb-8">
                {service.description}
              </p>
              <Button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2 uppercase font-bold tracking-[0.15em] text-[11px] h-12"
              >
                Initiate Project <ArrowRight size={16} />
              </Button>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="bg-background/50 border-white/5 p-8">
                  <h3 className="text-white font-display text-lg mb-4">
                    Core Features
                  </h3>
                  <ul className="space-y-3 text-sm text-text-muted font-light">
                    {service.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-primary/50 shadow-[0_0_8px_rgba(10,102,194,0.6)] rounded-full shrink-0"></div>{" "}
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="bg-background/50 border-white/5 p-8 relative top-0 sm:top-12">
                  <h3 className="text-white font-display text-lg mb-4">
                    Key Benefits
                  </h3>
                  <ul className="space-y-3 text-sm text-text-muted font-light">
                    {service.benefits.map((benefit: string, i: number) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-primary/50 shadow-[0_0_8px_rgba(10,102,194,0.6)] rounded-full shrink-0"></div>{" "}
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </FadeUp>
          </div>
        </Container>
      </section>
    </>
  );
}
