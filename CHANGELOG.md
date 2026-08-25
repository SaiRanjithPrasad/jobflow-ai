# JobFlow AI — Changelog & Release Notes

All notable changes, version numbers, and release updates to **JobFlow AI** will be documented in this file using [Semantic Versioning](https://semver.org/).

---

## [v1.3.0] — 2026-08-25

### 🧭 Added
- **PathFinder AI — Career Switch & Fulfillment Module**:
  - Designed for candidates who are tired of their current role and want to switch career paths while finding their passion and maximizing earning potential.
  - Interactive **4-Pillar Alignment Calculator**: Evaluates Passions & Interests, Skills & Strengths, Market Demand, and Salary Goals.
  - New Python FastAPI AI microservice endpoint: `POST /api/ai/pathfinder-assess`.
  - Node API Gateway proxy endpoint: `POST /api/ai/pathfinder`.
  - New Seeker Portal tab: **`🧭 PathFinder AI`** (`/seeker?tab=pathfinder`).
  - Computes 0–100% Fulfillment Alignment Score, 3 Recommended Career Pivot Roles, Transferable Skill Tags, and a Step-by-Step Monetization Blueprint.

---

## [v1.2.0] — 2026-08-25

### 🎨 Added
- **Minimalist Editorial & Cinematic Hero UI Specification**:
  - `Instrument Serif` display typography (-2.46px negative letter-spacing for H1 titles).
  - Full-bleed cinematic video background (`serene-art-hero.mp4`) with subtle dark overlay.
  - Staggered entrance animations (`fade-rise` keyframes with 0.2s stagger increments).
  - 3-column distributed navigation bar featuring `JobFlow AI®` trademark logo in 30px Instrument Serif.
  - High-contrast rounded pill action buttons (`btn-pill`) with hover scaling.
- **Live Metrics Showcase Banner**:
  - Real-time `Outputs Generated So Far` counter.
  - Real-time `Total Visitors So Far` unique page views counter.
  - Real-time `People Currently Online` live user ticker with pulsing green indicator dot.
  - New Node API Gateway endpoints: `GET /api/stats` and `POST /api/stats/visit`.

---

## [v1.1.0] — 2026-08-24

### 💳 Added
- **Stripe Payments & 2-Free Trial Search Limit**:
  - Users receive 2 free AI resume parses and job matches out of the box.
  - Interactive Stripe Checkout Paywall Modal ($29/mo Unlimited Pro Pass) triggered on 3rd usage attempt.

---

## [v1.0.0] — 2026-08-24

### 🚀 Initial Release
- **Next.js 14 Frontend**: Job Seeker Portal & Recruiter Command Hub.
- **Node.js Express API Gateway**: Mongoose ODM database layer & MongoDB Atlas cloud integration.
- **Python FastAPI AI Microservice**: PyPDF2 resume parsing, scikit-learn TF-IDF Cosine vector matching, cover letter synthesis, and AI mock interview evaluator.
