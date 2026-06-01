import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  name?: string;
  image?: string;
  url?: string;
  canonical?: string;
  keywords?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string[];
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
  isService?: boolean;
}

export function SEO({
  title = "EINORT SOLUTIONS | Premium Digital Agency & Software Architecture",
  description = "EINORT SOLUTIONS is a world-class digital agency engineering enterprise web applications, premium UI/UX, and highly scalable software solutions.",
  type = "website",
  name = "EINORT SOLUTIONS",
  image = "https://i.imgur.com/6V1ecDU.png",
  url = "https://einort.com",
  canonical,
  keywords = "web development company, custom software development, UI/UX agency, digital transformation agency, enterprise software development, premium web design agency",
  article,
  breadcrumbs,
  isService = false,
}: SEOProps) {
  const metaTitle = title.includes("EINORT") ? title : `${title} | EINORT SOLUTIONS`;
  const canonicalUrl = canonical || url;
  
  // High-value global and local keywords
  const finalKeywords = [keywords, 
    "Software Development Agency", 
    "Custom Web Application Developer", 
    "Premium SaaS Development Firm", 
    "Elite Software Architects",
    "Digital Transformation Strategy",
    "Enterprise Software Solutions",
    "Premium Web Development"
  ].filter(Boolean).join(", ");

  const baseSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfessionalService", "Organization"],
        "@id": `${url}/#organization`,
        "name": "EINORT SOLUTIONS",
        "url": "https://einort.com",
        "logo": {
          "@type": "ImageObject",
          "url": image,
          "width": 512,
          "height": 512
        },
        "description": "World-class digital agency engineering enterprise web applications and software solutions globally.",
        "image": image,
        "priceRange": "$$$$",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "Global Presence"
        },
        "sameAs": [
          "https://twitter.com/einortsolutions",
          "https://linkedin.com/company/einort"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "hello@einort.com",
          "availableLanguage": ["English", "Spanish", "French", "German"]
        }
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        "url": "https://einort.com",
        "name": "EINORT SOLUTIONS",
        "publisher": {
          "@id": "https://einort.com/#organization"
        }
      }
    ]
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    baseSchema["@graph"].push({
      "@type": "BreadcrumbList",
      "@id": `${url}/#breadcrumb`,
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@id": crumb.url,
          "name": crumb.name
        }
      }))
    } as any);
  }

  if (isService) {
    baseSchema["@graph"].push({
      "@type": "Service",
      "name": metaTitle,
      "provider": {
        "@id": "https://einort.com/#organization"
      },
      "description": description,
      "serviceType": "Digital Agency Services"
    } as any);
  }

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <html lang="en-US" />
      <title>{metaTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* International SEO */}
      <link rel="alternate" hrefLang="en-US" href={`${canonicalUrl}`} />
      <link rel="alternate" hrefLang="en-GB" href={`${canonicalUrl}`} />
      <link rel="alternate" hrefLang="en-CA" href={`${canonicalUrl}`} />
      <link rel="alternate" hrefLang="en-AE" href={`${canonicalUrl}`} />
      <link rel="alternate" hrefLang="x-default" href={`${canonicalUrl}`} />
      {/* End standard metadata tags */}
      
      {/* Open Graph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={name} />
      {/* End Open Graph tags */}

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@einortsolutions" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {/* End Twitter tags */}

      <script type="application/ld+json">
        {JSON.stringify(baseSchema)}
      </script>
    </Helmet>
  );
}
