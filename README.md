# KC Dumpsters Review Build v4

Static multi-page website and admin preview built for GitHub Pages.

## What changed in v3
- Replaced the cropped wordmark with the full KC Dumpsters logo provided in chat
- Tightened the customer-side copy so it reads like an operating website instead of a pitch
- Grounded the city, rural, and roll-off pages more closely in the company’s current public service details
- Cleaned up admin naming so it feels more like a real operations workspace
- Fixed the broken customer-form link inside the admin ticket page
- Kept the project static so it still deploys cleanly on GitHub Pages

## Structure
- Customer site pages at repo root
- Admin pages inside `/admin`
- Shared styling and scripts in `/assets`
- Seed data in `/data`

## Deploy to GitHub Pages
1. Create or open your GitHub repo
2. Upload all files from this folder
3. In GitHub, go to **Settings → Pages**
4. Set the source to deploy from the main branch root
5. Save and wait for publish

## Notes
- Forms are front-end only in this review build
- Admin sign-in uses a local browser-only preview flow
- A production build should move to a real stack with auth, database, payments, roles, and live dispatch data
