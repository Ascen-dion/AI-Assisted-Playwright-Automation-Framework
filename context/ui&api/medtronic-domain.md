# Medtronic India — Domain Context

## Business Domain
Medtronic is a global leader in healthcare technology. The India website (`medtronic.com/in-en/`)
serves patients, caregivers, and healthcare professionals in the Indian subcontinent.

## Core Business Areas

### For Patients and Caregivers
- **Conditions**: Information about medical conditions treatable with Medtronic devices
- **Treatments & Therapies**: Details on available treatment options and therapies
- **Response Care**: Post-implant patient care services via certified technical consultants
  and the Carelink Network (for Medtronic/Vitatron implantable device patients)
- **DBS Sahayata**: Deep Brain Stimulation support program for Indian patients
- **Electromagnetic Safety**: Guidance on cardiac device safety around electromagnetic fields

### For Healthcare Professionals
- Therapies & Procedures information
- Product catalogs and specifications
- Collaboration and training programs

### Company Information
- **Mission**: Alleviating pain, restoring health, extending life
- **MEIC**: Medtronic Engineering & Innovation Center — R&D hub in India
- **Key Facts**: 95,000+ employees in 150+ countries
- **History**: Founded 1949, global expansion
- **Locations**: Global and India-specific office locations

### Impact Areas
- Health Equity
- Inclusion, Diversity & Equity
- Planet / Environmental sustainability
- Community engagement

## Key Trust Indicators
- Global leader in healthcare technology
- 95,000+ employees worldwide
- Operations in 150+ countries
- Groundbreaking healthcare technology solutions
- Medtronic Engineering & Innovation Center (MEIC) in India

## Test Data Rules
- All assertion strings must come from `src/shared/data/medtronic-test-data.js`
- Never hardcode assertion values in spec files
- URL patterns use regex for `toHaveURL()` assertions
- Page titles verified with regex patterns for `toHaveTitle()` assertions

## Edge Cases
- Cookie consent banner shows "Okay" button (not "I understand")
- Navigation is mega-menu style, triggered by a Menu button
- Some footer navigation links open in new windows (marked with "opens new window")
- Healthcare Professionals sub-links may use `#` as href (client-side routing)
