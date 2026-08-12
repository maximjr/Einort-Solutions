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
      <main className="pt-32 pb-24 bg-surface min-h-[80dvh] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[200px] pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <Container>
          <header className="mb-16 relative z-10 max-w-4xl">
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
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10 mb-24">
            <article className="col-span-1 lg:col-span-2 space-y-12">
              <FadeUp delay={0.1}>
                <section className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-display text-white mb-4">{t("ui.enterprise_overview")}</h2>
                  <p className="text-text-muted leading-relaxed text-[17px] font-light">{service.longDescription}</p>
                  {service.cameroonContext && (
                    <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-2xl italic text-text-muted">
                       {service.cameroonContext}
                    </div>
                  )}
                </section>
              </FadeUp>

              {serviceId === 'websites-web-apps' && (
                <FadeUp delay={0.2}>
                  <section>
                    <div className="mb-8">
                      <h2 className="text-2xl font-display text-white mb-4">Our Recent Web Dev Projects</h2>
                      <p className="text-text-muted font-light">Explore some of our latest enterprise and consumer web applications, built for scale and performance.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          name: "E-Commerce Platform",
                          type: "E-Commerce",
                          desc: "A scalable, high-performance online retail platform featuring secure payments, intuitive product discovery, and seamless checkout.",
                          image: "https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/Einort%2FChatGPT%20Image%20Aug%2011%2C%202026%2C%2011_13_35%20AM.png?alt=media&token=cb43ebff-61ff-4b2a-8649-9e2217b1e307",
                          link: "https://kbl-e-lectronics.vercel.app/",
                        },
                        {
                          name: "Premium Hotel Landing Page",
                          type: "PREMIUM HOTEL",
                          desc: "An elegant, high-conversion landing page for a premium hotel.",
                          image: "https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/Einort%2FScreenshot%202026-08-11%20195316.png?alt=media&token=bc8c3e6b-704c-4e89-9f86-0f4dc24828a7",
                          link: "https://kamojamas-hotel-zstz.vercel.app/",
                        },
                        {
                          name: "Fashion E-Shop Platform",
                          type: "FASHION E-SHOP",
                          desc: "A modern e-commerce storefront for fashion and accessories.",
                          image: "https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/Einort%2FScreenshot%202026-08-11%20170344.png?alt=media&token=91b01adf-fbfb-48bf-b75c-93bf02f643e2",
                          link: "https://jo-accessories-1.vercel.app/",
                        },
                        {
                          name: "Apple E-Commerce Store",
                          type: "E-COMMERCE",
                          desc: "A sleek, high-performance online storefront for Apple products and electronics.",
                          image: "https://firebasestorage.googleapis.com/v0/b/jo-accessories-44ffa.firebasestorage.app/o/Einort%2FScreenshot%202026-08-11%20194241.png?alt=media&token=8749a2fa-323b-49cf-83a7-f7e8d61eb81c",
                          link: "https://best-buy-opal.vercel.app/",
                        }
                      ].map((project, idx) => {
                        const CardWrapper = project.link ? 'a' : 'div';
                        const linkProps = project.link ? { href: project.link, target: "_blank", rel: "noopener noreferrer" } : {};
                        
                        return (
                        <CardWrapper key={idx} {...linkProps} className="group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 bg-background/50 hover:bg-white/[0.02] transition-colors block">
                          <div className="aspect-[4/3] overflow-hidden">
                            <img 
                              src={project.image} 
                              alt={project.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />
                          </div>
                          <div className="p-6">
                            <p className="text-primary text-xs uppercase tracking-wider font-semibold mb-2">{project.type}</p>
                            <h3 className="text-xl text-white font-medium mb-2">{project.name}</h3>
                            <p className="text-text-muted font-light text-sm">{project.desc}</p>
                          </div>
                        </CardWrapper>
                      )})}
                    </div>
                  </section>
                </FadeUp>
              )}
              
              <FadeUp delay={0.3}>
                 <section>
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
                 </section>
              </FadeUp>
            </article>

            <aside className="col-span-1">
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
            </aside>
          </div>
        </Container>
      </main>
    </>
  );
}
