@sales
Feature: Sales Management UI - User

  Background:
    Given the user logged-in as "User"
    When the user provide credentials with username "testuser" and password "test123" and click the login button for ui
    Then User should be redirected to the dashboard
    When User navigates to "/ui/sales"

  Scenario: Verify Sell Plant button hidden in User view
    Then The "Sell Plant" button should be hidden

  Scenario: Verify Sell Plant items visibility in User view
   Then The Sales Plant items should be visibile in User View

  Scenario: Verify Sales items are sorted in ascending order by date in User view
    Then The Sales Plant items should be sorted by date in ascending order in User View

  Scenario: Verify Sell Plant Delete button hidden in User view
    Then The Delete button should be hidden in User View 
  
  Scenario: Verify Sales List Table responsiveness
    Then Sales list table should be responsive

  Scenario: Verify no single sale view page exists
    Then No single sale view option should be available


 
