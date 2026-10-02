# Jelas

**Access, explained.**

Jelas is an access-resolution layer for Malaysia's licensed digital banks and
e-wallet operators. When a bank's automated fraud, anti-money-laundering or
identity controls lock out a legitimate customer, Jelas gives that customer a
plain-language reason, a self-serve route back in, and a tracked resolution
time — while giving the bank a triage queue, a service-level clock and an
auditable conduct record. It never makes or overrides the risk decision itself.

Built for BFM 3130 Entrepreneurship in FinTech, Monash University Malaysia,
Semester 2 2026.

---

## Live site

**[ADD YOUR GITHUB PAGES URL HERE]**

---

## What is in this folder

```
frontend/
  index.html          All fourteen screens in one document
  assets/
    styles.css        Stylesheet, built on the project design tokens
    app.js            Client-side router that switches screens
    jelas-mark.svg    Logo mark
    jelas-lockup.svg  Full logo lockup
plan.txt              System design and logic overview
README.md             This file
```

There is no `backend/` folder. The prototype is a static frontend by design:
it demonstrates the interface and the user journey, and processes no data.
`plan.txt` sets out the production architecture a real build would use.

## Dependencies

None to install. The site is plain HTML, CSS and JavaScript with no build
step and no package manager.

Two typefaces load from Google Fonts over the network:

- Inter (interface text)
- IBM Plex Mono (case references and metric figures)

Both are open-licence. If the fonts fail to load the site falls back to system
sans-serif and monospace faces and remains fully usable.

## Running it locally

Open `frontend/index.html` in any modern browser. That is the whole process.

If you prefer to serve it over HTTP, from the `frontend` folder run:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Deploying to GitHub Pages

1. Create a new **public** repository on GitHub
2. Upload the contents of this folder
3. Repository **Settings** → **Pages**
4. Under **Source**, choose **Deploy from a branch**, select `main`, folder `/frontend`
5. Save. The site appears at `https://<username>.github.io/<repo>/` within a
   few minutes

GitHub Pages is free for public repositories and includes HTTPS automatically.

---

## Walkthrough — how to review the prototype

Follow this path to see every screen. Fourteen screens, about three minutes.

**Marketing site**

1. Open the live URL. The home page opens on the hero and the evidence strip.
2. Use the top navigation to visit **The problem**, **How it works**,
   **For banks**, **Research** and **About**.

**Customer recovery flow** — the core demonstration

3. From the home page, select **See the customer flow**.
4. **Locked out** — the restriction notice as the customer first sees it.
   Select **Find out why**.
5. **Why** — the plain-language explanation. Select **Resolve this now**.
6. **Confirm it was you** — four recovery routes. Select any of the first,
   third or fourth. The second route (reporting fraud) deliberately does not
   continue, because that case stays locked.
7. **One quick check** — the step-up verification. Select **Continue**.
8. **Transfers restored** — the resolved case, with its reference and elapsed
   time. Select **View the bank's side of this case**.

**Bank dashboard**

9. **Case detail** — the audit trail for the same case the customer just
   resolved, seen from the bank's side.
10. Use the sidebar to visit **Cases**, then select the first row
    (`JLS-4471-20B`) to return to the case detail.
11. Use the sidebar to visit **Overview** for the monthly metrics and the
    avoided-versus-billed ledger.

Every screen has a **Back to site** link returning to the home page.

## Testing

Testing was manual, using GitHub Copilot to assist with review:

- **Navigation** — every link and clickable table row was followed to confirm
  it reaches the intended screen and that no route is a dead end other than
  the fraud-report route, which is dead by design
- **Responsive layout** — checked at desktop, tablet and phone widths. Layout
  collapses to a single column below 620px
- **Keyboard access** — every interactive element is reachable by Tab and has
  a visible focus ring. Clickable table rows respond to Enter
- **Contrast** — all text and status colours checked against WCAG AA (4.5:1)
- **Reduced motion** — the site respects `prefers-reduced-motion`
- **Fallback fonts** — checked with Google Fonts blocked

## Technologies used

| | |
|---|---|
| Markup and styling | HTML5, CSS3 (custom properties, grid, flexbox) |
| Behaviour | Vanilla JavaScript, no framework or dependencies |
| Typefaces | Inter, IBM Plex Mono (Google Fonts) |
| Brand assets | SVG logo mark and lockup, produced by the team |
| Editor and assistance | Visual Studio Code, GitHub Copilot |
| Hosting | GitHub Pages |

## Team

| Name | Degree | Led |
|---|---|---|
| [Name] | [Degree] | [Contribution] |
| [Name] | [Degree] | [Contribution] |
| [Name] | [Degree] | [Contribution] |
| [Name] | [Degree] | [Contribution] |

## Data sources

- Bank Negara Malaysia, *Annual Report 2025* — scam losses and interventions;
  digital bank customer and deposit figures
- Financial Markets Ombudsman Service, *Annual Report 2025* — complaint volumes
  and dispute types
- Malaysian FinTech customer pain and market gap dataset 2026 (unit resource) —
  the 71 coded public app reviews
- Primary survey conducted by the group, [N] respondents, [dates]

## Use of generative AI

Generative AI (Claude, Anthropic) was used to assist with the interface design,
copywriting, brand development and code for this prototype. All content,
figures and conclusions were reviewed and verified by the project team.

## Note on fictional content

**Bank Semaya** is a fictional institution created for this prototype. No real
Malaysian bank is represented, named or endorsed. Customer reviews shown on the
Problem page are paraphrased from the coded evidence register and the
originating companies are not identified. All figures in the dashboard are
illustrative and derived from the financial model in the submitted Excel
workbook. This is an academic prototype and not a live financial service.
