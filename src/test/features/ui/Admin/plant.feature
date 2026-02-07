@plants
Feature: Plant Management - Admin

  Background:
    Given the user logged-in as "Admin"
    When the user provide credentials with username "admin" and password "admin123" and click the login button for ui
    Then User should be redirected to the dashboard
    When User navigates to "/ui/plants"

  Scenario: Verify Add Plant button visibility
    Then The "Add a Plant" button should be visible

  Scenario: Verify plant quantity cannot be a minus value
    And User clicks "Add a Plant" button
    And Provide "valid" plantName "Plant 6", select category "Sub_Cat 3", price as "1500", and quantity as "-1" for ui
    And User clicks "Save" button
    Then User see an error message as "Quantity cannot be negative"

  Scenario: Verify plant name length validation
    And User clicks "Add a Plant" button
    And Provide "invalid" plantName "ab", select category "Sub_Cat 3", price as "250", and quantity as "40" for ui
    And User clicks "Save" button
    Then User see an error message as "Plant name must be between 3 and 25 characters"

    When Provide "invalid" plantName "This is a lengthy plant name", select category "Sub_Cat 4", price as "650", and quantity as "20" for ui
    And User clicks "Save" button
    Then User see an error message as "Plant name must be between 3 and 25 characters"

  Scenario: Verify plant category validation
    And User clicks "Add a Plant" button
    When Provide "valid" plantName "Plant 4", select category "", price as "800", and quantity as "2" for ui
    And User clicks "Save" button
    Then User see an error message as "Category is required"

  Scenario: Verify price validation
    And User clicks "Add a Plant" button
    When Provide "valid" plantName "Plant 12", select category "Sub_Cat 4", price as "0", and quantity as "20" for ui
    And User clicks "Save" button
    Then User see an error message as "Price must be greater than 0"

    When Provide "valid" plantName "Plant 12", select category "Sub_Cat 4", price as "", and quantity as "20" for ui
    And User clicks "Save" button
    Then User see an error message as "Price is required"

  Scenario: Verify successful plant addition
    And User clicks "Add a Plant" button
    When Provide "valid" plantName "Plant 10", select category "Sub_Cat 4", price as "800", and quantity as "19" for ui
    And User clicks "Save" button
    Then User see a success message as "Plant added successfully"

  Scenario: Verify duplicate validation
    And User clicks "Add a Plant" button
    When Provide "invalid" plantName "Plant 10", select category "Sub_Cat 4", price as "800", and quantity as "19" for ui
    And User clicks "Save" button
    Then User see an error message as "Plant 'Daffodil1' already exists in this category"

  Scenario Outline: Verify Cancel button functionality
    And User clicks "Add a Plant" button
    When Provide "<status>" plantName "<name>", select category "<category>", price as "<price>", and quantity as "<quantity>" for ui
    And User clicks "Cancel" button
    Then User should be on the "/ui/plants" page
    And The plant "<name>" should not be in the list

    Examples:
      | status  | name        | category    | price | quantity |
      | valid   | plant11     | Sub_Cat 1   | 750   | 16       |
      | invalid |             | Sub_Cat 1   | 1000  | 5        |
      | invalid | Plant 1     |             | 1000  | 5        |
      | invalid | Plant 1     | Sub_Cat 1   |       | 5        |
      | valid   | Plant 1     | Sub_Cat 1   | 1000  |          |
      | invalid |             |             |       |          |

  Scenario: Verify visibility of the pagination for plants list for admin
    Then The pagination should be visible

  Scenario: Verify the Next button functionality of the pagination
    And The pagination should be visible
    And User clicks "Next" button
    Then The page "2" should be currently active

  Scenario: Verify Edit plant button in Actions
    And User clicks "Edit" button in the action of first record
    Then User see the current details of the plant

  Scenario: Verify Delete plant button in Actions
    And User clicks "Delete" button in the action of first record
    Then User see a confirmation message
