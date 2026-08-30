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
# KoofyLab Website & Admin Console

## Admin console

The shared operations console lives under `app/admin` and is served from
`https://admin.koofy.co.kr`. The domain root is rewritten to `/admin`; project pages remain
modular under `app/admin/projects/<project-id>`.

The first connected project is Slime Strike Force. Browser code never receives Firebase Admin
credentials and never reads Firestore directly. It signs in with Firebase Google Auth and calls
App-Check-protected, role-checked Cloud Functions in `asia-northeast3`.

### Required Firebase/Vercel setup

1. Register a Web App in the existing `slimestrikeforce` Firebase project.
2. Add `admin.koofy.co.kr` and `localhost` to Firebase Authentication authorized domains.
3. Register the Web App with App Check using reCAPTCHA Enterprise and allow
   `admin.koofy.co.kr`.
4. Copy `.env.example` values into Vercel Production environment variables and `.env.local` for
   local development. Firebase Web configuration and the reCAPTCHA site key are public
   identifiers; never add a service-account JSON file.
5. Sign in once with the intended Google admin account, then grant that Firebase UID merged custom
   claims on a privileged server: `superAdmin`, `supportAdmin`, `mailAdmin`, and later
   `financeAdmin`. Force an ID-token refresh or sign out and back in afterward.
6. Deploy the corresponding Functions, Firestore rules, and indexes from the game backend before
   using live account or mailbox screens.

### Adding another project

Add its descriptor and navigation to `lib/admin/projects.ts`, then add isolated pages and feature
components beneath `app/admin/projects/<project-id>` and `components/admin/<project-id>`. Keep
authentication, shell layout, shared cards/notices, and project selection reusable.
