Feature: Plant management - Add Plant button visibility

  Scenario: Verify Add Plant button visibility
    Given User logged-in as Admin
    When Provide valid username "admin" and password "admin123" for ui
    Then click the login button for ui
    When User navigates to "/ui/plants"
    Then The "Add a Plant" button should be visible
