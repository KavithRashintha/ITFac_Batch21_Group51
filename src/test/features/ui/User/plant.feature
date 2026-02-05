@plants
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
    Then The pagination should be visible for non-admin user

  Scenario: Verify the Next button functionality of the pagination
    And The pagination should be visible for non-admin user
    And User clicks "Next" button
    Then The page "2" should be currently active

  Scenario: Display "Low" badge when plant quantity is below 5
    Then Plants with quantity below 5 should display the "Low" badge

  Scenario: Verify Edit plants button visibility
    Then "Edit" button should not be visible

  Scenario: Verify Delete plants button visibility
    Then "Delete" button should not be visible

  Scenario: Verify visibility of the pagination for plants list for non-admin user
    Then The pagination should be visible for non-admin user

  Scenario: Verify the visibility of the sort indicator
    Then User see the sort indicator in the Name column

  Scenario: Verify the functionality of sort indicator
    And User clicks on "Name" column header
    Then User see the sort indicator "down" in the name column
    When User clicks on "Name" column header
    Then User see the sort indicator "up" in the name column