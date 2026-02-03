Feature: Plant Management

  Background:
    Given the user logged-in as "User"
    When the user provide credentials with username "testuser" and password "test123" and click the login button for ui
    Then User should be redirected to the dashboard
    When User navigates to "/ui/plants"

  Scenario: Verify filter by All Categories
    Then User selects category "All Categories" from filter
    And All plants should be displayed

  Scenario: Verify filter by a specific plant category
    Then User selects category "ABC" from filter
    And Only plants with category "ABC" should be displayed

  Scenario: Verify search plants by existing plant name
    Then User searches for plant "Anthurium"
    And The plant "Anthurium" should be visible in the results

  Scenario: Verify search plants by non-existing plant name
    Then User searches for plant "NonExistentPlant"
    And No plants should be displayed
    Then A message "No plants found" should be visible

  Scenario: Verify search with a valid plant name and a specific category filter
    Then User searches for plant "Anthurium"
    And User selects category "Fl_01" from filter
    Then The plant "Anthurium" should be visible in the results
    And Only plants with category "Fl_01" should be displayed

  Scenario: Verify visibility of the pagination for plants list
    Then The pagination should be visible

  Scenario: Verify the Next button functionality of the pagination
    And The pagination should be visible
    And User clicks "Next" button
    Then The page "2" should be currently active

  Scenario: Display "Low" badge when plant quantity is below 5
    Then Plants with quantity below 5 should display the "Low" badge

