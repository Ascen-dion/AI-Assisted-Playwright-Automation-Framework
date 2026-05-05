# === FILE: src/bdd/features/homepage/homepage.feature ===
@homepage @smoke @regression
Feature: StarHub Personal Home Page
  As a StarHub website visitor
  I want to view the personal home page
  So that I can explore available products and services

  Background:
    Given the user navigates to the StarHub home page
    And the cookie consent is dismissed

  @C0
  Scenario: Home page loads with correct title
    Then the page title should contain "StarHub"

  @C0
  Scenario: Top navigation bar displays all segment links
    Then the "Personal" top nav link should be visible
    And the "SME" top nav link should be visible
    And the "Enterprise" top nav link should be visible
    And the "About Us" top nav link should be visible

  @C0
  Scenario: Main navigation menu displays all product categories
    Then the "Mobile" menu button should be visible
    And the "Broadband" menu button should be visible
    And the "Entertainment" menu button should be visible
    And the "Perks & Promos" menu button should be visible

  @C0
  Scenario: Hero banner is displayed with a heading
    Then the hero banner heading should be visible

  @C0
  Scenario: Value propositions strip is displayed
    Then the "Peace of mind" value proposition should be visible
    And the "Full flexibility" value proposition should be visible
    And the "Multi-service savings" value proposition should be visible
    And the "24/7 HubCare" value proposition should be visible

  @C0
  Scenario: Key content sections are displayed on the page
    Then the "A better way to connect" section heading should be visible
    And the "Curated offers" section heading should be visible
    And the "Trending Devices" section heading should be visible
    And the "Gear up with StarHub" section heading should be visible

  @C0
  Scenario: Footer displays copyright and essential links
    Then the footer copyright should contain "StarHub 2026"
    And the "Contact Us" footer link should be visible
    And the "FAQ" footer link should be visible
    And the "Legal Notices" footer link should be visible
