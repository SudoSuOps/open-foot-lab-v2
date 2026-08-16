# openfootlab.com — production site

Static, dependency-free site for **OpenFootLab**. No build step, no framework,
no npm install — plain HTML/CSS/JS plus one Cloudflare Pages Function for the
contact form. Five pages, five Intel articles, one shared stylesheet.

## Where this is authoritative, and where it is not

This directory is the **source of truth**. Edit here.

It is **not** what Cloudflare builds. openfootlab.com deploys from
`github.com/SudoSuOps/open-foot-lab-v2` via Cloudflare Pages on push to `main`.
`openfootlab-os` lives on the NAS (`origin` = `/mnt/nas-swarm/git/`) and its
GitHub remote was retired on 2026-08-06 — it is named `github-old` for that
reason. Cloudflare cannot build from the NAS, so the deploy repo stays.

That split is why `sync-deploy.sh` exists. Two copies of a site drift silently,
and the one that drifts is always the one nobody is looking at.

```
sites/openfootlab.com/   ← edit here (source of truth, NAS)
        │  scripts/sync-deploy.sh
        ▼
open-foot-lab-v2/        ← deploy mirror (GitHub) → Cloudflare Pages → live
```

```bash
bash scripts/sync-deploy.sh          # dry run: shows what would change
bash scripts/sync-deploy.sh --push   # sync, commit, push, poll until live
```

It refuses to run when the mirror has uncommitted changes or sits behind its own
origin, because `rsync --delete` over someone's direct edit destroys it without
a word. That guard has already caught one real uncommitted change.

## Cloudflare Pages settings

- **Framework preset:** None
- **Build command:** *(empty)*
- **Build output directory:** `/`

Environment variables (Settings → Environment variables), then redeploy:

| Variable | Required | Default |
|---|---|---|
| `RESEND_API_KEY` | **yes** | — verify the `openfootlab.com` domain in Resend first |
| `CONTACT_TO` | no | `build@openfootlab.com` — where enquiries land |
| `NOTIFY_FROM` | no | `notifications@openfootlab.com` — the send-from |
| `CONFIRM_FROM` | no | `OpenFootLab <build@openfootlab.com>` |
| `CONFIRM_OFF` | no | set to `1` to suppress the customer confirmation |

`NOTIFY_FROM` is deliberately not `build@`. Sending from the same mailbox that
receives is what turns an auto-responder into a loop.

Without a key the endpoint **fails loudly**. It does not show a success state.
Telling someone their message went through when it did not is worse than an
error, and this is the one place the site is holding something a person needs.

## Structure

| Path | What |
|---|---|
| `index.html` | Foot Passport — the landing surface. One CTA: **Start free** → `#contact` |
| `inserts.html` | The insert product, FAQ, book-a-scan. Carries the not-a-medical-device line |
| `intel.html` | Article hub. Declares `Blog` schema listing all five posts |
| `intel/*.html` | Five sourced articles, `Article` schema, author = Donovan, TOC + prev/next |
| `styles.css` | `:root` tokens, base reset, doc-reader styles, responsive layer |
| `app.js` | Vanilla, no deps — `data-hover`/`data-focus` states, `data-faq` accordion, contact POST |
| `fonts.css` + `assets/fonts/` | Self-hosted Archivo / Hanken Grotesk / JetBrains Mono (26 faces) |
| `functions/api/contact.js` | Pages Function. Reads keys from env — never inline one here |
| `llms.txt` | Published for AI crawlers. Keep its URLs canonical (no `.html`) |
| `_redirects` | Legacy aliases. Point at final routes, never at a URL that redirects again |

Styling is inline on elements by design; `styles.css` carries the tokens.
Intel articles are pre-rendered static HTML — to edit one, edit the HTML.

## Copy & claims policy (binding)

- Devices are **custom-fit accommodative devices, not medical devices**. Never
  imply diagnose / treat / cure / prevent.
- Allowed: "redistribute pressure across the foot", "custom 3D-printed TPU with
  a soft, skin-safe top cover", "latex-free", "washable".
- Do **not** reintroduce "medical-grade", "biocompatible", or
  "protect / heal / cure".
- Intel figures cite peer-reviewed literature and carry "Not medical advice".

## Two things that are easy to undo by accident

**The colour register.** Light-warm: paper `#F7F4EE`, botanical green `#1F6F4A`,
ink `#22201C`. The audience skews 50–75+, and positive polarity constricts the
pupil — more depth of field, sharper focus, no halation. The old dark scheme was
**not** failing WCAG; it measured 11.24:1 and 16.99:1. It was failing eyes. The
accent is green rather than gold because bright gold is 1.76:1 on this paper —
the same trap that ruled out the old lime at 1.7:1.

**Small type.** The regulatory line must stay at **13px or larger**. It was 11px,
which passed contrast and still failed the reader. Disclosed and read are not
the same thing.

## Still open

- [ ] Legal/counsel review of `privacy.html`, `terms.html`, and the
      not-a-medical-device language.
- [ ] Replace the illustrative SVG product renders with real photography.
- [ ] Mono microlabels → sentence-case Hanken. The design brief calls this the
      single biggest source of the terminal feeling, more than the darkness —
      but the labels are literal capitals in the markup across 55 mono usages,
      so it is a copy rewrite, not a style toggle. Intel keeps mono either way.
- [ ] Brand authority is the ceiling on GEO (~8/100). Every remaining point
      comes from being mentioned off this domain, not from editing this repo.

Done since the original checklist: fonts self-hosted (were on the Google CDN),
`assets/founder.jpg` in place, `/study` nav target removed.

## Local preview

Open `index.html`, or run any static server from this folder
(`python3 -m http.server`). All links are relative, so it works offline.

## History

Full commit history lives in `open-foot-lab-v2`, which is retained. This
directory was copied in on 2026-08-15 rather than grafted with `git subtree`,
because subtree requires a clean working tree and this repo had 54 unrelated
files in flight from that night's CAD work. Nothing was lost.

Legal entity: Swarm and Bee LLC.
