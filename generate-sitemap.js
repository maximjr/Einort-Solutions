import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://einort.com';
const srcDir = path.join(__dirname, 'src');

const publicRoutes = new Set(['/']);

// 1. Extract static routes from App.tsx
const appTsxContent = fs.readFileSync(path.join(srcDir, 'App.tsx'), 'utf-8');
const routeRegex = /<Route[^>]+(path=["']([^"']+)["']|index)[^>]*>/g;
let match;
while ((match = routeRegex.exec(appTsxContent)) !== null) {
  if (match[2]) {
    const p = match[2];
    if (!p.includes(':') && !p.includes('*') && p !== 'admin' && p !== 'client-portal') {
      publicRoutes.add(p.startsWith('/') ? p : `/${p}`);
    }
  }
}

// 2. Discover dynamic routes by crawling the codebase for all explicit links
function crawlFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      crawlFiles(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const linkRegexes = [
        /to=["'](\/[^"']*)["']/g,
        /href=["'](\/[^"']*)["']/g,
        /to=\{[\`'"](\/[^\`'"]*)[\`'"]\}/g
      ];

      for (const regex of linkRegexes) {
        let linkMatch;
        while ((linkMatch = regex.exec(content)) !== null) {
          let routePath = linkMatch[1];
          // Extrapolate exact path without hash or query string
          routePath = routePath.split('#')[0].split('?')[0];
          
          if (
            routePath && 
            routePath !== '/' &&
            !routePath.includes('$') && 
            !routePath.includes(':') && 
            !routePath.startsWith('/admin') && 
            !routePath.startsWith('/client-portal')
          ) {
            publicRoutes.add(routePath);
          }
        }
      }
    }
  }
}

if (fs.existsSync(srcDir)) {
  crawlFiles(srcDir);
}

// 3. Fallback discovery for dynamically derived data objects that might not be explicitly linked with <Link>
const dynamicParams = {
  ':serviceId': ['enterprise-web', 'custom-software', 'saas', 'crm-erp', 'ai-automation', 'ui-ux'],
  ':region': ['usa', 'canada', 'europe', 'united-kingdom'],
  ':industry': ['healthcare', 'finance', 'real-estate', 'retail'],
  ':caseId': ['global-logistics-erp', 'fintech-mobile-app', 'healthcare-portal']
};

let appTsxPaths = [];
let m;
const routeRegex2 = /<Route[^>]+path=["']([^"']+)["'][^>]*>/g;
while ((m = routeRegex2.exec(appTsxContent)) !== null) {
  appTsxPaths.push(m[1].startsWith('/') ? m[1] : `/${m[1]}`);
}

for (const routePath of appTsxPaths) {
  if (routePath.includes(':') && !routePath.includes('*')) {
    let generatedPaths = [routePath];
    for (const [param, values] of Object.entries(dynamicParams)) {
      if (routePath.includes(param)) {
        const newPaths = [];
        for (const curPath of generatedPaths) {
          for (const val of values) {
            newPaths.push(curPath.replace(param, val));
          }
        }
        generatedPaths = newPaths;
      }
    }
    // Add these combinations if they are public
    if (!routePath.startsWith('/admin') && !routePath.startsWith('/client-portal')) {
        generatedPaths.forEach(gp => publicRoutes.add(gp));
    }
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(publicRoutes)
  .sort()
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route === '/' ? '' : route}</loc>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

const publicDir = path.resolve(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully by crawling React Router configuration!');
