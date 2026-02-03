Feature: Sales management

  Background:
    Given User logged-in as Admin

  Scenario: Verify Sell Plant button visibility
    When User navigates to page "/ui/sales"
    Then The "Sell Plant" button should be visible

  Scenario: Verify sales list displays and sorts correctly by sold date
    When User navigates to page "/ui/sales"
    Then Sales list should be displayed
    And Sales list should be sorted by "Sold At" in descending order