import React from "react";
import { Container } from "../../components/layout/Container";
import { FadeUp } from "../../components/animations/FadeUp";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Database, Smartphone, LayoutTemplate, Code2 } from "lucide-react";

const services = [
  {
    icon: <Code2 className="w-6 h-6 text-primary" />,
    title: "Websites & Web Apps",
    description:
      "Build stunning, high-performance websites and intelligent web applications engineered for growth, scalability, and premium user experience.",
  },
  {
    icon: <LayoutTemplate className="w-6 h-6 text-primary" />,
    title: "UI/UX Design",
    description:
      "Crafting intuitive, visually exceptional, and conversion-focused user experiences that elevate digital engagement.",
  },
  {
    icon: <Database className="w-6 h-6 text-primary" />,
    title: "ERP Solutions",
    description:
      "Streamline operations with intelligent ERP systems built to automate workflows, centralize management, and scale business efficiency.",
  },
  {
    icon: <Smartphone className="w-6 h-6 text-primary" />,
    title: "Mobile App Development",
    description:
      "Deliver premium mobile experiences with high-performance applications designed for seamless functionality and modern usability.",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="py-24 bg-surface z-10 relative border-t border-white/5"
    >
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <FadeUp>
            <div className="flex flex-col gap-4">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Core Expertise
              </h2>
              <h3 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-white max-w-2xl leading-[1.1]">
                ENGINEERING AT <br /> THE HIGHEST LEVEL.
              </h3>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-text-muted max-w-md text-base leading-relaxed font-light">
              We do not just build websites; we engineer digital products that
              serve as the foundation for modern enterprises.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <FadeUp key={index} delay={0.1 * index}>
              <Card className="h-full bg-background/50 border-white/5 hover:border-white/10 hover:bg-background/80 transition-all duration-500 group">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface/50 border border-white/5 flex items-center justify-center mb-6 group-hover:scale-[1.05] group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-500 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {React.cloneElement(
                      service.icon as React.ReactElement<any>,
                      {
                        className:
                          "w-6 h-6 text-primary group-hover:text-primary transition-colors duration-500",
                      },
                    )}
                  </div>
                  <CardTitle className="text-2xl font-display font-medium text-white tracking-wide">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-muted leading-relaxed font-light text-[15px]">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
