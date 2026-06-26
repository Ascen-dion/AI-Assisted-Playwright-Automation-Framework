Feature: AVVA Agent Builder

  Scenario: User navigates to Agent Builder page
    Given the user is authenticated
    When the user clicks "Build" in the left sidebar
    And the user clicks the "Agent" card
    Then the Agent Builder page should load
    And the prompt textbox should be visible

  Scenario: User creates agent using suggested prompt
    Given the user is on the Agent Builder page
    When the user clicks the "Create agent to track project deadlines" suggestion
    And the user clicks the "Refine" button
    Then the agent configuration should be displayed

  Scenario: User enters custom agent prompt
    Given the user is on the Agent Builder page
    When the user enters "Create an agent that analyzes test results" in the prompt textbox
    And the user clicks the "Refine" button
    Then the agent should be created successfully
    And a success message should be displayed
