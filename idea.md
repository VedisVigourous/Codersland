# ♠ CODERLANDS 2026 — MASTER ARCHITECTURE & DESIGN BIBLE
> **The Definitive Guide, Technical Specification & Lore for Technovation Club's Technical Survival Tournament**  
> **Tournament Dates**: 26th & 27th | **Venue**: Seminar Hall 1 (Raman Block)  
> **Repository**: [github.com/VedisVigourous/Coderland-Registration](https://github.com/VedisVigourous/Coderland-Registration)

---

## 🎯 1. The Core Vision: Why CoderLands Exists

Most college event registrations use sterile, boring Google Forms or generic Typeforms. **CoderLands was built to disrupt that entirely.**

### The Tournament Lore
CoderLands is an inter-club technical survival arena hosted by **Technovation Club**, heavily inspired by the psychological tension, laser-gated arenas, and playing-card hierarchy of **Alice in Borderland** fused with **Royal French Playing Cards**.

In the tournament lore:
- Participating squads are not merely "attendees"; they are **Borderland Contenders**.
- The registration page is not a form; it is an **Immigration Terminal & Visa Issuance Portal**.
- Passing through grants a **14-Day Visa Clearance** to enter Seminar Hall 1 on the 26th & 27th.
- Failing to secure a Visa means elimination before the tournament even commences.

### The Two Rounds
1. **Round 1 — FOURFOLD (30-09-2026 / Day 1)**:
   - 15 questions per domain across Web Development, Cybersecurity, Cloud, and Networking.
   - Every squad member answers questions specific to their chosen domain in a simultaneous live quiz.
2. **Round 2 — GAMBiT (Day 2)**:
   - High-stakes algorithmic survival, rapid debugging, and architectural problem-solving under strict countdown constraints.

---

## 🗄️ 2. The Database Philosophy & Quiz Site Integration

The registration platform is only **Phase 1** of a larger ecosystem. The database was specifically architected to feed directly into the **Main Live Quiz Tournament Engine** running on the event days.

### Why Every Squad Gets a `Team ID` and `Passcode`
When a squad completes registration, the engine generates two cryptographic credentials:
- **`Team ID` (e.g. `CL-2026-A7F2`)**: Public tournament identifier displayed on live leaderboards, projector screens, and organizer attendance sheets.
- **`Passcode` (e.g. `CODER-9K2M`)**: Private authentication secret used by the squad to log into their terminal on tournament day in Seminar Hall 1.

### Automatic Domain Mapping Schema
In typical forms, members are listed in random order. In CoderLands, the database enforces a strict **Domain Map**:
```json
{
  "id": "CL-2026-A7F2",
  "passcode": "CODER-9K2M",
  "clubName": "ACM Student Chapter",
  "teamName": "Binary Knights",
  "members": [
    {
      "name": "Alex Chen",
      "email": "alex@domain.edu",
      "phone": "+91 9876543210",
      "isLeader": false,
      "domain": "Web Development"
    },
    {
      "name": "Maya Patel",
      "email": "maya@domain.edu",
      "phone": "+91 9876543211",
      "isLeader": true,
      "domain": "Cybersecurity"
    },
    {
      "name": "Jordan Lee",
      "email": "jordan@domain.edu",
      "phone": "",
      "isLeader": false,
      "domain": "Cloud"
    },
    {
      "name": "Sam Rivera",
      "email": "sam@domain.edu",
      "phone": "",
      "isLeader": false,
      "domain": "Networking"
    }
  ],
  "registeredAt": "2026-11-23T10:05:24.950Z",
  "status": "VISA_GRANTED",
  "visaDays": 14,
  "ipAddress": "192.168.1.15",
  "domainMap": {
    "webDev": "Alex Chen",
    "cybersecurity": "Maya Patel",
    "cloud": "Jordan Lee",
    "networking": "Sam Rivera"
  }
}
```

### How the Quiz Platform Consumes This (`data/quiz_event_teams.json`)
Every time a team registers, a normalized, quiz-optimized mapping file is synchronized:
```json
[
  {
    "teamId": "CL-2026-A7F2",
    "passcode": "CODER-9K2M",
    "teamName": "Binary Knights",
    "clubName": "ACM Student Chapter",
    "domains": {
      "Web Development": "Alex Chen",
      "Cybersecurity": "Maya Patel",
      "Cloud": "Jordan Lee",
      "Networking": "Sam Rivera"
    }
  }
]
```
When Contenders log into the Round 1 Quiz Terminal using `CODER-9K2M`:
- The quiz engine checks the `domainMap`.
- `Alex Chen` only sees Web Development challenges.
- `Maya Patel` only sees Cybersecurity challenges.
- `Jordan Lee` only sees Cloud challenges.
- `Sam Rivera` only sees Networking challenges.
- Individual scores are aggregated live under `Binary Knights`!

### Hybrid Cloud Architecture: Vercel Serverless + Upstash Redis + Local JSON
1. **Serverless Filesystem Challenge**:
   - Vercel functions run in read-only AWS Lambda containers. Writing to `fs.writeFileSync` triggers `EROFS` crashes, and memory is lost upon function shutdown.
2. **Upstash Redis in Production (`lib/db.ts`)**:
   - When deployed on Vercel, the app automatically detects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL`).
   - Uses `@upstash/redis` via HTTP REST (no connection pool limits, zero cold-start delay).
   - Primary Redis Keys:
     - `coderlands:registrations`: Complete serialized array of all verified squads.
     - `coderlands:audit_log`: Append-only Write Ahead Log (WAL) recording every registration timestamp and client IP.
3. **Localhost Development Fallback**:
   - If Redis keys are absent, `lib/db.ts` falls back to `data/registrations.json` and `data/quiz_event_teams.json` with zero configuration needed.
4. **Concurrency Protection**:
   - An in-memory asynchronous `AsyncMutex` serializes requests to guarantee atomic duplicate checks (e.g., stopping two teams from registering the same squad name in the same millisecond).

---

## 🎭 3. Visual & 3D Spatial Mechanics

### The Atmospheric Borderland Arena (`components/BorderlandArena.tsx`)
- **Red Laser Lines**: Vertical glowing neon red laser beams (`#ff113a`) pulse up and down the viewport, creating the visual feeling of the Borderland death lasers from the show.
- **Shoji Grid Background**: Subtle grid pattern with radial dark gradients fading into `#050508` (Obsidian).
- **Floating Dust Particles**: Ambient particles drifting through the red volumetric light.

### The 3D Continuous Scroll Stage (`components/ContinuousScrollStage.tsx`)
Instead of standard paginated steps, the desktop experience is an unbroken **3D virtual table**:
- **Perspective**: 1200px 3D perspective viewport (`perspective: 1200px`, `transform-style: preserve-3d`).
- **Interactive Mouse Tilt**: Moving the mouse tilts cards realistically using Framer Motion springs (`stiffness: 400`, `damping: 30`).
- **Deck Dealing Physics**:
  - Cards begin stacked in the center deck.
  - As you scroll down, completed cards dynamically scale down (`scale: 0.72`), rotate (`rotate: -20deg` / `+20deg`), and slide outward to the screen borders (`x: -460px` and `+460px`), mimicking cards dealt to the sides of a card table.
  - As soon as the user scrolls, any expanded card smoothly moves back to its resting position.
- **Direct Front-Card Inputs (No Confusing Flips)**:
  - Initial prototypes flipped cards on click, which confused users about where to enter text.
  - The final design features **direct front-of-card inputs** embedded seamlessly into the royal card faces, styled with ivory backgrounds (`#fbf7ee`) and burgundy borders.

### The 6 Stages of the Scroll Journey
- **Stage 0: Hero Intro**: Dramatic cinematic typography: *"Technovation Presents: CoderLands"* with glowing 3D depth and audio prompt.
- **Stage 1: Briefing Deck**: 3-card spread (Fourfold Round 1 on left, Seminar Hall 1 Raman Block in center, GAMBiT Round 2 on right).
- **Stage 2: Squad Identity**: The Ace of Hearts (Club Affiliation) and Ace of Spades (Squad Moniker).
- **Stage 3: Squad Alpha**: King of Clubs (Web Development) and Queen of Diamonds (Cybersecurity), with Team Leader toggle buttons.
- **Stage 4: Squad Bravo**: Jack of Spades (Cloud) and 10 of Hearts (Networking), with Team Leader toggle buttons.
- **Stage 5: Master Review & Edit Dossier**: High-tech foil contract summarizing all details. **All fields are directly editable inline** so mistakes can be fixed without scrolling back!
- **Stage 6: Isolated Visa Passcard Screen**: Once submitted, confetti explodes and the scrollable stage unmounts, presenting a **focused single-page card view** with zero vertical scrolling.

### Mobile-First Minimalist Strategy (`components/MobileScrollStage.tsx`)
On screens `< 768px`:
- 3D card clusters and side-migrating cards are disabled to prevent clutter and preserve 60 FPS mobile performance.
- Each stage delivers a **single, centered card** designed for one-thumb scrolling.
- Direct inputs remain right on the front of each card.

---

## 🎨 4. Complete Design System & Typography

### Typography Hierarchy (`app/layout.tsx` & `tailwind.config.ts`)
| Token | Font Family | Character / Purpose |
| :--- | :--- | :--- |
| `font-baroque` | **Pirata One** | Gothic tournament titles, card ranks (A, K, Q, J), bold numbers |
| `font-sheepman` | **Cinzel Decorative** | Ornate subtitles, card badges, action buttons, royal watermarks |
| `font-techno` | **Rajdhani** | High-tech chapter indicators, HUD text, countdowns, timestamps |
| `font-mono` | **JetBrains Mono** | Team IDs (`CL-2026-XXXX`), passcodes, input fields, coordinates |

### Color Tokens
- `bg-[#050508]`: Dark Obsidian void.
- `text-[#ff113a]`: Laser Red neon accent.
- `bg-[#fbf7ee]`: Authentic royal card ivory parchment.
- `border-[#e6dbc8]`: Aged gold-trimmed card border.
- `text-red-950` / `text-stone-900`: Vintage ink typography.
- `text-amber-400`: Designated Team Leader highlight star (`★`).

### Audio Architecture (`lib/sounds.ts` & `public/themesong.mp3`)
- **Theme Song**: Low-volume background theme song (`themesong.mp3` at 25% volume) creates a tense, focused tournament atmosphere without drowning out conversation. Starts automatically upon first user tap/click/scroll.
- **Web Audio API Procedural SFX**: Zero external audio asset overhead. Synthesizes mechanical card clicks, laser zaps, and fanfare in real-time using native browser oscillators and gain nodes.

---

## 🛡️ 5. Organizer Command Center (`components/OrganizerModal.tsx`)

To maintain event integrity, the tournament registry is locked behind an administrative gate:
- **Authentication**:
  - **Organizer ID**: `technoAdmin`
  - **Passkey**: `coderland2k26`
- **Features**:
  - Live progress counter toward the 30-squad tournament limit.
  - Instant client-side search across Squad Monikers, Club Names, and Team IDs.
  - Passcode visibility toggle for troubleshooting contenders at the venue check-in desk.
- **Indian Standard CSV Export**:
  - One-click **"Export CSV (All Details)"** generates a full spreadsheet for event organizers.
  - Formats all registration timestamps in Indian Standard Time (`DD-MM-YYYY hh:mm:ss AM/PM`).
  - Includes dedicated columns for `TEAM_LEAD_NAME`, `PASSCODE`, and individual domain specialists.

---

## 🖨️ 6. Visa Passcard Export & Mobile Sharing (`components/VisaPasscardView.tsx`)

When registration is sealed, contenders receive their official **Borderland Visa**:
- **On Desktop PC**: Clicking *"DOWNLOAD CARD (PNG)"* captures the DOM element with `html-to-image` at `pixelRatio: 2` (retina quality) and saves directly to the PC's `Downloads` folder as `CoderLands_Visa_CL-2026-XXXX.png`.
- **On Mobile Phones**: Automatically triggers the native Web Share API (`navigator.share`), allowing contenders to tap **"Save to Photos"** or directly share to their squad WhatsApp group.
- **In-App Browser Failsafe**: In browsers that block downloads (Instagram in-app browser or Google App on iPhone), a modal pops up instructing the user: *"Touch and hold the card above, then select 'Save to Photos'"*.

---

## 🛠️ 7. Teammate Quickstart & Contribution Rules

### 1. Setup & Installation
```bash
# Clone the repository
git clone https://github.com/VedisVigourous/Coderland-Registration.git
cd Coderland-Registration

# Install dependencies
npm install

# Run development server
npm run dev
```

### 2. Environment Variables (`.env.local`)
For local development, no variables are required (it uses local JSON files automatically).  
For production deployment on Vercel, connect **Upstash for Redis** or add:
```env
UPSTASH_REDIS_REST_URL=https://your-upstash-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

### 3. Strict Rules for Future Edits
- 🔒 **Never remove domain constraints**: Every team must have 4 distinct domains (`Web Development`, `Cybersecurity`, `Cloud`, `Networking`) and exactly 1 Team Lead.
- 📱 **Respect mobile minimalism**: Do not re-add 3-card fans or heavy 3D transforms to `MobileScrollStage.tsx`.
- 📁 **Keep git clean**: Never commit `node_modules` or `.next` build files. All database entries are sanitized in git.
- 🎵 **Audio casing**: Always reference `/themesong.mp3` in all lowercase to prevent Linux 404 errors.

---
*Maintained by TECHNOVATION CLUB • Raman Block • CoderLands 2026*
