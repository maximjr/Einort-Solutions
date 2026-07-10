import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "../../constants/seo";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation("seo");

  const normalizedPath = useMemo(() => {
    return location.pathname.replace(/^\/(en|fr)/, "") || "/";
  }, [location.pathname]);

  const routeConfig = useMemo(() => {
    switch (normalizedPath) {
      case "/":
        return {
          title: t("home.title"),
          description: t("home.description"),
        };
      case "/admin":
        return {
          title: t("admin.title"),
          description: t("admin.description"),
        };
      case "/client-portal":
        return {
          title: t("client_portal.title"),
          description: t("client_portal.description"),
        };
      default:
        if (normalizedPath.startsWith("/locations/")) {
          const region = normalizedPath
            .replace("/locations/", "")
            .replace(/-/g, " ");
          const formattedRegion =
            region.charAt(0).toUpperCase() + region.slice(1);
          return {
            title: t("locations.title", { region: formattedRegion }),
            description: t("locations.description", { region: formattedRegion }),
          };
        }
        if (normalizedPath.startsWith("/services/")) {
          const serviceName = normalizedPath
            .replace("/services/", "")
            .replace(/-/g, " ");
          const formattedService =
            serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
          return {
            title: t("services.title", { service: formattedService }),
            description: t("services.description", { service: formattedService }),
          };
        }
        if (normalizedPath.startsWith("/industries/")) {
          const industryName = normalizedPath
            .replace("/industries/", "")
            .replace(/-/g, " ");
          const formattedIndustry =
            industryName.charAt(0).toUpperCase() + industryName.slice(1);
          return {
            title: t("industries.title", { industry: formattedIndustry }),
            description: t("industries.description", { industry: formattedIndustry }),
          };
        }
        return {
          title: t("default.title"),
          description: t("default.description"),
        };
    }
  }, [normalizedPath, t]);

  const currentLang = i18n.resolvedLanguage || lang;
  
  const basePath = location.pathname.replace(/^\/(en|fr)/, '');
  const urlEn = `https://einort.com/en${basePath === '' ? '' : basePath}`;
  const urlFr = `https://einort.com/fr${basePath === '' ? '' : basePath}`;
  
  const url = canonical || (currentLang === 'fr' ? urlFr : urlEn);
  
  const metaTitle = title || routeConfig.title;
  const metaDescription = description || routeConfig.description;

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
      <html lang={currentLang} />
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
      <link rel="alternate" hrefLang="x-default" href={urlEn} />
      <link rel="alternate" hrefLang="en" href={urlEn} />
      <link rel="alternate" hrefLang="fr" href={urlFr} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: finalSchema }} />
    </Helmet>
  );
}
