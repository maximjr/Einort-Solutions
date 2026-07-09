import { useState } from "react";
import { Container } from "../../components/layout/Container";
import { FadeUp } from "../../components/animations/FadeUp";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { SEO } from "../../components/seo/SEO";

export const faqs = [
  {
    question: "What is your typical project timeline?",
    answer:
      "Our timelines vary depending on the scope and complexity of the project. A standard web application MVP might take 6 to 10 weeks, while large-scale enterprise solutions and ERP systems can take 3 to 6 months. We break development into agile sprints to ensure continuous delivery and feedback.",
  },
  {
    question: "Do you offer post-launch support and maintenance?",
    answer:
      "Yes, we provide ongoing support, maintenance, and optimization services. We monitor system performance, perform security patches, and can continuously iterate on features based on user feedback and business growth.",
  },
  {
    question: "What technologies do you specialize in?",
    answer:
      "We focus on modern, scalable technology stacks including React, TypeScript, Node.js, Next.js, and Firebase or Cloud SQL for databases. For mobile, we leverage cross-platform frameworks to ensure high performance on both iOS and Android.",
  },
  {
    question: "How do you handle project communication?",
    answer:
      "We believe in total transparency. Our clients have access to a dedicated Client Portal where they can track project milestones, view staging links, and directly chat with the Development Team in real-time.",
  },
  {
    question:
      "Can you integrate with our existing backend or third-party APIs?",
    answer:
      "Absolutely. We have extensive experience in seamless API integrations, migrating legacy databases, and connecting modern applications with established enterprise software (CRMs, payment gateways, etc.).",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  });

  return (
    <section className="py-24 bg-background z-10 relative border-t border-white/5">
      <SEO schema={faqSchema} />
      <Container>
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="flex flex-col gap-4 text-center mb-16">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                F.A.Q
              </h2>
              <h3 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-white leading-[1.1]">
                FREQUENTLY ASKED <br /> QUESTIONS
              </h3>
            </div>
          </FadeUp>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <FadeUp key={index} delay={0.1 * index}>
                  <div className="bg-surface/50 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                    <button
                      className="w-full text-left px-6 py-6 flex items-center justify-between focus:outline-none"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="text-lg font-medium text-white pr-8">
                        {faq.question}
                      </span>
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300",
                          isOpen ? "rotate-180" : "",
                        )}
                      >
                        <ChevronDown size={16} className="text-white/60" />
                      </div>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-in-out",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-6 pt-2 text-text-muted font-light leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
