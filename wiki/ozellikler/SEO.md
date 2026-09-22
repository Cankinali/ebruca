---
tags: [ozellik]
---

# SEO

- Sabitler: `src/lib/seo.ts` (`SITE`, `absoluteUrl`)
- Kök metadata ve JSON-LD (`Store`, `WebSite` + SearchAction): `src/app/layout.tsx`
- Ürün: `Product` + `BreadcrumbList` JSON-LD, `src/app/urun/[slug]/page.tsx`
- `src/app/sitemap.ts` (statik sayfalar + kategoriler + DB ürünleri), `robots.ts`
- OG görseli dinamik: `opengraph-image.tsx`
- Google Search Console doğrulaması: `GOOGLE_SITE_VERIFICATION`

Meta alan adı doğrulaması aynı yolla yapılabilir: `metadata.verification.other['facebook-domain-verification']` ya da DNS TXT → [[Meta-Pixel-ve-CAPI]]
