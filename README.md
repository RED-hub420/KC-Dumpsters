# KC Dumpsters Demo Repo

Static multi-page demo built for GitHub Pages.

## What is included

### Customer side
- Homepage
- Roll-off service page
- Rural trash page
- City of Graham information page
- Service area page
- Route updates page
- Request service form
- Contact page
- Customer portal concept

### Admin side
- Login screen
- Dashboard
- Customers
- Quotes
- Dispatch
- Inventory
- Invoices
- Tickets
- Staff
- Reports
- Settings

## Stack
- Plain HTML
- Shared CSS
- Vanilla JavaScript
- JSON seed data
- GitHub Pages compatible

## Deploy to GitHub Pages

1. Create a new GitHub repo.
2. Upload all files in this folder to the repo root.
3. Commit to `main`.
4. In GitHub, go to **Settings -> Pages**.
5. Under **Build and deployment**, set:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
6. Save. GitHub Pages will publish the site.

## Preview locally

Because the admin pages fetch JSON files, do not preview by double-clicking the HTML files directly.

Use a local server instead:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## Notes
- This is a front-end demo only.
- Forms are mocked.
- Admin login is mocked.
- Data is seeded from static JSON files in `/data`.
- Ready to show as a serious concept demo.
- Best next production stack: Next.js + Supabase + Stripe + map/route tooling.
