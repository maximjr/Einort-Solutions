import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "../../constants/seo";
import { useMemo } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  schema?: string;
  lang?: string;
}

export function SEO({
  title,
  description,
  canonical,
  schema,
  lang = "en",
}: SEOProps = {}) {
  const location = useLocation();

  const routeConfig = useMemo(() => {
    switch (location.pathname) {
      case "/":
        return {
          title:
            "Einort Solutions | Elite Custom Software & Enterprise Web Architecture",
          description:
            "Einort Solutions provides world-class enterprise software architecture, full-stack systems engineering, and scalable cloud infrastructure for modern businesses globally.",
        };
      case "/admin":
        return {
          title: "Admin Intelligence | Einort Solutions",
          description: "Enterprise command center and project pipeline.",
        };
      case "/client-portal":
        return {
          title: "Client Portal | Einort Solutions",
          description:
            "Manage your ongoing projects, billing, and consultations.",
        };
      default:
        if (location.pathname.startsWith("/locations/")) {
          const region = location.pathname
            .replace("/locations/", "")
            .replace(/-/g, " ");
          const formattedRegion =
            region.charAt(0).toUpperCase() + region.slice(1);
          return {
            title: `Enterprise Web Development & Software Engineering in ${formattedRegion} | Einort Solutions`,
            description: `Einort Solutions delivers world-class custom software development, AI automation, and premium UI/UX design services to businesses in ${formattedRegion}.`,
          };
        }
        if (location.pathname.startsWith("/services/")) {
          const serviceName = location.pathname
            .replace("/services/", "")
            .replace(/-/g, " ");
          const formattedService =
            serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
          return {
            title: `${formattedService} Services | Best ${formattedService} Company | Einort Solutions`,
            description: `Partner with Einort Solutions for premium ${formattedService}. We build scalable, enterprise-grade applications and digital automation systems for global brands.`,
          };
        }
        if (location.pathname.startsWith("/industries/")) {
          const industryName = location.pathname
            .replace("/industries/", "")
            .replace(/-/g, " ");
          const formattedIndustry =
            industryName.charAt(0).toUpperCase() + industryName.slice(1);
          return {
            title: `${formattedIndustry} Web Development & Custom Software Architecture | Einort Solutions`,
            description: `Specialized cutting-edge web design and enterprise software solutions for the ${formattedIndustry} sector by Einort Solutions.`,
          };
        }
        return {
          title: SEO_CONFIG.title,
          description: SEO_CONFIG.description,
        };
    }
  }, [location.pathname]);

  const metaTitle = title || routeConfig.title;
  const metaDescription = description || routeConfig.description;
  const url = canonical || `https://einort.com${location.pathname}`;

  const breadcrumbs = useMemo(() => {
    const paths = location.pathname.split("/").filter(Boolean);
    const itemListElement = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://einort.com/",
      },
    ];

    let currentPath = "";
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const name = path
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      itemListElement.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": name,
        "item": `https://einort.com${currentPath}`,
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: itemListElement,
    };
  }, [location.pathname]);

  const defaultSchemaArray = useMemo(() => [
    SEO_CONFIG.organizationSchema,
    SEO_CONFIG.localBusinessSchema,
    SEO_CONFIG.websiteSchema,
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: metaTitle,
      description: metaDescription,
      url: url,
    },
    breadcrumbs,
  ], [metaTitle, metaDescription, url, breadcrumbs]);

  const finalSchema = useMemo(() => {
    if (schema) {
      try {
        const parsedSchema = JSON.parse(schema);
        if (Array.isArray(parsedSchema)) {
          return JSON.stringify([...defaultSchemaArray, ...parsedSchema]);
        }
        return JSON.stringify([...defaultSchemaArray, parsedSchema]);
      } catch (e) {
        return JSON.stringify(defaultSchemaArray);
      }
    }
    return JSON.stringify(defaultSchemaArray);
  }, [schema, defaultSchemaArray]);

  return (
    <Helmet>
      <html lang={lang} />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph */}
      <meta property="og:type" content={SEO_CONFIG.openGraph.type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SEO_CONFIG.openGraph.siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content={SEO_CONFIG.twitter.cardType} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />

      {/* Canonical and Multilingual SEO */}
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      <link rel="alternate" hrefLang="en-US" href={url} />
      <link rel="alternate" hrefLang="en-CA" href={url} />
      <link rel="alternate" hrefLang="en-GB" href={url} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: finalSchema }} />
    </Helmet>
  );
}
