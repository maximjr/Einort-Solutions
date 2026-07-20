const fs = require('fs');

const BASE_URL = 'https://einort.com';

const routes = [
  '',
  '/contact',
  '/services/custom-software',
  '/services/crm-erp',
  '/services/saas',
  '/services/ui-ux',
  '/services/enterprise-web',
  '/services/ai-automation',
  '/locations/usa',
  '/locations/canada',
  '/locations/europe',
  '/locations/united-kingdom',
  '/industries/finance',
  '/industries/healthcare',
  '/industries/real-estate',
  '/industries/retail',
  '/case-studies/fintech-mobile-app',
  '/case-studies/healthcare-portal',
  '/case-studies/global-logistics-erp',
];

const generateUrlEntry = (route) => {
  const enUrl = `${BASE_URL}/en${route}`;
  const frUrl = `${BASE_URL}/fr${route}`;
  const defaultUrl = enUrl; // default fallback

  return `
  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
    <changefreq>${route === '' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>
  <url>
    <loc>${frUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
    <changefreq>${route === '' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes.map(generateUrlEntry).join('')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap.trim());
console.log('Sitemap successfully generated at public/sitemap.xml');
