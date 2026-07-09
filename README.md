# OpenFootlab — production site

Static, dependency-free marketing site for **OpenFootlab**, ready to deploy on **Cloudflare Pages**.
No build step, no framework, no npm install — plain HTML/CSS/JS plus one Pages Function for the contact form.

## Deploy (Cloudflare Pages)

1. Commit the **contents of this folder** to the repo root of `github.com/OpenDiabetic/open-foot-lab`
   (or point the Pages project's build output at this folder).
2. Cloudflare Pages settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (the folder that holds `index.html`)
3. Push to the default branch → Pages builds and deploys automatically.
4. **Contact form:** add these environment variables in the Pages project (Settings → Environment variables), then redeploy:
   - `RESEND_API_KEY` — from [resend.com](https://resend.com); verify the `openfootlab.com` domain first.
   - `CONTACT_TO` — optional, defaults to `build@openfootlab.com`.
   - `CONTACT_FROM` — optional, defaults to `OpenFootlab <build@openfootlab.com>`.
   Until the key is set the form still shows its success state (so nothing looks broken) but no email is sent.
   To use a different provider (Postmark, SES, a CRM webhook), edit `functions/api/contact.js` — it's ~40 lines.

## Structure

```
index.html                     Home — the foot-at-risk platform + Foot Passport + contact form
inserts.html                   Custom 3D-printed offloading inserts + FAQ + book-a-scan form
intel.html                     Intel index (sourced deep-dives)
intel/*.html                   5 statically-rendered Intel articles (TOC + prev/next)
privacy.html                   Privacy policy
terms.html                     Terms of use ("not a medical device")
styles.css                     Tokens, base reset, doc-reader styles, responsive rules
app.js                         Tiny vanilla engine: hover/focus states, FAQ accordion, form submit
functions/api/contact.js       Cloudflare Pages Function — receives the contact form
assets/favicon.svg             The insole mark
assets/og.png                  1200×630 social share image
robots.txt, sitemap.xml        SEO
llms.txt                       LLM/GEO discovery summary
_headers, _redirects           Cloudflare Pages config (security headers + legacy redirects)
```

## How it works

- **Styling** is inline on elements (as designed), with `styles.css` providing tokens (`--accent`, `--radius`),
  base resets, the Intel doc-reader styles, and a responsive layer that collapses multi-column grids on mobile.
- **Interactions** are handled by `app.js` with no dependencies:
  - hover/focus states come from `data-hover` / `data-focus` attributes,
  - the Inserts FAQ is a single-open accordion (`data-faq`),
  - the contact form (`form[data-contact]`) validates inline and POSTs JSON to `/api/contact`,
    falling back to an inline success state.
- **Intel docs** are pre-rendered to static HTML from the Markdown in the design bundle's `docs/` —
  no client-side fetching. To edit an article, update the HTML in `intel/` (or re-run the generator
  from the source Markdown).
- **Accent:** signal green `#5FD38A`, defined once in `:root`. Change it there to re-theme the whole site.

## Brand

OpenFootlab is its own standalone brand: signal-green accent, **Archivo** (display) / **Hanken Grotesk** (body) /
**JetBrains Mono** (technical), and the insole + pressure-relief-ring mark. Legal entity: Swarm and Bee LLC.

## Copy & claims policy (binding)

- Devices are **custom-fit accommodative devices, not medical devices**; never imply diagnose / treat / cure / prevent.
- Allowed: "redistribute pressure across the foot," "custom 3D-printed TPU with a soft, skin-safe top cover," "latex-free," "washable."
- Do **not** reintroduce "medical-grade," "biocompatible," or "protect/heal/cure" claims.
- Intel figures are cited to peer-reviewed literature and carry "Not medical advice."

## Before launch — checklist

- [ ] Set `RESEND_API_KEY` (+ verify domain) so the contact form delivers.
- [ ] Add a real founder photo at `assets/founder.jpg` (the founder quote block; it hides gracefully if absent).
- [ ] Replace the illustrative SVG product renders with real product photography when available.
- [ ] Self-host the three fonts (currently Google Fonts CDN) for performance/privacy.
- [ ] Legal/counsel review of `privacy.html`, `terms.html`, and the "not a medical device" language.
- [ ] Confirm `LocalStudy` nav target (`/study`) exists, or update the link.

## Local preview

Open `index.html` in a browser, or run any static server from this folder
(e.g. `npx serve` or `python3 -m http.server`). All links are relative, so it works offline.
