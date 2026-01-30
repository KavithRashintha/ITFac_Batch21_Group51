Feature: Categories management - Add A Category button visibility

Background:
    Given User logged-in as Admin
    When Provide valid username "admin" and password "admin123" for ui
    Then click the login button for ui

Scenario: Verify Add A Category button visibility
    When User navigates to "/ui/categories"
    Then The "Add A Category" button should be visible

