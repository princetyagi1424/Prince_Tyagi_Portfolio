# Prince Tyagi — Portfolio

Personal portfolio of **Prince Tyagi**, a second-year B.Tech CSE (AI & Data Science) student at GLA University, Mathura.

**Live site:** [prince-tyagi-portfolio.pages.dev](https://prince-tyagi-portfolio.pages.dev/)

---

## Selected projects

| Project | Stack | Status | Demo |
|---------|-------|--------|------|
| **Hand Gesture Box Creator** | JavaScript, MediaPipe Hands, Web Camera API | Aug 2026 | [Live](https://handboxp.netlify.app/) |
| **GLA Campus Navigator** | React, Leaflet, OpenStreetMap, Dijkstra | Oct 2026 – Present | [Live](https://campus-navigator--liyorajcs25.replit.app/) |

---

## Tech stack (this site)

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **3D (optional):** `@react-three/fiber` + Three.js (lazy-loaded, reduced particles, `prefers-reduced-motion` respected)
- **API:** Express (LeetCode live stats) · Cloudflare Pages Functions compatible
- **Deploy:** Cloudflare Pages (`wrangler.toml`)

---

## Coding profiles (verified)

| Platform | Handle / link | Notes |
|----------|---------------|--------|
| **LeetCode** | [princeytyagi](https://leetcode.com/u/princeytyagi/) | Snapshot **13 Oct 2026, 14:05 IST**: 264 solved (206 Easy · 52 Medium · 6 Hard) · rating ~1480 · 2 badges |
| **GitHub** | [princetyagi1424](https://github.com/princetyagi1424) | 10 public repos (checked 13 Oct 2026) |
| **HackerRank** | [princetyagi3726](https://www.hackerrank.com/profile/princetyagi3726) | Java (Basic) certified |
| **LinkedIn** | [prince-tyagi-2147482aa](https://www.linkedin.com/in/prince-tyagi-2147482aa/) | — |

Live LeetCode numbers refresh via `/api/leetcode/stats` when the backend is available; otherwise a clearly labelled historical snapshot is shown.

---

## Certificates

- Deloitte / Forage — Data Analytics Job Simulation (28 Dec 2025)
- Google Student Ambassador — Build Your Fest Stall Edition (8 Oct 2026)
- GLA + Code Busters — BuildCamp: AI, Scalability & Google Antigravity (18 Sep 2026)
- HackerRank — Java (Basic) (12 Aug 2026)

Certificate images live under `public/certificates/`.

---

## Local development

```bash
# From monorepo root
pnpm install
pnpm --filter @workspace/prince-tyagi-portfolio run dev

# API (optional, for live LeetCode)
pnpm --filter @workspace/api-server run dev
```

Build:

```bash
pnpm --filter @workspace/prince-tyagi-portfolio run build
# Output: artifacts/prince-tyagi-portfolio/dist/public
```

Deploy (Cloudflare Pages):

```bash
npx wrangler pages deploy artifacts/prince-tyagi-portfolio/dist/public
```

---

## Accessibility & performance notes

- Skip link, semantic landmarks, `aria-*` on interactive controls
- 3D scene disabled under `prefers-reduced-motion` and when WebGL is unavailable
- Particle count reduced (~1200) and geometry segments lowered to keep the Three.js chunk lighter
- Images use `loading="lazy"` where appropriate

---

## Suggested repository topics

`portfolio` · `react` · `typescript` · `vite` · `tailwindcss` · `threejs` · `student-portfolio` · `java` · `dsa` · `mediapipe`

*(Set these in GitHub → Settings → Topics if desired.)*

---

## Contact

- Email: **princetyagi3726@gmail.com**
- Location: Mathura, Uttar Pradesh, India

---

© 2026 Prince Tyagi. Content is factual and verified; no invented experience or metrics.
