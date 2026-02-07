@sales
Feature: Sales Management UI - Admin

  Background:
    Given the user logged-in as "Admin"
    When the user provide credentials with username "admin" and password "admin123" and click the login button for ui
    Then User should be redirected to the dashboard
    When User navigates to "/ui/sales"

  Scenario: Verify Sell Plant button visibility
    Then The "Sell Plant" button should be visible

  Scenario: Verify Sell Plant items visibility
   Then The Sales Plant items should be visibile 

  Scenario: Verify Sales items are sorted in ascending order by date
    Then The Sales Plant items should be sorted by date in ascending order

  Scenario: Varify Delete button visibility in Admin View 
    Then The Delete button should be visibile in Admin View 
  
  Scenario: Verify Delete Confirmation Dialog
    And User clicks the Delete button on a sales item
    Then The Delete confirmation dialog should be visible

  