Feature: Plant management

  Background:
    Given User logged-in as Admin
    When Provide valid username "admin" and password "admin123" for ui
    Then click the login button for ui

  Scenario: Verify Add Plant button visibility
    When User navigates to "/ui/plants"
    Then The "Add a Plant" button should be visible

  Scenario: Verify plant quantity cannot be a minus value
    When User navigates to "/ui/plants"
    And User clicks "Add a Plant" button
    And Provide "valid" plantName "Anthurium", select category "subcat 1.1", price as "1000", and quantity as "-1" for ui
    And User clicks "Save" button
    Then User see an error message as "Quantity cannot be negative"

  Scenario: Verify plant name length validation
    When User navigates to "/ui/plants"
    And User clicks "Add a Plant" button
    And Provide "invalid" plantName "ab", select category "subcat 1.1", price as "500", and quantity as "10" for ui
    And User clicks "Save" button
    Then User see an error message as "Plant name must be between 3 and 25 characters"

    When Provide "invalid" plantName "This is a lengthy plant name", select category "subcat 1.1", price as "120", and quantity as "12" for ui
    And User clicks "Save" button
    Then User see an error message as "Plant name must be between 3 and 25 characters"

  Scenario: Verify plant category validation
    When User navigates to "/ui/plants"
    And User clicks "Add a Plant" button
    When Provide "valid" plantName "Daffodil1", select category "", price as "700", and quantity as "15" for ui
    And User clicks "Save" button
    Then User see an error message as "Category is required"

  Scenario: Verify price validation
    When User navigates to "/ui/plants"
    And User clicks "Add a Plant" button
    When Provide "valid" plantName "Blue Water Lily", select category "subcat 1.1", price as "0", and quantity as "15" for ui
    And User clicks "Save" button
    Then User see an error message as "Price must be greater than 0"

    When Provide "valid" plantName "Blue Water Lily", select category "subcat 1.1", price as "", and quantity as "15" for ui
    And User clicks "Save" button
    Then User see an error message as "Price is required"

  Scenario: Verify successful plant addition
    When User navigates to "/ui/plants"
    And User clicks "Add a Plant" button
    When Provide "valid" plantName "Daffodil1", select category "subcat 1.1", price as "700", and quantity as "15" for ui
    And User clicks "Save" button
    Then User see a success message as "Plant added successfully"

  Scenario: Verify duplicate validation
    When User navigates to "/ui/plants"
    And User clicks "Add a Plant" button
    When Provide "invalid" plantName "Daffodil1", select category "subcat 1.1", price as "500", and quantity as "12" for ui
    And User clicks "Save" button
    Then User see an error message as "Plant 'Daffodil1' already exists in this category"

  Scenario Outline: Verify Cancel button functionality
    When User navigates to "/ui/plants"
    And User clicks "Add a Plant" button
    When Provide "<status>" plantName "<name>", select category "<category>", price as "<price>", and quantity as "<quantity>" for ui
    And User clicks "Cancel" button
    Then User should be on the "/ui/plants" page
    And The plant "<name>" should not be in the list

    Examples:
      | status  | name        | category    | price | quantity |
      | valid   | testplant   | subcat 1.1  | 700   | 15       |
      | invalid |             | subcat 1.1  | 700   | 15       |
      | invalid | testplant   |             | 700   | 15       |
      | invalid | testplant   | subcat 1.1  |       | 15       |
      | valid   | testplant   | subcat 1.1  | 700   |          |
      | invalid |             |             |       |          |

  Scenario: Verify visibility of the pagination for plants list
    When User navigates to "/ui/plants"
    Then The pagination should be visible

  Scenario: Verify the Next button functionality of the pagination
    When User navigates to "/ui/plants"
    And The pagination should be visible
    And User clicks "Next" button
    Then The page "2" should be currently active

  Scenario: Verify Edit plant button in Actions
    When User navigates to "/ui/plants"
    And User clicks "Edit" button in the action of first record
    Then User see the current details of the plant

  Scenario: Verify Delete plant button in Actions
    When User navigates to "/ui/plants"
    And User clicks "Delete" button in the action of first record
    Then User see a confirmation message
