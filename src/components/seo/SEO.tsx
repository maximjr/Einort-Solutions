import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SEO_CONFIG } from "../../constants/seo";
import { safeJsonLd } from "../../lib/jsonld";

interface SEOProps {
  title?:       string;
  description?: string;
  canonical?:   string;
  schema?:      string;
  lang?:        string;
}

// Routes that must never be indexed (admin / client-only pages)
const NOINDEX_PATHS = new Set(["/admin", "/client-portal"]);

// Service page titles without keyword stuffing
const SERVICE_TITLES: Record<string, string> = {
  "enterprise-software":   "Enterprise Software Development",
  "erp-solutions":         "Custom ERP Solutions & Systems Integration",
  "ui-ux-design":          "UI/UX Design & Product Strategy",
  "mobile-development":    "Mobile App Development for iOS & Android",
  "ai-automation":         "AI Automation & Machine Learning Solutions",
  "cloud-infrastructure":  "Cloud Infrastructure & DevOps Engineering",
};

export function SEO({
  title,
  description,
  canonical,
  schema,
  lang = "en",
}: SEOProps = {}) {
  const location = useLocation();

  const routeConfig = useMemo(() => {
    const { pathname } = location;

    if (pathname === "/") {
      return {
        title:
          "Einort Solutions | Elite Custom Software & Enterprise Web Architecture",
        description:
          "Einort Solutions provides world-class enterprise software architecture, full-stack systems engineering, and scalable cloud infrastructure for modern businesses globally.",
      };
    }

    if (pathname === "/admin") {
      return {
        title:       "Admin Intelligence | Einort Solutions",
        description: "Enterprise command center and project pipeline.",
      };
    }

    if (pathname === "/client-portal") {
      return {
        title:       "Client Portal | Einort Solutions",
        description: "Manage your ongoing projects, billing, and consultations.",
      };
    }

    if (pathname.startsWith("/locations/")) {
      const slug    = pathname.replace("/locations/", "");
      const region  = slug.replace(/-/g, " ");
      const label   = region.charAt(0).toUpperCase() + region.slice(1);
      return {
        title:       `Enterprise Software Development in ${label} | Einort Solutions`,
        description: `Einort Solutions delivers custom software development, AI automation, and premium UI/UX design services to businesses in ${label}.`,
      };
    }

    if (pathname.startsWith("/services/")) {
      const slug    = pathname.replace("/services/", "");
      const name    = slug.replace(/-/g, " ");
      const label   = name.charAt(0).toUpperCase() + name.slice(1);
      const base    = SERVICE_TITLES[slug] ?? `${label} Services`;
      return {
        title:       `${base} | Einort Solutions`,
        description: `Partner with Einort Solutions for enterprise-grade ${label.toLowerCase()}. We build scalable, production-ready solutions for global brands.`,
      };
    }

    if (pathname.startsWith("/industries/")) {
      const slug    = pathname.replace("/industries/", "");
      const name    = slug.replace(/-/g, " ");
      const label   = name.charAt(0).toUpperCase() + name.slice(1);
      return {
        title:       `${label} Software Solutions | Einort Solutions`,
        description: `Specialised web design and enterprise software for the ${label.toLowerCase()} sector by Einort Solutions.`,
      };
    }

    return {
      title:       SEO_CONFIG.title,
      description: SEO_CONFIG.description,
    };
  }, [location.pathname]);

  const metaTitle       = title       || routeConfig.title;
  const metaDescription = description || routeConfig.description;
  const url             = canonical   || `https://einort.com${location.pathname}`;
  const isProtected     = NOINDEX_PATHS.has(location.pathname);

  const defaultSchema = safeJsonLd([
    SEO_CONFIG.organizationSchema,
    {
      "@context":   "https://schema.org",
      "@type":      "WebPage",
      "@id":        `${url}#webpage`,
      name:         metaTitle,
      description:  metaDescription,
      url,
      isPartOf:     { "@id": "https://einort.com/#website" },
      dateModified: new Date().toISOString(),
      publisher: {
        "@type": "Organization",
        name:    "Einort Solutions",
        "@id":   "https://einort.com/#org",
      },
    },
  ]);

  return (
    <Helmet>
      <html lang={lang} />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Prevent search engines from indexing protected routes */}
      {isProtected && (
        <meta name="robots" content="noindex, nofollow, noarchive" />
      )}

      {/* Open Graph */}
      <meta property="og:type"        content={SEO_CONFIG.openGraph.type} />
      <meta property="og:title"       content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url"         content={url} />
      <meta property="og:site_name"   content={SEO_CONFIG.openGraph.siteName} />
      <meta property="og:image"       content="https://einort.com/og-cover.jpg" />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"    content="Einort Solutions — Elite Custom Software & Enterprise Web Architecture" />
      <meta property="og:image:type"   content="image/jpeg" />

      {/* Twitter / X */}
      <meta name="twitter:card"        content={SEO_CONFIG.twitter.cardType} />
      <meta name="twitter:title"       content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image"       content="https://einort.com/og-cover.jpg" />
      <meta name="twitter:image:alt"   content="Einort Solutions — Enterprise Software Agency" />

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* hrefLang: only include when regional URL variants actually exist.
          Pointing all alternates to the same URL is invalid and ignored by Google.
          Uncomment and populate when einort.co.uk / einort.ca are live.
      <link rel="alternate" hrefLang="x-default" href="https://einort.com/" />
      <link rel="alternate" hrefLang="en-US"     href="https://einort.com/" />
      <link rel="alternate" hrefLang="en-GB"     href="https://einort.co.uk/" />
      <link rel="alternate" hrefLang="en-CA"     href="https://einort.ca/" />
      */}

      {/* JSON-LD — output is sanitised by safeJsonLd to prevent </script> injection */}
      <script type="application/ld+json">{schema || defaultSchema}</script>
    </Helmet>
  );
}
