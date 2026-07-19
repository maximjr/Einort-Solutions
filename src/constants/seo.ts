export const SEO_CONFIG = {
  title:
    "Einort Solutions | Elite Custom Software & Enterprise Web Architecture",
  description:
    "Einort Solutions is a premier enterprise software engineering agency based in Douala, Cameroon. We specialize in custom web development, ERP systems, AI automation, and premium UI/UX design across Cameroon, Africa, and globally.",
  keywords: [
    // Cameroon Specific Keywords (English)
    "Best Software Company in Cameroon",
    "Web Development Agency in Douala",
    "Top Web Designers in Yaounde",
    "Enterprise Software Development Cameroon",
    "Custom ERP Systems Cameroon",
    "Tech Company in Cameroon",
    "Einort Solutions Cameroon",
    "Top IT Company in Douala",
    "Software Engineers Cameroon",
    "Mobile App Development Cameroon",
    "Best Web Hosting Cameroon",
    "SEO Agency Douala",
    
    // Cameroon Specific Keywords (French)
    "Agence de création de site web au Cameroun",
    "Développement d'applications web Douala",
    "Entreprise de développement informatique Cameroun",
    "Création de logiciels sur mesure Cameroun",
    "Agence Web Douala",
    "Meilleure entreprise informatique au Cameroun",
    "Développement d'applications mobiles Cameroun",
    "Création de site e-commerce Cameroun",
    "Conception d'applications d'entreprise Douala",

    // Global English Keywords
    "Custom Software Development",
    "Enterprise Web Architecture",
    "ERP Systems Development",
    "AI Automation Solutions",
    "Premium UI/UX Design",
    "Full-Stack Systems Engineering",
    "SaaS Application Development",
    "Cloud Infrastructure Setup",
    "Legacy System Modernization",
    "Fintech Software Solutions",
    "Healthcare IT Solutions",
    "Retail Management Systems",
    "Web Development Agency",
    "React Development Company",
    "Next.js Development",
    "Global Software Agency",
    "Einort Solutions",
    
    // Global French Keywords
    "Développement de Logiciels sur Mesure",
    "Architecture Web d'Entreprise",
    "Développement de Systèmes ERP",
    "Solutions d'Automatisation IA",
    "Conception UI/UX Premium",
    "Ingénierie de Systèmes Full-Stack",
    "Développement d'Applications SaaS",
    "Configuration d'Infrastructure Cloud",
    "Modernisation de Systèmes Existants",
    "Solutions Logicielles Fintech",
    "Solutions Informatiques de Santé",
    "Systèmes de Gestion de Vente au Détail",
    "Agence de Développement Web",
    "Entreprise de Développement React",
    "Développement Next.js",
    "Agence Logicielle Mondiale",
    "Einort Solutions France"
  ].join(", "),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://einort.com/",
    siteName: "Einort Solutions",
    title: "Einort Solutions | Custom Web Apps & Enterprise Architecture Cameroon",
    description:
      "World-class software development, premium UI/UX design, and scalable cloud infrastructure for modern businesses in Cameroon and globally. Top web agency in Douala.",
  },
  twitter: {
    cardType: "summary_large_image",
    title: "Einort Solutions | Enterprise Software Agency Cameroon",
    description:
      "Premium enterprise software engineering and architecture for businesses in Cameroon and beyond.",
  },
  organizationSchema: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Einort Solutions",
    url: "https://einort.com",
    logo: "https://einort.com/icon.png",
    description:
      "Premier software engineering agency in Douala, Cameroon. Custom CRM & ERP solutions, and full-stack enterprise web development.",
    sameAs: [
      "https://twitter.com/einortsolutions",
      "https://linkedin.com/company/einortsolutions",
    ],
    areaServed: [
      "CM",
      "US",
      "CA",
      "GB",
      "DE",
      "FR",
    ],
    knowsAbout: [
      "Enterprise Software Architecture",
      "React Development",
      "ERP Development",
      "AI Automation",
      "Web Design",
      "UI/UX",
    ],
  },
  localBusinessSchema: {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: "Einort Solutions",
    image: "https://einort.com/icon.png",
    "@id": "https://einort.com",
    url: "https://einort.com",
    telephone: "+237686661578",
    email: "contact@einort.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Douala",
      addressLocality: "Douala",
      addressRegion: "Littoral Region",
      postalCode: "BP 0000",
      addressCountry: "CM"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 4.0511,
      longitude: 9.7085
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      opens: "08:00",
      closes: "18:00"
    },
    areaServed: {
      "@type": "Country",
      name: "Cameroon"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software Engineering Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Software Development"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Enterprise Web Architecture"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "ERP & CRM Systems Development"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI Automation Solutions"
          }
        }
      ]
    },
    sameAs: [
      "https://twitter.com/einortsolutions",
      "https://linkedin.com/company/einortsolutions"
    ]
  },
  websiteSchema: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Einort Solutions",
    url: "https://einort.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "{search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
};
