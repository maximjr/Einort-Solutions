import { Container } from "./Container";
import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 border-t border-white/5 relative z-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-8 border-b border-white/5 pb-20 mb-12">
          <div className="md:col-span-1 border-r border-white/5 pr-8">
            <Link to="/" className="flex items-center gap-3 group mb-8">
              <Logo className="w-10 h-10 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-500" />
              <div className="flex flex-col">
                <span className="text-xl font-display font-bold uppercase tracking-widest text-white leading-none">
                  Einort
                </span>
                <span className="text-[9px] font-display font-bold uppercase tracking-[0.3em] text-primary mt-1">
                  Solutions
                </span>
              </div>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs font-light">
              We engineer tomorrow's digital reality. Partner with EINORT for
              premium software architecture, SaaS products, ERP systems, and
              digital transformation capabilities deployed globally.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-6">
              Services
            </h4>
            <ul className="space-y-4 text-sm text-text-muted font-light">
              <li>
                <Link
                  to="/services/enterprise-web"
                  className="hover:text-primary transition-colors"
                >
                  Enterprise Web Apps
                </Link>
              </li>
              <li>
                <Link
                  to="/services/custom-software"
                  className="hover:text-primary transition-colors"
                >
                  Custom Software
                </Link>
              </li>
              <li>
                <Link
                  to="/services/saas"
                  className="hover:text-primary transition-colors"
                >
                  SaaS Architecture
                </Link>
              </li>
              <li>
                <Link
                  to="/services/crm-erp"
                  className="hover:text-primary transition-colors"
                >
                  CRM & ERP Systems
                </Link>
              </li>
              <li>
                <Link
                  to="/services/ai-automation"
                  className="hover:text-primary transition-colors"
                >
                  AI Automation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-6">
              Locations
            </h4>
            <ul className="space-y-4 text-sm text-text-muted font-light">
              <li>
                <Link
                  to="/locations/usa"
                  className="hover:text-primary transition-colors"
                >
                  United States
                </Link>
              </li>
              <li>
                <Link
                  to="/locations/canada"
                  className="hover:text-primary transition-colors"
                >
                  Canada
                </Link>
              </li>
              <li>
                <Link
                  to="/locations/europe"
                  className="hover:text-primary transition-colors"
                >
                  Europe
                </Link>
              </li>
              <li>
                <Link
                  to="/locations/united-kingdom"
                  className="hover:text-primary transition-colors"
                >
                  United Kingdom
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-6">
              Industries
            </h4>
            <ul className="space-y-4 text-sm text-text-muted font-light">
              <li>
                <Link
                  to="/industries/healthcare"
                  className="hover:text-primary transition-colors"
                >
                  Healthcare
                </Link>
              </li>
              <li>
                <Link
                  to="/industries/finance"
                  className="hover:text-primary transition-colors"
                >
                  Finance
                </Link>
              </li>
              <li>
                <Link
                  to="/industries/real-estate"
                  className="hover:text-primary transition-colors"
                >
                  Real Estate
                </Link>
              </li>
              <li>
                <Link
                  to="/industries/retail"
                  className="hover:text-primary transition-colors"
                >
                  Retail & SMEs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white mb-6">
              Company
            </h4>
            <ul className="space-y-4 text-sm text-text-muted font-light">
              <li>
                <Link
                  to="/#architecture"
                  className="hover:text-primary transition-colors"
                >
                  Our Approach
                </Link>
              </li>
              <li>
                <Link
                  to="/#why-us"
                  className="hover:text-primary transition-colors"
                >
                  Why EINORT
                </Link>
              </li>
              <li>
                <Link
                  to="/#contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <p>
            &copy; {new Date().getFullYear()} Einort Solutions Global. All
            rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="opacity-70">
              Serving the US, Canada, and Europe
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
