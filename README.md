# KC Dumpsters Demo Repo (V2)

Static multi-page demo for GitHub Pages.

## What changed in V2

- Reworked the copy so the site reads like a real operating website instead of a sales pitch
- Tightened the customer pages around service, notices, and contact flow
- Rebuilt the admin side to feel more like a dispatch / billing / ticket command center
- Upgraded the demo data so tables and boards feel more believable
- Kept the project static so it still deploys cleanly on GitHub Pages

## Pages

### Customer side
- `index.html`
- `roll-off.html`
- `rural-trash.html`
- `city-of-graham.html`
- `service-area.html`
- `route-updates.html`
- `request-quote.html`
- `contact.html`
- `customer-portal.html`

### Admin side
- `admin/login.html`
- `admin/dashboard.html`
- `admin/customers.html`
- `admin/quotes.html`
- `admin/dispatch.html`
- `admin/inventory.html`
- `admin/invoices.html`
- `admin/tickets.html`
- `admin/staff.html`
- `admin/reports.html`
- `admin/settings.html`

## Deploy to GitHub Pages

1. Create or open your GitHub repo.
2. Upload all files from this folder to the repo root.
3. Commit to the default branch.
4. In GitHub repo settings, open **Pages**.
5. Set source to **Deploy from a branch**.
6. Choose your main branch and `/root`.
7. Save.

## Notes

- This is a static preview. Forms do not send anywhere.
- The admin side is a front-end shell only.
- The production build should move to a real stack with auth, database, payments, roles, and live dispatch data.
