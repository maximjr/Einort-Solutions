import { Link } from "react-router-dom";
import { Container } from "../../components/layout/Container";
import { FadeUp } from "../../components/animations/FadeUp";
import { ArrowRight, BarChart, Smartphone, Globe } from "lucide-react";

const caseStudies = [
  {
    id: "global-logistics-erp",
    title: "Global Logistics ERP",
    category: "ERP Solutions Dev",
    icon: <BarChart className="w-6 h-6 text-primary" />,
    description:
      "A comprehensive supply chain and logistics management ERP system that increased operational efficiency by 40% for a multi-national transportation company.",
    metric: "40% Efficiency Gain",
  },
  {
    id: "fintech-mobile-app",
    title: "FinTech Mobile App",
    category: "Mobile App Dev",
    icon: <Smartphone className="w-6 h-6 text-primary" />,
    description:
      "A cross-platform mobile wallet and investment application processing over $10M in monthly transactions with bank-grade security protocols.",
    metric: "$10M+ Monthly Volume",
  },
  {
    id: "healthcare-portal",
    title: "Healthcare Patient Portal",
    category: "Websites & Web App Dev",
    icon: <Globe className="w-6 h-6 text-primary" />,
    description:
      "A HIPAA-compliant patient management web application handling scheduling, telehealth, and electronic health records for over 50,000 active users.",
    metric: "50k+ Active Users",
  },
];

export function CaseStudies() {
  return (
    <section id="case-studies" className="py-24 bg-surface z-10 relative">
      <Container>
        <div className="flex flex-col gap-4 text-center mb-16 max-w-3xl mx-auto">
          <FadeUp>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Success Stories
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h3 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-white leading-[1.1]">
              CASE STUDIES
            </h3>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-lg text-text-muted font-light mt-4">
              Explore how we've helped leading organizations transform their operations and scale digitally.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <FadeUp key={study.id} delay={0.1 * (index + 2)}>
              <div className="bg-background border border-white/5 rounded-2xl p-8 h-full flex flex-col hover:border-primary/30 transition-colors group">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-primary">
                  {study.icon}
                </div>
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/80 mb-3">
                  {study.category}
                </div>
                <h4 className="text-2xl font-medium text-white mb-4">
                  {study.title}
                </h4>
                <p className="text-text-muted font-light leading-relaxed mb-8 flex-grow">
                  {study.description}
                </p>
                <div className="mt-auto">
                  <div className="text-sm font-medium text-white mb-6 py-2 px-4 bg-white/5 inline-block rounded-lg border border-white/10">
                    Key Result: {study.metric}
                  </div>
                  <Link
                    to={`/case-studies/${study.id}`}
                    className="inline-flex items-center text-sm font-bold tracking-[0.1em] text-white hover:text-primary transition-colors uppercase group-hover:gap-3 gap-2"
                  >
                    Read More
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
