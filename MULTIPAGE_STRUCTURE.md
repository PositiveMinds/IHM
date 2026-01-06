# HealthFlow AI - Multi-Page Website Structure

## Overview
Your website has been converted from a single-page design to a professional multi-page structure. This improves SEO, user experience, and code organization.

## Directory Structure
```
e:/IHM/IHM/
├── index.html                 # Home page
├── styles.css                 # Shared stylesheet
├── pages/
│   ├── how-it-works.html     # How It Works page
│   ├── features.html         # Features/Modules page
│   ├── dashboard.html        # Dashboard page
│   ├── pricing.html          # Pricing page
│   ├── mobile-app.html       # Mobile App page
│   ├── about.html            # About page
│   └── contact.html          # Contact page
├── js/
│   └── script.js             # Shared JavaScript file
└── [other files]
```

## Pages Overview

### 1. **index.html** (Home Page)
- Hero section with carousel
- Problem section highlighting healthcare challenges
- Call-to-action section
- Footer with quick links
- Entry point for all visitors

### 2. **pages/how-it-works.html**
- 5-step process flow
- Key features section
- Feature cards (AI-Powered, Multi-Channel, HIPAA Compliant, etc.)
- CTA to schedule demo

### 3. **pages/features.html**
- 6 integrated modules:
  - HIV Management
  - Chronic Disease Management
  - Maternal Health
  - Appointment Management
  - Automated Reporting
  - Mobile Synchronization
- Module comparison table
- Module availability by plan

### 4. **pages/dashboard.html**
- Dashboard features overview
- Mock dashboard interface
- Key metrics display
- Analytics features
- CTA to request demo

### 5. **pages/pricing.html**
- 3 pricing tiers:
  - Starter (UGX 1,397,000/month)
  - Professional (UGX 2,796,000/month)
  - Enterprise (UGX 5,250,000/month)
- Feature comparison table
- Free trial highlights

### 6. **pages/mobile-app.html**
- Mobile app features
- App highlights
- Phone mockup display
- Download buttons for App Store & Google Play
- Offline access & sync capabilities

### 7. **pages/about.html**
- Company mission
- Why choose HealthFlow AI (6 trust cards)
- Impact metrics
- Core values (6 value cards)
- Team introduction

### 8. **pages/contact.html**
- Contact form
- Contact information cards (Email, WhatsApp, Location, Response Time)
- FAQ section with collapsible items
- Form validation
- Trust badges (Free Trial, No Credit Card, Expert Support)

## Navigation Structure
All pages include:
- **Navbar** with links to all pages
- **Footer** with quick links and legal information
- Consistent header and layout
- Mobile menu toggle

## Key Changes from Single Page

### Before
- One large HTML file (~1061 lines)
- All sections on one page
- SEO disadvantage (no separate page titles)
- Harder to maintain

### After
- **8 separate HTML files** (cleaner organization)
- Each page has its own `<title>` tag for SEO
- Dedicated pages for specific topics
- Easier to update individual sections
- Better user experience with focused content

## Technical Notes

### Relative Paths
Pages in the `pages/` folder use relative paths to access shared resources:
- `<link rel="stylesheet" href="../styles.css">` (go up one directory)
- `<script src="../js/script.js"></script>`
- Links: `<a href="../index.html">` (to home)
- Links: `<a href="about.html">` (to other pages in pages folder)

### Shared Resources
- **styles.css** - All styling (unchanged, in root)
- **js/script.js** - All JavaScript functionality
- Both are referenced from all pages

## Navigation Flow
```
index.html
  ├─→ pages/how-it-works.html
  ├─→ pages/features.html
  ├─→ pages/dashboard.html
  ├─→ pages/pricing.html
  ├─→ pages/mobile-app.html
  ├─→ pages/about.html
  └─→ pages/contact.html
```

All pages link back to index.html and to each other through the navigation bar.

## Next Steps (Optional Enhancements)

1. **Add Individual Page Analytics**
   - Track which pages users visit most
   - Monitor conversion funnels

2. **Create Additional Pages**
   - Blog/Resources
   - Case Studies
   - Testimonials
   - Documentation/Help

3. **Optimize for SEO**
   - Add meta descriptions to each page
   - Create XML sitemap
   - Add schema markup

4. **Add Dynamic Navigation**
   - Highlight active page in navbar
   - Add breadcrumb navigation

5. **Mobile Optimization**
   - Test responsive design on all pages
   - Ensure hamburger menu works on all pages

## Testing Checklist

- [ ] Click through all navigation links
- [ ] Verify all page titles display correctly
- [ ] Check responsive design on mobile/tablet
- [ ] Test form submission on contact page
- [ ] Verify carousel works on home page
- [ ] Check all CSS and JS load correctly
- [ ] Test hamburger menu on all pages
- [ ] Verify footer links work
- [ ] Test smooth scrolling where applicable

## File Sizes
- index.html: ~4KB
- Each pages/*.html: ~6-8KB
- styles.css: Unchanged
- js/script.js: Unchanged

Total size remains similar, but better organized!
