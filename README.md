# Arpan Sahu — Portfolio (Static, Free-Hosted)

A modern, zero-backend, always-on rebuild of the `arpansahu_dot_me` Django portfolio.
Plain HTML/CSS/JS — no build step, no server, no database. Content (projects, stack,
resume) is pulled from `data/projects.json` and the copied assets under `assets/`.

Why this exists: the original portfolio is a full Django app that depends on the
home-server stack (Postgres/Redis/MinIO/Nginx/K3s). If the home server or Airtel
connection goes down, the portfolio goes down with it. This static version is
content-equivalent but hosts for **$0/forever** on any static host, independent of
the home server's uptime.

## Local preview

```sh
cd arpansahu_portfolio_static
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy for free — pick one

### Option A: GitHub Pages (recommended, zero config beyond one setting)
1. Push this folder as its own repo, e.g. `arpansahu/portfolio`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow at `.github/workflows/deploy.yml` builds & deploys on every
   push to `main`. Your site will be live at `https://<user>.github.io/portfolio/`.
4. To use `arpansahu.space` (or a subdomain like `www.arpansahu.space`) instead:
   - Add a `CNAME` file at the repo root containing your domain.
   - In Cloudflare DNS, add a `CNAME` record pointing the subdomain to
     `<user>.github.io`, proxy status "DNS only" (grey cloud) while GitHub issues
     the cert, then re-enable the orange cloud once HTTPS is active in Pages settings.

### Option B: Cloudflare Pages (also free, faster global CDN, easiest custom domain)
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Framework preset: **None**. Build command: *(empty)*. Output directory: `/`.
3. Attach your `arpansahu.space` subdomain directly in Pages custom domains —
   since your DNS is already on Cloudflare, this is a one-click, auto-SSL setup.

### Option C: Vercel / Netlify
Same idea — "no framework", output directory `/`, connect the repo, done. Both are
free for personal/hobby projects.

## Updating content
- Edit `data/projects.json` to add/update/remove project cards (title, github link,
  live demo link, bullet points, image filename under `assets/img/projects/`).
- Edit the About/Experience sections directly in `index.html`.
- Replace `assets/pdfs/resume.pdf` to update the downloadable resume.
- Replace the Formspree form ID in `index.html` (`action="https://formspree.io/f/..."`)
  with your own free Formspree form endpoint (50 submissions/month free), or swap the
  form for a `mailto:` link if you'd rather not depend on a third party.

## What's intentionally NOT here
No Postgres, Redis, MinIO, Celery, Jenkins, Docker, or Kubernetes — that's the point.
This site has no backend to keep alive, patch, or pay for.
