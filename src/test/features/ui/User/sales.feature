Feature: Sales management

  Background:
    Given the user logged-in as "User"
    When the user provide credentials with username "testuser" and password "test123" and click the login button for ui
    Then User should be redirected to the dashboard
    When User navigates to "/ui/sales"

  Scenario: Verify Sell Plant button hide in User view
    When User navigates to page "/ui/sales"
    Then The "Sell Plant" button should be hidden

  Scenario: Verify Sell Plant items visibility in User view
   When User navigates to page "/ui/sales"
   Then The Sales Plant items should be visibile in User View

  Scenario: Verify Sales items are sorted in ascending order by date in User view
    When User navigates to page "/ui/sales"
    Then The Sales Plant items should be sorted by date in ascending order in User View