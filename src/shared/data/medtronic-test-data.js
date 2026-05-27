// === FILE: src/shared/data/medtronic-test-data.js ===
/**
 * Centralised test data for Medtronic India automation suite.
 *
 * Single source of truth for all assertion strings, URLs, and expected values.
 * When the application changes a label or copy, update here — not in each spec.
 */

module.exports = {

  // ── URLs ────────────────────────────────────────────────────────────────
  urls: {
    homepage:               'https://www.medtronic.com/in-en/index.html',
    patients:               'https://www.medtronic.com/in-en/patients.html',
    patientsConditions:     'https://www.medtronic.com/in-en/patients/conditions.html',
    patientsTreatments:     'https://www.medtronic.com/in-en/patients/treatments-therapies.html',
    patientsResponseCare:   'https://www.medtronic.com/in-en/patients/response-care.html',
    patientsDbsSahayata:    'https://www.medtronic.com/in-en/patients/dbs-sahayata.html',
    healthcareProfessionals:'https://www.medtronic.com/in-en/healthcare-professionals.html',
    ourCompany:             'https://www.medtronic.com/in-en/our-company.html',
    mission:                'https://www.medtronic.com/in-en/our-company/mission.html',
    leadership:             'https://www.medtronic.com/in-en/our-company/leadership.html',
    keyFacts:               'https://www.medtronic.com/in-en/our-company/key-facts.html',
    history:                'https://www.medtronic.com/in-en/our-company/history.html',
    locations:              'https://www.medtronic.com/in-en/our-company/locations.html',
    medtronicIndia:         'https://www.medtronic.com/in-en/our-company/india.html',
    meic:                   'https://www.medtronic.com/in-en/our-company/india/medtronic-engineering-innovation-center.html',
    careers:                'https://www.medtronic.com/in-en/our-company/careers.html',
    ourImpact:              'https://www.medtronic.com/in-en/our-impact.html',
    impactReporting:        'https://www.medtronic.com/in-en/our-impact/impact-reporting.html',
    healthEquity:           'https://www.medtronic.com/in-en/our-impact/health-equity.html',
    inclusionDiversityEquity:'https://www.medtronic.com/in-en/our-impact/inclusion-diversity-equity.html',
    planet:                 'https://www.medtronic.com/in-en/our-impact/protecting-our-planet.html',
    communities:            'https://www.medtronic.com/in-en/our-impact/communities.html',
    privacyStatement:       'https://www.medtronic.com/in-en/privacy-statement.html',
    termsOfUse:             'https://www.medtronic.com/in-en/terms-of-use.html',
    contactUs:              'https://www.medtronic.com/in-en/about/contact-us.html',
  },

  // ── URL patterns (regex for toHaveURL assertions) ────────────────────────
  urlPatterns: {
    homepage:               /medtronic\.com\/in-en\/index\.html/,
    patients:               /medtronic\.com\/in-en\/patients\.html/,
    patientsConditions:     /patients\/conditions/,
    patientsTreatments:     /patients\/treatments-therapies/,
    patientsResponseCare:   /patients\/response-care/,
    patientsDbsSahayata:    /patients\/dbs-sahayata/,
    healthcareProfessionals:/healthcare-professionals/,
    ourCompany:             /our-company\.html/,
    mission:                /our-company\/mission/,
    leadership:             /our-company\/leadership/,
    keyFacts:               /our-company\/key-facts/,
    history:                /our-company\/history/,
    locations:              /our-company\/locations/,
    medtronicIndia:         /our-company\/india\.html/,
    meic:                   /medtronic-engineering-innovation-center/,
    careers:                /our-company\/careers/,
    ourImpact:              /our-impact\.html/,
    impactReporting:        /our-impact\/impact-reporting/,
    healthEquity:           /our-impact\/health-equity/,
    planet:                 /protecting-our-planet/,
    communities:            /our-impact\/communities/,
    privacyStatement:       /privacy-statement/,
    termsOfUse:             /terms-of-use/,
    contactUs:              /contact-us/,
  },

  // ── Homepage content ──────────────────────────────────────────────────────
  homepage: {
    heroTagline:            'Engineering the extraordinary',
    heroDescription:        'Groundbreaking healthcare technology solutions for the most complex and challenging conditions.',
    heroCtaText:            'See how',
    meicHeading:            'Medtronic Engineering & Innovation Center',
    meicCtaText:            'Learn more',
    hcpHeading:             'Creating connections to optimize healthcare systems',
    hcpCtaText:             'Read more',
    impactHeading:          'Impact with purpose',
    impactDescription:      '95,000-plus people in over 150 countries',
    impactCtaText:          'Learn more',
    careersHeading:         'Join the team that powers the extraordinary',
    careersCtaText:         'Join us',
  },

  // ── Patients page content ────────────────────────────────────────────────
  patientsPage: {
    heroHeading:            'PATIENTS ANDCAREGIVERS',
    empowerHeading:         'EMPOWER',
    findConditionCta:       'FIND YOUR CONDITION',
    treatmentHeading:       'LEARN ABOUT YOUR TREATMENT AND THERAPY OPTIONS',
    selectOptionsCta:       'SELECT OPTIONS',
    patientServicesCta:     'CONTACT PATIENT SERVICES',
    responseCareHeading:    'RESPONSECARE',
    heartSafeHeading:       'STAYHEARTSAFE',
  },

  // ── Our Company page content ──────────────────────────────────────────────
  ourCompanyPage: {
    heroHeading:            'Who we are',
    missionText:            'alleviating pain, restoring health, and extending life',
  },

  // ── Footer section labels ─────────────────────────────────────────────────
  footer: {
    patientsLabel:          'PATIENTS AND CAREGIVERS',
    hcpLabel:               'HEALTHCARE PROFESSIONALS',
    companyLabel:           'OUR COMPANY',
    impactLabel:            'OUR IMPACT',
    privacyLinkText:        'Privacy Statement',
    termsLinkText:          'Terms of Use',
    contactLinkText:        'Contact',
    copyrightPattern:       /© \d{4} Medtronic/,
  },

  // ── Cookie consent ────────────────────────────────────────────────────────
  cookieConsent: {
    buttonText:             'Okay',
  },

  // ── Page titles ───────────────────────────────────────────────────────────
  pageTitles: {
    homepage:               /Medtronic/,
    patients:               /Patients/i,
    ourCompany:             /Medtronic/,
    ourImpact:              /Medtronic/,
    careers:                /Careers|Medtronic/,
  },

};
