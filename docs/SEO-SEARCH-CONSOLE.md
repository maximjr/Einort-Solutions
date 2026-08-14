# Google Search Console Setup Guide for EINORT Solutions

## Overview
This document outlines the workflow for verifying and managing EINORT Solutions' presence on Google Search Console (GSC). 
The application has been structurally optimized, but these steps must be performed by the domain owner to complete indexing.

## 1. Domain Verification
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property**.
3. Select **Domain Property** (recommended) or **URL prefix**.
   - **Domain Property:** Enter `einortsolutions.com`. You will need to add a TXT record to your DNS provider.
   - **URL Prefix:** Enter `https://einortsolutions.com`. You can verify via HTML tag or Google Analytics if already linked.

## 2. Sitemap Submission
Once verified:
1. Navigate to **Sitemaps** in the left sidebar.
2. Enter `sitemap.xml` in the "Add a new sitemap" field.
3. Click **Submit**.
4. GSC will periodically crawl the sitemap to discover the English (`/en/`) and French (`/fr/`) structures.

## 3. URL Inspection & Indexing Workflow
If you publish a new case study or insight article:
1. Copy the full URL (e.g., `https://einortsolutions.com/en/insights/new-article`).
2. Paste it into the top search bar in GSC (URL Inspection Tool).
3. If not indexed, click **Request Indexing**.

## 4. Internationalization & Hreflang
The site uses `hreflang` tags to indicate language versions (`en`, `fr`, and `x-default`).
- Monitor the **International Targeting** report in GSC (under Legacy tools) or watch for hreflang errors in the **Page Indexing** report.
- Do NOT canonicalize French pages to English or vice versa. They are distinct, valid pages.

## 5. Performance Monitoring
- Monitor **Core Web Vitals** under the Experience tab.
- Mobile Usability issues will appear here if any viewport or touch-target problems arise.

## 6. Common SEO Problems
- **Discovered - currently not indexed:** Google found the page but hasn't crawled it yet. Usually resolves itself over time or with better internal linking.
- **Crawled - currently not indexed:** Google crawled it but decided not to index it yet. Improve the content quality or internal linking.
- **Duplicate without user-selected canonical:** Check if a query parameter URL is being indexed. The strict canonical tags implemented in the site should prevent this.
