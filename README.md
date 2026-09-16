# Rheumora — Rheumatology & Autoimmune Care Center

A state-of-the-art, accessible, and compassionate multi-page web application for **Rheumora**, a center of clinical excellence specializing in Rheumatology, Arthritis, and Autoimmune Healthcare.

---

## 💎 Brand & Aesthetic Direction
- **Visual Direction**: Luxury-Refined Clinical Warmth — merging serene clinical authority with reassuring human warmth.
- **Color Palette (Max 3 CSS Tokens)**:
  - **Primary**: Deep Healing Teal / Slate (`#184e5a`)
  - **Secondary**: Luminous Sea Sage (`#2f7c85`)
  - **Accent**: Radiant Amber / Coral (`#d86c52`)
- **Typography Scale**:
  - Headings: Variable Google Serif **`Fraunces`**
  - Body & UI: Variable Google Sans-Serif **`Urbanist`**
  - **Maximum Heading Weight Rule**: Strictly capped at `580` (no 600+, 700, 800, 900, or `bold` anywhere).
- **Uniform Global Geometry**:
  - Border Radius: `14px` uniformly across all cards, buttons, badges, and modals.
  - Box Shadows: Single unified elevation system (`0 10px 30px -4px rgba(24, 78, 90, 0.08)` in light; customized in dark mode).
- **Icons**: Phosphor Icons library for clean, clinical symbology.

---

## 📂 File Structure
```
Rheumatology & Autoimmune Care Center/
├── index.html            # Primary Homepage (Hero animation, clinical specialties, story, highlights, testimonials, CTA)
├── home2.html            # Home 2 (Editorial split hero, Interactive Joint & Symptom Navigator)
├── services.html         # Clinical Services & Treatment Comparison Table
├── about.html            # Mission, Medical Director message, Specialist Faculty Board, Innovation Timeline
├── blog.html             # Categorized Autoimmune Knowledge Hub & Newsletter
├── blog-single.html      # Comprehensive clinical guide on Biologic Therapies with Author Profile
├── contact.html          # Appointment booking with client-side validation, hours & interactive location map
├── login.html            # Centered authentication view (Login, Google/Apple auth, link to Register)
├── register.html         # Centered patient registration view with terms checkbox validation
├── dashboard.html        # Patient Care & Lab Titers Portal (DAS28 score, flare-up logger, appointment booking)
├── 404.html              # Custom medical 404 recovery screen
├── coming-soon.html      # Countdown timer & VIP early-access launch capture
├── assets/
│   ├── css/
│   │   ├── style.css     # Design tokens, typography rules, alignment system, dark theme overrides
│   │   └── rtl.css       # Dedicated RTL layout flipping overrides
│   └── js/
│       ├── main.js       # Sticky nav, slide-drawer, theme toggle, RTL toggle, hero animation, form validation
│       └── dashboard.js  # Patient portal tab switching, appointment booking, flare-up tracker
└── README.md             # Project documentation
```

---

## 🚀 Key Features

1. **Breakpoints & Navbar Behavior (Step 4 & Step 7)**:
   - `> 1024px`: Full horizontal navbar displaying all fixed links (`Home`, `Home 2`, `Services`, `Conditions`, `Blog`, `Contact`, `Dashboard`), RTL toggle (`⇄`), theme switcher (moon/sun), and `Login` button.
   - `≤ 1024px`: Clean mobile/tablet header with logo, RTL toggle, and hamburger button. Opens a smooth slide-in drawer from the right (or from the left in RTL mode) containing all nav links, the theme toggle, and the `Login` button.
   - `360px`: Full-width mobile drawer with touch targets ≥ 44px and no horizontal overflow.

2. **Full Bi-Directional RTL Support (Step 5)**:
   - Easily toggled via the `⇄` icon button in the desktop navbar and mobile drawer.
   - Separate `rtl.css` overrides file.
   - Drawer slides seamlessly from the left in RTL mode; text, badges, and card baselines align cleanly.

3. **Theme Management (Step 6)**:
   - Light and Dark modes using `[data-theme="dark"]` on `<html>`.
   - Persists user preferences in `localStorage` with initial detection of system `prefers-color-scheme`.
   - Per specifications: **Auth pages (`login.html`, `register.html`) omit theme toggle and back button**.

4. **Client-Side Form Validation (Step 12)**:
   - Validates required inputs, email regex formatting, minimum 8-character password requirements, password matching on registration, and terms acceptance checkboxes.
   - Visual red borders and error messages on invalid inputs; green borders on valid inputs.
   - Submissions display an inline confirmation without reloading the page.

5. **Home 2 Interactive Joint & Symptom Navigator (Step 9.2)**:
   - Patients can toggle between **Hands & Wrists**, **Axial Spine & Sacroiliac**, **Knees & Hips**, and **Systemic & Connective Tissue (Lupus)**.
   - Dynamically renders symptom patterns, visual inspection images, and recommended clinical assessments.

6. **Interactive Patient Care Portal (`dashboard.html`)**:
   - Disease Activity Score (DAS28-CRP), inflammation levels (hs-CRP, ESR), next biologic infusion timer.
   - Working flare-up journal where patients can log joint location, pain scale (1–10), and morning stiffness duration, instantly prepending new logs to history.
   - Infusion chair reservation form with instant feedback.

---

## 🌐 How to Run Locally
Open `index.html` directly in any modern browser, or launch using any static HTTP server (e.g. `npx serve .` or VS Code Live Server).
