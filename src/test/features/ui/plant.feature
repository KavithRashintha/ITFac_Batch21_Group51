Feature: Plant management - Add Plant button visibility

  Background:
    Given User logged-in as Admin
    When Provide valid username "admin" and password "admin123" for ui
    Then click the login button for ui

  Scenario: Verify Add Plant button visibility
    When User navigates to "/ui/plants"
    Then The "Add a Plant" button should be visible
