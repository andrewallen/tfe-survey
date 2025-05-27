# The Fitness Experts (TFE) – Interactive Survey Platform PRD

## 1. Purpose
Deliver a mobile-first, gamified survey web-app that collects richer member insights for TFE (High Wycombe) while making the feedback process fun and engaging.

## 2. Goals & Success Metrics
- Increase survey completion rate to ≥ 65 % of members.
- Cut average completion time to < 9 min without sacrificing depth.
- Achieve ≥ 4 / 5 average “survey enjoyment” score (post-survey micro-poll).
- Surface actionable insights (top-3 member issues) within 48 h of survey close.

## 3. Target Users
- Current members (3 + months)
- New members (< 3 months)
- Previous members (paused / cancelled)
- Gym leadership team (admin dashboard)

## 4. Core Features
1. Dynamic question flow  
   - Reads Markdown files from `survey-questions/` at runtime.  
   - Branch logic based on answers (member type, selections, etc.).

2. Gamified UX  
   - Progress bar with milestones & confetti.  
   - Micro-animations on answer selection.  
   - Badge for survey completion (redeemable in gym app).

3. Mobile-first UI  
   - Responsive layout using CSS grid / flexbox.  
   - Touch-optimised controls (large hit-areas, swipe-able options).

4. Data capture & storage  
   - Persist each response atomically to DB (PostgreSQL).  
   - Anonymise user by default; email only if prize-draw opted-in.

5. Admin dashboard  
   - Real-time completion stats, drop-off points, NPS heat-map.  
   - CSV export.

## 5. Functional Requirements
FR-1 Load questions dynamically from Markdown.  
FR-2 Screener routes user to correct deep-dive set.  
FR-3 Validate required fields before navigation.  
FR-4 Save progress; allow resume within 7 days (localStorage + user-token).  
FR-5 Support single / multi-select, rating scales, free-text.  
FR-6 Gamification layer (XP counter, celebration animations).  
FR-7 GDPR-compliant consent capture (hard gate).  
FR-8 Admin authentication (role-based).  
FR-9 Export anonymised dataset.

## 6. Non-Functional Requirements
- Performance: first contentful paint < 2 s on 3G.  
- Accessibility: WCAG 2.1 AA.  
- Security: OWASP top-10 mitigation, HTTPS only.  
- Internationalisation-ready (content strings externalised).  
- Availability: 99.5 % during survey windows.

## 7. Tech Stack
Frontend: React + TypeScript (Vite), TailwindCSS for styling, Framer-Motion for animations.  
Backend: Node.js (NestJS) API, PostgreSQL via Prisma ORM.  
Hosting: Vercel (frontend) + Supabase / Railway (DB + API).  
CI/CD: GitHub Actions.

## 8. Data Model (simplified)
- `users` (id, type, created_at)  
- `responses` (id, user_id, question_id, answer, created_at)  
- `questions` (id, path, slug, metadata) – auto-synced from Markdown front-matter.  

## 9. Privacy & Compliance
- Consent checkbox mandatory.  
- Pseudonymised user IDs.  
- 30-day data retention for raw email addresses (prize draw).

## 10. Analytics & Reporting
- Mixpanel events: start, question_view, answer_submit, complete.  
- Drop-off funnel visualised in admin dashboard.

## 11. Roadmap (High-level)
| Phase | Scope | Duration |
|-------|-------|----------|
| 0 | Design & prototyping, UI library | 2 w |
| 1 | MVP: dynamic survey, persistence, basic admin | 4 w |
| 2 | Gamification, progress save/resume | 2 w |
| 3 | Advanced analytics, export, polishing | 2 w |

## 12. Risks & Mitigations
- Low completion → iterate on UX via A/B tests.  
- Markdown schema drift → linting & CI validation step.  
- DB performance spikes → read replicas & query caching.

## 13. Open Questions
1. Is multi-language support required Day 1?  
2. Badge redemption mechanism within existing GloFox app?

---
