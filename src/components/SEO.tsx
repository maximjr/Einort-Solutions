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
}

export function SEO({
  title = "EINORT SOLUTIONS | Future-Forward Digital Architecture",
  description = "EINORT SOLUTIONS architects immersive web experiences, deep tech ecosystems, and scalable infrastructure designed to dominate markets and inspire generations.",
  type = "website",
  name = "EINORT SOLUTIONS",
  image = "https://i.imgur.com/6V1ecDU.png",
  url = "https://einort.com",
  canonical,
  keywords = "enterprise digital architecture, UI/UX design agency, deep tech solutions, scalable infrastructure, web development, cloud platform engineering, futuristic UI"
}: SEOProps) {
  const metaTitle = title.includes("EINORT") ? title : `${title} | EINORT SOLUTIONS`;
  const canonicalUrl = canonical || url;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${url}/#organization`,
        "name": "EINORT SOLUTIONS",
        "url": url,
        "logo": {
          "@type": "ImageObject",
          "url": image,
          "width": 512,
          "height": 512
        },
        "description": description,
        "image": image,
        "priceRange": "$$$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Virtual HQ",
          "addressLocality": "Global",
          "addressCountry": "US"
        },
        "sameAs": [
          "https://twitter.com/einortsolutions",
          "https://linkedin.com/company/einort"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "hello@einort.com",
          "availableLanguage": ["English"]
        }
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        "url": url,
        "name": metaTitle,
        "publisher": {
          "@id": `${url}/#organization`
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <html lang="en" />
      <title>{metaTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="theme-color" content="#020617" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />
      {/* End standard metadata tags */}
      
      {/* Open Graph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
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
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
