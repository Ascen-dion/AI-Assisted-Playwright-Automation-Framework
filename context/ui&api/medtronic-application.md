# Medtronic India — Application Context

## Target Application
**Medtronic India** — Healthcare technology company website for the Indian subcontinent.
- **Homepage**: https://www.medtronic.com/in-en/index.html
- **Base URL**: https://www.medtronic.com
- **Locale prefix**: `/in-en/`

## Site Structure

### Top-Level Navigation (Header)
The main navigation consists of a megamenu triggered by a **Menu** button/hamburger icon:
- **Patients and Caregivers** → `/in-en/patients.html`
  - Conditions → `/in-en/patients/conditions.html`
  - Treatments & Therapies → `/in-en/patients/treatments-therapies.html`
  - Response Care → `/in-en/patients/response-care.html`
  - DBS Sahayata → `/in-en/patients/dbs-sahayata.html`
- **Healthcare Professionals** → `/in-en/healthcare-professionals.html`
  - Therapies & Procedures
  - Products
- **Our Company** → `/in-en/our-company.html`
  - Who we are → `/in-en/our-company.html`
  - Mission → `/in-en/our-company/mission.html`
  - Leadership → `/in-en/our-company/leadership.html`
  - Key Facts → `/in-en/our-company/key-facts.html`
  - History → `/in-en/our-company/history.html`
  - Locations → `/in-en/our-company/locations.html`
  - Medtronic in India → `/in-en/our-company/india.html`
  - Research & Development (MEIC) → `/in-en/our-company/india/medtronic-engineering-innovation-center.html`
  - Careers → `/in-en/our-company/careers.html`
- **Our Impact** → `/in-en/our-impact.html`
  - Impact Reporting → `/in-en/our-impact/impact-reporting.html`
  - Health Equity → `/in-en/our-impact/health-equity.html`
  - Inclusion, Diversity & Equity → `/in-en/our-impact/inclusion-diversity-equity.html`
  - Planet → `/in-en/our-impact/protecting-our-planet.html`
  - Communities → `/in-en/our-impact/communities.html`

### Homepage Sections
1. **Hero Banner** — "Engineering the extraordinary" tagline with CTA "See how"
2. **MEIC Section** — Medtronic Engineering & Innovation Center
3. **Healthcare Professionals** — "Creating connections to optimize healthcare systems"
4. **Our Impact** — "Impact with purpose" with 95,000+ people in 150+ countries
5. **Careers** — "Join the team that powers the extraordinary"

### Footer
- Social links: Facebook, YouTube, LinkedIn, Instagram
- Footer columns: Patients and Caregivers, Healthcare Professionals, Our Company, Our Impact
- Legal links: Privacy Statement, Terms of Use, Contact

### Cookie Consent
- Banner appears on first visit with "Okay" button
- Selector: button with text "Okay" (not "I understand" like UnionDigital)
- `globalSetup.js` must be updated to dismiss with "Okay" text

## Environment Notes
- Static marketing site (not SPA) — `waitUntil: 'load'` is appropriate
- Pages load reliably; no heavy SPA hydration delays
- Region selector shows "Indian Subcontinent"
- Search functionality available via search icon in header
- Logo links back to `/in-en/index.html`
