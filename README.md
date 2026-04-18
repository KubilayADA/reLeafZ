This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# reLeafZ


# note: (sanket advice)

DOOH SAKITO has a plug know the guys from HYGH
elevator pitch 

for marketplace dual side card user hover other side shows with strain relevabt info 
for mobile “i” then back of card shows with info

listen option explaining the strains  

## Local Access Bypass (Form + Marketplace)

Use this if you want local access without the postcode/session gate.

- Toggle file: `src/lib/devAccess.ts`
  - `ENABLE_LOCAL_ACCESS_BYPASS = true` enables local bypass
  - `ENABLE_LOCAL_ACCESS_BYPASS = false` disables it
  - Bypass only applies on `localhost` / `127.0.0.1`

  to remove it go to @devAccess.ts and set it to true to be able to access and false to turn it off  in lib

  To remove this feature later, search for: 

`LOCAL ACCESS BYPASS BLOCK START`

### Where code was changed

- `src/lib/devAccess.ts`
  - Added toggle helper functions
  - Wrapped with `LOCAL ACCESS BYPASS BLOCK START/END` comments

- `src/app/form/page.tsx`
  - Added local fallback query values
  - Added local postcode validation bypass path
  - Wrapped each changed region with `LOCAL ACCESS BYPASS BLOCK START/END` comments

- `src/app/marketplace/page.tsx`
  - Added demo treatment request + demo marketplace fallback data
  - Added local seeding of `sessionStorage.treatmentRequest`
  - Added local fallback behavior when marketplace API fails
  - Wrapped each changed region with `LOCAL ACCESS BYPASS BLOCK START/END` comments

- `src/form/mashallah.tsx`
  - Added local bypass for treatment submit (skips backend call when enabled)
  - Added local bypass for auth/OTP step (routes directly to questionnaire when enabled)
  - Stores treatment request in both `localStorage` and `sessionStorage`
  - Wrapped each changed region with `LOCAL ACCESS BYPASS BLOCK START/END` comments


