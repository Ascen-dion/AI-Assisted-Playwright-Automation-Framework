# === FILE: src/bdd/features/navigation/navigation.feature ===
@navigation @regression
Feature: StarHub Website Navigation
  As a StarHub website visitor
  I want to navigate to different sections of the website
  So that I can find the products and services I need

  Background:
    Given the user navigates to the StarHub home page
    And the cookie consent is dismissed

  @C0
  Scenario: Clicking SME navigates to the SME page
    When the user clicks the "SME" top nav link
    Then the page URL should contain "sme"

  @C0
  Scenario: Clicking Enterprise navigates to the Business page
    When the user clicks the "Enterprise" top nav link
    Then the page URL should contain "business"

  @C0
  Scenario: Clicking About Us navigates to the About Us page
    When the user clicks the "About Us" top nav link
    Then the page URL should contain "about-us"

  @C0
  Scenario: Support link is accessible from the main navigation
    Then the "Support" link should be visible in the navigation

  @C0
  Scenario: StarHub logo links back to the personal home page
    When the user clicks the StarHub logo
    Then the page URL should contain "personal"
