# Deploying the demo to Vercel

Both apps are **100% statically prerendered** — every route came out of
`next build` as `○ (Static)`. There is no backend, no database, no API route
and no environment variable. That makes this about the cheapest, fastest thing
Vercel can host.

You deploy **two projects from one repo**: `apps/b2b` and `apps/admin`. Two
URLs, two independent deploys, one codebase.

---

## Before you start

The repo is not under version control yet:

```bash
cd d:/A-Projects/Vlora/Loopway
git init -b main
git add .
git commit -m "LoopWay B2B + Admin portals (UI only)"
```

`.gitignore` already excludes `node_modules/`, `.next/`, `out/` and `.env*`.

---

## Path A — GitHub → Vercel (recommended)

Best if you'll keep iterating: every push redeploys, and every branch gets its
own preview URL you can send for review.

**1. Push to GitHub**

```bash
gh repo create vlora/loopway --private --source=. --push
# or: create the repo in the GitHub UI, then
# git remote add origin https://github.com/<you>/loopway.git
# git push -u origin main
```

**2. Create the B2B project**

vercel.com → **Add New… → Project** → import the repo, then:

| Setting | Value |
|---|---|
| Project Name | `loopway-b2b` |
| Framework Preset | Next.js *(auto-detected)* |
| **Root Directory** | **`apps/b2b`** ← the only setting you must change |
| Build / Install / Output commands | leave as default |

When you set the Root Directory, Vercel shows
**"Include source files outside of the Root Directory in the Build Step"** —
this must be **ON**. It is enabled automatically once Vercel sees the npm
workspaces at the repo root; just confirm it before deploying, because
`packages/ui` lives outside `apps/b2b` and the build fails without it.

Deploy → `https://loopway-b2b.vercel.app`

**3. Create the Admin project**

Add New → Project → **import the same repo again**, and this time:

| Setting | Value |
|---|---|
| Project Name | `loopway-admin` |
| **Root Directory** | **`apps/admin`** |

Deploy → `https://loopway-admin.vercel.app`

Vercel will now rebuild both on every push to `main`. If you want each project
to rebuild only when its own files change, set **Settings → Git → Ignored Build
Step** to:

```bash
npx turbo-ignore   # or, without turbo:
git diff --quiet HEAD^ HEAD -- . ../../packages/ui
```

---

## Path B — Vercel CLI, no GitHub

Fastest way to a link. Good for a one-off demo.

```bash
npm i -g vercel
vercel login

cd apps/b2b
vercel --prod        # answer: Set up and deploy? Y
                     #         Root directory? ./  (you're already in it)

cd ../admin
vercel --prod
```

The CLI uploads the local directory. Because the apps depend on
`@loopway/ui` **outside** their own folder, run these from inside each app
directory as shown — the CLI detects the workspace root from the lockfile and
uploads the whole repo, then builds the selected app.

To redeploy later: re-run `vercel --prod` from the same folder.

---

## Verify after deploying

Open each URL at a **1480×1020 or larger** window and check:

- [ ] Arabic renders in Tajawal, not a system sans *(if it looks generic, the
      `next/font` build step failed — check the build log)*
- [ ] `/trips` — three tabs, live `HH:MM:SS` timers ticking, rows expand
- [ ] `/trips` — the `حالة العرض` selector cycles all six view states
- [ ] `/trips/calendar` — bars render, hover dims siblings, click opens the panel
- [ ] `/finance` — wallet card, table, row opens the detail panel, `شحن الرصيد`
      opens the top-up sheet
- [ ] Admin — navy sidebar, all 16 sections reachable

---

## Four things to know before you share the link

**1. It needs a desktop window.** The shell is `min-width: 1480px` — a
deliberate fidelity decision, since the design is a fixed 1440×980 frame.
Anyone opening the link on a phone gets horizontal scrolling. If demo viewers
will be on mobile, say "open on a laptop" when you share it, or ask and we can
add a responsive breakpoint set (that is a design decision, not a bug fix —
see `docs/design-system/05-web-scale.md`).

**2. The URL is public.** Anyone who has it can open it. Vercel's password
protection (**Settings → Deployment Protection**) is a Pro feature; on the
Hobby plan, production URLs are always public while *preview* URLs can be
protected. For a client demo, the cheapest fix is simply not publishing the
link anywhere.

**3. Hobby is non-commercial.** Vercel's Hobby plan terms exclude commercial
use. If this is billable client work for Vlora, it belongs on a Pro team.

**4. Everything is mock data.** Nothing persists — refreshing resets top-up
state, expanded rows and filters. Worth saying out loud in the demo so nobody
reports it as a bug. "Today" is pinned to 16 July 2026 so the calendar is
populated; it will not track the real date.

---

## If the build fails

| Symptom | Cause | Fix |
|---|---|---|
| `Module not found: @loopway/ui` | "Include source files outside the Root Directory" is off | Turn it on in Project Settings → General |
| Arabic renders in a fallback font | `next/font` could not reach Google Fonts during build | Retry the deploy; if it persists, self-host the two families in `apps/*/src/app/fonts.ts` |
| `next lint is deprecated` warning | Next 15 notice, not an error | Ignore — it does not fail the build |
| Build succeeds, page 404s | Root Directory left at repo root | Set it to `apps/b2b` / `apps/admin` |
