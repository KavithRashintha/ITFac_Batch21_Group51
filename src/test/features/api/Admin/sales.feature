Feature: Sales API management

  Background:
    Given Admin logs in with username "admin" and password "admin123"

  Scenario: Ensure that an admin user can retrieve the sales list using GET method
    And Admin sets the endpoint "/api/sales"
    When Admin sends GET request with token
    Then Response should have status code 200
    And Response body should be a sales list
    And Each sales record should have required fields
    And The sale should include plant details
