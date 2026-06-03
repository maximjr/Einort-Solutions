# 🚀 EINORT Solutions - Production Deployment Checklist

This project is configured and heavily optimized for deployment via Vercel, Netlify, or any static SPA host.

## 1. Platform Configuration (Vercel)
- [x] `vercel.json` included in repository root for proper React Router SPA rewriting.
- [x] Node.js version set to 20.x or higher in environment settings.
- [x] Build Command: `npm run build`
- [x] Install Command: `npm install`
- [x] Output Directory: `dist`

## 2. Environment Variables
Ensure the following variables are securely added to your hosting environment:
- `VITE_FIREBASE_API_KEY`: Sourced from your Firebase Configuration.
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

*(The `.env.example` file provides the exact keys required).*

## 3. SEO & Performance Validations
- [x] **Lighthouse Score Targeting**: Lazy loading (via `React.lazy`/`Suspense`) configured for off-screen components (`Testimonials`, `WhyChooseUs`, `ContactForm`).
- [x] **Semantic HTML**: Sections use strictly standard semantic landmarks (`<nav>`, `<header>`, `<footer>`, `<main>`, `<section>`, `<article>`).
- [x] **Metadata**: `react-helmet-async` implemented to map OpenGraph and standard title elements dynamically across the application tree.
- [x] **CSS Animations**: Hardware-accelerated CSS transform-based motion logic, mapped down to `Framer Motion` standards, respecting user `reduced-motion` queries.

## 4. Accessibility
- [x] All complex UI interactive elements (like the mobile hamburger menu toggle, password visibility eye toggles) possess distinct `aria-labels` and `aria-expanded` attributes.
- [x] High contrast requirements achieved with the standard dark mode theme and Slate/Primary gradients.

## 5. Security Restrictions
- [x] Firebase SDK keys are standardly configured. No sensitive server-side database keys (e.g. Firebase Admin service accounts) are committed or exposed within the React bundle.
- [x] Zod implemented on the Contact and Authentication forms to cleanly prevent malicious execution client-side.

**All manual review QA checks have passed successfully.**
