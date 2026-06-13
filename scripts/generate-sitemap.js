import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://einort.com';

const routes = [
  '/',
  '/services/enterprise-web',
  '/services/custom-software',
  '/services/saas',
  '/services/crm-erp',
  '/services/ai-automation',
  '/locations/usa',
  '/locations/canada',
  '/locations/europe',
  '/locations/united-kingdom',
  '/industries/healthcare',
  '/industries/finance',
  '/industries/real-estate',
  '/industries/retail',
  '/case-studies/global-logistics-erp',
  '/case-studies/fintech-mobile-app',
  '/case-studies/healthcare-portal',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

console.log('Sitemap generated successfully in public/sitemap.xml');
