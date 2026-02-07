Feature: Plant Management API - User

  Background:
    Given User logs in with username "testuser" and password "test123"

  Scenario: Verify unauthorized access
    And "User" sets the endpoint "/api/plants/paged?page=0&size=5"
    When "User" sends "GET" request without token
    Then Response should have status code 401 and message containing "Unauthorized"

  Scenario: Verify fetch plants with default pagination
    And "User" sets the endpoint "/api/plants/paged?page=0&size=10"
    When "User" sends "GET" request with token
    Then Response status code should be 200
    And Response body 'content' should be an array with at most 10 items

  Scenario: Verify pagination to the next page
    And "User" sets the endpoint "/api/plants/paged?page=1&size=10"
    When "User" sends "GET" request with token
    Then Response status code should be 200
    And Response page number should be 1

  Scenario: Verify search plants by existing name
    And "User" sets the endpoint "/api/plants/paged?name=Plant1&page=0&size=10"
    When "User" sends "GET" request with token
    Then Response status code should be 200
    And Response body 'content' should be an array with 1 items
    And The first plant in 'content' should have name "Plant1"

  Scenario: Verify search plants by non-existing name
    And "User" sets the endpoint "/api/plants/paged?name=Plant25&page=0&size=10"
    When "User" sends "GET" request with token
    Then Response status code should be 200
    And Response body 'content' should be an array with 0 items

  Scenario: Verify the GET all plants method
    And "User" sets the endpoint "/api/plants"
    When "User" sends "GET" request with token
    Then Response status code should be 200
    And Response body should match JSON structure
      """
      [
        {
          "id": "any_number",
          "name": "any_non_empty_string",
          "price": "any_number",
          "quantity": "any_number",
          "category": {
            "id": "any_number",
            "name": "any_non_empty_string",
            "subCategories": []
          }
        }
      ]
      """

  Scenario: Verify the GET plant summary method
    And "User" sets the endpoint "/api/plants/summary"
    When "User" sends "GET" request with token
    Then Response status code should be 200
    And Response body should match JSON structure
      """
      {
        "totalPlants": "any_number",
        "lowStockPlants": "any_number"
      }
      """

  Scenario: Verify the DELETE plant method by ID for a existing valid ID
    And "User" sets the endpoint "/api/plants/10"
    When "User" sends "DELETE" request with token
    Then Response status code should be 403
    And Response body should match JSON structure
      """
      {
        "status": 403,
        "error": "Forbidden",
        "path": "string",
        "timestamp": "any_non_empty_string"
      }
      """

  Scenario: Verify the POST method for create a plant
    And "User" sets the endpoint "/api/plants/category/3"
    When "User" sends "POST" request with token and payload
    """
      {
        "id": 15,
        "name": "Rose",
        "price": 100,
        "quantity": 20,
        "category": {
          "id": 1,
          "name": "Category 1",
          "subCategories": []
        }
      }
      """
    Then Response status code should be 403
    And Response body should match JSON structure
      """
      {
        "status": 403,
        "error": "Forbidden",
        "path": "string",
        "timestamp": "any_non_empty_string"
      }
      """

  Scenario: Verify the PUT method for update a plant
    And "User" sets the endpoint "/api/plants/2"
    When "User" sends "PUT" request with token and payload
    """
      {
        "id": 2,
        "name": "Plant2",
        "price": 790,
        "quantity": 50,
        "category": {
          "id": 2,
          "name": "Sub_Cat1",
          "subCategories": []
        }
      }
      """
    Then Response status code should be 403
    And Response body should match JSON structure
      """
      {
        "status": 403,
        "error": "Forbidden",
        "path": "string",
        "timestamp": "any_non_empty_string"
      }
      """
