Feature: Sales API management

  Background:
    Given User logs in with username "testuser" and password "test123"

  Scenario: Ensure that a normal user can retrieve the sales list using GET method
    And "User" sets the endpoint "/api/sales"
    When "User" sends "GET" request with token
    Then Response should have status code 200
    And Response body should be a sales list
    And Each sales record should have required fields
    And The sale should include plant details
