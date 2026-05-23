export const generateOrganizationSchema = (url: string, logo: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "EINORT SOLUTIONS",
  "url": url,
  "logo": logo,
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
});

export const generateLocalBusinessSchema = (url: string, location: string) => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": `EINORT SOLUTIONS ${location}`,
  "url": url,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": location,
    "addressCountry": "US" // Dynamic based on region if needed
  },
  "priceRange": "$$$$"
});

export const generateFAQSchema = (faqs: {question: string, answer: string}[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
