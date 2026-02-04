Feature: Plant Management API

  Background:
    Given User logs in with username "testuser" and password "test123"

  Scenario: Verify unauthorized access
    And User sets the endpoint "/api/plants/paged?page=0&size=5"
    When User sends GET request without token
    Then Response should have status code 401 and message containing "Unauthorized"

  Scenario: Verify fetch plants with default pagination
    And User sets the endpoint "/api/plants/paged?page=0&size=10"
    When User sends GET request with token and payload
    Then Response status code should be 200
    And Response body 'content' should be an array with at most 10 items

  Scenario: Verify pagination to the next page
    And User sets the endpoint "/api/plants/paged?page=1&size=10"
    When User sends GET request with token and payload
    Then Response status code should be 200
    And Response page number should be 1

  Scenario: Verify search plants by existing name
    And User sets the endpoint "/api/plants/paged?name=Anthurium&page=0&size=10"
    When User sends GET request with token and payload
    Then Response status code should be 200
    And Response body 'content' should be an array with 1 items
    And The first plant in 'content' should have name "Anthurium"

  Scenario: Verify search plants by non-existing name
    And User sets the endpoint "/api/plants/paged?name=NonExistingPlant&page=0&size=10"
    When User sends GET request with token and payload
    Then Response status code should be 200
    And Response body 'content' should be an array with 0 items
