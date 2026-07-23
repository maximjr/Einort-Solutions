import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container } from "../../components/layout/Container";
import { FadeUp } from "../../components/animations/FadeUp";
import { Card } from "../../components/ui/Card";
import { Code2, LayoutTemplate, Database, Smartphone, PenTool, Share2, Target, Search, ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui/Button";

import { SEO } from "../../components/seo/SEO";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";

export function ServicesPage() {
  const { serviceId } = useParams();
  const { t, i18n } = useTranslation("services");
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }

    // Since translations might not be loaded yet or might change, 
    // we derive the service data from the translation object
    const serviceData = t(`items.${serviceId}`, { returnObjects: true }) as any;
    
    if (serviceData && typeof serviceData !== 'string') {
      // Map icons back based on serviceId
      const iconMap: Record<string, any> = {
        "websites-web-apps": <Code2 className="w-12 h-12 text-primary" />,
        "ui-ux-design": <LayoutTemplate className="w-12 h-12 text-primary" />,
        "erp-solutions": <Database className="w-12 h-12 text-primary" />,
        "mobile-app-development": <Smartphone className="w-12 h-12 text-primary" />,
        "branding-graphic-design": <PenTool className="w-12 h-12 text-primary" />,
        "social-media-management": <Share2 className="w-12 h-12 text-primary" />,
        "digital-advertising": <Target className="w-12 h-12 text-primary" />,
        "seo-workspace-setup": <Search className="w-12 h-12 text-primary" />,
      };
      
      setService({ ...serviceData, icon: iconMap[serviceId] });
    } else {
      setService(null);
    }
    setLoading(false);
  }, [serviceId, t]);

  if (loading) {
    return (
      <Container className="py-32 text-center h-[70vh] flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-text-muted text-sm tracking-wider uppercase font-mono">{t("ui.loading")}</p>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container className="py-32 text-center h-[70vh] flex flex-col justify-center">
        <h1 className="text-4xl text-white font-display">{t("ui.not_found")}</h1>
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

  const langPrefix = `/${i18n.resolvedLanguage || 'en'}`;

  return (
    <>
      <SEO 
        title={`${service.title} | Einort Solutions`}
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
                  { label: t("ui.home"), href: langPrefix || "/" },
                  { label: t("ui.services"), href: `${langPrefix}/#services` },
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
                  <h2 className="text-2xl font-display text-white mb-4">{t("ui.enterprise_overview")}</h2>
                  <p className="text-text-muted leading-relaxed text-[17px] font-light">{service.longDescription}</p>
                  {service.cameroonContext && (
                    <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-2xl italic text-text-muted">
                       {service.cameroonContext}
                    </div>
                  )}
                </div>
              </FadeUp>
              
              <FadeUp delay={0.3}>
                 <h2 className="text-2xl font-display text-white mb-6">{t("ui.execution_process")}</h2>
                 <div className="space-y-6">
                    {Array.isArray(service.benefits) && service.benefits.map((benefit: string, i: number) => {
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
                    <ShieldCheck className="w-5 h-5 text-primary" /> {t("ui.core_capabilities")}
                  </h3>
                  <ul className="space-y-4 text-sm text-text-muted font-light">
                    {Array.isArray(service.features) && service.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-primary/50 shadow-[0_0_8px_rgba(10,102,194,0.6)] rounded-full shrink-0"></div>{" "}
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-8 border-t border-white/5">
                     <p className="text-sm text-text-muted mb-4 font-light">{t("ui.ready_to_elevate")}</p>
                     <Button
                        onClick={() => window.open("https://wa.me/message/52SRSBT3VZXQB1", "_blank")}
                        className="w-full flex items-center justify-center gap-2 uppercase font-bold tracking-[0.15em] text-[11px] h-12 bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20 hover:bg-[#00e676]/20 hover:border-[#00e676]/50 transition-colors"
                      >
                        {t("ui.chat_whatsapp")}
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
