Feature: Sales management

  Background:
    Given the user logged-in as "Admin"
    When the user provide credentials with username "admin" and password "admin123" and click the login button for ui
    Then User should be redirected to the dashboard
    When User navigates to "/ui/sales"

  Scenario: Verify Sell Plant button visibility
    When User navigates to page "/ui/sales"
    Then The "Sell Plant" button should be visible

  Scenario: Verify Sell Plant items visibility
   When User navigates to page "/ui/sales"
   Then The Sales Plant items should be visibile 

  Scenario: Verify Sales items are sorted in ascending order by date
    When User navigates to page "/ui/sales"
    Then The Sales Plant items should be sorted by date in ascending order

  Scenario: Varify Delete button visibility in Admin View 
    When User navigates to page "/ui/sales"
    Then The Delete button should be visibile in Admin View 