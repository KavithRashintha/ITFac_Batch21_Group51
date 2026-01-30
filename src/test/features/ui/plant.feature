Feature: Plant management - Add Plant button visibility

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
    And Provide valid plantName "Anthurium", select category "subcat 1.1", price as "1000", and incorrect quantity as "-1" for ui
    And User clicks "Save" button
    Then User see an error message as "Quantity cannot be negative"

  Scenario: Verify visibility of the pagination for plants list
    When User navigates to "/ui/plants"
    Then The pagination should be visible

