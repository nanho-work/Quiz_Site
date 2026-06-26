# Koofy Lab Website

Koofy Lab is the home site for Koofy products: games, mobile apps, AI-powered tools, and lightweight web utilities.

The project was originally created as `Quiz_Site`, but the current direction is a Koofy Lab brand and product landing page.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- lucide-react icons

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Scripts

```bash
npm run build
npm run start
```

## Notes

- `app/page.tsx` is the main Koofy Lab landing page.
- Site copy is managed through `lib/i18n.ts` with English, Korean, Japanese, and Chinese variants.
- `components/LanguageProvider.tsx` stores the selected language in local storage and updates the page language.
- `/bus-pop/privacy` is preserved for the Bus Pop mobile app.
- `public/ads.txt` and `public/app-ads.txt` are preserved for ads and app store requirements.
- Older quiz and calculator routes may still exist in the codebase, but they are no longer promoted from the main landing page or sitemap.
