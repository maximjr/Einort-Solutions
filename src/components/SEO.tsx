import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  name?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title = "EINORT SOLUTIONS | Future-Forward Digital Architecture",
  description = "EINORT SOLUTIONS engineers high-performance ecosystems, immersive web experiences, and scalable AI infrastructure for the world's most ambitious enterprise brands.",
  type = "website",
  name = "EINORT SOLUTIONS",
  image = "https://i.imgur.com/6V1ecDU.png",
  url = "https://einort.com"
}: SEOProps) {
  const metaTitle = title.includes("EINORT") ? title : `${title} | EINORT SOLUTIONS`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EINORT SOLUTIONS",
    "url": url,
    "logo": image,
    "description": description,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{metaTitle}</title>
      <meta name='description' content={description} />
      {/* End standard metadata tags */}
      
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={name} />
      {/* End Facebook tags */}

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
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
