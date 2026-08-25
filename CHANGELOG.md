# JobFlow AI — Changelog & Release Notes

All notable changes, version numbers, and release updates to **JobFlow AI** will be documented in this file using [Semantic Versioning](https://semver.org/).

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

### 🛡️ Enhanced
- Added automatic zero-downtime failover proxy handling in Node Gateway: if Render Python AI microservice is cold-starting (status 502), requests automatically failover to local Python AI engine (`http://127.0.0.1:5001`).

---

## [v1.1.0] — 2026-08-24

### 💳 Added
- **Stripe Payments & 2-Free Trial Search Limit**:
  - Users receive 2 free AI resume parses and job matches out of the box.
  - Interactive Stripe Checkout Paywall Modal ($29/mo Unlimited Pro Pass) triggered on 3rd usage attempt.
  - Node API Gateway endpoints: `GET /api/user/usage`, `POST /api/stripe/create-checkout-session`, and `POST /api/stripe/mock-success`.

---

## [v1.0.0] — 2026-08-24

### 🚀 Initial Release
- **Next.js 14 Frontend**: Job Seeker Portal & Recruiter Command Hub.
- **Node.js Express API Gateway**: Mongoose ODM database layer & MongoDB Atlas cloud integration.
- **Python FastAPI AI Microservice**: PyPDF2 resume parsing, scikit-learn TF-IDF Cosine vector matching, cover letter synthesis, and AI mock interview evaluator.
- **Git Version Control & Security**: `.gitignore` protection for secrets and dependencies.
